# Project

## Environment & Tools


| Program |  Version   |
|--------|:----------:| 
| `MacOS` |  **13.0**  | 
| `Filezilla` | **17.0.3** |
| `VScode` | **1.73.0** |
| `Git`    | **2.32.1** |


## Purpose

This study covers implementing a typing game in html, css and javascript that adhere to supplied specifications. The goal is to meet the following requirements:

- HTML, CSS and Javascript code should not be intermingled, but kept in separate files.
- HTML should be divide into header, main and footer.
- CSS must include type-faces and @keyframe animations.
- Texts must be loaded from an XML file.
- The game should index the character to be typed and colourize inputs to indicate correct or incorrect input.
- Statistics should be calculated as the game runs to display gross WPM, net WPM, accuracy and errors.
- A graph should be drawn to display gross WPM throughout the game.

## Procedures

### index.html

The page is split up into header main and footer, where the main simply has a logo/title and the footer has the authors info.

The main is divided in a linear fasion with the end goal to implement a vertical flex layout using CSS. This simplifies the HTML code as no tables or lists will be used. Main is divided into five spaces in the order of:
- `<select>`    for selecting text
- `<section>`   to hold settings panel
- `<div>`       to hold title, author and text
- `<section>`   to hold statistics
- `<canvas>`    to draw a graph

Sections were used where there was naturally needed a static header, otherwise `<div>` was used. `<select>` and `<canvas>` were per instruction.


### style.css
Flex layout was chosen for this webpage. The body is a flexcontainer and the subheaders of head, main and footers are both flexitems and flexcontainers. 
```css 
header,
main,
footer {
    display: flex;
    width: 600px;
    flex-direction: column;
    flex: 1;
    align-items: center;
}
``` 
This ensures a vertical layout with one element per row. Sub elements are ordered separately. 

### Animation
The header, playbutton, and typed text is animated using two different key frames. The header one simply slides slowly from right to left while changing opactity and the other is quick expand and fade animation for the play button. The latter is reused for typed elements to add some extra flair.

### @font-face
Two fontfaces were used for this project. One for regular text and one for bold. 
```css
/*  FONT-FACES   */
@font-face {
    font-family: "camingocode";
    src: url('../font/CamingoCode-Regular-webfont.woff') format('woff');
    font-weight: normal;
    font-style: normal;
}

@font-face {
    font-family: "camingocode";
    src: url('../font/CamingoCode-Bold-webfont.woff') format('woff');
    font-weight: bold;
    font-style: normal;
}
```
The `font-weight` attribute is used to match each font to its respective use case.

### main.js

The javascript part was done with a collection of functions:
- `supertyper()`
    - `getXMLtexts()`
    - `getHTMLObjects()`
    - `addListeners()`
    - `textSelected(e)`
    - `radioBtnAction(e)`
    - `playListener(e)`
    - `chartyped(e)`
    - `populateSelected()`
    - `startGame()`
    - `stopGame()`
    - `resetVariables()`
    - `spanifyText()`
    - `updateStats()`
    - `draw()`
    - `initCanvas()`
    - `sleep()`

`supertyper()` is the main function and holds all the data different variables. The other functions are all inner functions. No data is passed between functions, they all operate on data directly. 

The program flow looks something like this. `getXMLtexts()` gets data from texts.xml. `getHTMLObjects()` then adds html refrences to relevent objects in `html{}`. After that listeners are added and the display is updated. The rest is just the listeners reacting to the user action to start, stop and run the game. 

### Data structure
A multitude of variables were used this time around:
```javascript
let running = false;
    const texts = getXMLtexts();
    const html = getHtmlObjects();
    let ignoreCasing = false;
    let spans = [];
    let time = 0;
    let index = 0;
    let errors = 0;
    let gWPM = 0; 
    let canvas = {};
```
- `texts` holds the texts in a dictionary keyed with title for easy access on the data.
- `html` holds the references to hmtl objects for ease of access. For example `html.playBtn` instead of `document.getElementById("play")` every time.
- `ignoreCasing` flag for setting 
- `time` timer for game length 
- `index` holds the character index when playing the game 
- `errors`, `texts` and `texts` to hold statistics 

### charTyped() and game logic
When playing the game, all interaction happens with the keyboard() unless the stop button is used). This means that almost all of the game logic resides here. 
```javascript
function charTyped(e) {
        let audio = new Audio('../sound/click.mp3');
        audio.play();
        html.inputbox.value = " ";      // Add a blankspace instead of the inputed value in textfield. This allows backspace action
        if (e.data == null) {           // Nullcheck when using backspace to go out of bounds
            if (index == 0) return;     // Abort to avoid using index < 0
            spans[index].id = "";       // Remove highlighting before stepping back
            index--;                    // Decrement index
            if (spans[index].id == "error") errors--;   // Decrement errors if we land on a prevoius error
            spans[index].id = "selected";               // Select the new index
        }

        else if (e.data == spans[index].innerText) {    // If typed char is the same as selection
            spans[index].id = "pass";                   // PASS
            index++;
        }
        else if (ignoreCasing && e.data.toLowerCase() == spans[index].innerText.toLowerCase()) {
            spans[index].id = "pass";
            index++;
        }
        else {
            spans[index].id = "error";
            errors++;
            index++;
        }
```

## Discussion

The goals stated in the purpose have been used to model the solution and testing of the finished webpage suggests that the goals have been met.

The creative freedom in the project made for a lot of fun and a few extra functions I wanted to implement. Looking back at the project now, it could use some refactoring to help readability and divide up responsibilities better between functions. Async and promises should probably also be used more, especially when reading the XML file.
