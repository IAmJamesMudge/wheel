import { WheelController, Wheel, StopSpinningOptions, SpinIndefinitelyOptions, WheelSectionEvent } from "./WheelTypes";

export class BasicWheelController implements WheelController {
    private animationId?: number;
    private currentSpeed: number = 0;
    private wheel: Wheel;

    constructor(wheel: Wheel) {
        this.wheel = wheel;

        this.#updateMarkedState();
    }

    stopSpinning(options: StopSpinningOptions) {
        window.cancelAnimationFrame(this.animationId || 0);
    
        const targetRotation = options.degreesToStopAt;
        let distanceToTarget = targetRotation - (this.wheel.currentRotation % 360);
        if (distanceToTarget < 0) {
            distanceToTarget += 360;
        }
        if (distanceToTarget < 180) {
            distanceToTarget += 360;
        }
        const initialDistance = distanceToTarget;
        const initialSpeed = this.currentSpeed;
    
        const lerp = (a: number, b: number, t: number) => a + t * (b - a);
    
        let lastFrameTime = performance.now();
    
        const animate = (time: number) => {
            const dt = (time - lastFrameTime) / 1000;
            lastFrameTime = time;
    
            const t = (initialDistance - distanceToTarget) / initialDistance;
            this.currentSpeed = lerp(initialSpeed, 5, t);
    
            const amountToRotate = this.currentSpeed * dt;
    
            this.wheel.currentRotation += amountToRotate;
            this.#updateMarkedState();
            distanceToTarget -= amountToRotate;
    
            if (distanceToTarget <= 0.1) {
                this.wheel.currentRotation = targetRotation;
                this.#updateMarkedState();
                return;
            }
    
            this.animationId = requestAnimationFrame(animate);
        };
    
        this.animationId = requestAnimationFrame(animate);
    }

    spinIndefinitely(options: SpinIndefinitelyOptions) {
        window.cancelAnimationFrame(this.animationId || 0);
        this.currentSpeed = options.speedInDegreesPerSecond;

        let lastFrameTime = performance.now();
        const animate = (time: number) => {
            const dt = (time - lastFrameTime) / 1000;
            lastFrameTime = time;

            const amountToRotate = options.speedInDegreesPerSecond * dt;

            this.wheel.currentRotation += amountToRotate;
            this.#updateMarkedState();

            this.animationId = requestAnimationFrame(animate);
        }

        this.animationId = requestAnimationFrame(animate);
    }

    jumpTo(degreePosition: number) {
        this.wheel.currentRotation = degreePosition;
        this.#updateMarkedState();
    }

    #updateMarkedState() {
        // Reset isMarked for all sections
        for (const section of this.wheel.sections) {
            section.isMarked = false;
        }
    
        // If there are no markers, no need to proceed further
        if (!this.wheel.markers) return;
    
        for (const marker of this.wheel.markers) {
            // The effective degree of the marker when considering the wheel's current rotation
            const effectiveMarkerDegree = this.#normalizeDegrees(marker.positionInDegrees - this.wheel.currentRotation);
    
            for (const section of this.wheel.sections) {
                const start = this.#normalizeDegrees(section.startDegree);
                const end = this.#normalizeDegrees(section.endDegree);
    
                // Check if marker is within this section
                if (start <= end) {
                    // Normal case where the section doesn't span 0 degrees
                    if (effectiveMarkerDegree >= start && effectiveMarkerDegree < end) {
                        section.isMarked = true;
                        break; // Exit loop early once the marker section is found
                    }
                } else {
                    // This section spans over 0 degrees (e.g. 350 to 10)
                    if (effectiveMarkerDegree >= start || effectiveMarkerDegree < end) {
                        section.isMarked = true;
                        break; // Exit loop early once the marker section is found
                    }
                }
            }
        }
    }
    
    

    #normalizeDegrees(degrees:number) {
        while (degrees < 0) {
            degrees += 360;
        }
        degrees = degrees % 360.01;
        return degrees;
    }

    handleSectionEvent(callback: (e: WheelSectionEvent) => void): void {
        // Handle the section events, probably involves checking currentRotation against marker positions
        // and invoking the callback when sections enter or exit a marker
    }
}
