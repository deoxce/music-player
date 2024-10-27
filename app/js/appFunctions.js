import { getSongs } from './modules/song.js';
import { createSongElements } from './modules/HTMLElements.js';

const pathToDir = 'C:/Users/deoxce/Music/lossy/';
const albums = await getSongs(pathToDir); //object of arrays

window.playingSong = new Audio();
window.volume = 1;
window.loop = false;

window.playlist = [];
window.currentSongId;

window.queue = {
    nowPlaying: [],
    nextInQueue: [],
    nextUp: []
};

createSongElements(albums);