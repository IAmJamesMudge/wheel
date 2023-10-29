export interface WheelRenderer {
    mount(container: HTMLDivElement, width:number, height:number): void;
    dismount(container: HTMLDivElement): void;
}

export interface WheelController {
    stopSpinning(options: StopSpinningOptions): void;
    spinIndefinitely(options: SpinIndefinitelyOptions): void;
    handleSectionEvent(callback: (e: WheelSectionEvent) => void): void;
    jumpTo(degreePosition:number):void;
}

export interface StopSpinningOptions {
    degreesToStopAt: number;

    onSpinFinished?: (sections:Section[]) => void;
}

export interface SpinIndefinitelyOptions {
    speedInDegreesPerSecond: number;
}

export interface WheelSectionEvent {
    section: Section;
    marker: Marker;
    type: "Entered" | "Exited";
}

export interface Wheel {
    currentRotation: number;
    sections: Section[];
    markers?: Marker[];
}

export interface Section {
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

export interface Marker {
    id: string;
    positionInDegrees: number;
    color?: string;                
}
