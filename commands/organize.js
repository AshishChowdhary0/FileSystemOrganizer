const fs = require('fs');
const path = require('path');

let types = {
    media: ["mp4", "mkv", "mp3"],
    archives: ["zip", "7z", "rar", "tar", "gz", "ar", "iso", "xz"],
    documents: ["docx", "doc", "pdf", "xlsx", "xls", "odt", "ods", "odp", "odg", "odf", "txt", "ps", "tex",],
    app: ["exe", "dmg", "pkg", "deb"],
};

function organizeFn(dirPath) {
    if (dirPath == undefined) {
        console.log("Please enter a Directory path");
        return;
    }

    let destPath;

    let doesExist = fs.existsSync(dirPath);

    if (doesExist == true) {
        destPath = path.join(dirPath, 'organized_Files');

        if (fs.existsSync(destPath) == false) {
            fs.mkdirSync(destPath);
        }
    }
    else {
        console.log("Please enter a valid Directory path");
        return;
    }

    organaizeHelper(dirPath, destPath);

    console.log('Files organized!');
}

function organaizeHelper(src, dest) {
    let childNames = fs.readdirSync(src);

    for (let i = 0; i < childNames.length; i++) {
        let childAddress = path.join(src, childNames[i]);

        let isFile = fs.lstatSync(childAddress).isFile()

        if (isFile == true) {
            let fileCategory = getCategory(childNames[i]);

            sendFiles(childAddress, dest, fileCategory);
        }
    }
}

function getCategory(fileName) {
    let ext = path.extname(fileName).slice(1);

    for (let key in types) {
        let cTypeArr = types[key];

        for (let i = 0; i < cTypeArr.length; i++) {
            if (ext == cTypeArr[i]) {
                return key;
            }
        }
    }

    return 'others';
}

function sendFiles(srcFilePath, dest, fileCategory) {
    let catPath = path.join(dest, fileCategory);

    if (fs.existsSync(catPath) == false) {
        fs.mkdirSync(catPath);
    }

    let fileName = path.basename(srcFilePath);

    let destFilePath = path.join(catPath, fileName);

    fs.copyFileSync(srcFilePath, destFilePath);

    fs.unlinkSync(srcFilePath);

}

module.exports = {
    organizeFnKey: organizeFn
}