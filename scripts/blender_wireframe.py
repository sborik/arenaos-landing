"""
Headless Blender script to generate a displaced + wireframe render from a clip frame and its depth map.

Usage (inside repo):
blender -b -P scripts/blender_wireframe.py -- \
  --base public/processed/smash-bros-ultimate-gzl1kcle7ai \
  --frame frame_001 \
  --out public/processed/smash-bros-ultimate-gzl1kcle7ai/wireframe.png \
  --turntable 24
"""

import argparse
import math
import os
import sys

import bpy
from mathutils import Vector


def parse_args():
  argv = sys.argv
  if "--" in argv:
    argv = argv[argv.index("--") + 1 :]
  else:
    argv = []

  parser = argparse.ArgumentParser(description="Displaced wireframe render for one clip frame")
  parser.add_argument("--base", required=True, help="Base dir containing frames/ and depth/ folders")
  parser.add_argument("--frame", default="frame_001", help="Frame stem, e.g. frame_001")
  parser.add_argument("--out", default=None, help="Output still path (PNG). Default: <base>/wireframe.png")
  parser.add_argument("--turntable", type=int, default=0, help="Optional turntable frame count (0 to skip)")
  parser.add_argument("--subdiv", type=int, default=4, help="Subdivision levels before displacement")
  parser.add_argument("--strength", type=float, default=0.25, help="Displacement strength")
  parser.add_argument("--wire", type=float, default=0.0025, help="Wireframe thickness")
  return parser.parse_args(argv)


def clear_scene():
  bpy.ops.object.select_all(action="SELECT")
  bpy.ops.object.delete(use_global=False)
  for block in [
    bpy.data.meshes,
    bpy.data.materials,
    bpy.data.textures,
    bpy.data.images,
    bpy.data.cameras,
    bpy.data.lights,
  ]:
    for datablock in block:
      block.remove(datablock, do_unlink=True)


def look_at(obj, target=Vector((0.0, 0.0, 0.0))):
  direction = target - obj.location
  rot_quat = direction.to_track_quat("-Z", "Y")
  obj.rotation_euler = rot_quat.to_euler()


def make_materials(color_path: str, wire_color=(0.1, 0.8, 1.0, 1.0)):
  # Base material with texture
  base_mat = bpy.data.materials.new(name="BaseImage")
  base_mat.use_nodes = True
  nt = base_mat.node_tree
  nodes = nt.nodes
  links = nt.links
  nodes.clear()
  output = nodes.new(type="ShaderNodeOutputMaterial")
  shader = nodes.new(type="ShaderNodeBsdfPrincipled")
  tex = nodes.new(type="ShaderNodeTexImage")
  tex.image = bpy.data.images.load(color_path)
  links.new(tex.outputs["Color"], shader.inputs["Base Color"])
  links.new(shader.outputs["BSDF"], output.inputs["Surface"])

  # Wireframe emission
  wire_mat = bpy.data.materials.new(name="WireframeMat")
  wire_mat.use_nodes = True
  nt = wire_mat.node_tree
  nodes = nt.nodes
  links = nt.links
  nodes.clear()
  w_output = nodes.new(type="ShaderNodeOutputMaterial")
  emission = nodes.new(type="ShaderNodeEmission")
  emission.inputs["Color"].default_value = wire_color
  emission.inputs["Strength"].default_value = 2.0
  links.new(emission.outputs["Emission"], w_output.inputs["Surface"])

  return base_mat, wire_mat


def build_plane(color_path: str, depth_path: str, subdiv: int, strength: float, wire_thickness: float):
  color_img = bpy.data.images.load(color_path)
  width, height = color_img.size
  aspect = width / height if height else 1.0

  bpy.ops.mesh.primitive_plane_add(size=2.0, location=(0, 0, 0))
  plane = bpy.context.object
  plane.scale.x = aspect
  plane.scale.y = 1.0

  subsurf = plane.modifiers.new("Subsurf", type="SUBSURF")
  subsurf.levels = subdiv
  subsurf.render_levels = subdiv

  tex = bpy.data.textures.new("DepthTex", type="IMAGE")
  tex.image = bpy.data.images.load(depth_path)
  disp = plane.modifiers.new("Displace", type="DISPLACE")
  disp.texture = tex
  disp.strength = strength
  disp.mid_level = 0.5

  wire = plane.modifiers.new("Wireframe", type="WIREFRAME")
  wire.thickness = wire_thickness
  wire.use_replace = False
  wire.material_offset = 1  # second material slot

  base_mat, wire_mat = make_materials(color_path)
  plane.data.materials.append(base_mat)
  plane.data.materials.append(wire_mat)

  return plane, color_img


