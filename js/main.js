
function supertyper() {
    let running = false;
    const texts = getXMLtexts();
    const html = getHtmlObjects();
    const spans = [];
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
            playBtn: document.getElementById("play")
        }
    }
    function addListeners() {
        html["textSelect"].addEventListener('change', (event) => {
            if (event.target.value != "") {
                html["title"].innerHTML = event.target.value;
                const t = texts[event.target.value].text;
                html["textbox"].innerHTML = t;
                let a = texts[event.target.value].author;
                a += " (" + t.split(" ").length + " words, " + t.length + " chars)";
                html["author"].innerHTML = a;

            }
        });
        html["playBtn"].addEventListener('click', (event) => {
            if (running) {
                html.textSelect.disabled = false, running = false;
                html.inputbox.disabled = true;
                html.playBtn.innerHTML = "&#x25B6;";
            }
            else if (html.textSelect.value != "" && html.textSelect.disabled == false) {
                html.textSelect.disabled = true, running = true;
                html.playBtn.innerHTML = "&#x23F9;"   //&#x25B6;
                html.inputbox.disabled = false;
                html.inputbox.focus();
                spanifyText();
                startGame();
            }
        });
        html.inputbox.addEventListener('input', (event) => {
            html.inputbox.value = "";
            if (event.data == spans[index].innerText) {
                console.log("MATCH");
                spans[index].id = "";
            }
            else {
                spans[index].id = "error";
                errors++;
            }
            index++;
            updateStats();
            spans[index].id = "selected";

            if (index == spans.length) {
                stopGame();
            }
        });
    }

    function populateSelect() {
        for (const key in texts) {
            let y = document.createElement("option");
            y.innerHTML = key;
            html["textSelect"].appendChild(y);
        }
    }
    function startGame() {
        time = new Date().getTime();
        spans[index].id = "selected";
    }
    function stopGame() {
        html.textSelect.disabled = false, running = false;
        html.inputbox.disabled = true;
        html.playBtn.innerHTML = "&#x25B6;";
    }

    function spanifyText() {
        let text = html["textbox"].innerText;
        html["textbox"].innerText = "";
        for (let letter of text) {
            let y = document.createElement("span");
            y.innerHTML = letter;
            spans.push(y);
            html["textbox"].appendChild(y);
        }
    }

    function updateStats(){
        let elapsed_minutes = (new Date().getTime() - time) / (1000 * 60);
        //console.log(time);
        //console.log(date.getTime());
        document.getElementById("gwpm").innerHTML = (index / (5*elapsed_minutes)).toFixed(0);
        document.getElementById("accuracy").innerHTML = parseFloat((index - errors)*100/index).toFixed(0)+"%";
        document.getElementById("nwpm").innerHTML = ((index - errors) / (5*elapsed_minutes)).toFixed(0);
        document.getElementById("errors").innerHTML = errors;
    }
}


supertyper();





