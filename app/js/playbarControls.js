import { playPauseSong, nextSong, prevSong } from './modules/utils.js';

const playPauseButton = document.querySelector('.play-pause');
playPauseButton.addEventListener('click', playPauseSong);

const nextSongButton = document.querySelector('.next-song');
const prevSongButton = document.querySelector('.prev-song');
nextSongButton.addEventListener('click', nextSong);
prevSongButton.addEventListener('click', prevSong);