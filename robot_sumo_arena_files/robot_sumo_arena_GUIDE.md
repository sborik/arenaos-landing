## Component Configuration
* Raspberry Pi 5: Install Raspberry Pi OS. Configure SSH and VNC for headless operation. Connect official 27W USB-C power supply. Ethernet port to switch.
* USB Camera: Connect to powered USB 3.0 hub. Ensure camera drivers are compatible with Linux (usually UVC compliant).
* Powered USB 3.0 Hub: Connect to RPi5 via a USB 3.0 A-to-B cable. Connect its dedicated power supply. Robot charging cables plug into hub.
* Ethernet Switch: Connect RPi5 to one port. Optional: Connect a network cable to classroom network for internet access.
* AprilTags: Print various AprilTag families (e.g., Tag36h11) at appropriate sizes. Laminate for durability. Place strategically on arena surface and/or robots.

## Mechanical Integration
* Arena Base: Arrange 2x2m EVA foam mats. Secure with interlocking edges or tape. Ensure a flat, stable surface.
* Arena Frame (Optional): Construct a simple 2x2m frame from 1x2 wood or PVC pipe if extra rigidity is desired for the foam base. This will also provide a base for the borders.
* Arena Borders: Cut foam pipe insulation lengthwise, or use rectangular foam strips, to create 10cm high, 4-sided borders around the 2x2m playing surface. Secure these to the arena base/frame using construction adhesive or heavy-duty double-sided tape. Consider painting them black.
* Safety Barriers: Place additional soft foam strips or pool noodles around the entire outer perimeter of the arena for spectator safety.
* Overhead Camera Mount: Construct a gantry or tripod-like structure from PVC pipe to position the camera directly above the center of the 2x2m arena at 2.5m height. The camera should point downwards. Use zip ties or a small custom 3D-printed mount to attach the camera securely. Ensure the structure is stable and weighted at the base if necessary. The dimensions will be roughly 2.5m tall with a base wide enough for stability (e.g., 1.5m x 1.5m)..
* Cable Management: Route power cables for RPi5 and USB hub along the arena frame or camera mount structure using zip ties or Velcro straps. Extend robot charging cables from the USB hub to a convenient, easily accessible location near the arena.

## Assembly Logic
* Step 1: Assemble the 2x2m foam mat arena surface in the desired location.
* Step 2: Construct and attach the 10cm high foam borders around the arena perimeter. Secure them firmly.
* Step 3: Assemble the PVC overhead camera mount structure. Ensure it is stable and can safely hold the camera at 2.5m height. Place it over the center of the arena.
* Step 4: Mount the USB camera to the overhead structure, ensuring it has a clear, unobstructed view of the entire 2x2m arena surface.
* Step 5: Securely position the Raspberry Pi 5, powered USB hub, and Ethernet switch in a dedicated control station area near the arena.
* Step 6: Connect the RPi5 to its power supply and the Ethernet switch.
* Step 7: Connect the powered USB hub to its power supply and to the RPi5 via a USB 3.0 data cable.
* Step 8: Connect the USB camera to the powered USB hub.
* Step 9: Route robot charging cables from the powered USB hub to the designated charging area.
* Step 10: Implement cable management for all power and data lines using zip ties.
* Step 11: Print and laminate AprilTags. Distribute them on the arena surface and/or robots as needed for tracking.
* Step 12: Install Raspberry Pi OS on the microSD card and insert it into the RPi5. Boot up and perform initial configuration (network, SSH).
* Step 13: Install OpenCV and AprilTag libraries on the Raspberry Pi 5 (e.g., `sudo apt install python3-opencv` and `pip install apriltag`). Write a Python script to capture video from the USB camera, detect AprilTags, and output their positions. Test camera feed and AprilTag detection.
* Step 14: Place soft foam safety barriers around the outer perimeter of the arena area.