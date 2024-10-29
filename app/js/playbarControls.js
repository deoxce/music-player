import { playPauseSong, nextSong, prevSong } from './modules/utils.js';
import { createQueueElements } from './modules/HTMLElements.js';

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

    if (window.loop || window.queueLoop) {
        nowPlaying.classList.remove('repeat-container');

        window.playingSong.loop = false;
        window.loop = false;

        repeatPath.style.fill = 'var(--secondary-color)';

        if (window.queueLoop) {
            window.queue[0] = [window.queue[0][window.currentIdInLoop]];
            window.currentIdInLoop = 0;
            window.queueLoop = false;
            createQueueElements();
        }
    } else {
        nowPlaying.classList.add('repeat-container');

        window.playingSong.loop = true;
        window.loop = true;
        
        repeatPath.style.fill = 'var(--main-color)';
    }
});

const selectedButtonAdd = document.querySelector('.selected-button-add');

selectedButtonAdd.addEventListener('click', () => {
    if (window.selectedLoop) {
        let loop = [];
        for (let j = 0; j < window.selected.length; j++) {
            loop.push(window.selected[j]);
        }

        for (let i = 1; i < window.queue.length; i++) {
            if (window.queue[i]['queueType'] == 'nextUp') {
                window.queue.splice(i, 0, loop);
                break;
            }
        }
    } else {
        for (let i = 1; i < window.queue.length; i++) {
            if (window.queue[i]['queueType'] == 'nextUp') {
                for (let j = window.selected.length - 1; j >= 0; j--) {
                    window.queue.splice(i, 0, {
                        song: window.selected[j],
                        queueType: 'nextInQueue'
                    });
                }
                break;
            }
        }
    }

    window.selected = [];
    window.selectedLoop = false;
    selectedLoopPath.style.fill = 'var(--secondary-color)';

    const selectedSection = document.querySelector('.selected');
    selectedSection.style.display = 'none';
    
    createQueueElements()
});

const selectedClearButton = document.querySelector('.selected-clear-button');

selectedClearButton.addEventListener('click', () => {
    window.selected = [];
    const selectedSection = document.querySelector('.selected');
    selectedSection.style.display = 'none';
});


const selectedLoopButton = document.querySelector('.selected-repeat');
const selectedLoopPath = document.querySelector('.selected-repeat > path');
selectedLoopButton.addEventListener('click', () => {
    if (window.selectedLoop) {
        selectedLoopPath.style.fill = 'var(--secondary-color)';
        window.selectedLoop = false;
    } else {
        selectedLoopPath.style.fill = 'var(--main-color)';
        window.selectedLoop = true;
    }
});