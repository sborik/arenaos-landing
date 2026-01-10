## Component Configuration
* Raspberry Pi 5: Install Raspberry Pi OS. Configure `apt` for necessary packages (OpenCV, AprilTag, Python libraries). Set up Wi-Fi for wireless communication with the scoreboard controller and potentially referee laptop/tablet. Ethernet to local switch. Connect official 27W USB-C power supply.
* USB Cameras: Connect both OV5640 cameras to the powered USB 3.0 hub. Ensure unique device paths are identified (e.g., `/dev/video0`, `/dev/video1`) for stereo vision processing in OpenCV.
* Powered USB 3.0 Hub (Camera): Connect to RPi5 via a high-quality USB 3.0 A-to-B cable. Connect its dedicated power supply.
* WS2812B LED Strips: Cut to fit the 3x3m perimeter (approx. 3.75m per side, so 4 strips of 3.75m each). Connect in series or parallel segments to the ESP32 LED controller. Ensure proper data line and robust power injection from the 5V 10A supply. Use 3.3V logic level shifters if ESP32 GPIO is 3.3V and LEDs expect 5V signal.
* ESP32 LED Controller: Program with a library like FastLED. Implement a simple API (e.g., MQTT or UDP) to receive commands from the RPi5 for color, brightness, and patterns. Connect to its 5V power supply and data lines to LEDs.
* Referee Button Panel: Program an Arduino Leonardo/Pro Micro as a USB HID keyboard. Assign button presses to specific key codes that the RPi5 software can interpret (e.g., 'S' for start, 'P' for pause). Connect to RPi5 via USB. Mount the OLED display to the Arduino or RPi5 GPIO (I2C) for timer feedback.
* Robot Charging Station: Connect its dedicated power supply. Ensure all USB ports provide sufficient current for rapid robot charging (e.g., 2A per port). Cable manage robot charging cables to be easily accessible.
* Tournament Scoreboard: Assemble P10 LED panels. Connect them to the Hub75 driver board. Program the ESP32/RPi Zero 2W controller to receive data wirelessly from the main RPi5 (e.g., via MQTT or UDP over Wi-Fi) and display scores/timer. Connect dedicated 5V 20A power supply for optimal brightness and stability.

## Mechanical Integration
* Arena Mat: Lay out the 3x3m official mat in a clear area. Ensure it is flat and free of wrinkles. Consider non-slip backing if it tends to move.
* Overhead Camera Rig: Construct a robust, disassemblable gantry-style frame from aluminum extrusions. Design it to be stable and tall enough to place cameras at 2.5m-3m height, providing a full view of the 3x3m arena. Use angle brackets and T-nuts for modularity and easy assembly/disassembly. Mount cameras with adjustable brackets for precise positioning and stereo calibration. The base footprint should be slightly larger than 3x3m for stability.
* LED Perimeter Lighting: Secure the WS2812B LED strips to the outer edge of the 3x3m arena (can be adhered to the mat, or mounted on low-profile border elements if added). Ensure even light distribution. Consider diffusing covers for a cleaner look.
* Referee Station: Place the referee laptop stand at a comfortable viewing height and distance from the arena. Mount the custom button panel and timer display for easy access and visibility.
* Robot Charging Station: Position it conveniently close to the arena, but outside the safety barrier. Use cable clips to manage charging cables.
* Safety Barriers: Arrange modular foam panels around the entire 3x3m arena perimeter, creating a safe zone for spectators and participants. These should be stackable and easily moved for access or transport.
* Equipment Storage Cart: Store all arena components in the wheeled cart. Use stackable bins to categorize and organize smaller items (cables, tools, controllers). Ensure the camera rig and mat can be folded/rolled and secured on/in the cart for transport in a school van.

## Assembly Logic
* Step 1: Roll out and assemble the 3x3m competition mat on a flat, clear floor.
* Step 2: Assemble the modular aluminum extrusion overhead camera rig. Carefully lift and position it over the arena. Secure its base for stability.
* Step 3: Mount and position both USB cameras onto the overhead rig, aiming them for optimal stereo coverage of the arena. Connect them to the powered USB 3.0 hub.
* Step 4: Install the WS2812B LED strips around the arena perimeter. Secure the ESP32 LED controller and connect its power supply and the LED data lines.
* Step 5: Set up the referee station: place the laptop stand, custom button panel (Arduino connected via USB to RPi5), and timer display. Connect these to the RPi5.
* Step 6: Position the robot charging station and connect its power supply. Arrange robot charging cables.
* Step 7: Arrange the modular foam safety barriers around the entire arena perimeter.
* Step 8: Assemble the P10 LED scoreboard panels and connect them to the Hub75 driver board. Connect the ESP32/RPi Zero 2W scoreboard controller and its dedicated power supply. Place the scoreboard in a visible location.
* Step 9: Install Raspberry Pi OS on the main RPi5's microSD card. Configure networking (Ethernet to switch, Wi-Fi for scoreboard). Install necessary software (OpenCV, AprilTag libraries, custom Python scripts for vision, control, and scoring).
* Step 10: Flash firmware to the ESP32 LED controller and ESP32/RPi Zero 2W scoreboard controller. Configure them to communicate with the main RPi5 wirelessly.
* Step 11: Connect the RPi5 to its power supply and the Ethernet switch.
* Step 12: Connect the powered USB 3.0 hub to its power supply and to the RPi5 via USB 3.0.
* Step 13: Power up all components in sequence (power supplies first, then controllers/RPi).
* Step 14: Calibrate the stereo cameras for accurate 3D position tracking of AprilTags. Test LED control, referee button panel, and scoreboard functionality. Print and distribute AprilTags as needed.
* Step 15: Perform a full system test to ensure all components integrate and function correctly.
* Step 16: When transporting, disassemble modular components (camera rig, scoreboard, barriers), roll the mat, and pack all items securely into the wheeled equipment cart and stackable bins for easy loading into a school van.