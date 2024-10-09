import Song from './Song.js';

const pathToDir = 'C:/Users/deoxce/Music/test/';
const songs = await Song.getSongs(pathToDir);

createSongElements(songs);

let playingSong = new Audio();

function createSongElements(songs) {
    songs.forEach((song, index) => {
        const songTitle = document.createElement('p');
        songTitle.classList.add('song-element-title');
        songTitle.textContent = song.title;

        const songArtist = document.createElement('p');
        songArtist.classList.add('song-element-artist');
        songArtist.textContent = song.artists[0];

        const songCover = document.createElement('img');
        songCover.classList.add('song-element-cover');
        songCover.src = song.imageUrl;

        const songElement = document.createElement('div');
        songElement.addEventListener('click', () => {
            playSong(song);
        });
        songElement.append(songCover);
        songElement.append(songTitle);
        songElement.append(songArtist);

        songElement.classList.add('song-element');
        songElement.id = index;

        const songsList = document.querySelector('.songs-list');
        songsList.append(songElement);
    });
}

function playSong(song) {
    if (!playingSong.paused) {
        playingSong.pause();
    }

    const volume = playingSong.volume;
    const pathToTune = pathToDir + song.filename;

    playingSong = new Audio(pathToTune);
    playingSong.play();
    playingSong.volume = volume;

    const sliderProgress = document.querySelector('#progress .slider-progress');
    const sliderThumb = document.querySelector('#progress .slider-thumb');
    sliderProgress.style.width = 0;
    sliderThumb.style.left = 0;

    setMetadata(song);
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
    volumeSliderThumb.classList.add('active');
});

document.addEventListener('mouseup', (event) => {
    isDraggingVolume = false;
    volumeSliderThumb.classList.remove('active');
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
    progressSliderThumb.classList.add('active');
});

document.addEventListener('mouseup', (event) => {
    if (isDraggingProgress) {
        playingSong.currentTime = progressLeft / progressSliderContainer.getBoundingClientRect().width * playingSong.duration;
    }

    isDraggingProgress = false;
    progressSliderThumb.classList.remove('active');
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
}, 1000);

// скролл

const container = document.querySelector('.main-window');
const content = document.querySelector('.songs-list');
const thumb = document.querySelector('.custom-thumb');
const scrollbar = document.querySelector('.custom-scrollbar');

scrollbar.addEventListener('mousedown', (event) => {
    thumb.classList.add('active');
});

document.addEventListener('mouseup', (event) => {
    thumb.classList.remove('active');
});

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
    const containerHeight = container.clientHeight;
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