let axios = require('axios')
let fs = require('fs')
let util = require('util')
let childProcess = require('child_process')
let events = require('events')
let os = require('os')

module.exports = {
    downloadAndZip: async (urls: string[], options?: {
        zip_name ?: string,
        zip_dir ?: string,
        file_extension ?: string,
        onFileComplete ?: (info: {complete: boolean}) => void
        onEnd ?: (info: {zip_path: string}) => void;
    }) => {

        const myOs = os.platform() === 'win32' ? "Windows" :
                os.platform() === 'darwin' ? "Mac OS" :
                os.platform() === 'linux' ? "Linux" : ""

        const dir_name = options.zip_name ? options.zip_name.split(' ').join('_') : new Date().getTime().toString(16)
        let zip_dir = options.zip_dir ? (options.zip_dir != "" ? `${options.zip_dir}` : "") : "", zip_path = `${zip_dir}/${dir_name}`;
        let files_Path = []

        let exec = util.promisify(childProcess.exec)
        let emitter = new events.EventEmitter()
        let count = 0

        emitter.on('addAll',async () => {

            if(os.platform() === 'win32'){
                let script1 = `rar a ${zip_path}.zip ${dir_name}`
                await exec(script1);
    
                let script2 = `del /q ${dir_name}`
                let script3 = `rmdir ${dir_name}`
                await exec(script2); await exec(script3)
            }
            else{
                let script1 = `tar -cf ${zip_path}.tar ${dir_name}`
                await exec(script1);

                let script2 = `rm -rf ${dir_name}`
                await exec(script2)
            }
            emitter.emit('end')
        })

        emitter.on('fileComplete',(file_path) => {
            options.onFileComplete? options.onFileComplete({complete: true}): ""
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
