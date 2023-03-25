"use strict";

const URL = "https://my-json-server.typicode.com/dev-yun0525/fakedb/todos";
const USERNAME_KEY = "username";

// 로컬스토리지에 저장된 사용자 정보 불러오기
let currentUsername = localStorage.getItem(USERNAME_KEY);

// AJAX
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

// 모달 조작
const ctrlModal = () => {
  const $modals = document.querySelectorAll(".js-modal");

  const openModal = (e) => {
    if (!e.target.classList.contains("js-nav__btn")) return;
    const modalCategory = e.target.dataset.modalCategory;
    const $targetModal = document.querySelector(`.js-modal[data-modal-category='${modalCategory}']`);

    $modals.forEach((elm) => elm.classList.remove("on"));
    $targetModal.showModal();
    $targetModal.classList.add("on");
  };

  const closeModal = (e) => {
    if (!e.target.parentElement.classList.contains("js-modal__close-btn")) return;

    $modals.forEach((elm) => {
      if (elm.contains(e.target)) {
        elm.classList.remove("on");
        elm.close();
      }
    });
  };

  document.body.addEventListener("click", openModal);
  document.body.addEventListener("click", closeModal);
};

// 로그인 및 로그아웃
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

  /** 로그인 UI 숨기기 */
  function hideSignInUI() {
    $signInQuestion.classList.add(HIDDEN_CLASSNAME);
    $signInBtn.classList.add(HIDDEN_CLASSNAME);
  }

  /** 할일 보이기 */
  function showToDo() {
    $toDo.classList.remove(HIDDEN_CLASSNAME);
    setTimeout(() => {
      $toDo.classList.add(ON_CLASSNAME);
    }, 400);
  }

  /** 환영인사 보이기 */
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

  /** 로그아웃 처리 */
  function handleSignOut() {
    localStorage.removeItem(USERNAME_KEY);
    location.reload();
  }

  /** 로그인 처리 */
  function handleSignIn(e) {
    e.preventDefault();
    const username = $usernameInput.value;

    // DB에 사용자 저장
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

  // 사용자가 로컬스토리지에 저장되어 있는 경우
  if (currentUsername !== null) {
    hideSignInUI();
    $signOutBtn.addEventListener("click", handleSignOut);
    paintGreeting(currentUsername);
    showToDo();
    toDoApp();
  } else {
    // 로컬스토리지에 사용자가 없을 경우
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

// 뉴스 앱
const newsApp = () => {
  const $newsOpenBtn = document.querySelector(".js-nav__btn[data-modal-category='news']");
  const $newsModal = document.querySelector(".js-modal[data-modal-category='news']");
  const $loadingTxt = $newsModal.querySelector(".js-loading-text");
  const $newsList = $newsModal.querySelector(".js-news-list");
  const $newsFragment = document.createDocumentFragment();

  const NEWS_API = `https://newsapi.org/v2/top-headlines?country=kr&apiKey=509e5683a97a4d0995f41662e21d9520`;

  const paintArticle = (data) => {
    const $li = document.createElement("li");
    $li.classList.add("news-item");
    const $title = document.createElement("a");
    $title.textContent = `${data.title}`;
    $title.href = `${data.url}`;
    $title.target = `_blank`;
    $title.classList.add("news-title");
    $li.append($title);
    const $author = document.createElement("span");
    $author.textContent = `${data.author}`;
    $author.classList.add("news-author");
    $li.append($author);
    $newsFragment.append($li);
  };

  const fetchNews = async () => {
    $loadingTxt.textContent = "불러오는 중...";
    const response = await httpRequest.get(NEWS_API);
    const data = await response.json();
    const articles = data.articles;
    if (articles) {
      $loadingTxt.textContent = "";
      articles.forEach((article) => paintArticle(article));
      $newsList.append($newsFragment);
    }
  };

  $newsOpenBtn.addEventListener("click", () => {
    $newsList.textContent = "";
    fetchNews().catch((reason) => {
      console.error(reason);
      $loadingTxt.textContent = "불러오기 실패";
    });
  });
};

// 할일 앱
function toDoApp() {
  const $toDo = document.querySelector(".js-todo-wrap");
  const $toDoForm = $toDo.querySelector(".js-todo-form");
  const $newToDoInput = $toDoForm.querySelector(".js-new-todo");
  const $toDoList = $toDo.querySelector(".js-todo-list");

  // 할일 객체를 배열에 저장
  let todos = [];

  /** 할일 배열 저장 */
  function saveToDo() {
    httpRequest.put(`${URL}/${currentUsername}`, { list: todos }).catch(console.error);
  }

  /** 할일 객체 삭제 */
  function deleteToDo(e) {
    todos = todos.filter((toDoObj) => +toDoObj.id !== +e.target.parentNode.id);
    $toDoList.removeChild(e.target.parentNode);
    saveToDo();
  }

  /** 할일 객체 그리기 */
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

  /** 할일 객체 추가 */
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

  /** DB에서 할일 데이터 불러오기 */
  async function fetchToDo() {
    // DB에서 사용자 이름 기반으로 데이터 검색
    const response = await httpRequest.get(`${URL}/${currentUsername}`);
    const data = await response.json();

    // 할일 데이터 불러오기 및 후속 처리
    data.list.forEach((todo) => {
      paintToDo(todo);
      todos.push(todo);
    });
    saveToDo();
  }

  fetchToDo().catch(console.error);
}

// 날씨 앱
const weatherApp = () => {
  const $locationInfo = document.querySelector(".js-weather span:first-of-type");
  const $weatherInfo = document.querySelector(".js-weather span:nth-child(2)");
  const $weatherIcon = document.querySelector(".js-weather-icon");

  const API_KEY = "a155f00c11c73a1d9b10cc6ab623767b";

  /** 위치정보를 받아 날씨정보 불러오기(AJAX) 및 데이터 후속 처리 */
  const fetchWeatherInfo = async (lat, lon) => {
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
  };

  /** 위치정보 취득 성공 처리 */
  function geoSuccess(position) {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;

    /** 취득한 위치정보 바탕으로 날씨정보 불러오기 (AJAX) */
    fetchWeatherInfo(lat, lon).catch(console.error);
  }

  /** 위치정보 취득 실패 처리 */
  function geoError() {
    alert("Failed to get your location :(");
  }

  navigator.geolocation.getCurrentPosition(geoSuccess, geoError);
};

// 배경 설정
function ctrlBg() {
  const images = ["0.jpg", "1.jpg", "2.jpg", "3.jpg"];

  const chosenImage = images[Math.floor(Math.random() * images.length)];

  document.body.style.backgroundImage = `url("img/${chosenImage}")`;
}

// 시계 앱
function clockApp() {
  const $clock = document.querySelector(".js-clock-time");
  const $midday = document.querySelector(".js-clock-midday");

  function getClock() {
    const date = new Date();
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
    // const seconds = String(date.getSeconds()).padStart(2, "0");
    $clock.textContent = `${hours}:${minutes}`;
    $midday.textContent = midday;
  }

  getClock();
  setInterval(getClock, 1000);
}

// 인용구 앱
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
