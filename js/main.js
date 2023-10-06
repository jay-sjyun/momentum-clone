"use strict";

const CURRENTUSER_KEY = "currentUser";
const HIDDEN_CLASSNAME = "hidden";
// 로컬스토리지에 저장된 사용자 정보 불러오기
let currentUser = localStorage.getItem(CURRENTUSER_KEY);

// 환영 인사
const showGreeting = (username) => {
  const $greeting = document.querySelector(".js-greeting");
  const date = new Date();
  const hour = date.getHours();
  let greetingTxt;
  if (hour > 4 && hour < 12) {
    greetingTxt = "Good morning";
  } else if (hour > 12 && hour < 20) {
    greetingTxt = "Good afternoon";
  } else {
    greetingTxt = "Good evening";
  }
  $greeting.textContent = `${greetingTxt}, ${username}`;
};

// 할일 앱
const toDoApp = () => {
  const $toDoForm = document.querySelector(".js-todo-form");
  const $toDoInput = document.querySelector(".js-input--todo");
  const $toDoList = document.querySelector(".js-todo-list");

  // 할일 객체를 배열에 저장
  let todos = [];

  // 할일 배열 저장
  const saveToDo = () => {
    localStorage.setItem(currentUser, JSON.stringify(todos));
  };

  // 할일 객체 삭제
  const deleteToDo = (e) => {
    todos = todos.filter((toDoObj) => +toDoObj.id !== +e.target.parentNode.id);
    $toDoList.removeChild(e.target.parentNode);
    saveToDo();
  };

  // 할일 html 요소 생성
  const paintToDo = (toDoObj) => {
    const $li = document.createElement("li");
    $li.id = toDoObj.id;
    //텍스트 추가
    const $span = document.createElement("span");
    $span.textContent = toDoObj.content;
    $span.classList.add("todo-content");
    $toDoInput.value = "";
    $li.appendChild($span);
    //삭제 버튼 추가
    const $delBtn = document.createElement("button");
    $delBtn.textContent = "DELETE";
    $delBtn.classList.add("btn--del-todo");
    $li.appendChild($delBtn);
    $delBtn.addEventListener("click", deleteToDo);
    $toDoList.appendChild($li);
  };

  // 할일 객체 추가
  const addToDo = (e) => {
    e.preventDefault();
    const toDoObj = {};
    toDoObj.id = Date.now();
    toDoObj.content = $toDoInput.value;
    paintToDo(toDoObj);
    todos.push(toDoObj);
    saveToDo();
  };

  $toDoForm.addEventListener("submit", addToDo);

  // 로컬 스토리지에서 현재 사용자 이름으로 저장된 할일 불러오기
  if (localStorage.getItem(currentUser) === null) {
    return;
  } else {
    todos = JSON.parse(localStorage.getItem(currentUser));
    todos.forEach((todo) => {
      paintToDo(todo);
    });
  }
};

// 뉴스 앱
const newsApp = () => {
  const $loadingTxt = document.querySelector(".js-loading-text");
  const $newsList = document.querySelector(".js-news-list");
  const $newsFragment = document.createDocumentFragment();

  // const NEWS_API = `https://newsapi.org/v2/top-headlines?country=kr&apiKey=956d67a3a5fe45a2b60bb2f789870a46`;

  const NEWS_API = "https://api.currentsapi.services/v1/latest-news?" + "language=us&" + "apiKey=c8MTKqAAmJQ87nIz_YJB--RQAI7iqLuGrmyzgyaWMHSm-ceX";

  const paintArticle = (data) => {
    const $li = document.createElement("li");
    $li.classList.add("news-item");
    const fullHeadline = data.title;
    // 뉴스 헤드라인 추출
    const headline = fullHeadline.substring(0, fullHeadline.indexOf("-") - 1);
    const $title = document.createElement("a");
    $title.textContent = `${headline}`;
    $title.href = `${data.url}`;
    $title.target = `_blank`;
    $title.classList.add("news-title");
    $li.append($title);
    // 뉴스 출처 추출
    const source = fullHeadline.substring(fullHeadline.lastIndexOf("-") + 1);
    const $source = document.createElement("span");
    $source.textContent = `${source}`;
    $source.classList.add("news-source");
    $li.append($source);
    $newsFragment.append($li);
  };

  const fetchNews = async () => {
    $loadingTxt.textContent = "Loading...";
    const response = await fetch(NEWS_API);
    const data = await response.json();
    console.log(data);
    const articles = data.articles.slice(0, 10);
    if (articles) {
      $loadingTxt.textContent = "";
      articles.forEach((article) => paintArticle(article));
      $newsList.append($newsFragment);
    }
  };

  $newsList.textContent = "";
  fetchNews().catch((reason) => {
    console.error(reason);
    $loadingTxt.textContent = "Loading failed.";
  });
};

