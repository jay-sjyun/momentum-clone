"use strict";

signInAndOut();

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
    greeting.innerText = `Hello ${username}`;
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
