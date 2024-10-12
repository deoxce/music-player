import Song from './Song.js';

const pathToDir = 'C:/Users/deoxce/Music/test/';
const albums = await Song.getSongs(pathToDir);
createSongElements(albums);

let playingSong = new Audio();
let queue = [];
let currentSongIdQueue;

function createSongElements(albums) {
    for (const album in albums) {
        if (albums.hasOwnProperty(album)) {

            const firstSong = albums[album][0]; // for album info

            const songTitle = document.createElement('p');
            songTitle.classList.add('song-element-title');
            songTitle.textContent = firstSong.album;
    
            const songArtist = document.createElement('p');
            songArtist.classList.add('song-element-artist');
            songArtist.textContent = firstSong.albumartist;
    
            const songCover = document.createElement('img');
            songCover.classList.add('song-element-cover');
            songCover.src = firstSong.imageUrl;
    
            const songElement = document.createElement('div');
            songElement.addEventListener('click', () => {
                queue = albums[album];
                playSong(firstSong);
            });
            songElement.append(songCover);
            songElement.append(songTitle);
            songElement.append(songArtist);
    
            songElement.classList.add('song-element');
    
            const songsList = document.querySelector('.songs-list');
            songsList.append(songElement);
        }
    }
}

const nextSongButton = document.querySelector('.next-song');
const prevSongButton = document.querySelector('.prev-song');
nextSongButton.addEventListener('click', nextSong);
prevSongButton.addEventListener('click', prevSong);

function nextSong() {
    try {
        const nextSong = queue[currentSongIdQueue + 1];
        playSong(nextSong);
    } catch {
        console.log('queue is ended');
    }
}

function prevSong() {
    try {
        const prevSong = queue[currentSongIdQueue - 1];
        playSong(prevSong);
    } catch {
        console.log('queue is ended');
    }
}

function playSong(song) {
    if (!playingSong.paused) {
        playingSong.pause();
    }

    const volume = playingSong.volume;
    const pathToTune = song.pathToSong;

    for (let i = 0; i < queue.length; i++) {
        if (pathToTune === queue[i].pathToSong) {
            currentSongIdQueue = i;
            break;
        }
    }

    playingSong = new Audio(pathToTune);
    playingSong.addEventListener('ended', nextSong);
    playingSong.play();
    playingSong.volume = volume;

    playingSong.addEventListener('loadedmetadata', () => {
        const songDuration = document.querySelector('.song-duration');
        songDuration.innerHTML = formatTime(playingSong.duration);
    });

    const currentTime = document.querySelector('.current-time');
    currentTime.innerHTML = formatTime(playingSong.currentTime);

    const sliderProgress = document.querySelector('#progress .slider-progress');
    const sliderThumb = document.querySelector('#progress .slider-thumb');
    sliderProgress.style.width = 0;
    sliderThumb.style.left = 0;

    setQueue();
    setMetadata(song);
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    // Добавляем ведущий ноль, если число секунд меньше 10
    const formattedSeconds = remainingSeconds < 10 ? '0' + remainingSeconds : remainingSeconds;

    return minutes + ':' + formattedSeconds;
}

function setQueue() {
    let songId = currentSongIdQueue;

    let elements = [];
    for (songId; songId < queue.length; songId++) {

        const song = queue[songId];

        const songInfo = document.createElement('div');
        songInfo.classList.add('queue-element-info');

        const songTitle = document.createElement('p');
        songTitle.classList.add('queue-element-title');
        songTitle.textContent = song.title;

        const songArtist = document.createElement('p');
        songArtist.classList.add('queue-element-artist');
        songArtist.textContent = song.artists[0];

        songInfo.append(songTitle);
        songInfo.append(songArtist);

        const songCover = document.createElement('img');
        songCover.classList.add('queue-element-cover');
        songCover.src = song.imageUrl;

        const queueElement = document.createElement('div');
        queueElement.addEventListener('click', () => {
            playSong(song);
        });
        queueElement.append(songCover);
        queueElement.append(songInfo);

        queueElement.classList.add('queue-element');

        elements.push(queueElement);
    }

    const queueList = document.querySelector('.queue-list');
    queueList.innerHTML = '';
    
    for (const el of elements) {
        queueList.append(el);
    }
}

function setMetadata(song) {
    const imageUrl = song.imageUrl;

    if (imageUrl === 'undefined') {
        document.querySelector('.cover-art').style.display = 'none';
        return;
    }

    document.querySelector('.cover-art').style.display = 'block';
    document.querySelector('.cover-art').src = imageUrl;

    document.querySelector('.playing-song-title').innerHTML = song.title;
    document.querySelector('.playing-song-artist').innerHTML = song.artists[0];
}

// playbar controls

const playPauseButton = document.querySelector('.play-pause');

playPauseButton.addEventListener('click', () => {
    if (playingSong.paused) {
        playingSong.play();
    } else {
        playingSong.pause();
    }
});

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

    playingSong.volume = newLeft / sliderRect.width;
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
        playingSong.currentTime = progressLeft / progressSliderContainer.getBoundingClientRect().width * playingSong.duration;
        const currentTime = document.querySelector('.current-time');
        currentTime.innerHTML = formatTime(playingSong.currentTime);
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

setInterval(() => {
    if (isDraggingProgress) return;

    const sliderRect = progressSliderContainer.getBoundingClientRect();

    let newLeft = sliderRect.width * (playingSong.currentTime / playingSong.duration);

    progressSliderProgress.style.width = `${newLeft}px`;
    progressSliderThumb.style.left = `${newLeft}px`;

    const currentTime = document.querySelector('.current-time');
    currentTime.innerHTML = formatTime(playingSong.currentTime);
}, 1000);

// скролл

const container = document.querySelector('.main-window');
const content = document.querySelector('.songs-list');
const thumb = document.querySelector('.custom-thumb');

// Расчёт высоты ползунка в зависимости от содержимого
const updateThumbHeight = () => {
    const contentHeight = content.scrollHeight;
    const containerHeight = container.clientHeight;
    const thumbHeight = Math.max((containerHeight / contentHeight) * containerHeight, 40); // Минимум 40px
    thumb.style.height = `${thumbHeight}px`;
};

// Обновление позиции ползунка при прокрутке
const updateThumbPosition = () => {
    const contentScrollTop = content.scrollTop;
    const contentHeight = content.scrollHeight;
    const containerHeight = container.clientHeight - 7.5;
    const scrollRatio = contentScrollTop / (contentHeight - containerHeight);
    const thumbTop = scrollRatio * (containerHeight - thumb.clientHeight);
    thumb.style.top = `${thumbTop}px`;
};

// Прокрутка при перетаскивании ползунка
let isDragging = false;
let startY;
let startScrollTop;

const startDragging = (e) => {
    isDragging = true;
    startY = e.clientY;
    startScrollTop = content.scrollTop;
};

const stopDragging = () => {
    isDragging = false;
};

const onDrag = (e) => {
    if (!isDragging) return;
    const deltaY = e.clientY - startY;
    const contentHeight = content.scrollHeight;
    const containerHeight = container.clientHeight;
    const scrollRatio = (contentHeight - containerHeight) / (containerHeight - thumb.clientHeight);
    content.scrollTop = startScrollTop + deltaY * scrollRatio;
};

thumb.addEventListener('mousedown', startDragging);
document.addEventListener('mousemove', onDrag);
document.addEventListener('mouseup', stopDragging);

// Обновление ползунка при изменении размера окна или содержимого
window.addEventListener('resize', updateThumbHeight);
content.addEventListener('scroll', updateThumbPosition);

// Инициализация
updateThumbHeight();
updateThumbPosition();