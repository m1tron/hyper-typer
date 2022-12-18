
function supertyper() {
    let running = false;
    const date = new Date();
    const texts = getXMLtexts();
    const html = getHtmlObjects();
    const spans = [];
    const index = 0;
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
            }
        });
        html.inputbox.addEventListener('input', (event) => {
            html.inputbox.innerText = "";
            if(event.data == spans[index].innerText){
                console.log("MATCH");
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
        let time = date.getTime();


        
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
}


supertyper();





