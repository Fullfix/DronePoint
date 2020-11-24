const express = require('express');
const Evfs = require('../models/Evfs');
const multer = require('multer');
const { getData } = require('./excel');


const router = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({
    storage: storage
});

router.post('/evfs', async (req, res, next) => {
    const evfs = new Evfs({
        personnelDetails: req.body.personnelDetails,
        contactDetails: req.body.contactDetails,
        educationDetails: req.body.educationDetails,
        employmentVerificationDetails: req.body.employmentVerificationDetails,
        identityVerificationDetails: req.body.identityVerificationDetails,
    });
    const newEvfs = await evfs.save();
    return res.send(newEvfs);
})

router.post('/evfs-files', upload.any(), async (req, res, next) => {
    const evfs = await Evfs.findById(req.body.id);
    evfs.educationDetails = evfs.educationDetails.map((details, i) => {
        const file = req.files.find(file => file.fieldname === `educationDetails${i}`);
        return {
            ...details,
            document: file.path,
            document_name: file.originalname,
        }
    });
    evfs.employmentVerificationDetails = evfs.employmentVerificationDetails.map(
        (details, i) => {
        const file = req.files.find(
            file => file.fieldname === `employmentVerificationDetails${i}`
        );
        return {
            ...details,
            document: file.path,
            document_name: file.originalname,
        }
    });
    evfs.identityVerificationDetails = evfs.identityVerificationDetails.map(
        (details, i) => {
        const file = req.files.find(
            file => file.fieldname === `identityVerificationDetails${i}`
        );
        return {
            ...details,
            document: file.path,
            document_name: file.originalname,
        }
    });
    const newEvfs = await evfs.save();
    return res.send(newEvfs);
});

router.post('/excel', upload.single('file'), async (req, res, next) => {
    const data = await getData(req.file.path);
    console.log(data);
    const evfs = new Evfs(data);
    const newEvfs = await evfs.save();
    return res.send(newEvfs);
});

module.exports = router;