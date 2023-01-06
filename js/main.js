"use strict";

const URL = "http://dev-yun0525.github.io/momentum-clone/db.json/todos";
const USERNAME_KEY = "username";

let currentUsername = localStorage.getItem(USERNAME_KEY);

const httpRequest = {
  get(url) {
    return fetch(url);
  },
  post(url, payload) {
    return fetch(url, {
      method: "POST",
      headers: { "content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  },
  put(url, payload) {
    return fetch(url, {
      method: "PUT",
      headers: { "content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  },
  patch(url, payload) {
    return fetch(url, {
      method: "PATCH",
      headers: { "content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  },
  delete(url) {
    return fetch(url, { method: "DELETE" });
  },
};

function weatherApp() {
  const $locationInfo = document.querySelector(".js-weather span:first-of-type");
  const $weatherInfo = document.querySelector(".js-weather span:nth-child(2)");
  const $weatherIcon = document.querySelector(".js-weather-icon");

  const API_KEY = "a155f00c11c73a1d9b10cc6ab623767b";

  async function fetchWeatherInfo(lat, lon) {
    const response = await httpRequest.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`);
    const dataObj = await response.json();
    const currentWeather = dataObj.weather[0].main;
    let weatherIcon;

    switch (currentWeather) {
      case "Clear":
        weatherIcon = "Sunny";
        break;
      case "Clouds":
        weatherIcon = "Cloud";
        break;
      case "Thunderstorm":
        weatherIcon = "Thunderstorm";
        break;
      case "Drizzle":
        weatherIcon = "Rainy";
        break;
      case "Rain":
        weatherIcon = "Rainy";
        break;
      case "Snow":
        weatherIcon = "Weather Snowy";
        break;
      case "Mist":
      case "Smoke":
      case "Haze":
      case "Dust":
      case "Fog":
      case "Sand":
      case "Ash":
      case "Squall":
        weatherIcon = "Foggy";
        break;
      case "Tornado":
        weatherIcon = "Cyclone";
        break;
      default:
        weatherIcon = "";
    }

    $locationInfo.textContent = `${dataObj.name}, `;
    $weatherInfo.textContent = currentWeather;
    $weatherIcon.textContent = weatherIcon;
  }

  function geoSuccess(position) {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;

    fetchWeatherInfo(lat, lon).catch(console.error);
  }

  function geoError() {
    alert("Failed to get your location :(");
  }

  navigator.geolocation.getCurrentPosition(geoSuccess, geoError);
}

function signInAndOut() {
  const $signArea = document.querySelector(".js-sign-wrap");
  const $signForm = $signArea.querySelector(".js-sign-form");
  const $signInQuestion = $signArea.querySelector(".js-question");
  const $usernameInput = $signArea.querySelector(".js-username");
  const $signInBtn = $signArea.querySelector(".js-btn-signin");
  const $greetingTxt = $signArea.querySelector(".js-greeting");
  const $signOutBtn = $signArea.querySelector(".js-btn-signout");
  const $toDo = document.querySelector(".js-todo-wrap");

  const HIDDEN_CLASSNAME = "hidden";
  const ON_CLASSNAME = "on";

  function hideSignInUI() {
    $signInQuestion.classList.add(HIDDEN_CLASSNAME);
    $signInBtn.classList.add(HIDDEN_CLASSNAME);
  }

  function showToDo() {
    $toDo.classList.remove(HIDDEN_CLASSNAME);
    setTimeout(() => {
      $toDo.classList.add(ON_CLASSNAME);
    }, 400);
  }

  function paintGreeting(username) {
    $greetingTxt.textContent = `Hi, ${username}`;
    $greetingTxt.classList.remove(HIDDEN_CLASSNAME);
    setTimeout(() => {
      $greetingTxt.classList.add(ON_CLASSNAME);
    }, 10);
    $signOutBtn.classList.remove(HIDDEN_CLASSNAME);
    setTimeout(() => {
      $signOutBtn.classList.add(ON_CLASSNAME);
    }, 200);
  }

  function handleSignOut() {
    localStorage.removeItem(USERNAME_KEY);
    location.reload();
  }

  function handleSignIn(e) {
    e.preventDefault();
    const username = $usernameInput.value;

    httpRequest.post(URL, { id: username }).catch(console.error);

    currentUsername = username;
    localStorage.setItem(USERNAME_KEY, username);
    hideSignInUI();
    $signOutBtn.addEventListener("click", handleSignOut);
    paintGreeting(username);
    showToDo();
    toDoApp();
  }

  $signForm.addEventListener("submit", handleSignIn);

  if (currentUsername !== null) {
    hideSignInUI();
    $signOutBtn.addEventListener("click", handleSignOut);
    paintGreeting(currentUsername);
    showToDo();
    toDoApp();
  } else {
    $signInQuestion.classList.remove(HIDDEN_CLASSNAME);
    setTimeout(() => {
      $signInQuestion.classList.add(ON_CLASSNAME);
    }, 10);
    $signInBtn.classList.remove(HIDDEN_CLASSNAME);
    setTimeout(() => {
      $signInBtn.classList.add(ON_CLASSNAME);
    }, 200);
  }
}

function toDoApp() {
  const $toDo = document.querySelector(".js-todo-wrap");
  const $toDoForm = $toDo.querySelector(".js-todo-form");
  const $newToDoInput = $toDoForm.querySelector(".js-new-todo");
  const $toDoList = $toDo.querySelector(".js-todo-list");

  let todos = [];

  function saveToDo() {
    httpRequest.put(`${URL}/${currentUsername}`, { list: todos }).catch(console.error);
  }

  function deleteToDo(e) {
    todos = todos.filter((toDoObj) => +toDoObj.id !== +e.target.parentNode.id);
    $toDoList.removeChild(e.target.parentNode);
    saveToDo();
  }

  function paintToDo(toDoObj) {
    const $li = document.createElement("li");
    $li.id = toDoObj.id;
    //텍스트 추가
    const $span = document.createElement("span");
    $span.textContent = toDoObj.content;
    $newToDoInput.value = "";
    $li.appendChild($span);
    //삭제 버튼 추가
    const delBtn = document.createElement("button");
    delBtn.textContent = "DELETE";
    $li.appendChild(delBtn);
    delBtn.addEventListener("click", deleteToDo);
    $toDoList.appendChild($li);
  }

  function addToDo(e) {
    e.preventDefault();
    const toDoObj = {};
    toDoObj.id = Date.now();
    toDoObj.content = $newToDoInput.value;
    paintToDo(toDoObj);
    todos.push(toDoObj);
    saveToDo();
  }

  $toDoForm.addEventListener("submit", addToDo);

  async function fetchToDo() {
    const response = await httpRequest.get(`${URL}/${currentUsername}`);
    const data = await response.json();

    data.list.forEach((todo) => {
      paintToDo(todo);
      todos.push(todo);
    });
    saveToDo();
  }

  fetchToDo().catch(console.error);
}

function ctrlBg() {
  const images = ["0.jpg", "1.jpg", "2.jpg", "3.jpg"];

  const chosenImage = images[Math.floor(Math.random() * images.length)];

  document.body.style.backgroundImage = `url("img/${chosenImage}")`;
}

function clockApp() {
  const $clock = document.querySelector(".js-clock-time");
  const $midday = document.querySelector(".js-clock-midday");

  function getClock() {
    const date = new Date();
    // let hours = String(date.getHours()).padStart(2, "0");
    let hours = date.getHours();
    let midday;
    if (hours > 12) {
      hours = String(hours - 12).padStart(2, "0");
      midday = "PM";
    } else {
      hours = String(hours).padStart(2, "0");
      midday = "AM";
    }
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    $clock.textContent = `${hours}:${minutes}:${seconds}`;
    $midday.textContent = midday;
  }

  getClock();
  setInterval(getClock, 1000);
}

function quotesApp() {
  const quotes = [
    { quote: "Be yourself; everyone else is already taken.", author: "Oscar Wilde" },
    { quote: "You only live once, but if you do it right, once is enough.", author: "Mae West" },
    { quote: "Be the change that you wish to see in the world.", author: "Mahatma Gandhi" },
    { quote: "In three words I can sum up everything I've learned about life: it goes on.", author: "Robert Frost" },
    { quote: "If you tell the truth, you don't have to remember anything.", author: "Mark Twain" },
    { quote: "I have not failed. I've just found 10,000 ways that won't work.", author: "Thomas A. Edison" },
    { quote: "It is never too late to be what you might have been.", author: "George Eliot" },
    { quote: "Life isn't about finding yourself. Life is about creating yourself.", author: "George Bernard Shaw" },
    { quote: "Life is like riding a bicycle. To keep your balance, you must keep moving.", author: "Albert Einstein" },
    { quote: "It takes courage to grow up and become who you really are.", author: "E.E. Cummings" },
  ];

  const $quote = document.querySelector(".js-quote q:first-child");
  const $author = document.querySelector(".js-quote span:last-child");

  const todaysQuote = quotes[Math.floor(Math.random() * quotes.length)];

  $quote.textContent = `"${todaysQuote.quote}"`;
  $author.textContent = todaysQuote.author;
}
