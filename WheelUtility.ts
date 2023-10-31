import type { Section } from "./WheelTypes";

export function degToRad(deg: number): number {
    return deg * Math.PI / 180;
}

export function getPositionFromDegrees(centerX: number, centerY: number, radius: number, degrees: number): { x: number, y: number } {
    const rad = degToRad(degrees);

    const x = centerX + radius * Math.cos(rad);
    const y = centerY + radius * Math.sin(rad);

    return { x, y };
}

export function getBoundingRectangle(centerX:number, centerY:number, startAngle:number, endAngle:number, radius:number, aspectRatio:number) {
    // Convert angles to radians
    startAngle = (startAngle * Math.PI) / 180;
    endAngle = (endAngle * Math.PI) / 180;

    // Identify potential extreme points
    const angles = [startAngle, endAngle];
    const standardAngles = [0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2];

    for (let angle of standardAngles) {
        if (startAngle < endAngle) {
            if (angle >= startAngle && angle <= endAngle) {
                angles.push(angle);
            }
        } else { // Handle cases where arc crosses 360/0 degree boundary
            if (angle >= startAngle || angle <= endAngle) {
                angles.push(angle);
            }
        }
    }

    let minX = centerX, minY = centerY, maxX = centerX, maxY = centerY;
    for (let angle of angles) {
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);

        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
    }

    let width = maxX - minX;
    let height = maxY - minY;

    // Adjust width and height according to the aspect ratio
    if (width / height < aspectRatio) {
        const newWidth = height * aspectRatio;
        maxX = minX + newWidth;
        width = newWidth;
    } else {
        const newHeight = width / aspectRatio;
        maxY = minY + newHeight;
        height = newHeight;
    }

    return {
        left: minX,
        top: minY,
        right: maxX,
        bottom: maxY,
        width: width,
        height: height
    };
}

// returns a random entry from options
// the likelihood of getting a certain entry corresponds to the
// weight in the same index of the weights array
export function getWeightedRandom<T>(options: T[], weights: number[]): T {
    if (options.length !== weights.length) {
      throw new Error('options and weights must be of the same length');
    }
  
    const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
    if (totalWeight <= 0) {
      throw new Error('total weight must be greater than 0');
    }
  
    let random = Math.random() * totalWeight;
    for (let i = 0; i < options.length; i++) {
      random -= weights[i];
      if (random < 0) {
        return options[i];
      }
    }
  
    // This should never be reached if weights are correctly provided
    throw new Error('failed to get a weighted random value');
  }
  export function getRandomWheelPosition(sections: Section[], weights?: number[]): number {
    if (weights === undefined) {
      // Calculate the arc lengths assuming a unit circle and normalize degrees to [0, 360)
      weights = sections.map(s => {
        let normalizedStart = s.startDegree % 360;
        let normalizedEnd = s.endDegree % 360;
        if (normalizedStart < 0) normalizedStart += 360;
        if (normalizedEnd < 0) normalizedEnd += 360;
        if (normalizedEnd < normalizedStart) normalizedEnd += 360;
        const arcLength = (normalizedEnd - normalizedStart) * (Math.PI / 180);
        return arcLength;
      });
    }
  
    const chosenSection = getWeightedRandom(sections, weights);
  
    // Normalize degrees to [0, 360)
    let startDegree = chosenSection.startDegree % 360;
    let endDegree = chosenSection.endDegree % 360;
    if (startDegree < 0) startDegree += 360;
    if (endDegree < 0) endDegree += 360;
    if (endDegree < startDegree) endDegree += 360;
  
    // Get random number between the start and end degrees
    const randomDegree = startDegree + (Math.random() * (endDegree - startDegree));
  
    // Normalize the result back to [0, 360)
    return randomDegree % 360;
  }