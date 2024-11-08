/** 
 * Main function 
 * Holds variables and initiates states
*/
function supertyper() {
    let running = false;
    const texts = getXMLtexts();
    const html = getHtmlObjects();
    let ignoreCasing = false;
    let spans = [];
    let time = 0;
    let index = 0;
    let errors = 0;
    let tLength = 0; //Storing this separatly as the innerHTML changes after spannify is called. Could perhaps be done with innertext hmm.
    let gWPM = 0; // Breaking out this value to make it more easily accesible for canvas.
    let canvas = {};



    addListeners();
    populateSelect();
    /** Fetches the texts from the XML document an formats them into an object variable */
    function getXMLtexts() { // TODO: FIX THIS TO USE LISTENER IN ASYNC
        const req = new XMLHttpRequest();           // New XML request
        req.open("GET", "texts.xml", false);        // Set XML request paramaters
        req.send();                                 // Send request
        const res = req.responseXML;                // Extract DOM representation of XML
        const temp = {};
        const title = res.getElementsByTagName("title");        // Extract fields from DOM
        const author = res.getElementsByTagName("author");
        const text = res.getElementsByTagName("text");
        const language = res.getElementsByTagName("language");
        for (let i = 0; i < title.length; i++) {    // Add all fields into an object using the title as key
            temp[title[i].innerHTML] = { author: author[i].innerHTML, text: text[i].innerHTML, lang: language[i].innerHTML };
        }
        return temp;
    }
    /** Fetches DOM elements and return them as an object for easy access */
    function getHtmlObjects() {
        return {
            title: document.getElementById("title"),
            author: document.getElementById("author"),
            textbox: document.getElementById("textbox"),
            inputbox: document.getElementById("inputbox"),
            textSelect: document.getElementById("textSelect"),
            playBtn: document.getElementById("play"),
            sweBtn: document.getElementById("swe"),
            engBtn: document.getElementById("eng"),
            case: document.getElementById("case"),
            canvas: document.getElementById("canvas")
        }
    }
    /** A run-once to add listeners where needed */
    function addListeners() {
        html.textSelect.addEventListener('change', textSelected);
        html.playBtn.addEventListener('click', playListener);
        html.inputbox.addEventListener('input', charTyped);
        html.sweBtn.addEventListener("click", radioBtnAction);
        html.engBtn.addEventListener("click", radioBtnAction);
    }

    /** Listener function for dropdown menu text select
     * Moves text into window */
    function textSelected(e) {
        if (e.target.value != "") {                     // Nullcheck to avoid selecting default value "choose text.."
            html["title"].innerHTML = e.target.value;   // Set title in textwindow
            const t = texts[e.target.value].text;       // texts[key] uses title as key, and title is stored in dropmenu and sent in event
            html["textbox"].innerHTML = t;              // Set text in textbox
            let a = texts[e.target.value].author;       // texts[key] uses title as key, and title is stored in dropmenu and sent in event                      // Se
            a += " (" + t.split(" ").length + " words, " + t.length + " chars)"; // Get author and add amount of words and chars
            html["author"].innerHTML = a;               // Add to element
        }
    }

    /** Listener function for radiobuttons */
    function radioBtnAction(e) {
        for (const opt of html.textSelect.getElementsByTagName("option")) {
            if (opt.value == "noDisable") continue;     // Dont disable the first placeholder option
            opt.disabled = (opt.lang == e.target.value) ? false : true; // disable(true) if text option != radioBtn selected value
        }
    }
    /** Listener function for play/stop button
     * Calls startGame() and stopGame() */
    function playListener(e) {
        if (running) stopGame();
        else if (html.textSelect.value != "noDisable") startGame(); // Check that text is selected
    }

    /** Listener function for inputbox when character is typed (this function is gated by element.disabled and controlled by startGame())
     * Calls stopGame() when index reaches end. Calls draw() and updateStats() on every iteration.
     * Includes logic to determine correct or error
     * Triggers coloring */
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

        updateStats();
        draw();
        if (index == spans.length) {
            stopGame();
            return;
        }
        spans[index].id = "selected";
    }

    /** Called when XML is loaded to populate dropdown text selector */
    function populateSelect() {
        for (const key in texts) {
            let y = document.createElement("option");
            y.innerHTML = key;
            y.lang = texts[key].lang;
            html.textSelect.appendChild(y);
        }
    }

    /** Called from playListener
     * disables/enables relevant elements
     * calls resetVariables(), spannifyText(), updateStats()
     */
    async function startGame() {
        ignoreCasing = html.case.checked;
        html.textSelect.disabled = true, running = true;
        html.case.disabled = true;
        html.inputbox.disabled = false;
        html.inputbox.focus();
        canvas = initCanvas();
        resetVariables();
        spanifyText();
        spans[index].id = "selected";
        updateStats();
        html.playBtn.className += "pop";
        await sleep(300);
        html.playBtn.innerHTML = "&#x23F9;"   //&#x25B6;
    }

    /** Called from playListener to stop game
     * disables/enables relevant elements */
    function stopGame() {
        html.textSelect.disabled = false, running = false;
        html.case.disabled = false;
        html.inputbox.disabled = true;
        html.playBtn.innerHTML = "&#x25B6;";
        html.playBtn.className = "";
    }

    /** Resets variables */
    function resetVariables() {
        index = errors = 0;             // This is okay for simple datatypes
        time = new Date().getTime();    // Store current time
        spans = [];
    }

    /** Called from startGame() to start the game!
     * Creates a span for every character in text and adds to textwindow */
    function spanifyText() {
        let text = html["textbox"].innerText;   // Grab text in textbox
        html["textbox"].innerHTML = "";         // Remove text from textbox
        for (let letter of text) {
            let y = document.createElement("span"); // Create a span
            y.innerHTML = letter;                   // Add a letter to the span
            spans.push(y);                          // Add span to array
            html["textbox"].appendChild(y);         // Add span to textbox
        }
    }
    /** Called from startGame() and charTyped()
     * Updates gross/net WPM, accuracy and errors */
    function updateStats() {
        let elapsed_minutes = (new Date().getTime() - time) / (1000 * 60);
        gWPM = (index / (5 * elapsed_minutes)).toFixed(0);
        document.getElementById("gwpm").innerHTML = gWPM;
        document.getElementById("accuracy").innerHTML = parseFloat((index - errors) * 100 / index).toFixed(0) + "%";
        document.getElementById("nwpm").innerHTML = ((index - errors) / (5 * elapsed_minutes)).toFixed(0);
        document.getElementById("errors").innerHTML = errors;
    }

    /** Called from charTyped() to draw WPM graph */
    function draw() {
        console.log("drawing to X: " + canvas.step * index) // + " Y: " + 150-gWPM);
        canvas.ctx.lineTo(canvas.step * index, 150 - gWPM);
        canvas.ctx.stroke();
    }
    /** Called from startGame() to initialize canvas
     * Returns an object with a new CTX, start coordinates and step length */
    function initCanvas() {
        let tempCtx = html.canvas.getContext("2d");
        tempCtx.clearRect(0, 0, 350, 150);
        tempCtx.beginPath();
        tempCtx.strokeStyle = "yellow";
        tempCtx.moveTo(0, 150);

        return {
            ctx: tempCtx,
            startX: 0,
            startY: 150,
            step: 300 / tLength
        }
    }

    /** Helper function to wait
     * Used in startGame() when changing play button to stop button so that the animation is can be performed before
     */
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

}

supertyper();