import {PathLike} from "fs";

let axios = require('axios')
let fs = require('fs')
let util = require('util')
let childProcess = require('child_process')
let events = require('events')

module.exports = {
    downloadAndZip: async (urls: string[], options?: {
        zip_name ?: string,
        zip_dir ?: string,
        file_extension ?: string,
        onFileComplete ?: (info: {filePath: string, complete: boolean}) => void
        onEnd ?: (info: {zip_path: string}) => void;
    }) => {
        const dir_name = options.zip_name ? options.zip_name.split(' ').join('_') : new Date().getTime().toString(16)
        let zip_dir = options.zip_dir ? `${options.zip_dir}/` : "", zip_path = `${zip_dir}${dir_name}.zip`, files_Path = []

        let exec = util.promisify(childProcess.exec)
        let emitter = new events.EventEmitter()
        let count = 0

        emitter.on('addAll',async () => {
            let script1 = `rar a ${zip_path} ${dir_name}`
            await exec(script1);

            let script2 = `del /q ${dir_name}`
            let script3 = `rmdir ${dir_name}`
            await exec(script2); await exec(script3)
            emitter.emit('end')
        })

        emitter.on('fileComplete',(file_path) => {
            options.onFileComplete? options.onFileComplete({filePath: file_path, complete: true}): ""
        })

        emitter.on('end',() => {
           options.onEnd? options.onEnd({zip_path: zip_path}): ""
        })

        for(let i=0; i<urls.length; i++){
            let url = urls[i], extension = options.file_extension || "jpg", file_path = `${dir_name}/${i+1}.${extension}`;
            let res = await axios(url,{responseType: 'stream'})
            await fs.mkdir(dir_name,() => {})
            const writer = fs.createWriteStream(file_path)
            let download = res.data.pipe(writer)
            download.on('finish',async () => {
                files_Path.push(file_path)
                count++
               emitter.emit('fileComplete',file_path)
                if(count == urls.length) emitter.emit('addAll')
            })
        }
    }
}
