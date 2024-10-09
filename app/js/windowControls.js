const { ipcRenderer } = require('electron');
const ipc = ipcRenderer;

closeButton.addEventListener('click', () => {
    ipc.send('closeApp');
});

minimizeButton.addEventListener('click', () => {
    ipc.send('minimizeApp');
});

maximizeButton.addEventListener('click', () => {
    ipc.send('maximizeRestoreApp');
});