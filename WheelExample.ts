import { BasicWheelController } from "./BasicWheelController.js";
import { BasicWheelRenderer } from "./BasicWheelRenderer.js";
import { Section, Wheel } from "./WheelTypes.js";
import { getRandomWheelPosition } from "./WheelUtility.js";


const wheel = {
    currentRotation: 0,
    sections: [
        { id: '1', startDegree: 5, endDegree: 55, label: 'Prize 1', color: 'red', imageURL: "https://www.oxpal.com/downloads/uv-checker/checker-map_tho_blog.png", isMarked: false, isHovered: false, isActive: false },
        { id: '2', startDegree: 65, endDegree: 115, label: 'Prize 2', color: 'blue', isMarked: false, isHovered: false, isActive: false },
        { id: '3', startDegree: 125, endDegree: 175, label: 'Prize 3', color: 'yellow', isMarked: false, isHovered: false, isActive: false },
        { id: '4', startDegree: 185, endDegree: 235, label: 'Prize 4', color: 'green', isMarked: false, isHovered: false, isActive: false },
        { id: '5', startDegree: 245, endDegree: 345, label: 'Prize 5', color: 'purple', isMarked: false, isHovered: false, isActive: false },
        { id: '6', startDegree: 350, endDegree: 360, label: 'Prize 6', color: 'orange', isMarked: false, isHovered: false, isActive: false },
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


const hasSpun = localStorage.getItem("hasSpun");

const button = document.createElement("div");
const style = `
    width: 112px;
    height: 24px;
    border: 1px solid black;
    background: white;
    font-weight: bold;
    font-size: 16px;
    cursor: pointer;
    text-align: center;
    line-height: 1.5;
    font-family: sans-serif;
    padding: 3px 6px;
    user-select: none;
    border-radius: 3px;
`;
button.innerText = "Spin";
button.setAttribute("style",style);

if (false ) { //hasSpun) {
    button.innerText = "Already Spun!";
    button.style.background = "grey";
    let section = JSON.parse(hasSpun!) as Section;
    const center = ((section.startDegree + section.endDegree) / 2) % 360;

    controller.jumpTo(center - wheel.markers[0].positionInDegrees);

    
    alert("You got: " + section.label);
} else {

    let counter = 0;
    button.onclick = () => {
        if (counter === 0) {
            button.style.background = "grey";
            controller.spinIndefinitely({
                speedInDegreesPerSecond: 660
            });
            counter = 1;
    
            setTimeout(() => {
                const stoppingPosition = getRandomWheelPosition(wheel.sections, [0,0,0,0,0,1]);
    
                controller.stopSpinning({
                    degreesToStopAt: stoppingPosition - wheel.markers[0].positionInDegrees,
                    onSpinFinished(sections) {
                        alert("You got: " + sections[0].label);
                        localStorage.setItem("hasSpun", JSON.stringify(sections[0]));
                        //counter = 0;
                    },
                });
            }, 1500);
        }
    };
}

document.body.appendChild(button);