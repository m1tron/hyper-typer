function supertyper() {
    let running = false;
    const texts = getXMLtexts();
    const html = getHtmlObjects();
    let ignoreCasing = false;
    let spans = [];
    let time = 0;
    let index = 0;
    let errors = 0;

    addListeners();
    populateSelect();

    function getXMLtexts() {
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
            case: document.getElementById("case")
        }
    }
    function addListeners() {
        html.textSelect.addEventListener('change', textSelected);
        html.playBtn.addEventListener('click', playListener);
        html.inputbox.addEventListener('input', charTyped);
    }

    function textSelected(e) {
        if (e.target.value != "") {
            html["title"].innerHTML = e.target.value;
            const t = texts[e.target.value].text;
            html["textbox"].innerHTML = t;
            let a = texts[e.target.value].author;
            a += " (" + t.split(" ").length + " words, " + t.length + " chars)";
            html["author"].innerHTML = a;
        }
    }

    function playListener(e) {
        if (running) stopGame();
        else if (html.textSelect.value != "") startGame();
    }

    function charTyped(e) {
        html.inputbox.value = " ";
        if (e.data == null) {
            if (index == 0) return;
            spans[index].id = "";
            index--;
            if (spans[index].id == "error") {
                errors--;
            }
            spans[index].id = "selected";
        }

        else if (e.data == spans[index].innerText) {
            spans[index].id = "pass";
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
            html["textSelect"].appendChild(y);
        }
    }
    function startGame() {
        ignoreCasing = html.case.checked;
        html.textSelect.disabled = true, running = true;
        html.playBtn.innerHTML = "&#x23F9;"   //&#x25B6;
        html.case.disabled = true;
        html.inputbox.disabled = false;
        html.inputbox.focus();

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
        document.getElementById("gwpm").innerHTML = (index / (5 * elapsed_minutes)).toFixed(0);
        document.getElementById("accuracy").innerHTML = parseFloat((index - errors) * 100 / index).toFixed(0) + "%";
        document.getElementById("nwpm").innerHTML = ((index - errors) / (5 * elapsed_minutes)).toFixed(0);
        document.getElementById("errors").innerHTML = errors;
        console.log("index: " + index + "    errors: " + errors);
        console.log(spans[index]);
    }

}


supertyper();





