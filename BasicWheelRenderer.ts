import { degToRad, getBoundingRectangle, getPositionFromDegrees } from "./WheelUtility.js";

export type RendererOptions = {
    lineThickness: number;
    canvasDiameter: number;
}

export class BasicWheelRenderer implements WheelRenderer {
    private wheel: Wheel;
    private wheelGroup? : HTMLDivElement;
    private canvas?: HTMLCanvasElement;
    private ctx?: CanvasRenderingContext2D;
    private centerX: number = 0;
    private centerY: number = 0;
    private radius: number = 0;
    private options: RendererOptions;

    constructor(wheel: Wheel, options: RendererOptions) {
        this.wheel = wheel;
        this.options = options;
    }

    private RedrawWheel() {
        console.log("Redrawing the whole wheel");
        this.ctx!.clearRect(0,0,this.canvas!.width,this.canvas!.height);
        let sortedSections = [...this.wheel.sections];
        sortedSections.sort((a,b) => {
            if (a.isMarked && !b.isMarked) {
                return 1;
            } else if (!a.isMarked && b.isMarked) {
                return -1;
            }
            return 0;
        })
        for (const section of sortedSections) {
            this.#DrawSection(section);
        }
    }

    mount(container: HTMLDivElement): void {
        const height = this.options.canvasDiameter;
        const width = this.options.canvasDiameter;

        this.centerX = width / 2;
        this.centerY = height / 2;
        this.radius = (width / 2) - 1;

        // create the wheel group to contain the canvas and markers
        this.wheelGroup = document.createElement("div");
        this.wheelGroup.style.display = "inline-block";
        this.wheelGroup.style.width = `${width}px`;
        this.wheelGroup.style.height = `${height}px`;
        this.wheelGroup.style.position = "relative";

        const canvas = this.canvas = document.createElement('canvas');
        this.ctx = canvas.getContext("2d")!;
        canvas.width = width;
        canvas.height = height;
        this.wheelGroup.appendChild(canvas);

        if (this.wheel?.markers) {
            for (let marker of this.wheel.markers) {
                const degreesInWheelSpace = marker.positionInDegrees + 90;
                const distanceFromEdge = 5;
                const elem = document.createElement("div");
                elem.style.transformOrigin = `${width/2}px ${height/2}px`;

                elem.className = "wheel-arrow marker";
        
                // Rotate to position and adjust for the marker's own dimensions to ensure it's centered on the specified angle
                elem.style.transform = `rotate(${degreesInWheelSpace}DEG) translate(${width/2 - 4.5}px, calc(-100% + ${distanceFromEdge}px))`;
                elem.style.left = `0px`;
                elem.style.top = `0px`;
        
                this.wheelGroup.appendChild(elem);
            }
        }

        container.appendChild(this.wheelGroup);

        this.RedrawWheel();
        this.#RotationListener();
    }
    

