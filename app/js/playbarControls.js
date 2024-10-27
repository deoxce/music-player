import { playPauseSong, nextSong, prevSong } from './modules/utils.js';

const playPauseButton = document.querySelector('.play-pause');
playPauseButton.addEventListener('click', playPauseSong);

const nextSongButton = document.querySelector('.next-song');
const prevSongButton = document.querySelector('.prev-song');
nextSongButton.addEventListener('click', nextSong);
prevSongButton.addEventListener('click', prevSong);


const repeatButton = document.querySelector('.repeat');
const repeatPath = document.querySelector('.repeat > path');
repeatButton.addEventListener('click', () => {
    const nowPlaying = document.querySelector('.now-playing');

    if (window.playingSong.loop) {
        nowPlaying.classList.remove('repeat-container');

        window.playingSong.loop = false;
        window.loop = false;

        repeatPath.style.fill = 'var(--secondary-color)';
    } else {
        nowPlaying.classList.add('repeat-container');

        window.playingSong.loop = true;
        window.loop = true;
        
        repeatPath.style.fill = 'var(--main-color)';
    }
});