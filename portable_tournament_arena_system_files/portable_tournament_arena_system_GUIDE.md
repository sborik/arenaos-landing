## Component Configuration
* Aerial Rig Frames (2x): Each 6x6x3m frame uses 80/20 aluminum extrusion, designed for quick assembly/disassembly. Corner posts are reinforced. Motors and pulleys are mounted at the top corners.
* NEMA23 Stepper Motors (8x): Each motor, with its 1:5 gear reduction, is mounted at a corner of an arena frame. They connect to individual closed-loop stepper drivers within the motor controller boxes. Encoder feedback is sent to the PCIe motion control cards.
* Motor Controller Boxes (2x): Each box houses four closed-loop stepper drivers and a local E-Stop. Power is supplied by dedicated 48V PSUs. Control signals (Step/Direction/Enable) come from the respective PCIe motion control card in the Arena Control PC. The local E-stop provides immediate motor power cut.
* Force Sensors (8x): Inline S-type load cells are integrated into each of the eight suspension cables. They connect to the 8-channel high-resolution ADC module, which then sends data to the Arena Control PC for feedback in the servo loop.
* Robot Harnesses (2x): Custom-designed for the ToddlerBot, with four attachment points. Each point integrates a heavy-duty magnetic breakaway connector, ensuring safety and quick release.
* Cable Systems (2x): Each arena utilizes 2mm stainless steel aircraft cable, routed through low-friction pulleys and equipped with custom tensioners to prevent slack. Cables are wound onto geared NEMA23 motors.
* Floor Padding (2x): 10cm thick EVA foam mats cover the entire 6x6m area of each arena for impact absorption.
* Arena Control PC: Configured with a real-time Linux OS and two PCIe motion control cards. This PC runs the primary servo loop for both arenas, processes force sensor data, performs AprilTag tracking for additional positional feedback, and controls scoreboard logic. It communicates with the Streaming PC and VR Teleoperation PCs over the network.
* Spectator Bleachers: Modular aluminum bleachers are assembled for 50 people, positioned at a safe distance from the arenas. They feature quick-pin connections and integrated casters for portability.
* PTZ Cameras (5x): Five HDMI/IP-enabled PTZ cameras are used: two per arena for overhead coverage and one for a wide shot of the entire venue. They feed into the ATEM Mini Extreme ISO.
* ATEM Mini Extreme ISO: This video switcher receives all 5 camera feeds via HDMI. It handles multi-camera switching, graphics overlays (from Arena Control PC via HDMI), and records ISO feeds to an SSD. Its USB-C output streams directly to the Streaming PC.
* Streaming PC: High-performance PC (Ryzen 9 5950X, RTX 4070) running OBS for final stream encoding (1080p60) and live recording. It receives the switched program feed from the ATEM via USB-C and sends the encoded stream via its 10GbE NIC to the internet.
* VR Teleoperation PCs (2x): Each player station has a dedicated VR PC (i7-12700K, RTX 4060 Ti) for low-latency Quest VR teleoperation. These PCs transmit robot commands to the Arena Control PC via a dedicated 1GbE network link.
* Announcer Booth: A portable, soundproof booth with integrated microphones, connected to an audio mixer.
* Audio Mixer: Manages announcer mics, ambient music, and sound effects. It sends a mixed audio feed to the PA speakers and the ATEM Mini Extreme ISO for inclusion in the live stream.
* PA Speakers: Two powered 12-inch PA speakers provide venue-wide sound.
* Central Control Room Console: A modular desk/rack setup accommodating all control PCs, monitors, ATEM, audio mixer, and network equipment.
* Referee Displays: Two large monitors in the control room show multiview from the ATEM, match status, and other critical data from the Arena Control PC.
* Power Distribution: A main 200A portable power distribution panel takes venue power. It feeds three sub-panels: one for each arena (motors, sensors) and one for AV/Control Room (PCs, cameras, lighting, audio). Each sub-panel has appropriate breakers.
* Lighting Rig: A modular truss system is erected to mount 8 DMX-compatible LED flood lights (4 per arena) for general illumination. RGB LED strips are used for accent lighting, all controlled by a USB-DMX controller connected to the Streaming PC or a dedicated mini-PC.
* Network Infrastructure: A managed 24-port Gigabit switch acts as the main backbone. A separate 8-port switch is used for the VR player station network to ensure low-latency robot control, then uplinks to the main switch.
* Global Emergency Stop: A prominently placed E-Stop button that simultaneously cuts main power to the motor control systems and triggers a software-level stop on the Arena Control PC.