// 날씨 앱
const weatherApp = () => {
  const $location = document.querySelector(".js-location");
  const $temper = document.querySelector(".js-temper");
  const $weatherIcon = document.querySelector(".js-weather-icon");

  const API_KEY = "a155f00c11c73a1d9b10cc6ab623767b";

  // 위치정보를 받아 날씨정보 불러오기(AJAX) 및 데이터 후속 처리
  const fetchWeatherInfo = async (lat, lon) => {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`);
    const dataObj = await response.json();
    $location.textContent = `${dataObj.name},`;
    $temper.textContent = `${Math.round(dataObj.main.temp)}°C`;
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

    $weatherIcon.textContent = weatherIcon;
  };

  // 위치정보 취득 성공 처리
  const geoSuccess = (position) => {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;

    // 취득한 위치정보 바탕으로 날씨정보 불러오기 (AJAX)
    fetchWeatherInfo(lat, lon).catch(console.error);
  };

  // 위치정보 취득 실패 처리
  const geoError = () => {
    alert("Failed to get your location :(");
  };

  navigator.geolocation.getCurrentPosition(geoSuccess, geoError);
};

// 시계 앱
const clockApp = () => {
  const $time = document.querySelector(".js-time");
  const $midday = document.querySelector(".js-midday");
  let hour;

  const getTime = () => {
    const date = new Date();
    hour = date.getHours();
    let midday;
    if (hour > 12) {
      hour = String(hour - 12).padStart(2, "0");
      midday = "PM";
    } else {
      hour = String(hour).padStart(2, "0");
      midday = "AM";
    }
    const minute = String(date.getMinutes()).padStart(2, "0");

    $time.textContent = `${hour}:${minute}`;
    $midday.textContent = midday;
  };

  getTime();
  setInterval(getTime, 1000);
};

// 배경 설정
const randomBg = () => {
  const images = ["0.jpg", "1.jpg", "2.jpg", "3.jpg"];

  const chosenImage = images[Math.floor(Math.random() * images.length)];

  document.body.style.backgroundImage = `url("img/${chosenImage}")`;
};
randomBg();

// 인용구 앱
const quotesApp = () => {
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
};

// 모달 조작
const ctrlModal = () => {
  const $todoBtn = document.querySelector(".js-show-todo");
  const $newsBtn = document.querySelector(".js-show-news");
  const $todoModal = document.querySelector(".js-todo-modal");
  const $newsModal = document.querySelector(".js-news-modal");

  toDoApp();
  $todoBtn.addEventListener("click", () => {
    $todoModal.showModal();
  });
  $newsBtn.addEventListener("click", () => {
    $newsModal.showModal();
    newsApp();
  });
};

// UI 보이기
const showUi = (element) => {
  element.classList.remove(HIDDEN_CLASSNAME);
};

// 로그인 UI 숨기기
const hideSignInForm = () => {
  const $signInForm = document.querySelector(".js-signin-form");
  $signInForm.classList.add(HIDDEN_CLASSNAME);
};

// 로그아웃
const signOutProcess = () => {
  const $signOutBtn = document.querySelector(".js-btn--signout");

  $signOutBtn.addEventListener("click", () => {
    localStorage.removeItem(CURRENTUSER_KEY);
    location.reload();
  });
};

// 홈 UI 초기화
const initHomeUi = (username) => {
  const $header = document.querySelector(".js-header");
  const $home = document.querySelector(".js-home-wrap");
  const $footer = document.querySelector(".js-footer");

  hideSignInForm();
  showUi($header);
  ctrlModal();
  weatherApp();
  showUi($home);
  clockApp();
  showGreeting(username);
  showUi($footer);
  quotesApp();
  signOutProcess();
};

// 로그인
const signInProcess = () => {
  const $signInForm = document.querySelector(".js-signin-form");
  const $usernameInput = document.querySelector(".js-input--username");

  // 로그인 핸들러
  const handleSignIn = (e) => {
    e.preventDefault();
    const username = $usernameInput.value;
    currentUser = username;
    localStorage.setItem(CURRENTUSER_KEY, username);
    initHomeUi(currentUser);
  };

  $signInForm.addEventListener("submit", handleSignIn);
};

// 사용자가 로컬스토리지에 저장되어 있는 경우
if (currentUser !== null) {
  initHomeUi(currentUser);
} else {
  // 로컬스토리지에 사용자가 없을 경우
  showUi(document.querySelector(".js-signin-form"));
  signInProcess();
  // setTimeout(() => {
  //   $signInQuestion.classList.add(ON_CLASSNAME);
  // }, 10);
}
