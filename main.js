const { app, BrowserWindow, ipcMain } = require('electron');

const ipc = ipcMain;
app.disableHardwareAcceleration();

function createWindow() {
    const window = new BrowserWindow({
        titleBarStyle: 'hidden',
        icon: "app.ico",
        width: 1280,
        height: 720,
        minWidth: 940,
        minHeight: 560,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    window.loadFile('app/index.html');

    ipc.on('closeApp', () => {
        window.close();
    });

    ipc.on('minimizeApp', () => {
        window.minimize();
    });

    ipc.on('maximizeRestoreApp', () => {
        if (window.isMaximized()) {
            window.restore();
        } else {
            window.maximize();
        }
    });
}

app.on('ready', () => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (!process.platform === 'darwin') {
        app.quit();
    }
});