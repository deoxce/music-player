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
    const prevSong = window.queue.shift();
    window.queueHistory.unshift(prevSong);
    playSong(window.queue[0]['song']);
}

export function prevSong() {
    let nextUpFirstSong = null;

    for (let i = 0; i < window.queue.length; i++) {
        if (window.queue[i]['queueType'] == 'nextUp') {
            nextUpFirstSong = window.queue[i]['song'];
            break;
        }
    }

    let prevSong = null;

    for (let i = 0; i < window.playlist.length; i++) {
        if (nextUpFirstSong.pathToSong == window.playlist[i].pathToSong) {
            prevSong = window.playlist[i - 1];
            window.currentSongId = i - 1;
            break;
        }
    }

    let songObject = window.queue.shift();
    for (let i = 0; i < window.queue.length; i++) {
        if (window.queue[i]['queueType'] == 'nextUp') {
            window.queue.splice(i, 0, songObject);
            break;
        }
    }

    window.queue.unshift({
        song: prevSong,
        queueType: 'nextUp'
    });

    playSong(window.queue[0]['song']);
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

export function setQueue() {
    let newQueue = [];

    for (let i = 0; i < window.queue.length; i++) {
        if (window.queue[i]['queueType'] == 'nextInQueue') {
            newQueue.push(window.queue[i]);
        }
    }
    window.queue = Array.from(newQueue);

    for (let i = window.currentSongId; i < window.playlist.length; i++) {
        if (i == window.currentSongId) {
            window.queue.unshift({
                song: window.playlist[i],
                queueType: 'nextUp'
            });
        } else {
            window.queue.push({
                song: window.playlist[i],
                queueType: 'nextUp'
            });
        }
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