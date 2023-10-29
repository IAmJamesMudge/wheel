import { BasicWheelController } from "./BasicWheelController.js";
import { BasicWheelRenderer } from "./BasicWheelRenderer.js";


const wheel: Wheel = {
    currentRotation: 0,
    sections: [
        { id: '1', startDegree: 0, endDegree: 60, label: 'Prize 1', color: 'red',  imageURL:"https://www.oxpal.com/downloads/uv-checker/checker-map_tho_blog.png", isMarked: false, isHovered: false, isActive: false },
        { id: '2', startDegree: 60, endDegree: 120, label: 'Prize 2', color: 'blue', isMarked: false, isHovered: false, isActive: false },
        { id: '3', startDegree: 120, endDegree: 180, label: 'Prize 3', color: 'yellow', isMarked: false, isHovered: false, isActive: false },
        { id: '4', startDegree: 180, endDegree: 240, label: 'Prize 4', color: 'green', isMarked: false, isHovered: false, isActive: false },
        { id: '5', startDegree: 240, endDegree: 300, label: 'Prize 5', color: 'purple', isMarked: false, isHovered: false, isActive: false },
        { id: '6', startDegree: 300, endDegree: 360, label: 'Prize 6', color: 'orange', isMarked: false, isHovered: false, isActive: false },
    ],
    markers: [
        { id: 'marker1', positionInDegrees: -30, color: 'red' }
    ]
};


const renderer = new BasicWheelRenderer(wheel, {
    lineThickness: 2,
    canvasDiameter: 350,
});
const controller = new BasicWheelController(wheel);

const container = document.createElement('div');
document.body.appendChild(container);

renderer.mount(container);

let counter = 0;
container.onclick = () => {

    if (counter === 0) {
        controller.spinIndefinitely({
            speedInDegreesPerSecond: 660
        });
        counter = 1;
    } else {
        controller.stopSpinning({
            degreesToStopAt: 90,
        });
        counter = 0;
    }
}

controller.handleSectionEvent(e => {
    console.log(e.type, e.section, e.marker);
});

const btn = document.createElement("button");
btn.innerHTML = "Rotate by 10";
btn.onclick = () => {
    controller.jumpTo(wheel.currentRotation + 10);
}
document.body.appendChild(btn);