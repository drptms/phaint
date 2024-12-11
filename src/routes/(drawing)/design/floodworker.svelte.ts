self.onmessage = function (event) {
    const { x, y, data, width, heigth, color } = event.data;
    
    // Perform the flood fill operation (example implementation)
    const result = performFloodFill({x: x, y: y}, data, width, heigth, color);
  
    if (!result) {
        postMessage({ message: "error" });
    } else {
        postMessage({ data: result, width: width, height: heigth, message: "success" });
    }
};


const colorMap: Map<string, Color> = new Map([
    ['red', [255, 0, 0, 255]],
    ['orange', [255, 165, 0, 255]],
    ['yellow', [255, 255, 0, 255]],
    ['green', [0, 255, 0, 255]],
    ['blue', [0, 0, 255, 255]],
    ['indigo', [75, 0, 130, 255]],
    ['violet', [238, 130, 238, 255]],
    ['black', [0, 0, 0, 255]],
    ['white', [255, 255, 255, 255]]
]);

const chunks = [-1, 0, 1]

type Color = [number, number, number, number];
type Coordinates = {x: number, y: number};

function colorsMatch(color1: Color, color2: Color): boolean {
    return color1[0] === color2[0] &&
            color1[1] === color2[1] &&
            color1[2] === color2[2] &&
            color1[3] === color2[3];
}
  
function performFloodFill(coords: Coordinates, pixels: Uint8ClampedArray, width: number, height: number, color: string, chunkSize = 3) {
    const startPos = (coords.y * width + coords.x) * 4;
    const startColor: Color = [
        pixels[startPos],
        pixels[startPos + 1],
        pixels[startPos + 2],
        pixels[startPos + 3]
    ];

    const fillColor = colorMap.get(color);

    if (!fillColor) {
        return
    }
    if (colorsMatch(fillColor, startColor)) {
        return
    }

    const stack: [number, number][] = [[coords.x, coords.y]];
    const visited: Set<[number, number]> = new Set();  // Track visited pixels

    const getPixelIndex = (x: number, y: number): number => {
        return (y * width + x) * 4;
    }

    while (stack.length > 0) {

        const [currentX, currentY] = stack.pop()!;
        // Skip if this pixel has already been visited
        if (visited.has([currentX, currentY])) {
            continue;
        }
        
        visited.add([currentX, currentY]);

        const index = getPixelIndex(currentX, currentY);

        // Check if the pixel color matches the target color
        const currentColor: Color = [
            pixels[index],
            pixels[index + 1],
            pixels[index + 2],
            pixels[index + 3]
        ];

        if (colorsMatch(currentColor, startColor)) {
            // Fill the current pixel
            for (let i = 0; i < chunkSize; i++) {
                for (let j = 0; j < chunkSize; j++) {
                    const index = getPixelIndex(currentX + chunks[j], currentY + chunks[i])
                    pixels[index] = fillColor[0];
                    pixels[index + 1] = fillColor[1];
                    pixels[index + 2] = fillColor[2];
                    pixels[index + 3] = fillColor[3];
                }
            }

            // Add neighboring pixels to the stack
            if (!visited.has([currentX - chunkSize, currentY]) && currentX > 0) {
                stack.push([currentX - chunkSize, currentY]);
            };
            if (!visited.has([currentX + chunkSize, currentY]) && currentX < width - 1) {
                stack.push([currentX + chunkSize, currentY]);
            };
            if (!visited.has([currentX, currentY - chunkSize]) && currentY > 0) {
                stack.push([currentX, currentY - chunkSize]); 
            };
            if (!visited.has([currentX, currentY + chunkSize]) && currentY < height - 1) {
                stack.push([currentX, currentY + chunkSize]); 
            };
        }
    }
    return pixels
}
  
export {};