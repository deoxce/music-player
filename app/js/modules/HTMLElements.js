import { playSong } from './utils.js';
import { updateScroll } from './utils.js';

export function createSongElements(albums) {
    for (const albumName in albums) {
        const firstSongInAlbum = albums[albumName][0];

        const songTitle = document.createElement('p');
        songTitle.classList.add('song-element-title');
        songTitle.textContent = firstSongInAlbum.album;

        const songArtist = document.createElement('p');
        songArtist.classList.add('song-element-artist');
        songArtist.textContent = firstSongInAlbum.albumartist;

        const songCover = document.createElement('img');
        songCover.classList.add('song-element-cover');
        songCover.src = firstSongInAlbum.imageUrl;

        const songElement = document.createElement('div');
        songElement.addEventListener('click', () => {
            window.queue = [];
            
            for (const albumName in albums) {
                for (const song of albums[albumName]) {
                    window.queue.push(song);
                }
            }

            playSong(firstSongInAlbum);
        });

        songElement.append(songCover);
        songElement.append(songTitle);
        songElement.append(songArtist);

        songElement.classList.add('song-element');

        const songsList = document.querySelector('.songs-list');
        songsList.append(songElement);
    }

    const mainWindow = document.querySelector('.main-window');
    updateScroll(mainWindow);
}

export function createQueueElements() {
    let elements = [];
    for (let songId = window.currentSongId; songId < window.queue.length && songId < window.currentSongId + 50; songId++) {

        const song = window.queue[songId];

        const songInfo = document.createElement('div');
        songInfo.classList.add('queue-element-info');

        const firstLine = document.createElement('p');
        firstLine.classList.add('queue-element-title');
        firstLine.textContent = `${song.title}`;

        const secondLine = document.createElement('p');
        secondLine.classList.add('queue-element-artist');
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

        if (songId === window.currentSongId) {
            queueElement.classList.add('now-playing');
        } else if (songId === window.currentSongId + 1) {
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
        } else if (i === 1) {
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
    updateScroll(container);
}