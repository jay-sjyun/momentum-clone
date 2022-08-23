"use strict";

signInAndOut();
toDoApp();

function signInAndOut() {
  const signInForm = document.querySelector(".js-signin-form");
  const signInInput = signInForm.querySelector(".js-username");
  const greeting = document.querySelector(".js-greeting");
  const signOutArea = document.querySelector(".js-signout");
  const signOutBtn = signOutArea.querySelector(".js-btn-signout");

  const HIDDEN_CLASSNAME = "hidden";
  const USERNAME_KEY = "username";

  const savedUsername = localStorage.getItem(USERNAME_KEY);

  function onSignIn(e) {
    e.preventDefault();
    signInForm.classList.add(HIDDEN_CLASSNAME);
    const typedUsername = signInInput.value;
    localStorage.setItem(USERNAME_KEY, typedUsername);
    paintGreeting(typedUsername);
    showSignOutBtn();
  }

  function paintGreeting(username) {
    greeting.innerText = `Hello, ${username}`;
    greeting.classList.remove(HIDDEN_CLASSNAME);
  }

  function onSignOut() {
    greeting.classList.add(HIDDEN_CLASSNAME);
    signOutArea.classList.add(HIDDEN_CLASSNAME);
    localStorage.removeItem(USERNAME_KEY);
    location.reload();
  }

  function showSignOutBtn() {
    signOutArea.classList.remove(HIDDEN_CLASSNAME);
    signOutBtn.addEventListener("click", onSignOut);
  }

  if (savedUsername === null) {
    signInForm.classList.remove(HIDDEN_CLASSNAME);
    signInForm.addEventListener("submit", onSignIn);
  } else {
    paintGreeting(savedUsername);
    showSignOutBtn();
  }
}

function toDoApp() {
  const toDoForm = document.querySelector(".js-todo-form");
  const newToDoInput = document.querySelector(".js-new-todo");
  const toDoList = document.querySelector(".js-todo-list");

  const TODOS_KEY = "toDos";

  let toDos = [];

  function saveToDo() {
    localStorage.setItem(TODOS_KEY, JSON.stringify(toDos));
  }

  function deleteToDo(e) {
    const li = e.target.parentElement;
    li.remove();
  }

  function paintToDo(newToDoObject) {
    const li = document.createElement("li");
    li.id = newToDoObject.id;
    const toDoText = document.createElement("span");
    toDoText.innerText = newToDoObject.text;
    const deleteBtn = document.createElement("button");
    deleteBtn.innerText = "🗑️";
    deleteBtn.addEventListener("click", deleteToDo);
    li.appendChild(toDoText);
    li.appendChild(deleteBtn);
    toDoList.appendChild(li);
  }

  function handleToDoSubmit(e) {
    e.preventDefault();
    const newToDoObject = {
      text: newToDoInput.value,
      id: Date.now(),
    };
    newToDoInput.value = "";
    paintToDo(newToDoObject);
    toDos.push(newToDoObject);
    saveToDo();
  }

  toDoForm.addEventListener("submit", handleToDoSubmit);

  const savedToDos = localStorage.getItem(TODOS_KEY);

  if (savedToDos !== null) {
    toDos = JSON.parse(savedToDos);
    toDos.forEach(paintToDo);
  }
}
