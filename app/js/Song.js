const { selectCover, parseFile } = require('music-metadata');
const fs = require('fs').promises;
const path = require('path');

export default class Song {
    async addMetadata(pathToDir, filename) {
        const pathToSong = `${pathToDir}${filename}`;
        const metadata = await parseFile(pathToSong);

        this.pathToSong = String(pathToSong);

        // console.log(metadata.common);

        this.filename = filename;
        this.title = String(metadata.common.title);
        this.artists = metadata.common.artists ? metadata.common.artists : ['undefined'];
        this.album = String(metadata.common.album);
        this.albumartist = String(metadata.common.albumartist);
        this.year = String(metadata.common.year);

        this.codec = metadata.format.codec;
        this.bitrate = metadata.format.bitrate;
        this.bitsPerSample = metadata.format.bitsPerSample;
        this.sampleRate = metadata.format.sampleRate;
        this.duration = metadata.format.duration;

        const cover = selectCover(metadata.common.picture);
        try {
            const image = new Blob([cover.data], { type: 'image/jpeg' });

            this.imageUrl = URL.createObjectURL(image);

            // let ogImageUrl = URL.createObjectURL(image);
            // this.imageUrl = await Song.resizeImage(ogImageUrl, 700, 700);

        } catch(error) {
            this.imageUrl = 'img/unnamed.jpg';
            console.log(error);
        }
    }

    static async getSongs(pathToDir, albums = {}) {
        const files = await fs.readdir(pathToDir);
        const extensions = ['.mp3', '.flac', '.aac', '.m4a', '.wav', '.ogg', '.opus'];
    
        for (const filename of files) {
            const filePath = path.join(pathToDir, filename);
            const stats = await fs.stat(filePath);

            if (stats.isDirectory()) {
                await this.getSongs(filePath + '/', albums);
            } else {
                const ext = path.extname(filename);
                if (extensions.includes(ext)) {
                    const song = new Song();
                    await song.addMetadata(pathToDir, filename);

                    const songAlbum = String(song.album);
                    if (!(songAlbum in albums)) {
                        albums[songAlbum] = [];
                    }

                    albums[songAlbum].push(song);
                    // console.log(song.title);
                }
            }
        }
    
        return albums;
    }

    static async resizeImage(blobUrl, newWidth, newHeight) {
        const img = new Image();
        img.src = blobUrl;
    
        // Ждём загрузки изображения
        await new Promise((resolve) => (img.onload = resolve));
    
        // Создаём canvas для изменения размера
        const canvas = document.createElement('canvas');
        canvas.width = newWidth;
        canvas.height = newHeight;
    
        const ctx = canvas.getContext('2d');
        // Рисуем изображение в новом разрешении
        ctx.drawImage(img, 0, 0, newWidth, newHeight);
    
        // Преобразуем canvas в Blob
        return new Promise((resolve) => {
            canvas.toBlob((blob) => {
                const newBlobUrl = URL.createObjectURL(blob);
                resolve(newBlobUrl);
            }, 'image/jpeg'); // Укажите тип изображения, например 'image/png' или 'image/jpeg'
        });
    }
}