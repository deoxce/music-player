import { formatTime } from './modules/utils.js';

// volume slider

const volumeSliderContainer = document.querySelector('.slider-container#volume');
const volumeSliderProgress = volumeSliderContainer.querySelector('.slider-progress');
const volumeSliderThumb = volumeSliderContainer.querySelector('.slider-thumb');

let isDraggingVolume = false;

volumeSliderContainer.addEventListener('mousedown', (event) => {
    moveVolumeThumb(event);

    isDraggingVolume = true;
    volumeSliderThumb.style.backgroundColor = 'white';
});

document.addEventListener('mouseup', (event) => {
    isDraggingVolume = false;
    volumeSliderThumb.style.backgroundColor = '';
});

document.addEventListener('mousemove', (event) => {
    if (isDraggingVolume) {
        moveVolumeThumb(event);
    }
});

function moveVolumeThumb(event) {
    const sliderRect = volumeSliderContainer.getBoundingClientRect();

    let newLeft = event.clientX - sliderRect.left;

    if (newLeft < 0) {
        newLeft = 0;
    }
    if (newLeft > sliderRect.width) {
        newLeft = sliderRect.width;
    }

    volumeSliderThumb.style.left = `${newLeft}px`;
    volumeSliderProgress.style.width = `${newLeft}px`;

    window.playingSong.volume = newLeft / sliderRect.width;
    window.volume = newLeft / sliderRect.width;
}

// progress slider

const progressSliderContainer = document.querySelector('.slider-container#progress');
const progressSliderProgress = progressSliderContainer.querySelector('.slider-progress');
const progressSliderThumb = progressSliderContainer.querySelector('.slider-thumb');

let isDraggingProgress = false;
let progressLeft = 0;

progressSliderContainer.addEventListener('mousedown', (event) => {
    moveProgressThumb(event);

    isDraggingProgress = true;
});

document.addEventListener('mouseup', (event) => {
    if (isDraggingProgress) {
        window.playingSong.currentTime = progressLeft / progressSliderContainer.getBoundingClientRect().width * window.playingSong.duration;
        const currentTime = document.querySelector('.current-time');
        currentTime.innerHTML = formatTime(window.playingSong.currentTime);
    }

    isDraggingProgress = false;
});

document.addEventListener('mousemove', (event) => {
    if (isDraggingProgress) {
        moveProgressThumb(event);
    }
});

function moveProgressThumb(event) {
    const sliderRect = progressSliderContainer.getBoundingClientRect();

    let newLeft = event.clientX - sliderRect.left;

    if (newLeft < 0) {
        newLeft = 0;
    }

    if (newLeft > sliderRect.width) {
        newLeft = sliderRect.width;
    }

    progressSliderThumb.style.left = `${newLeft}px`;
    progressSliderProgress.style.width = `${newLeft}px`;

    progressLeft = newLeft;
}

setInterval(updateProgressBar, 1000);

function updateProgressBar() {
    if (typeof window.playingSong === 'undefined') return;
    if (isDraggingProgress) return;
    if (window.playingSong.paused) return;

    const sliderRect = progressSliderContainer.getBoundingClientRect();

    let newLeft = sliderRect.width * (window.playingSong.currentTime / window.playingSong.duration);

    progressSliderProgress.style.width = `${newLeft}px`;
    progressSliderThumb.style.left = `${newLeft}px`;

    const currentTime = document.querySelector('.current-time');
    currentTime.innerHTML = formatTime(window.playingSong.currentTime);
}