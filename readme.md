# Laboration 4

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
- The game should index the character to be typed and colourize inputs to indicate correct or incorrect input
- Statistics should be calculated as the game runs to display gross WPM, net WPM, accuracy and errors.
- A graph should be drawn to display gross WPM throughout the game.

## Procedures

This will quickly go though

### booking.html

The right and left side were divided with `<div>` for the form and table respectively. The table were in turn implemented using 18 more `<div>`. This could have been any html tag really, but <div> was chosen as it comes with the least restrictions and thus simplifying the styling in CSS. A html table was used at first, but rounding corners of the table and it's elements to align with the page as a whole proved frustrating and this approach was selected instead.

The instruction reads:
>Du behöver inte använda canvas för att ”rita” tabellen, utan en vanlig html-tabell är ok. 

This was understood as suggestions that a html table was ok to use, but not enforced. 


### Javacript Structure

The javascript part was done with a collection of functions:
- `booking()`
    - `data{}`
    - `init()`
    - `buildData()`
    - `addListeners()`
    - `update()`
    - `clear()`
    - `save()`
    - `submit()`
    - `createBoardingcard()`

`booking()` is the main function and holds all the data in `data{}`. The other functions are all inner classes. No data is passed between functions, they all operate on `data{}` directly. 

The script is delayed with the `defer` keyword to make sure the HTML is ready before `booking()`is called from the end of the script _if_ the page running the script is `booking.html`.

The program flow looks something like this. `init()` gets data from `sessionStorage` or builds the structure using `buildData()`. `init()` then adds html refrences to relevent objects in `data{}`. After that listeners are added and the display is updated. The rest is just the listeners reacting to user action to save, update, clear or submit data! 

### Data structure
This was an interesting part. First I made objects called Seat. They had HTML references, listeners, color, selection tracker and all set by it´s constructor. This way still needed helper functions to iterate and make sure only one seat were selected for example. This was then mashed together with some functions checking and passing data between the fields and seat to make sure everything functioned properly. When I then tried to store this using `JSON.stringify` I got into some major trouble as this would not let me store html objects or listeners. This needed to be rebuilt and the class constructor did not make it through either. A rewrite was in order, and the decision fell on making a single variable that held all information: 
```javascript
data = {
    seats: [],
    form: {},
    lastSelect: null
}
```
`seats` stores the array of seats, and `form` stores the form containing input fields and buttons. Lastly `lastSelect` contains a number to indicate which seat that is selected.

One downside of this approach is that while storing the data is simple, it is done with some considerable overhead. All data is now replaced every time the user touches a button, a seat or an input field. However, for the scope of this program this should not be an issue.


### addListners()
When the listeners are added they are passed anonymous functions which somewhat obfuscates the program logic. Seeing as 10 functions had been made already to divide the logic, one could make the arguments that more functions also would make the program harder to overlook.


## Discussion

The goals stated in the purpose have been used to model the solution and testing of the finished webpage suggests that the goals have been met.

 From a personal perspective I found this laboration a lot of fun since it involved a lot of coding. It was also very hard given the time frame of a week were half of time is used for another course. Still I learned a ton, and having things work with JSON is a good practice as virtually every programming language supports the format in the standard library.