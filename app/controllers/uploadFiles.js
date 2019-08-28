const fs = require('fs');
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let dir = 'C:\\Users\\25102\\Desktop\\upload';
        if (!fs.existsSync(dir)) {
            fs.mkdir(dir, err => {
                if (err) {
                    console.log('文件夹创建失败');
                    return;
                }
                cb(null, dir);
            })
        } else {
            cb(null, dir);
        }
    },
    filename: function (req, file, cb) {
        const filenameArr = file.originalname.split('.');
        cb(null, Date.now() + '.' + filenameArr[filenameArr.length - 1]);
    }
});
const uploader = multer({storage: storage});

const arrMidle = uploader.array("file", 5);//一次最多处理5张


class UploadFiles {
    upload(req, res, next) {
        var _uploadLittleimg = req.files.uploadLittleimg;
        var _uploadImg = req.files.uploadImg;
        var _uploadVoice = req.files.uploadVoice;
        if (_uploadLittleimg) req.body.littleimg = "/uploads/" + _uploadLittleimg[0].filename;
        if (_uploadImg) req.body.img = "/uploads/" + _uploadImg[0].filename;
        if (_uploadVoice) req.body.voice = "/uploads/" + _uploadVoice[0].filename;
        res.send(req.files);
    }

    base64(req,res) {
        var imgData = req.body.base64;
        //过滤data:URL
        var base64Data = imgData;
        var dataBuffer = Buffer.from(base64Data,'base64');
        fs.writeFile("C:\\Users\\25102\\Desktop\\a.png", dataBuffer, function (err) {
            if (err) {
                res.send(err);
            } else {
                res.send("保存成功！");
            }

        });
    }
}

module.exports = {
    UploadFiles: new UploadFiles(),
    arrMidle
};
