const { selectCover, parseFile } = require('music-metadata');
const fs = require('fs');

export default class Song {
    async addMetadata(pathToDir, filename) {
        const pathToSong = `${pathToDir}${filename}`;
        const metadata = await parseFile(pathToSong);

        this.filename = filename;
        this.title = String(metadata.common.title);
        this.artists = metadata.common.artists ? metadata.common.artists : ['undefined'];
        this.album = String(metadata.common.album);
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

    static async getSongs(pathToDir) {
        const files = fs.readdirSync(pathToDir);
        let songs = [];
    
        for (const filename of files) {
            const song = new Song();
            await song.addMetadata(pathToDir, filename);
            songs.push(song);
        }
    
        return songs;
    }
}