    dismount(container: HTMLDivElement): void {
        container.innerHTML = '';

        window.cancelAnimationFrame(this.#animationId);
    }

    #DrawSection(section:Section) {
        const ctx = this.ctx!;
        const centerX = this.centerX;
        const centerY = this.centerY;
        const radius = this.radius;
        const arcLength = section.endDegree % 360 - section.startDegree % 360;

        const PrepareClipArea = () => {
            ctx.translate(centerX,centerY);
            ctx.rotate(degToRad(section.endDegree - arcLength));
    
            ctx.beginPath();
            ctx.moveTo(0, 0);
    
            ctx.lineTo(this.radius, 0);
            ctx.arc(0, 0, radius, 0, degToRad(arcLength));
    
            // Line back to center and close
            ctx.lineTo(0, 0);
            ctx.closePath();
        }

        if (section.imageURL) {

            const drawTheImage = () => {
                const img = section.cachedImage!;
                const rect = getBoundingRectangle(0,0, 0, section.endDegree, this.radius, img.width / img.height);

                // const testDiv = document.createElement("div");
                // testDiv.setAttribute("style", `border: 2px solid black; background: rgba(0,0,0,0.5); width: ${rect.width}px; height: ${rect.height}px; position: absolute; left: ${rect.left + centerX}px; top: ${rect.top + centerY}px`);
                // this.wheelGroup?.appendChild(testDiv);

                ctx.save();
                PrepareClipArea();
                ctx.clip();

                console.log("Rect: ", rect);

                ctx.fillStyle = section.color || 'grey';
                ctx.fill();

                ctx.drawImage(img, 
                    rect.left,
                    rect.top,
                    rect.width, 
                    rect.height
                );
        
                ctx.lineWidth = this.options.lineThickness;
                ctx.strokeStyle = section.isMarked ? "cyan" : 'black';
                ctx.stroke();
                
                ctx.restore();
            }

            if (!section.cachedImage) {
                section.cachedImage = new Image();
                section.cachedImage.src = section.imageURL;
            
                section.cachedImage.onload = drawTheImage;
            } else {
                drawTheImage();
            }
        } else {
            ctx.save();
            PrepareClipArea();
    
            // Style and fill
            ctx.fillStyle = section.color || 'grey';
            ctx.fill();
            ctx.lineWidth = this.options.lineThickness;
            ctx.strokeStyle = section.isMarked ? "cyan" : 'black';
            ctx.stroke();
    
            ctx.restore();
        }


        //draw the label, if it exists
        if (section.label) {
            const midAngle = degToRad((section.startDegree + section.endDegree) / 2);

            ctx.save();
            ctx.translate(this.radius,this.radius);
            ctx.rotate(midAngle);

            ctx.fillStyle = "white";
            ctx.font = "16px Arial";
            ctx.strokeStyle = "black";

            ctx.strokeText(section.label,this.radius * 0.35, 6.5,this.radius * 0.7);
            ctx.strokeText(section.label,this.radius * 0.35, 8.5,this.radius * 0.7);
            ctx.strokeText(section.label,this.radius * 0.35 - 1, 7.5,this.radius * 0.7);
            ctx.strokeText(section.label,this.radius * 0.35 + 1.5, 7.5,this.radius * 0.7);
            ctx.fillText(section.label,this.radius * 0.35, 7.5,this.radius * 0.7);

            ctx.restore();
        }
    }
    #DrawSectionOutline() {

    }

    #animationId = 0;
    #RotationListener() {
        window.cancelAnimationFrame(this.#animationId);

        let cachedSections = this.#CloneSections();
        let previousPosition = NaN;
        const tick = () => {
            let currentPosition = this.wheel.currentRotation;

            if (previousPosition != currentPosition) {
                this.canvas!.style.transform = `rotate(${currentPosition}DEG)`;
            }

            if (this.#CheckAndDrawSections(cachedSections)) {
                cachedSections = this.#CloneSections();
            }

            this.#animationId = requestAnimationFrame(tick);
        }
        
        tick();
    }

    #CloneSections() {
        let clonedSections: Section[] = [];

        for (let x = 0; x < this.wheel.sections.length; x++) {
            clonedSections[x] = {...this.wheel.sections[x]};
        }

        return clonedSections;
    }
    #SectionHasChanged(cachedSection:Section|null, currentSection:Section|null) {
        if (
            cachedSection === null || currentSection === null ||
            cachedSection.id != currentSection.id ||
            cachedSection.color != currentSection.color ||
            cachedSection.font != currentSection.font ||
            cachedSection.endDegree != currentSection.endDegree ||
            cachedSection.imageURL != currentSection.imageURL ||
            cachedSection.isActive != currentSection.isActive ||
            cachedSection.isHovered != currentSection.isHovered ||
            cachedSection.isMarked != currentSection.isMarked
        ) {
            console.log("A section has changed: ", cachedSection?.id);
            return true;
        }
        return false;
    }
    #CheckAndDrawSections(cachedSections: Section[]) {
        let didRedrawSomething = false;
        for (let x = 0; x < Math.max(this.wheel.sections.length, cachedSections.length); x++) {
            let cachedSection = cachedSections.length > x ? cachedSections[x] : null;
            let currentSection = this.wheel.sections.length > x ? this.wheel.sections[x] : null;

            if (this.#SectionHasChanged(cachedSection,currentSection)) {
                this.RedrawWheel();
                return true;
                // didRedrawSomething = true;
                // if (currentSection === null) {
                //     this.RedrawWheel();
                //     break;
                // } else {
                //     this.#DrawSection(currentSection);
                // }
            }
        }
        
        return didRedrawSomething;
    }
}