def setup_camera_and_lights():
  # Camera
  cam_data = bpy.data.cameras.new("Camera")
  cam = bpy.data.objects.new("Camera", cam_data)
  bpy.context.collection.objects.link(cam)
  cam.location = (0, -3.0, 1.2)
  look_at(cam)
  cam.data.lens = 35
  bpy.context.scene.camera = cam

  # Empty for turntable pivot
  pivot = bpy.data.objects.new("Pivot", None)
  bpy.context.collection.objects.link(pivot)
  cam.parent = pivot

  # Light
  light_data = bpy.data.lights.new(name="Key", type="AREA")
  light_data.energy = 1500
  light_data.shape = "RECTANGLE"
  light_data.size = 2.5
  light_data.size_y = 1.5
  light = bpy.data.objects.new("KeyLight", light_data)
  bpy.context.collection.objects.link(light)
  light.location = (2.5, -2.5, 3.0)
  look_at(light)

  fill_data = bpy.data.lights.new(name="Fill", type="AREA")
  fill_data.energy = 800
  fill = bpy.data.objects.new("FillLight", fill_data)
  bpy.context.collection.objects.link(fill)
  fill.location = (-2.0, 2.0, 2.5)
  look_at(fill)

  return cam, pivot


def configure_render(out_path: str, width: int, height: int):
  scene = bpy.context.scene
  # Use EEVEE Next if legacy EEVEE is unavailable (Blender 4.1+)
  scene.render.engine = "BLENDER_EEVEE" if "BLENDER_EEVEE" in bpy.types.RenderSettings.bl_rna.properties["engine"].enum_items else "BLENDER_EEVEE_NEXT"
  scene.render.image_settings.file_format = "PNG"
  scene.render.image_settings.color_mode = "RGBA"
  scene.render.resolution_x = width
  scene.render.resolution_y = height
  scene.render.resolution_percentage = 100
  scene.render.filepath = out_path
  scene.world.color = (0.02, 0.02, 0.03)
  scene.render.film_transparent = False


def animate_turntable(pivot, frame_count: int):
  pivot.rotation_euler = (0.0, 0.0, 0.0)
  pivot.keyframe_insert(data_path="rotation_euler", frame=1)
  pivot.rotation_euler.z = math.radians(360)
  pivot.keyframe_insert(data_path="rotation_euler", frame=frame_count)
  action = pivot.animation_data.action
  for fcurve in action.fcurves:
    for kf in fcurve.keyframe_points:
      kf.interpolation = "LINEAR"


def main():
  args = parse_args()
  base = os.path.abspath(args.base)
  color_path = os.path.join(base, "frames", f"{args.frame}.jpg")
  depth_path = os.path.join(base, "depth", f"{args.frame}_depth.jpg")
  out_path = os.path.abspath(args.out or os.path.join(base, "wireframe.png"))

  if not os.path.exists(color_path):
    raise FileNotFoundError(f"Missing frame image: {color_path}")
  if not os.path.exists(depth_path):
    raise FileNotFoundError(f"Missing depth map: {depth_path}")

  clear_scene()
  plane, color_img = build_plane(color_path, depth_path, args.subdiv, args.strength, args.wire)
  cam, pivot = setup_camera_and_lights()
  configure_render(out_path, int(color_img.size[0]), int(color_img.size[1]))

  # Still render
  bpy.ops.render.render(write_still=True)

  # Optional turntable animation
  if args.turntable > 0:
    animate_turntable(pivot, args.turntable)
    scene = bpy.context.scene
    scene.frame_start = 1
    scene.frame_end = args.turntable
    tt_dir = os.path.splitext(out_path)[0] + "_turntable"
    os.makedirs(tt_dir, exist_ok=True)
    scene.render.filepath = os.path.join(tt_dir, "tt_")
    bpy.ops.render.render(animation=True)


if __name__ == "__main__":
  main()
