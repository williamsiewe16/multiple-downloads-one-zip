# multiple-downloads-one-zip
A JavaScript module to download multiple files and zip them

### install
```
npm install multiple-downloads-one-zip --save 
```

## API
### ``.downloadAndZip(urls: string[], options?: DownloadOptions): void ``

An `async` function to download files located at different urls and put them in a zip

```javascript
 type DownloadOptions = {
    zip_name ?: string,     // Name of the zip file generated. Spaces in the name are replaced by `_`
    zip_dir ?: string,     // Directory where the file will be located. It must be an existing directory
    file_extension ?: string,     // Files extension. The value "jpg" is used by default
    onFileComplete ?: (info: FileCompleteInfo) => void,
    onEnd ?: (info: DownloadEnd) => void
 };
```

if  `options.onFileComplete` is provided, il will be called when a file is fully downloaded and passed an argument with a single property:

```javascript 
 type FileCompleteInfo = {
    complete: boolean     // A boolean returning true 
 } 
```

if  `options.onEnd` is provided, il will be called when all downloads are completed and passed an argument with a single property:

```javascript 
 type DownloadEnd = {
    zip_path: string,     // Path of the zip file
 }
```


#### Examples

```javascript  
  // require the module
  let download = require('multiple-downloads-one-zip')
  
  // Urls where files are downloaded from
  let urls = [
            "http://i996.imggur.net/hunter-x-hunter/390/hunter-x-hunter-11553019.jpg",
            "http://i996.imggur.net/hunter-x-hunter/390/hunter-x-hunter-11553025.jpg",
        ]

  let zip_name = "myZip" // avoid spaces
  let zip_dir = "." // give an existing directory
  
  // download and zip the files
  //  Since it is an async function, we must put `await` before, and the function must be called in an `async` function
  await download.downloadAndZip(urls,{
    zip_name: zip_name,
    zip_dir: zip_dir,
    onEnd: (data) => {
       // do what we want with the data containing the zip path
    },
    onFileComplete: (data) => {
        // do what we want
    }
 })
```
