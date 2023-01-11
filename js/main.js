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

    function getXMLtexts() { // TODO: FIX THIS TO USE LISTENER IN ASYNC
        const req = new XMLHttpRequest();
        req.open("GET", "texts.xml", false);
        req.send();
        const res = req.responseXML;
        const temp = {};
        const title = res.getElementsByTagName("title");
        const author = res.getElementsByTagName("author");
        const text = res.getElementsByTagName("text");
        const language = res.getElementsByTagName("language");
        for (let i = 0; i < title.length; i++) {
            temp[title[i].innerHTML] = { author: author[i].innerHTML, text: text[i].innerHTML, lang: language[i].innerHTML };
        }
        return temp;
    }
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
    function addListeners() {
        html.textSelect.addEventListener('change', textSelected);
        html.playBtn.addEventListener('click', playListener);
        html.inputbox.addEventListener('input', charTyped);
        html.sweBtn.addEventListener("click", radioBtnAction);
        html.engBtn.addEventListener("click", radioBtnAction);
    }

    function textSelected(e) {
        if (e.target.value != "") {
            html["title"].innerHTML = e.target.value;
            const t = texts[e.target.value].text;
            html["textbox"].innerHTML = t;
            let a = texts[e.target.value].author;
            tLength = t.length;
            a += " (" + t.split(" ").length + " words, " + tLength + " chars)";
            html["author"].innerHTML = a;
        }
    }
    function radioBtnAction(e) {
        for (const opt of html.textSelect.getElementsByTagName("option")) {
            if (opt.value == "noDisable") continue;     // Dont disable the first placeholder option
            opt.disabled = (opt.lang == e.target.value) ? false : true; // disable(true) if text option != radioBtn selected value
        }
    }
    function playListener(e) {
        if (running) stopGame();
        else if (html.textSelect.value != "noDisable") startGame(); // Check that text is selected
    }

    function charTyped(e) {
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

    function populateSelect() {
        for (const key in texts) {
            let y = document.createElement("option");
            y.innerHTML = key;
            y.lang = texts[key].lang;
            html.textSelect.appendChild(y);
        }
    }
    function startGame() {
        ignoreCasing = html.case.checked;
        html.textSelect.disabled = true, running = true;
        html.playBtn.innerHTML = "&#x23F9;"   //&#x25B6;
        html.case.disabled = true;
        html.inputbox.disabled = false;
        html.inputbox.focus();
        canvas = initCanvas();
        resetVariables();
        spanifyText();
        spans[index].id = "selected";
        updateStats();
    }

    function stopGame() {
        html.textSelect.disabled = false, running = false;
        html.case.disabled = false;
        html.inputbox.disabled = true;
        html.playBtn.innerHTML = "&#x25B6;";
    }

    function resetVariables() {
        index = errors = 0;             // This is okay for simple datatypes
        time = new Date().getTime();    // Store current time
        spans = [];
    }

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

    function updateStats() {
        let elapsed_minutes = (new Date().getTime() - time) / (1000 * 60);
        gWPM = (index / (5 * elapsed_minutes)).toFixed(0);
        document.getElementById("gwpm").innerHTML = gWPM;
        document.getElementById("accuracy").innerHTML = parseFloat((index - errors) * 100 / index).toFixed(0) + "%";
        document.getElementById("nwpm").innerHTML = ((index - errors) / (5 * elapsed_minutes)).toFixed(0);
        document.getElementById("errors").innerHTML = errors;
    }

    function draw() {
        console.log("drawing to X: " + canvas.step*index) // + " Y: " + 150-gWPM);
        canvas.ctx.lineTo(canvas.step*index, 150-gWPM);
        canvas.ctx.stroke();
    }

    function initCanvas(){
        let tempCtx = html.canvas.getContext("2d");
        tempCtx.clearRect(0, 0, 350, 150);
        tempCtx.beginPath();
        tempCtx.strokeStyle = "yellow";
        tempCtx.moveTo(0, 150);

        return {
            ctx: tempCtx,
            startX: 0,
            startY: 150,
            step: 300/tLength
        }
    }

    
}


supertyper();





