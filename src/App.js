import React, { useState } from 'react';
import { BOUNTY, PULL, AVANPOST, START, STOP, isTestMode } from './const';
import audioService from "./services/audioService";
import './App.css';

let bountyFirstSignalDelay = 4.5 * 60 * 1000;
let bountyInterval = 5 * 60 * 1000;
let avanpostFirstSignalDelay = 9.2 * 60 * 1000;
let avanpostInterval = 10 * 60 * 1000;
let pullInterval = 60 * 1000;
let pullToStart = 95 * 1000;
let timeToClearPullInterval = 8 * 60 * 1000;
let bountyTimer, avanpostTimer, pullTimer;
let bountyTimeout, avanpostTimeout, pullTimeout;
let gameStartedDate = null;

function App() {
    const [pullCheck, setPullCheck] = useState(true);
    const [isInitialized, setIsInitialized] = useState(false);
    const [initializeTime, setInitializeTime] = useState(85000);

    function initialize() {
        setIsInitialized(true);
        audioService.play(START);
        if (isTestMode) testModeVariablesUpdate();
        logStartGameTime();
        setPullNotifications();
        setAvanpostNotifications();
        setBountyNotifications();
        logAction(null, 'initialized with input seconds: ' + initializeTime / 1000);
    }

    function logStartGameTime() {
        setTimeout(() => {
            gameStartedDate = new Date();
        }, initializeTime);
    }

    function handleInitializeTimeChange({target : { value } }) {
        setInitializeTime(value > 0 ? value * 1000 : 0);
    }

    function setPullNotifications() {
        if (!pullCheck) return;
        pullTimeout = setTimeout(() => {
            pullTimer = setNotificationInterval(PULL, pullInterval);
            logAction(null, 'init pull interval');
        }, initializeTime + pullToStart);

        setTimeout(() => {
            clearInterval(pullTimer);
            logAction(null, 'clear pull interval', true);
        }, timeToClearPullInterval);
    }

    function setAvanpostNotifications() {
        avanpostTimeout = setTimeout(() => {
            logAction(AVANPOST);
            audioService.play(AVANPOST);
            avanpostTimer = setNotificationInterval(AVANPOST, avanpostInterval);
        }, initializeTime + avanpostFirstSignalDelay);
    }

    function setBountyNotifications() {
        bountyTimeout = setTimeout(() => {
            logAction(BOUNTY);
            audioService.play(BOUNTY);
            bountyTimer = setNotificationInterval(BOUNTY, bountyInterval);
        }, initializeTime + bountyFirstSignalDelay);
    }

    function stopAllNotifications() {
        setIsInitialized(false);
        audioService.play(STOP);
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

    function setNotificationInterval(type, interval) {
        return setInterval(() => {
            logAction(type);
            audioService.play(type);
        }, interval);
    }

    function testModeVariablesUpdate() {
        bountyFirstSignalDelay = 5 * 1000; // 5 seconds
        bountyInterval = 5 * 60 * 1000 / 60; // every 5 seconds
        avanpostInterval = 10 * 60 * 1000 / 60; // every 10 seconds
        avanpostFirstSignalDelay = 10 * 1000; // 10 seconds
        pullInterval = 60 * 1000 / 12; // every 5 seconds
        pullToStart = 5 * 1000; // 5 seconds delay
    }

    return (
        <div className="container">
            <h2>Dota 2 timer</h2>
            <form className="options">
                <p>Default notifications:</p>
                <ul>
                    <li onClick={() => audioService.play(BOUNTY)}>Gold runes</li>
                    <li onClick={() => audioService.play(AVANPOST)}>Avanpost</li>
                </ul>
                <br/>
                <p>Additional options</p>
                <div className="options__item">
                    <input type="checkbox" name="creeps-pull" id="creeps-pull" checked={pullCheck} onChange={( {target: { checked }} ) => { setPullCheck(checked) }}/>
                    <label htmlFor="creeps-pull">notify me to pull camps (first 8 minutes)</label>
                </div>
            </form>

            <form>
                <p>Init at 45 seconds before 0:00 (start game) or input your value. You can't set timer after first
                    creep wave has moved.</p>
                <fieldset className="annotation">
                    <strong className="annotation__text">Seconds left before first creep wave</strong>
                    <input id="initializeTime" type="text" name="initializeTime" value={initializeTime / 1000} onChange={handleInitializeTimeChange}/>
                </fieldset>
            </form>
            <button className="manipulation btn btn-success" onClick={initialize} disabled={isInitialized} >init</button>
            <button className="manipulation btn btn-warning" onClick={stopAllNotifications} >stop</button>
        </div>
    );
}

export default App;

// todo add scss
// todo add stack additional option
// todo add all options to checks form (gold and avanpost preselected)
// todo maybe later disable some notifications while gaming
// src http://soundbible.com/tags-funny.html