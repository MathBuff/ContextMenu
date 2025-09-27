//I need you to make a ColorSelectionMenu class
class ColorSelectionMenu{
    constructor(){
        //...
    }

    //...
}
//I want the class to be used like so:
//Lets say I want to create a new object for ColorSelectionMenu

let menu = new ColorSelectionMenu();

/*From here I want to be able to load in colors that the menu will contain.
The menu should  have multiple rows, each populated by coordinating color squares to the hex provided to select from.
*/

//Before actual use, I want to populate the manu by appending row by row, a line of color squares to the menu like so:
menu.addRow([["color1Name","#color1"],["color2Name","#color2"],["color3Name","#color3"]]);

//Then later, after loading all the rows, I can then actually use the menu in the final product like so:
let pickedColor = await menu.open(); 

//This summons the menu pop-up, and if a color is selected, the hexcode is returned,
//if no color is selected, null is returned
//reguardless, the menu hides itself automatically

/*
This menu is to allow selections to be possible via a mouse click or via keyboard navigation.
For keyboard navigation, I want each row to be in a vertical array, which the cursor is able to traverse via a matrix position
which gives a color square to highlight using a CSS class.
Controls will be the arrow keys to move this highlight, and enter will select the color at that highlight.

I want the colorNames to appear as a tool tip if the mouse hovers over the color.
In addition, to having a thin print bar attatched to the bottom of the menu that prints the name of the currently
highlighted color. 

I want the cursor position to be set to the selected color if clicked by a mouse, and I want the position to be 
unchanged between calls of menu.open(), unless colors are added, in which case it can be at row 0, color square 0.

For menu cancellation, which returns null instead of a hex, I want that to occur when a user selects something that is not on the menu using the mouse.
When the menu is empty.
Or when the user selects a small x button next to the thin print bar.
Or when the user presses the escape key.
I basically want to freeze the program with this pop up too so don't be afraid to block everything until the menu closes itself.
*/





