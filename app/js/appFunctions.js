import Song from './Song.js';

const pathToDir = 'C:/Users/deoxce/Music/test/';
const albums = await Song.getSongs(pathToDir);
createSongElements(albums);

let playingSong = new Audio();
let queue = [];
let currentSongIdQueue;
let volume = 1;

const playPauseButton = document.querySelector('.play-pause');

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
                updateQueue(albums)
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

function updateQueue(albums) {
    queue = [];
    for (const album in albums) {
        for (const song of albums[album]) {
            queue.push(song);
        }
    }
}

const nextSongButton = document.querySelector('.next-song');
const prevSongButton = document.querySelector('.prev-song');
nextSongButton.addEventListener('click', nextSong);
prevSongButton.addEventListener('click', prevSong);

function nextSong() {
    const nextSong = queue[currentSongIdQueue + 1];

    if (nextSong === undefined) {
        console.log('queue is ended');
        return;
    }

    playSong(nextSong, true, false);
}

function prevSong() {
    const prevSong = queue[currentSongIdQueue - 1];

    if (prevSong === undefined) {
        console.log('queue is ended');
        return;
    }

    playSong(prevSong, false, true);
}

function updateCurrentSongId(song) {
    for (let i = 0; i < queue.length; i++) {
        if (song.pathToSong === queue[i].pathToSong) {
            currentSongIdQueue = i;
            break;
        }
    }
}

let isAnimatingNow = false;
let stopAnimation = false;

async function playSong(song, isSongNext, isSongPrev) {

    await setQueue();
    
    if (isAnimatingNow) {
        stopAnimation = true;
    }

    playingSong.pause();
    playingSong = new Audio(song.pathToSong);
    playingSong.play();
    playingSong.volume = volume;
    updateCurrentSongId(song);
    playPauseButton.style.backgroundImage = 'url(img/pause.png)';
    
    playingSong.addEventListener('ended', nextSong);
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

    await setMetadata(song);

    if (!(isSongNext || isSongPrev)) {
        await setQueue();
    }

    if (isSongNext) {
        isAnimatingNow = true;
        animateNextSong(1000);
    }

    if (isSongPrev) {
        await setQueue();
    }
}

function animateNextSong(duration) {
    const elementIn = document.querySelector('.next-up-first');
    elementIn.classList.add('fadeIn');

    const startTime = performance.now();
    requestAnimationFrame(animate);

    function animate(currentTime) {
        let timeFraction = (currentTime - startTime) / duration;
        if (timeFraction > 1) timeFraction = 1;

        let progress = easeOutExpo(timeFraction);
        if (progress < 0) progress = 0;

        if (stopAnimation) {
            timeFraction = 1;
            progress = 1;
        }

        animateNextSongTransition(progress);

        if (timeFraction < 1) {
            requestAnimationFrame(animate);
        } else {
            isAnimatingNow = false;
            stopAnimation = false;
        }
    }
}

function easeOutExpo(x) {
    return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
}

function animateNextSongTransition(progress) {
    const elementOut = document.querySelector('.now-playing');
    const elementIn = document.querySelector('.next-up-first');
    const otherElements = document.querySelector('.next-up-list');
    
    elementOut.style.opacity = 1 - (1 * progress);
    elementIn.style.top = -(99 * progress) + 'px';
    otherElements.style.top = -(60 * progress) + 'px';
}

async function setQueue() {
    return new Promise(async (resolve, reject) => {
        let elements = [];
        for (let songId = currentSongIdQueue; songId < queue.length; songId++) {
    
            const song = queue[songId];
    
            const songInfo = document.createElement('div');
            songInfo.classList.add('queue-element-info');
    
            const firstLine = document.createElement('p');
            firstLine.classList.add('queue-element-title');
            firstLine.textContent = `${song.title}`;

            // firstLine.textContent = `${song.artists[0]} - ${song.title}`;
    
            const secondLine = document.createElement('p');
            secondLine.classList.add('queue-element-artist');

            // const sampleRate = Math.round(song.sampleRate / 1000);
            // const bitrate = Math.round(song.bitrate / 1000);
            // const ext = String(song.ext).slice(1).toUpperCase();

            // let bitsPerSample;

            // if (song.bitsPerSample !== undefined) {
            //     bitsPerSample = song.bitsPerSample + ' bit ';
            // } else {
            //     bitsPerSample = '';
            // }

            // secondLine.textContent = `${ext} :: ${bitsPerSample}${sampleRate} kHz, ${bitrate} kbps`;
            secondLine.textContent = `${song.artists.join(', ')}`;
    
            songInfo.append(firstLine);
            songInfo.append(secondLine);
    
            const songCover = document.createElement('img');
            songCover.classList.add('queue-element-cover');
            songCover.src = song.imageUrl;
    
            const queueElement = document.createElement('div');
            queueElement.addEventListener('click', () => {
                playSong(song);
            });
            queueElement.append(songCover);
            queueElement.append(songInfo);

            if (songId === currentSongIdQueue) {
                queueElement.classList.add('now-playing');
            } else if (songId === currentSongIdQueue + 1) {
                queueElement.classList.add('next-up-first');
            }

            queueElement.classList.add('queue-element');
    
            elements.push(queueElement);
        }
        
        const nextUpList = document.createElement('div');
        nextUpList.classList.add('next-up-list');

        const queueList = document.querySelector('.queue-list');
        queueList.innerHTML = '';

        for (let i = 0; i < elements.length; i++) {
            if (i === 0) {
                const nowPlaying = document.createElement('p');
                nowPlaying.classList.add('now-playing-title');
                nowPlaying.textContent = 'now playing';
                queueList.append(nowPlaying);
                queueList.append(elements[i]);
            }else if (i === 1) {
                const nextUp = document.createElement('p');
                nextUp.classList.add('next-up-title');
                nextUp.textContent = 'next up';
                queueList.append(nextUp);
                queueList.append(elements[i]);
            } else {
                nextUpList.append(elements[i]);
            }
        }

        queueList.append(nextUpList);

        const container = document.querySelector('.queue-list-container');
        scrollUpdate(container);
        resolve();
    })
}

async function setMetadata(song) {
    return new Promise((resolve, reject) => {
        const imageUrl = song.imageUrl;

        if (imageUrl === 'undefined') {
            document.querySelector('.cover-art').style.display = 'none';
            return;
        }
    
        document.querySelector('.cover-art').style.display = 'block';
        document.querySelector('.cover-art').src = imageUrl;
    
        document.querySelector('.playing-song-title').innerHTML = song.title;
        document.querySelector('.playing-song-artist').innerHTML = song.artists.join(', ');

        resolve();
    })
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    // Добавляем ведущий ноль, если число секунд меньше 10
    const formattedSeconds = remainingSeconds < 10 ? '0' + remainingSeconds : remainingSeconds;

    return minutes + ':' + formattedSeconds;
}

// playbar controls

playPauseButton.addEventListener('click', () => {
    if (playingSong.paused) {
        playingSong.play();
        playPauseButton.style.backgroundImage = 'url(img/pause.png)';
    } else {
        playingSong.pause();
        playPauseButton.style.backgroundImage = 'url(img/play.png)';
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
    volume = newLeft / sliderRect.width;
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

const scrollContainer = document.querySelectorAll('.scroll-container');

scrollContainer.forEach(container => {
    scrollUpdate(container);
});


function scrollUpdate(container) {
    const content = container.querySelector('.scrollable-content');
    const thumb = container.querySelector('.custom-thumb');

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
}