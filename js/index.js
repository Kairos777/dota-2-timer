initBtn.addEventListener('click', inititalize);
stopBtn.addEventListener('click', stopAllNotifications);


function inititalize() {
  initBtn.disabled = true;
  startAudio.play();
  if (isTestMode) testModeVariablesUpdate();
  setInizilizeTime();
  logStartGameTime();
  setPullNotifications();
  setAvanpostNotifications();  
  setBountyNotifications();
  logAction(null, 'inititalized with input seconds: ' + inititalizeTime / 1000);
}

function logStartGameTime() {
  setTimeout(() => {
    gameStartedDate = new Date();
  }, inititalizeTime);
}

function setInizilizeTime() {
  const inititalizeTimeSeconds = +document.getElementById("inititalizeTime").value;
  inititalizeTime = inititalizeTimeSeconds > 0 ? inititalizeTimeSeconds * 1000 : 0;
}

function setPullNotifications() {
  if (!pullCheckbox.checked) return;
  pullTimeout = setTimeout(() => {
    pullTimer = setNotificationInterval(PULL, pull, pullInterval);
    logAction(null, 'init pull interval');
  }, inititalizeTime + pullToStart);

  setTimeout(() => {
    clearInterval(pullTimer);
    logAction(null, 'clear pull interval', true);
  }, timeToClearPullInterval);
}

function setAvanpostNotifications() {
  avanpostTimeout = setTimeout(() => {
    logAction(AVANPOST);
    avanpost.play();
    avanpostTimer = setNotificationInterval(AVANPOST, avanpost, avanpostInterval);
  }, inititalizeTime + avanpostFirstSignalDelay);
}

function setBountyNotifications() {
  bountyTimeout = setTimeout(() => {
    logAction(BOUNTY);
    bounty.play();
    bountyTimer = setNotificationInterval(BOUNTY, bounty, bountyInterval);
  }, inititalizeTime + bountyFirstSignalDelay);
} 

function stopAllNotifications() {
  initBtn.disabled = false;
  stopAudio.play();
  clearInterval(bountyTimer);
  clearInterval(avanpostTimer);
  clearInterval(pullTimer);
  clearTimeout(bountyTimeout);
  clearTimeout(avanpostTimeout);
  clearTimeout(pullTimeout);
  logAction(null, 'cleared all intervals', true);
}

function logAction(type, customString, withDate) {
  if (customString) {
    console.log(customString, withDate ? 'at ' + getCurrentGameTime() : '');
  } else {
    console.log(`${type} notified at`, getCurrentGameTime());
  }
}

function getCurrentGameTime() {
  const timePassedDate = new Date(new Date() - gameStartedDate);
  let minutesPassed = timePassedDate.getMinutes();
  minutesPassed = minutesPassed.toString().length === 1 ? "0" + minutesPassed : minutesPassed;
  let secondsPassed = timePassedDate.getSeconds();
  secondsPassed = secondsPassed.toString().length === 1 ? "0" + secondsPassed : secondsPassed;
  return `${minutesPassed}:${secondsPassed}`;
}

function setNotificationInterval(type, audio, interval) {
  return setInterval(() => { logAction(type); audio.play(); }, interval);
}

function testModeVariablesUpdate() {
  bountyFirstSignalDelay = 5 * 1000; // 5 seconds
  bountyInterval = 5 * 60 * 1000 / 60; // every 5 seconds
  avanpostInterval = 10 * 60 * 1000 / 60; // every 10 seconds
  avanpostFirstSignalDelay = 10 * 1000; // 10 seconds
  pullInterval = 60 * 1000 / 12; // every 5 seconds
  pullToStart = 5 * 1000; // 5 seconds delay
}



// todo add stack additional option
// todo add all options to checkbox form (gold and avanpost preselected)
// maybe later disable some notifications while gaming
// src http://soundbible.com/tags-funny.html