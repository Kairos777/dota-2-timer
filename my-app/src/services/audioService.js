import bountySound from '../sounds/bounty.mp3';
import startSound from '../sounds/start.mp3';
import silenceSound from "../sounds/silence.mp3";
import avanpostSound from "../sounds/avanpost.mp3";
import pullSound from "../sounds/pull.mp3";

function AudioService() {
    this.silence  = new Audio(silenceSound);
    this.start  = new Audio(startSound);
    this.avanpost  = new Audio(avanpostSound);
    this.bounty  = new Audio(bountySound);
    this.pull = new Audio(pullSound);

    this.play = function(soundName) {
        return this[soundName] ? this[soundName].play() : null;
    };
}

var audioServiceInstance = new AudioService();
export default audioServiceInstance;