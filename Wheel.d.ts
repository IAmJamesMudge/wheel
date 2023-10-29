interface WheelRenderer {
    mount(container: HTMLDivElement, width:number, height:number): void;
    dismount(container: HTMLDivElement): void;
}

interface WheelController {
    stopSpinning(options: StopSpinningOptions): void;
    spinIndefinitely(options: SpinIndefinitelyOptions): void;
    handleSectionEvent(callback: (e: WheelSectionEvent) => void): void;
    jumpTo(degreePosition:number);
}

interface StopSpinningOptions {
    degreesToStopAt: number;
}

interface SpinIndefinitelyOptions {
    speedInDegreesPerSecond: number;
}

interface WheelSectionEvent {
    section: Section;
    marker: Marker;
    type: "Entered" | "Exited";
}

interface Wheel {
    currentRotation: number;
    sections: Section[];
    markers?: Marker[];
}

interface Section {
    id: string;
    startDegree: number;
    endDegree: number;
    font?: string;
    label?: string;                
    color?: string;               
    imageURL?: string;
    cachedImage? : HTMLImageElement;

    isMarked: boolean;
    isHovered: boolean;
    isActive: boolean;
}

interface Marker {
    id: string;
    positionInDegrees: number;
    color?: string;                
}
