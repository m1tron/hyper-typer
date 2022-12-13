/* const selectElement = document.querySelector('#textSelect');

selectElement.addEventListener('change', (event) => {
  const result = document.querySelector('.result');
  result.textContent = `You like ${event.target.value}`;
});
 */
function supertyper() {

    const texts = getXMLtexts();
    const html = getHtmlObjects();

    html["title"].innerHTML = texts.getElementsByTagName("title")[4].innerHTML;





    function getXMLtexts() {
        const req = new XMLHttpRequest();
        req.open("GET", "texts.xml", false);
        req.send();
        return req.responseXML;
    }

    function getHtmlObjects() {
        return {
            title: document.getElementById("title"),
            author: document.getElementById("author"),
            text: document.getElementById("textbox")
        }
    }
}

supertyper();
