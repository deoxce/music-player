import { getSongs } from './modules/song.js';
import { createSongElements } from './modules/HTMLElements.js';

const pathToDir = 'C:/Users/deoxce/Music/my/';
const albums = await getSongs(pathToDir); //object of arrays

window.playingSong = new Audio();
window.volume = 1;
window.loop = false;

window.playlist = [];

window.queue = [];
window.currentSongId;
window.queueHistory = [];

window.selected = [];
window.selectedLoop = false;

window.queueLoop = false;
window.currentIdInLoop;

createSongElements(albums);