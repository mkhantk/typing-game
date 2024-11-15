let wordArr = [];
let count = 0;
let charCount = 0;
let input = document.getElementById("typed-value");
let textArea = document.getElementById("textArea");
let button = document.getElementById("button");
let result = document.getElementById("result");
let container = document.getElementById("container");
let totalChar = 0;
let totalWord;
let countWord = 0;
let intervalId;

// fetch the data
async function generate() {
  try {
    textArea.textContent = "Loading . . .";
    let response = await fetch(
      "https://random-word-api.herokuapp.com/word?number=20"
    );
    wordArr = await response.json();
    displayWords();
    console.log(wordArr.join(" "));
  } catch (error) {
    console.error("Error Fetching word", error);
  }
}

// show the fetched data to the display
function displayWords() {
  textArea.textContent = "";
  count = 0;
  for (let i = 0; i < wordArr.length; i++) {
    newWord = document.createElement("span");

    newWord.textContent = wordArr[i];
    newWord.id = i;

    textArea.appendChild(newWord);
  }
  document.getElementById(count).classList.add("current");

  totalWord = wordArr.length;
}

//event for button

button.addEventListener("click", () => {
  generate();
  input.focus();
  input.value = "";
  input.classList.remove("error");
  resetTimer();
});

//display the word on first load
document.addEventListener("DOMContentLoaded", () => {
  generate();
  input.focus();
  input.value = "";
});

input.addEventListener("keyup", (event) => {
  let validChar = /[a-z]/;
  if (count === 0 && input.value.length > 0) {
    // start = true;
    startTimer();
    // start timer
  }

  if (event.key === " ") {
    console.log(input.value);
    if (input.value.length > 1) {
      if (input.value.trim() !== document.getElementById(count).textContent) {
        document.getElementById(count).style.color = "red";
      }
      if (count === totalWord - 1) {
        input.value = "";
        document.getElementById(count).classList.remove("current");
        stopTimer();
      } else {
        input.value = "";

        document.getElementById(count).classList.remove("current");
        count += 1;
        document.getElementById(count).classList.add("current");
      }
    } else {
      input.value = "";
      document.getElementById(count).classList.remove("current");
    }
    input.classList.remove("error");
  } else if (event.key.match(validChar)) {
    if (input.value) {
      let characters = document.getElementById(count).textContent.split("");
      if (
        input.value[input.value.length - 1] !==
        characters[input.value.length - 1]
      ) {
        input.classList.add("error");
        document.getElementById(count).style.color = "red";

        totalChar += 1;
      } else {
        input.classList.remove("error");

        charCount += 1;
        totalChar += 1;
      }
    } else {
      input.classList.remove("error");
    }
  }
});

//now timer
let minute = 0;
let second = 0;
// let start = false;
function startTimer() {
  if (!intervalId) {
    intervalId = setInterval(() => {
      if (second < 59) {
        second++;

        document.getElementById("second").textContent = String(second).padStart(
          2,
          "0"
        );
      } else {
        second = 0;
        minute++;
        document.getElementById("minute").textContent = String(minute).padStart(
          2,
          "0"
        );

        // console.log(minute, second);
      }
    }, 1000);
  }
}

function stopTimer() {
  clearInterval(intervalId);
  intervalId = null;
  container.classList.add("hide");
  showResult();
}

function resetTimer() {
  if (intervalId !== null) {
    clearInterval(intervalId);
    intervalId = null;
  }
  minute = 0;
  second = 0;
  count = 0;
  charCount = 0;

  document.getElementById("second").textContent = String(second).padStart(
    2,
    "0"
  );
  document.getElementById("minute").textContent = String(minute).padStart(
    2,
    "0"
  );
  document.getElementById("typed-value").disabled = false;
  input.focus();
  container.classList.remove("hide");
  while (result.firstChild) {
    result.removeChild(result.firstChild);
  }

  title.textContent = "Practice Typing";
}

//now it's time for the result display

function showResult() {
  let timeTakenInSecond = minute * 60 + second;
  let cpm = calculateCPM(charCount, timeTakenInSecond);
  let accuracyPercent = ((charCount / totalChar) * 100).toFixed(2);
  //show title
  title = document.querySelector("h1");
  if (cpm > 700) {
    title.textContent =
      "Your typing speed is approaching dangerous levels—who are you, a secret agent?";
  } else if (cpm > 600 && cpm < 700) {
    title.textContent =
      "Slow down before you put your keyboard into early retirement!";
  } else if (cpm > 500 && cpm < 600) {
    title.textContent =
      "Speedy fingers! Don’t worry, the keyboard can handle it… probably.";
  } else if (cpm > 400 && cpm < 500) {
    title.textContent =
      "Are you training to be the Flash? Because you're getting somewhere!";
  } else if (cpm > 300 && cpm < 400) {
    title.textContent =
      "Nice and steady! But maybe give those fingers a pep talk.";
  } else if (cpm > 200 && cpm < 300) {
    title.textContent =
      "Making progress, but the keyboard might start yawning soon.";
  } else if (cpm > 100 && cpm < 200) {
    title.textContent = "At least you’ve moved past turtle speed. Congrats!";
  } else {
    title.textContent = "Are you typing with your elbows? 🐢";
  }
  // title.textContent = "This is going to be the roast";

  // show speed and accuracy
  speed = document.createElement("h2");
  result.appendChild(speed);
  speed.textContent = `speed: ${cpm} cpm`;

  accuracy = document.createElement("h2");
  result.appendChild(accuracy);
  accuracy.textContent = `accuracy: ${accuracyPercent}%`;
  console.log("total characters:" + totalChar + "and typeChar: " + charCount);

  document.getElementById("typed-value").disabled = true;
}

//for speed
//accuracy or correct words out of every one
//and some roasting
function calculateCPM(characterCount, timerTaken) {
  let timeInMinute = timerTaken / 60;
  return (characterCount / timeInMinute).toFixed(2);
}
