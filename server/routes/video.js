const express = require('express');
const router = express.Router();
const multer = require('multer');
const ffmpeg = require('fluent-ffmpeg');
const { Video } = require('../models/Video');
const { Subscribe } = require('../models/Subscriber');
const { route } = require('./users');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads/')
    },
    filename: function (req, file, cb) {
      cb(null, `${Date.now()}_${file.originalname}`)
    },
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        if(ext !== '.mp4' && ext !== '.mov' && ext !== '.webm'){
            return cb(res.status(400).end('only mp4 file is allowed'), false);
        }
        cb(null, true);
    }
})
   
const upload = multer({ storage: storage }).single('file');

router.post('/uploadfiles', (req, res) => {
    upload(req, res, err => {
        if(err){
            console.log("res", res);
            console.log("err" , err);
            return res.json({success: false, err});
        }
        return res.json({success: true, filePath: res.req.file.path, fileName: res.req.file.filename});
    })
})

router.post('/thumbnail', (req, res) => {
    let thumbFilePath = "";
    let fileDuration = "";

    console.log("fucking request", req);

    ffmpeg.ffprobe(req.body.filePath, (err, metadata) => {
        console.dir(metadata);
        console.log(metadata.format.duration);
        fileDuration = metadata.format.duration;
    });

    ffmpeg(req.body.filePath)
        .on('filenames', filenames => {
            console.log('Will generate ' + filenames.join(', '));
            thumbFilePath = "uploads/thumbnails/" + filenames[0];
        })
        .on('end', () => {
            console.log('Screenshot taken');
            return res.json({success: true, thumbFilePath, fileDuration});
        })
        .screenshots({
            count: 1,
            folder: 'uploads/thumbnails',
            filename: 'thumbnail-%b.png'
        })
})

router.post('/uploadVideo', (req, res) => {
    const video = new Video(req.body);
    video.save((err, video) => {
        if(err) return res.status(400).json({success: false, err});
        return res.status(200).json({success: true});
    })
})

router.get('/getVideos', (req, res) => {
    Video.find()
        .populate('writer')
        .exec((err, videos) => {
            if(err) return res.status(400).send(err);
            res.status(200).json({ success: true, videos })
        })
})

router.post('/getVideo', (req, res) => {
    console.log(req.body.videoId);
    Video.findOne({"_id": req.body.videoId})
        .populate('writer')
        .exec((err, video) => {
            if(err) return res.status(400).send(err);
            res.status(200).json({success: true, video});
        })
})

router.post('/getSubscriptionVideos', (req, res) => {
    Subscribe.find({"userFrom": req.body.user})
        .exec((err, subscriber) => {
            if(err) return res.status(400).send(err);
            
            const subscribedUsers = subscriber.map(sub => {
                return sub.userTo;
            })
            console.log(subscribedUsers);

            Video.find({writer: {$in: subscribedUsers}})
                .populate('writer')
                .exec((err, videos) => {
                    if(err) return res.status(400).send(err);
                    res.status(200).json({success: true, videos});
                })
        })
})

router.post('/search', (req, res) => {
    console.log(req.body.search);
    //Video.index( { title: "text", description: "text" } );
    Video.find({ $text : {$search: req.body.search}}, {score: {$meta: 'textScore'}})
        .sort({score: {$meta: 'textScore'}})
        .populate('writer')
        .limit(30)
        .exec((err, videos) => {
            console.log("err", err);
            console.log(videos);
            if(err) return res.status(400).json({success: false, err});
            res.status(200).json({ success: true, videos })
        })
})




module.exports = router;