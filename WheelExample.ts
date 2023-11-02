import { BasicWheelController } from "./BasicWheelController.js";
import { BasicWheelRenderer } from "./BasicWheelRenderer.js";
import { Section, Wheel } from "./WheelTypes.js";
import { getRandomWheelPosition } from "./WheelUtility.js";


const wheel = {
    currentRotation: 0,
    sections: [
        { id: '1', startDegree: 0, endDegree: 60, label: 'Prize 1', color: 'red', 
        imageURL: "/wheel/untitled.png", 
        isMarked: false, isHovered: false, isActive: false, weight: 1 },
        { id: '2', startDegree: 60, endDegree: 120, label: 'Prize 2', color: 'blue', 
        //imageURL: "https://picsum.photos/seed/test24/200", 
        isMarked: false, isHovered: false, isActive: false, weight: 1 },
        { id: '3', startDegree: 120, endDegree: 180, label: 'Prize 3', color: 'yellow', 
        //imageURL: "https://picsum.photos/seed/test24/200", 
        isMarked: false, isHovered: false, isActive: false, weight: 1 },
        { id: '4', startDegree: 180, endDegree: 240, label: 'Prize 4', color: 'green', 
        //imageURL: "https://picsum.photos/seed/test24/200", 
        isMarked: false, isHovered: false, isActive: false, weight: 1 },
        { id: '5', startDegree: 240, endDegree: 300, label: 'Prize 5', color: 'purple', 
        //imageURL: "https://picsum.photos/seed/test24/200", 
        isMarked: false, isHovered: false, isActive: false, weight: 1 },
        { id: '6', startDegree: 300, endDegree: 360, label: 'Prize 6', color: 'orange', 
        //imageURL: "https://picsum.photos/seed/test24/200", 
        isMarked: false, isHovered: false, isActive: false, weight: 1 },
    ],
    markers: [
        { id: 'marker1', positionInDegrees: -30, color: 'red' }
    ]
} as Wheel;
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

    controller.jumpTo(center - (wheel.markers?.[0].positionInDegrees || 0));

    
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
                    degreesToStopAt: stoppingPosition - (wheel.markers?.[0].positionInDegrees || 0),
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

const img = new Image(200,200);
img.src = "https://picsum.photos/seed/test24/200";

document.body.append(img);