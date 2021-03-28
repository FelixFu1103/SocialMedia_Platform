const Interest = require('../models/interest');
const User = require('../models/user');
const _ = require('lodash');
const { UserRefreshClient } = require('google-auth-library');


const createInterest = async (req, res) => {
    const interestExists = await Interest.findOne({ title: req.body.title });
    if (interestExists)
        return res.status(403).json({
            error: 'The interest exists!'
        });
    
    const interest = await new Interest(req.body);
    await interest.save();
    res.status(200).json({ message: 'Interest created' });
};


const deleteInterest = (req, res) => {
    let interest = req.body.interest;
    Interest.findOneAndRemove({_id: interest },(err, interests) => {
        if (err) {
            return res.status(400).json({
                error: err
            });
        }
        res.json({ message: 'Interest deleted successfully' });
    });
};


const allInterests = (req, res) => {
    Interest.find((err, interests) => {
        if (err) {
            return res.status(400).json({
                error: err
            });
        }
        res.json(interests);
    });
};

const userInterests = (req, res) => {
    req.profile.hashed_password = undefined;
    req.profile.salt = undefined;

    Interest.find({_id : { $in : req.profile.interests}}, (err, result) => {
        if (err) {
            return res.status(400).json({ error: err });
        } 
        return res.json(result);
    })
};



const assignInterest = (req, res) => {
    let user = req.profile;
    User.findByIdAndUpdate(user._id, { $addToSet: { interests:{ $each: req.body.interests} } }, (err, result) => {
        if (err) {
            return res.status(400).json({ error: err });
        } 
        return res.json({message: 'succeed'});
    });

};

const unassignInterest = (req, res) => {
    let user = req.profile;
    User.findByIdAndUpdate(user._id, { $pull: { interests: req.body.interest } }, (err, result) => {
        if (err) {
            return res.status(400).json({ error: err });
        }
        return res.json({message: 'Interest removed'});
    });
};


exports.createInterest = createInterest
exports.allInterests = allInterests
exports.userInterests = userInterests
exports.assignInterest = assignInterest
exports.unassignInterest = unassignInterest
exports.deleteInterest = deleteInterest