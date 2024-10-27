import { getSongs } from './modules/song.js';
import { createSongElements } from './modules/HTMLElements.js';

const pathToDir = 'C:/Users/deoxce/Music/lossless/';
const albums = await getSongs(pathToDir); //object of arrays

window.playingSong = new Audio();
window.volume = 1;

window.queue = [];
window.currentSongId;

createSongElements(albums);