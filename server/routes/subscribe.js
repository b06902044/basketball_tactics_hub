const express = require('express');
const router = express.Router();
const { Subscribe } = require('../models/Subscriber');
//const { auth } = require("../middleware/auth");


router.post('/subscribeNumber', (req, res) => {
    Subscribe.find({"userTo": req.body.userTo})
        .exec((err, subscribe) => {
            if(err) return res.status(400).send(err);
            res.status(200).json({success: true, subscribeNumber: subscribe.length});
        })
})

router.post('/subscribed', (req, res) => {
    Subscribe.find({"userTo": req.body.userTo, "userFrom": req.body.userFrom})
        .exec((err, subscribe) => {
            if(err) return res.status(400).send(err);
            res.status(200).json({success: true, subscribed: subscribe.length > 0});
        })
})

router.post('/subscribe', (req, res) => {
    const sub = new Subscribe(req.body);
    sub.save((err, doc) => {
        if(err) return res.status(400).json({success: false, err});
        res.status(200).json({success: true});
    })
})

router.post('/unsubscribe', (req, res) => {
    Subscribe.findOneAndDelete(req.body)
        .exec((err, doc) => {
            if(err) return res.status(400).json({success: false, err});
            res.status(200).json({success: true, doc});
        })
})

module.exports = router;