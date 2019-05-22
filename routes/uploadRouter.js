const router = require('express').Router();
const bodyParser = require('body-parser');
// const errorhandle = require('../utils/errorHandle');
// const logger = require('../utils/logger');

const uzipUploadCtrl = require('../controller/uploadUnzip');
router.use(bodyParser.json({ extended: true }));
router
.route('/upload')
.post(uzipUploadCtrl.uploadFileUnzip);

module.exports = router;