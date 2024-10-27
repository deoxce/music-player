import { createQueueElements } from './HTMLElements.js';

export function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    const formattedSeconds = remainingSeconds < 10 ? '0' + remainingSeconds : remainingSeconds;

    return minutes + ':' + formattedSeconds;
}

export function playPauseSong() {
    const playPauseButton = document.querySelector('.play-pause');

    if (window.playingSong.paused) {
        window.playingSong.play();
        playPauseButton.style.backgroundImage = 'url(img/pause.png)';
    } else {
        window.playingSong.pause();
        playPauseButton.style.backgroundImage = 'url(img/play.png)';
    }
}

export function nextSong() {
    if (window.queue['nextInQueue'].length > 0) {
        const nextSong = window.queue['nextInQueue'].shift();
        playSong(nextSong);
    } else if (window.queue['nextUp'].length > 0) {
        const nextSong = window.queue['nextUp'].shift();
        playSong(nextSong);
    } else {
        console.log('queue is ended');
    }
}

export function prevSong() {
    let nextUpFirstId;
    const nextUpFirstSong = window.queue['nextUp'][0];
    for (let i = 0; i < window.playlist.length; i++) {
        if (nextUpFirstSong.pathToSong === window.playlist[i].pathToSong) {
            nextUpFirstId = i;
            break;
        }
    }

    let prevSong;

    if (window.currentSongId == nextUpFirstId - 1) {
        prevSong = window.playlist[nextUpFirstId - 2];
    } else {
        prevSong = window.playlist[nextUpFirstId - 1];
    }

    if (prevSong === undefined) {
        console.log('queue is ended');
        return;
    }

    updateCurrentSongId(prevSong);
    updateNextUp();

    playSong(prevSong);
}

export function playSong(song) {
    window.playingSong.pause();
    window.playingSong = new Audio(song.pathToSong);
    window.playingSong.play();
    window.playingSong.volume = window.volume;
    window.playingSong.loop = window.loop;
    
    const playPauseButton = document.querySelector('.play-pause');
    playPauseButton.style.backgroundImage = 'url(img/pause.png)';
    
    window.playingSong.addEventListener('ended', nextSong);
    window.playingSong.addEventListener('loadedmetadata', setTimeInfo);
    
    resetProgressSlider();
    updateCurrentSongId(song);
    window.queue['nowPlaying'][0] = window.playlist[window.currentSongId];
    
    setSongInfo(song);
    createQueueElements();
}

function setTimeInfo() {
    const songDuration = document.querySelector('.song-duration');
    songDuration.innerHTML = formatTime(window.playingSong.duration);
    
    const currentTime = document.querySelector('.current-time');
    currentTime.innerHTML = formatTime(window.playingSong.currentTime);
}

function setSongInfo(song) {
    const imageUrl = song.imageUrl;

    if (imageUrl === 'undefined') {
        document.querySelector('.cover-art').style.display = 'none';
        return;
    }

    document.querySelector('.cover-art').style.display = 'block';
    document.querySelector('.cover-art').src = imageUrl;

    document.querySelector('.playing-song-title').innerHTML = song.title;
    document.querySelector('.playing-song-artist').innerHTML = song.artists.join(', ');
}

function resetProgressSlider() {
    const sliderProgress = document.querySelector('#progress .slider-progress');
    const sliderThumb = document.querySelector('#progress .slider-thumb');

    sliderProgress.style.width = 0;
    sliderThumb.style.left = 0;
}

export function updateCurrentSongId(song) {
    for (let i = 0; i < window.playlist.length; i++) {
        if (song.pathToSong === window.playlist[i].pathToSong) {
            window.currentSongId = i;
            break;
        }
    }
}

export function updateNextUp() {
    window.queue['nextUp'] = [];

    for (let i = window.currentSongId + 1; i < window.playlist.length; i++) {
        window.queue['nextUp'].push(window.playlist[i]);
    }
}

export function updateScroll(container) {
    updateThumbHeight(container);
    updateThumbPosition(container);
}

function updateThumbHeight(container) {
    const content = container.querySelector('.scrollable-content');
    const thumb = container.querySelector('.custom-thumb');

    const contentHeight = content.scrollHeight;
    const containerHeight = container.clientHeight;
    const thumbHeight = Math.max((containerHeight / contentHeight) * containerHeight, 40); // Минимум 40px
    thumb.style.height = `${thumbHeight}px`;

    if (thumbHeight >= containerHeight) {
        thumb.style.height = `0px`;
    }
}

function updateThumbPosition(container) {
    const content = container.querySelector('.scrollable-content');
    const thumb = container.querySelector('.custom-thumb');

    const contentScrollTop = content.scrollTop;
    const contentHeight = content.scrollHeight;
    const containerHeight = container.clientHeight;
    const scrollRatio = contentScrollTop / (contentHeight - containerHeight);
    const thumbTop = scrollRatio * (containerHeight - thumb.clientHeight - 10);
    thumb.style.top = `${thumbTop + 5}px`;
}