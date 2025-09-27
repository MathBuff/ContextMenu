/**
 * ColorPalette Class
 * 
 * Represents a named color palette where each color has a string name
 * mapped to a hex code. Useful for document rendering or procedural
 * generation where colors are referenced by name.
 * 
 * Public API:
 *   - addColor(name, hex)      : Add a new color to the palette
 *   - removeColor(name)        : Remove a color by name
 *   - getHex(name)             : Retrieve hex code for a color
 *   - getAllColors()           : Return all colors as a plain object
 *   - size()                   : Get the number of colors in the palette
 */
class ColorPalette {
    constructor() {
        this.colors = new Map();
    }
    /**
     * Add a color to the palette
     * @param {string} name - The string name of the color
     * @param {string} hex - The hex code of the color
     */
    addColor(name, hex) {
        this.colors.set(name, hex);
    }

    /**
     * Remove a color from the palette
     * @param {string} name - Name of the color to remove
     * @returns {boolean} True if removed, false if not found
     */
    removeColor(name) {
        return this.colors.delete(name);
    }

    /**
     * Get the hex code of a color by name
     * @param {string} name - Name of the color
     * @returns {string | undefined} Hex code if found, otherwise undefined
     */
    getHex(name) {
        return this.colors.get(name);
    }

    /**
     * Get all colors as a plain object
     * @returns {Object} Key-value mapping of color names to hex codes
     */
    getAllColors() {
        return Object.fromEntries(this.colors);
    }

    /**
     * Get the number of colors in the palette
     * @returns {number} Number of colors
     */
    size() {
        return this.colors.size;
    }
}
//----------------------------------------------------------
const defaultPalette = new ColorPalette();

defaultPalette.addColor("red", "#ff0000");
defaultPalette.addColor("redBurn", "#cc4125");
defaultPalette.addColor("redBerry", "#980000");
defaultPalette.addColor("redBlush", "#e06666");
defaultPalette.addColor("orange", "#ff9900");
defaultPalette.addColor("brownFart", "#b45f06");
defaultPalette.addColor("brown", "#783f04");
defaultPalette.addColor("yellowBrass", "#7f6000");
defaultPalette.addColor("peach", "#f9cb9c");
defaultPalette.addColor("yellow", "#ffff00");
defaultPalette.addColor("yellowGold", "#f1c232");
defaultPalette.addColor("green", "#00ff00");
defaultPalette.addColor("greenMint", "#93c47d");
defaultPalette.addColor("greenOlive", "#38761d");
defaultPalette.addColor("cyan", "#00ffff");
defaultPalette.addColor("cyanSubmarine", "#76a5af");
defaultPalette.addColor("blue", "#0000ff");
defaultPalette.addColor("blueOcean", "#1155cc");
defaultPalette.addColor("blueCornFlower", "#4a86e8");
defaultPalette.addColor("blueSky", "#6fa8dc");
defaultPalette.addColor("purpleDream", "#8e7cc3");
defaultPalette.addColor("purple", "#9900ff");
defaultPalette.addColor("purpleEggPlant", "#351c75");
defaultPalette.addColor("pink", "#c27ba0");
defaultPalette.addColor("pinkPimp", "#741b47");
defaultPalette.addColor("magenta", "#ff00ff");
defaultPalette.addColor("gray", "#666666");
defaultPalette.addColor("white", "#ffffff");
//Only these 2 are not shared in the google theme:
defaultPalette.addColor("tan", "#D2B48C");
defaultPalette.addColor("gold", "#FFD700");

// Create a Google-themed color palette
const googlePalette = new ColorPalette();

/* GRAY SCALE */
googlePalette.addColor("black", "#000000");
googlePalette.addColor("darkGray4", "#434343");
googlePalette.addColor("darkGray3", "#666666");
googlePalette.addColor("darkGray2", "#999999");
googlePalette.addColor("darkGray1", "#b7b7b7");
googlePalette.addColor("gray", "#cccccc");
googlePalette.addColor("lightGray1", "#d9d9d9");
googlePalette.addColor("lightGray2", "#efefef");
googlePalette.addColor("lightGray3", "#f3f3f3");
googlePalette.addColor("white", "#ffffff");

/* RED BERRY */
googlePalette.addColor("darkRedBerry3", "#5b0f00");
googlePalette.addColor("darkRedBerry2", "#85200c");
googlePalette.addColor("darkRedBerry1", "#a61c00");
googlePalette.addColor("redBerry", "#980000");
googlePalette.addColor("lightRedBerry1", "#cc4125");
googlePalette.addColor("lightRedBerry2", "#dd7e6b");
googlePalette.addColor("lightRedBerry3", "#e6b8af");

