/**
 * Converts a hex color to a pastel version by mixing it with white
 * @param hexColor - The hex color to convert (e.g., "#FF0000")
 * @returns A pastel version of the input color
 */
export function generatePastelColor(hexColor: string): string {
    // Remove the # if present
    const hex = hexColor.replace('#', '');

    // Convert hex to RGB
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    // Mix with white (255, 255, 255)
    // Adjust the mixing ratio (0.7) to control how pastel the result is
    const mixRatio = 0.7;

    const newR = Math.round(r * (1 - mixRatio) + 255 * mixRatio);
    const newG = Math.round(g * (1 - mixRatio) + 255 * mixRatio);
    const newB = Math.round(b * (1 - mixRatio) + 255 * mixRatio);

    // Convert back to hex
    const newHex = '#' +
        newR.toString(16).padStart(2, '0') +
        newG.toString(16).padStart(2, '0') +
        newB.toString(16).padStart(2, '0');

    return newHex;
}

/**
 * Determines whether black or white text should be used based on background color
 * @param backgroundColor - The background color in hex format
 * @returns "#000000" for black or "#FFFFFF" for white
 */
export function getContrastColor(backgroundColor: string): string {
    // Remove the # if present
    const hex = backgroundColor.replace('#', '');

    // Convert hex to RGB
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    // Calculate relative luminance
    // Using the formula from WCAG 2.0
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

    // Return black for light backgrounds, white for dark backgrounds
    return luminance > 0.5 ? '#000000' : '#FFFFFF';
} 