"use strict";

const URL = "http://localhost:8080/todos";
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

  function toggleSignInUI() {
    $signInQuestion.classList.toggle(HIDDEN_CLASSNAME);
    $signInBtn.classList.toggle(HIDDEN_CLASSNAME);
  }

  function toggleToDo() {
    $toDo.classList.toggle(HIDDEN_CLASSNAME);
  }

  function paintGreeting(username) {
    $greetingTxt.textContent = `Hi, ${username}`;
    $greetingTxt.classList.toggle(HIDDEN_CLASSNAME);
    $signOutBtn.classList.toggle(HIDDEN_CLASSNAME);
  }

  function handleSignOut() {
    localStorage.removeItem(USERNAME_KEY);
    location.reload();
  }

  function handleSignIn(e) {
    e.preventDefault();
    const username = $usernameInput.value;

    httpRequest.post(URL, { id: username }).catch((e) => console.error(e));

    currentUsername = username;
    localStorage.setItem(USERNAME_KEY, username);
    toggleSignInUI();
    $signOutBtn.addEventListener("click", handleSignOut);
    paintGreeting(username);
    toggleToDo();
    toDoApp();
  }

  $signForm.addEventListener("submit", handleSignIn);

  if (currentUsername !== null) {
    toggleSignInUI();
    $signOutBtn.addEventListener("click", handleSignOut);
    paintGreeting(currentUsername);
    toggleToDo();
    toDoApp();
  }
}

function toDoApp() {
  const $toDo = document.querySelector(".js-todo-wrap");
  const $toDoForm = $toDo.querySelector(".js-todo-form");
  const $newToDoInput = $toDoForm.querySelector(".js-new-todo");
  const $toDoList = $toDo.querySelector(".js-todo-list");

  let todos = [];

  function saveToDo() {
    httpRequest.put(`${URL}/${currentUsername}`, { list: todos }).catch((e) => console.error(e));
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

  httpRequest
    .get(`${URL}/${currentUsername}`)
    .then((response) => response.json())
    .then((data) => {
      data.list.forEach((todo) => {
        paintToDo(todo);
        todos.push(todo);
      });
      saveToDo();
    })
    .catch((e) => console.error(e));
}