/* RED */
googlePalette.addColor("darkRed3", "#660000");
googlePalette.addColor("darkRed2", "#990000");
googlePalette.addColor("darkRed1", "#cc0000");
googlePalette.addColor("red", "#ff0000");
googlePalette.addColor("lightRed1", "#e06666");
googlePalette.addColor("lightRed2", "#ea9999");
googlePalette.addColor("lightRed3", "#f4cccc");

/* ORANGE */
googlePalette.addColor("darkOrange3", "#783f04");
googlePalette.addColor("darkOrange2", "#b45f06");
googlePalette.addColor("darkOrange1", "#e69138");
googlePalette.addColor("orange", "#ff9900");
googlePalette.addColor("lightOrange1", "#f6b26b");
googlePalette.addColor("lightOrange2", "#f9cb9c");
googlePalette.addColor("lightOrange3", "#fce5cd");

/* YELLOW */
googlePalette.addColor("darkYellow3", "#7f6000");
googlePalette.addColor("darkYellow2", "#bf9000");
googlePalette.addColor("darkYellow1", "#f1c232");
googlePalette.addColor("yellow", "#ffff00");
googlePalette.addColor("lightYellow1", "#ffd966");
googlePalette.addColor("lightYellow2", "#ffe599");
googlePalette.addColor("lightYellow3", "#fff2cc");

/* GREEN */
googlePalette.addColor("darkGreen3", "#274e13");
googlePalette.addColor("darkGreen2", "#38761d");
googlePalette.addColor("darkGreen1", "#6aa84f");
googlePalette.addColor("green", "#00ff00");
googlePalette.addColor("lightGreen1", "#93c47d");
googlePalette.addColor("lightGreen2", "#b6d7a8");
googlePalette.addColor("lightGreen3", "#d9ead3");

/* CYAN */
googlePalette.addColor("darkCyan3", "#0c343d");
googlePalette.addColor("darkCyan2", "#134f5c");
googlePalette.addColor("darkCyan1", "#45818e");
googlePalette.addColor("cyan", "#00ffff");
googlePalette.addColor("lightCyan1", "#76a5af");
googlePalette.addColor("lightCyan2", "#a2c4c9");
googlePalette.addColor("lightCyan3", "#d0e0e3");

/* CORN FLOWER BLUE */
googlePalette.addColor("darkCornflowerBlue3", "#1c4587");
googlePalette.addColor("darkCornflowerBlue2", "#1155cc");
googlePalette.addColor("darkCornflowerBlue1", "#3c78d8");
googlePalette.addColor("cornflowerBlue", "#4a86e8");
googlePalette.addColor("lightCornflowerBlue1", "#6d9eeb");
googlePalette.addColor("lightCornflowerBlue2", "#a4c2f4");
googlePalette.addColor("lightCornflowerBlue3", "#c9daf8");

/* BLUE */
googlePalette.addColor("darkBlue3", "#073763");
googlePalette.addColor("darkBlue2", "#0b5394");
googlePalette.addColor("darkBlue1", "#3d85c6");
googlePalette.addColor("blue", "#0000ff");
googlePalette.addColor("lightBlue1", "#6fa8dc");
googlePalette.addColor("lightBlue2", "#9fc5e8");
googlePalette.addColor("lightBlue3", "#cfe2f3");

/* PURPLE */
googlePalette.addColor("darkPurple3", "#20124d");
googlePalette.addColor("darkPurple2", "#351c75");
googlePalette.addColor("darkPurple1", "#674ea7");
googlePalette.addColor("purple", "#9900ff");
googlePalette.addColor("lightPurple1", "#8e7cc3");
googlePalette.addColor("lightPurple2", "#b4a7d6");
googlePalette.addColor("lightPurple3", "#d9d2e9");

/* MAGENTA */
googlePalette.addColor("darkMagenta3", "#4c1130");
googlePalette.addColor("darkMagenta2", "#741b47");
googlePalette.addColor("darkMagenta1", "#a64d79");
googlePalette.addColor("magenta", "#ff00ff");
googlePalette.addColor("lightMagenta1", "#c27ba0");
googlePalette.addColor("lightMagenta2", "#d5a6bd");
googlePalette.addColor("lightMagenta3", "#ead1dc");


//----------------------------------------------------------
export { ColorPalette, defaultPalette, googlePalette };

