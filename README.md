**Spinning Wheel TypeScript Project**

**Introduction**

This project provides a customizable spinning wheel that can be integrated into websites. Developers can specify wheel sections, their weights, and control the spinning behavior, including duration and final landing position.

**Structure**

The project consists of five main components:

BasicWheelController.ts: Manages the spinning behavior of the wheel.
BasicWheelRenderer.ts: Handles the rendering of the spinning wheel on a canvas.
WheelExample.ts: An example setup for the spinning wheel.
WheelTypes.ts: Defines TypeScript interfaces for the wheel's structure and behavior.
WheelUtility.ts: Contains utility functions for angle and position calculations.
Setup
To use this spinning wheel in your project, follow these steps:

Ensure you have TypeScript and a compatible web development environment set up.
Clone or download this repository to your local machine.
Include the TypeScript files in your project directory.

**Usage**

To integrate the spinning wheel into your website:

Create a wheel object defining the sections with their respective properties.
Instantiate BasicWheelController with the wheel object to manage spinning actions.
Instantiate BasicWheelRenderer with the wheel object and renderer options to handle the visual aspect.
Use the WheelExample.ts as a reference to implement the wheel on your site.
Customization
Customize the wheel by modifying the Section properties such as id, startDegree, endDegree, label, color, and weight.

**Examples**

Refer to WheelExample.ts for a complete example of how to set up and use the spinning wheel.

**Contributing**

Contributions are welcome! Please feel free to submit pull requests or create issues for any bugs or enhancements.

**License**

This project is open source and available under the MIT License.
