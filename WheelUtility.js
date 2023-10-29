export function getPositionFromDegrees(centerX, centerY, radius, degrees) {
    const rad = degToRad(degrees);
    const x = centerX + radius * Math.cos(rad);
    const y = centerY + radius * Math.sin(rad);
    return { x, y };
}
export function degToRad(deg) {
    return deg * Math.PI / 180;
}
export function getBoundingRectangle(centerX, centerY, startAngle, endAngle, radius, aspectRatio) {
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
        }
        else { // Handle cases where arc crosses 360/0 degree boundary
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
    }
    else {
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
