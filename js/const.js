// elements
const initBtn = document.getElementById("initBtn");
const stopBtn = document.getElementById("stopBtn");
const pull = document.getElementById("pull");
const pullCheckbox = document.getElementById("creeps-pull");
const bounty = document.getElementById("bounty"); 
const avanpost = document.getElementById("avanpost");
const startAudio = document.getElementById("start");
const stopAudio = document.getElementById("stop");

// literals
const BOUNTY = 'bounty';
const PULL = 'pull';
const AVANPOST = 'avanpost';

// logic
let bountyFirstSignalDelay = 4.5 * 60 * 1000;
let bountyInterval = 5 * 60 * 1000;
let avanpostFirstSignalDelay = 9.2 * 60 * 1000;
let avanpostInterval = 10 * 60 * 1000;
let pullInterval = 60 * 1000;
let pullToStart = 95 * 1000;
let timeToClearPullInterval = 8 * 60 * 1000;
let inititalizeTime = 0;
let bountyTimer, avanpostTimer, pullTimer;
let bountyTimeout, avanpostTimeout, pullTimeout;
let isInitzialized = false;
let gameStartedDate = null;
const isTestMode = false;