## Mechanical Integration
* Arena Frames: The 80/20 frames are designed with quick-release pin connections for fast assembly/disassembly. Each frame section is marked for easy identification. The assembled frames are positioned 2m apart, with 3m clear space to spectator seating.
* Cable Rig Integration: NEMA23 motors are mounted with robust brackets at the top of the frame corners. Pulleys are strategically placed to ensure smooth cable travel. The stainless steel cables are pre-cut and terminated with thimbles and shackles for easy attachment to force sensors and harness.
* Floor Padding: Interlocking 10cm EVA foam mats are laid out for each 6x6m arena. They are designed to be rolled or stacked for transport.
* Bleachers: The modular bleachers feature integrated locking casters and quick-pin assembly. Sections are lightweight enough for two-person carry and designed to fold flat for transport and stacking.
* PTZ Camera Mounting: Cameras are mounted on the main lighting/camera truss system above each arena and the wide shot area. Truss clamps allow for quick and secure mounting with adjustable angles.
* Announcer Booth: A modular, interlocking soundproof booth with pre-installed acoustic panels and a clear glass viewing panel. Designed for tool-less assembly.
* Player Stations: Simple, folding desks with ergonomic chairs and portable privacy screens. PCs are mounted securely under desks or in small flight cases.
* Control Room Console: Modular, flight-case style desks that securely house rack-mounted equipment (ATEM, audio mixer) and provide space for PCs and monitors. Designed for rapid deployment and cable management.
* Power Distribution: All power panels are rugged, portable units. Heavy-duty SOOW cable runs are color-coded and clearly labeled. Cable ramps are used over pedestrian areas.
* Lighting Rig: Truss sections are connected with quick-release pins. LED floods and RGB strips attach with standard truss clamps. The entire rig can be quickly assembled and raised using manual chain hoists or lift stands.
* Cable Management: Extensive use of Velcro ties, cable wraps, and designated cable channels within the frames and console for clean, safe, and fast setup/teardown.

## Assembly Logic
* Day 1 Setup (8 hours, 4-person crew):
    * **Hour 1-2: Frame & Flooring:** Unload and assemble both 6x6m aerial rig frames. Lay out 10cm EVA foam crash mats for both arenas. Position modular bleachers and assemble.
    * **Hour 3-4: Cable Rigs & Motors:** Mount NEMA23 motors on frames. Install pulleys and route stainless steel cables, integrating force sensors and tensioners. Attach robot harnesses.
    * **Hour 5-6: Power & Networking:** Set up main 200A power distribution panel and sub-panels. Run main power lines. Deploy main network switch and player station switches. Run Ethernet cables.
    * **Hour 7: AV & Control Room:** Set up Control Room Console. Install PCs, ATEM, audio mixer, referee displays. Mount PTZ cameras on truss and connect to ATEM. Assemble Announcer Booth and install mics.
    * **Hour 8: Lighting & Final Checks:** Assemble modular lighting truss and mount LED floods and RGB accent lighting. Connect DMX controller. Connect PA speakers. Perform initial system power-up and safety checks (E-Stops).
* Day 2 Event Operations:
    * **Hour 0.5-1: Software & Calibration:** Boot all PCs. Load arenaOS, OBS, VR software. Calibrate force sensors, motion control, and camera PTZ presets. Test live stream and teleoperation.
* Tear Down (4 hours, 4-person crew):
    * **Hour 1: Power Down & Disconnect:** Full system shutdown, disconnect all power and data cables, initial cable management. Disassemble Announcer Booth.
    * **Hour 2: AV & Lighting De-rig:** Remove PTZ cameras from truss. Disassemble lighting truss and remove lights. Pack ATEM, audio gear, PCs into flight cases. Disassemble Control Room Console.
    * **Hour 3: Arenas & Bleachers:** Disconnect cables from motors/harnesses. Disassemble cable rigs. Remove foam floor padding. Disassemble and fold bleachers.
    * **Hour 4: Frame Disassembly & Loading:** Disassemble both 80/20 aluminum frames into modular sections. Load all packed equipment onto a 26-foot box truck, ensuring optimal use of space and securing items for transport.