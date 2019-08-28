const express = require('express');
const router = express.Router();
const upload = require('../controllers/uploadFiles');


router.use("/files", upload.arrMidle , upload.UploadFiles.upload);
router.use("/base64",upload.UploadFiles.base64);
module.exports = router;


