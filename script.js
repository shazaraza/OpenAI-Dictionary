const dicturl = "https://api.dictionaryapi.dev/api/v2/entries/en/";
const result = document.getElementById('result');
const example =  document.getElementById('example');
const sound = document.getElementById('sound');
const buttons = document.querySelectorAll(".button");
const btn = document.getElementById('search-btn');


buttons.forEach(function(btn) {
  btn.addEventListener('mouseover', () => {
  btn.style.backgroundColor = 'blue';
}); });

buttons.forEach(function(btn) {
  btn.addEventListener('mouseout', () => {
  btn.style.backgroundColor = '';
}); });

btn.addEventListener ("click", () => {
  let inpWord = document.getElementById("input-word").value;
  btn.style.backgroundColor = '#FFB6C1';
  fetch(`${dicturl}${inpWord}`)
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
            result.innerHTML = `
            <div class="word">
                    <h3>${inpWord}</h3>
                    <button onclick="playSound()">
                        <i class="fas fa-volume-up"></i>
                    </button>
                </div>
                <div class="details">
                    <p>${data[0].meanings[0].partOfSpeech}</p>
                    <p>/${data[0].phonetic}/</p>
                </div>
                <p class="word-meaning">
                   ${data[0].meanings[0].definitions[0].definition}
                </p>
                <p class="word-example">
                    ${data[0].meanings[0].definitions[0].example || ""}
                </p>`;
            sound.setAttribute("src", `https:${data[0].phonetics[0].audio}`);
        })
        .catch(() => {
            result.innerHTML = `<h3 class="error">Couldn't Find The Word</h3>`;
        });
});
function playSound() {
    sound.play();
}

buttons[1].addEventListener("click", () => {
  let url = "https://api.openai.com/v1/chat/completions";
  let inpWord = document.getElementById("input-word").value;
  var bearer = 'Bearer ' + "YOURAPIKEYHERE";
  let q = `Use ${inpWord} in a sentence`;
    fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': bearer,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "model":"gpt-3.5-turbo",
            "messages": [
                    {
                      "role": "system",
                      "content": "You receive a word in the dictionary and have to create a short sentence to help to understand the definition of that word"
                    },
                    {
                      "role": "user",
                      "content": q,
                    }],
            "temperature": 0.7
        })


    }).then(response => {

        return response.json()

    }).then(data=>{
        console.log(data['choices'][0]['message']['content']);
        example.innerHTML = `
        <h4> Example </h4>
        <p class ="word-example"id="word-explain">
            ${data['choices'][0]['message']['content']}
        </p>`;

    })
        .catch(error => {
            console.log('Something bad happened ' + error)
        });

});
