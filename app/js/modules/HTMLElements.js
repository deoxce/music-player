import { playSong, updateScroll, updateCurrentSongId, setQueue } from './utils.js';

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

        const nextInQueueButton = document.createElement('div');
        nextInQueueButton.classList.add('song-element-next-in-queue-button');
        nextInQueueButton.addEventListener('click', () => {
            for (let i = 1; i < window.queue.length; i++) {
                if (window.queue[i]['queueType'] == 'nextUp') {
                    for (let j = albums[albumName].length - 1; j >= 0; j--) {
                        window.queue.splice(i, 0, {
                            song: albums[albumName][j],
                            queueType: 'nextInQueue'
                        });
                    }
                    break;
                }
            }

            createQueueElements()
        });

        const playButton = document.createElement('div');
        playButton.classList.add('song-element-play-button');
        playButton.addEventListener('click', () => {
            window.playlist = [];
            
            for (const albumName in albums) {
                for (const song of albums[albumName]) {
                    window.playlist.push(song);
                }
            }

            updateCurrentSongId(firstSongInAlbum);
            setQueue();

            playSong(firstSongInAlbum);
        });
        
        const songElement = document.createElement('div');
        songElement.classList.add('song-element');

        songElement.append(songCover);
        songElement.append(songTitle);
        songElement.append(songArtist);
        songElement.append(nextInQueueButton);
        songElement.append(playButton);

        const songsList = document.querySelector('.songs-list');
        songsList.append(songElement);
    }

    const mainWindow = document.querySelector('.main-window');
    updateScroll(mainWindow);
}

export function createQueueElements() {
    const nowPlayingList = document.querySelector('.now-playing-list');
    const nextInQueueList = document.querySelector('.next-in-queue-list');
    const nextUpList = document.querySelector('.next-up-list');

    const nowPlayingTitle = document.querySelector('.now-playing-title');
    const nextInQueueTitle = document.querySelector('.next-in-queue-title');
    const nextUpTitle = document.querySelector('.next-up-title');

    nowPlayingList.innerHTML = '';
    nextInQueueList.innerHTML = '';
    nextUpList.innerHTML = '';

    for (let i = 0; i < window.queue.length; i++) {
        const song = window.queue[i]['song'];
        const queueType = window.queue[i]['queueType'];

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
        queueElement.append(songCover);
        queueElement.append(songInfo);
        queueElement.classList.add('queue-element');
        
        if (i == 0) {
            if (window.playingSong.loop) queueElement.classList.add('repeat-container');
            queueElement.classList.add('now-playing');
            nowPlayingList.append(queueElement);

        } else if (queueType == 'nextInQueue') {
            queueElement.addEventListener('click', () => {
                window.queue = window.queue.slice(i);
                playSong(song);
            });
            nextInQueueList.append(queueElement);

        } else if (queueType == 'nextUp') {
            queueElement.addEventListener('click', () => {
                window.queue = window.queue.slice(i);
                playSong(song);
            });
            nextUpList.append(queueElement);
        }

        nowPlayingTitle.style.display = nowPlayingList.innerHTML == '' ? 'none' : 'block';
        nextInQueueTitle.style.display = nextInQueueList.innerHTML == '' ? 'none' : 'block';
        nextUpTitle.style.display = nextUpList.innerHTML == '' ? 'none' : 'block';
    }

    const container = document.querySelector('.queue-list-container');
    updateScroll(container);
}