const { selectCover, parseFile } = require('music-metadata');
const fs = require('fs');
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
        } catch(error) {
            this.imageUrl = 'img/unnamed.jpg';
        }
    }

    static async getSongs(pathToDir, albums = {}) {
        const files = fs.readdirSync(pathToDir);
        const extensions = ['.mp3', '.flac'];
    
        for (const filename of files) {
            const filePath = path.join(pathToDir, filename);
            const stats = fs.statSync(filePath);

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
                }
            }
        }
    
        return albums;
    }
}