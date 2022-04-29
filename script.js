languages_data = {
    "German":"Germanic",
    "Frisian":"Germanic",
    "Dutch":"Germanic",
    "Flemish":"Germanic",
    "English":"Germanic",
    "Danish":"Germanic",
    "Faroese":"Germanic",
    "Icelandic":"Germanic",
    "Norwegian":"Germanic",
    "Swedish":"Germanic",
    "Yiddish":"Germanic",
    "Afrikaans":"Germanic",
    "Italian":"Italic",
    "Spanish":"Italic",
    "Catalan":"Italic",
    "Portuguese":"Italic",
    "Sardinian":"Italic",
    "French":"Italic",
    "Romansh":"Italic",
    "Rumanian":"Italic",
    "Russian":"Slavic",
    "Ukrainian":"Slavic",
    "Byelorussian":"Slavic",
    "Slovenian":"Slavic",
    "Serbo-Croatian":"Slavic",
    "Macedonian":"Slavic",
    "Bulgarian":"Slavic",
    "Czech":"Slavic",
    "Slovak":"Slavic",
    "Polish":"Slavic"
}

const germanic_b = document.querySelector('#germanic_b');
const italic_b = document.querySelector('#italic_b');
const slavic_b = document.querySelector('#slavic_b');
const next_button = document.querySelector('#next_button');

let button_names = ["germanic_b", "italic_b", "slavic_b"]

let waitForPressResolve;
let waitForPressResolve2;

let current_guess = "";
let current_key = "";
let current_value = "";

let wrong_answers = {}

function translate(name){
    switch (name.toLowerCase()) {
        case "germanic":
            return button_names[0];
        case "italic":
            return button_names[1];
        case "slavic":
            return button_names[2];
    }
}
function quiz_board(){
    document.getElementById("score").classList.add("hidden");
    document.getElementById("quiz_wrapper").classList.remove("hidden");
    document.getElementById("start_button").classList.add("hidden");
    document.getElementById("repeat_wrong").classList.add("hidden");
}
function add_listeners() {
    germanic_b.addEventListener('click', function(e){ btnResolver(e) });
    italic_b.addEventListener('click', function(e){ btnResolver(e) });
    slavic_b.addEventListener('click', function(e){ btnResolver(e) });
    next_button.addEventListener('click', btnResolver2);
}
function remove_listeners() {
    germanic_b.removeEventListener('click', btnResolver);
    italic_b.removeEventListener('click', btnResolver);
    slavic_b.removeEventListener('click', btnResolver);
    next_button.removeEventListener('click', btnResolver2);
}

function buttons_switch(value){
    button_names.forEach(x => {
        document.getElementById(x).disabled=value;
    });
}

function waitForPress() {
    return new Promise(resolve => waitForPressResolve = resolve);
}
function waitForPress2() {
    return new Promise(resolve2 => waitForPressResolve2 = resolve2);
}

function btnResolver(e) {
    buttons_switch(true);
    current_guess = (e.target.innerHTML).toLowerCase();
    document.getElementById(translate(current_value)).classList.add("good");
    if(current_guess !== current_value.toLowerCase()) {
        e.target.classList.add("bad");
        wrong_answers[current_key] = current_value;
    }
    document.getElementById("next_button").classList.remove("hidden");
    if (waitForPressResolve) waitForPressResolve();
}

function btnResolver2() {
    buttons_switch(false);
    let elems = document.querySelectorAll(".good, .bad");
    [].forEach.call(elems, function(el) {
        el.classList.remove("good");
        el.classList.remove("bad");
    });
    document.getElementById("next_button").classList.add("hidden");
    if (waitForPressResolve2) waitForPressResolve2();
}

async function main_quiz(data) {
    let max_index = Object.entries(data).length;
    let indexes = Array.from(Array(max_index).keys()).sort((a, b) => 0.5 - Math.random());
    for (const x of indexes) {
        let key = Object.entries(data)[x][0];
        let value = Object.entries(data)[x][1];
        console.log(key, value);
        current_key = key;
        current_value = value;
        document.getElementById("question").innerText = key;
        await waitForPress();
        await waitForPress2();
    }
}

function end_quiz(data) {
    document.getElementById("quiz_wrapper").classList.add("hidden");
    document.getElementById("start_button").classList.remove("hidden");
    document.getElementById("start_button").innerText = "START AGAIN";
    if(Object.keys(wrong_answers).length !== 0) {
        document.getElementById("repeat_wrong").classList.remove("hidden");
    }
    document.getElementById("score").innerText = `${Object.keys(data).length - Object.keys(wrong_answers).length}/${Object.keys(data).length}`;
    document.getElementById("score").classList.remove("hidden");
}

document.getElementById("start_button").onclick=async ()=>{
    add_listeners();
    quiz_board();
    await main_quiz(languages_data);
    remove_listeners();
    end_quiz(languages_data);
};

document.getElementById("repeat_wrong").onclick=async ()=>{
    let wrong_answers_copy = wrong_answers;
    wrong_answers = {}
    add_listeners();
    quiz_board();
    await main_quiz(wrong_answers_copy);
    remove_listeners();
    end_quiz(wrong_answers_copy);
};