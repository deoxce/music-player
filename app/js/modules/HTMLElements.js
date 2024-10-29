import { playSong, updateScroll, updateCurrentSongId, setQueue } from './utils.js';

export function createSongElements(albums) {
    for (const albumName in albums) {
        const firstSongInAlbum = albums[albumName][0];

        const songTitle = document.createElement('p');
        songTitle.classList.add('song-element-title');
        songTitle.textContent = firstSongInAlbum.album;

        const songArtist = document.createElement('p');
        songArtist.classList.add('song-element-artist');
        if (firstSongInAlbum.albumartist == 'undefined') {
            songArtist.textContent = firstSongInAlbum.artists[0];
        } else {
            songArtist.textContent = firstSongInAlbum.albumartist;
        }

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

        songElement.addEventListener('click', (event) => {
            if (event.ctrlKey) {
                for (let j = 0; j < albums[albumName].length; j++) {
                    window.selected.push(albums[albumName][j]);
                }
                createSelectedElements();
            }
        });

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

    for (let i = 0; i < window.queue.length && i < 80; i++) {
        if (Array.isArray(window.queue[i])) {
            const repeatContainer = document.createElement('div');
            if (i !== 0 || window.queueLoop) {
                repeatContainer.classList.add('repeat-container');
            }

            for (let j = 0; j < window.queue[i].length; j++) {
                const song = window.queue[i][j];

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

                repeatContainer.append(queueElement);
            }

            if (i == 0) {
                const loopElements = repeatContainer.querySelectorAll('.queue-element');

                loopElements[window.currentIdInLoop].classList.add('now-playing');

                repeatContainer.classList.add('now-playing');
                nowPlayingList.append(repeatContainer);
    
            } else {
                nextInQueueList.append(repeatContainer);
            }
    
            nowPlayingTitle.style.display = nowPlayingList.innerHTML == '' ? 'none' : 'block';
            nextInQueueTitle.style.display = nextInQueueList.innerHTML == '' ? 'none' : 'block';
            nextUpTitle.style.display = nextUpList.innerHTML == '' ? 'none' : 'block';
        } else {
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
    
            if (i !== 0) {
                songCover.addEventListener('click', () => {
                    window.queue = window.queue.slice(i);
                    if (window.queueLoop) {
                        window.queueLoop = false;
                        const repeatPath = document.querySelector('.repeat > path');
                        repeatPath.style.fill = 'var(--secondary-color)';
                    }
                    playSong(song);
                });
            }
    
            const queueElement = document.createElement('div');
            queueElement.append(songCover);
            queueElement.append(songInfo);

            if (queueType == 'nextInQueue' && i !== 0) {
                const removeButton = document.createElement('div');
                removeButton.classList.add('queue-element-remove-button');
                removeButton.addEventListener('click', () => {
                    window.queue.splice(i, 1);
                    createQueueElements();
                });
                queueElement.append(removeButton);
            }

            queueElement.classList.add('queue-element');
            
            if (i == 0) {
                if (window.playingSong.loop) queueElement.classList.add('repeat-container');
                queueElement.classList.add('now-playing');
                nowPlayingList.append(queueElement);
    
            } else if (queueType == 'nextInQueue') {
                nextInQueueList.append(queueElement);
    
            } else if (queueType == 'nextUp') {
                nextUpList.append(queueElement);
            }
    
            nowPlayingTitle.style.display = nowPlayingList.innerHTML == '' ? 'none' : 'block';
            nextInQueueTitle.style.display = nextInQueueList.innerHTML == '' ? 'none' : 'block';
            nextUpTitle.style.display = nextUpList.innerHTML == '' ? 'none' : 'block';
        }
    }

    const container = document.querySelector('.queue-list-container');
    updateScroll(container);
}

export function createSelectedElements() {
    const selectedSection = document.querySelector('.selected');
    if (window.selected.length == 0) {
        selectedSection.style.display = 'none';
        return;
    }
    selectedSection.style.display = 'block';
    const selectedList = document.querySelector('.selected-list');
    selectedList.innerHTML = '';
    
    for (let i = 0; i < window.selected.length; i++) {
        const song = window.selected[i];

        const songInfo = document.createElement('div');
        songInfo.classList.add('selected-element-info');
        
        const firstLine = document.createElement('p');
        firstLine.classList.add('selected-element-title');
        firstLine.textContent = `${song.title}`;
        
        const secondLine = document.createElement('p');
        secondLine.classList.add('selected-element-artist');
        secondLine.textContent = `${song.artists.join(', ')}`;
        
        songInfo.append(firstLine);
        songInfo.append(secondLine);
        
        const songCover = document.createElement('img');
        songCover.classList.add('selected-element-cover');
        songCover.src = song.imageUrl;
        
        const removeButton = document.createElement('div');
        removeButton.classList.add('queue-element-remove-button');
        removeButton.addEventListener('click', () => {
            window.selected.splice(i, 1);
            createSelectedElements();
        });
        
        const selectedElement = document.createElement('div');
        selectedElement.append(songCover);
        selectedElement.append(songInfo);
        selectedElement.append(removeButton);
        selectedElement.classList.add('selected-element');

        selectedList.append(selectedElement);
    }
}