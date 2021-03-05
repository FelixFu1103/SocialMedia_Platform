const _ = require('lodash');
const User = require('../models/user');
const formidable = require('formidable');
const fs = require('fs');
const jaccard = require('jaccard');
const Heap = require('heap');

const userById = (req, res, next, id) => {
    User.findById(id)
        // populate followers and following users array
        .populate('following', '_id name')
        .populate('followers', '_id name')
        .exec((err, user) => {
            if (err || !user) {
                return res.status(400).json({
                    error: 'User not found'
                });
            }
            req.profile = user; // adds profile object in req with user info
            next();
        });
};

// middleware
const hasAuthorization = (req, res, next) => {
    let sameUser = req.profile && req.auth && req.profile._id == req.auth._id;
    let adminUser = req.profile && req.auth && req.auth.role === 'admin';

    const isAuthorized = sameUser || adminUser;

    // console.log("req.profile ", req.profile, " req.auth ", req.auth);
    // console.log("SAMEUSER", sameUser, "ADMINUSER", adminUser);

    if (!isAuthorized) {
        return res.status(403).json({
            error: 'User is not authorized to perform this action'
        });
    }
    next();
};

const allUsers = (req, res) => {
    User.find((err, users) => {
            if (err) {
                return res.status(400).json({
                    error: err
                });
            }
            res.json(users);
        })
        .select('name email updated created role');
};

const getCurrentUser = (req, res) => {
    req.profile.hashed_password = undefined;
    req.profile.salt = undefined;
    return res.json(req.profile);
};


// only update user profile photo
const updateUser = (req, res, next) => {
    let form = new formidable.IncomingForm();
    // console.log("incoming form data: ", form);
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: 'Photo could not be uploaded'
            });
        }
        // save user
        let user = req.profile;
        // console.log("user in update: ", user);
        user = _.extend(user, fields);

        user.updated = Date.now();
        // console.log("USER FORM DATA UPDATE: ", user);

        if (files.photo) {
            user.photo.data = fs.readFileSync(files.photo.path);
            user.photo.contentType = files.photo.type;
        }

        user.save((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: err
                });
            }
            user.hashed_password = undefined;
            user.salt = undefined;
            // console.log("user after update with formdata: ", user);
            res.json(user);
        });
    });
};

const recommend = (req, res) => {
    //
    var userInterest = new Array();
    req.profile.interests.forEach(function (value) {
        console.log("value >>>> ", value);
        userInterest.push(value.toString());
    });

    var heap = new Heap(function(a,b) {
        return b.jindex - a.jindex;
    });
    User.find({_id: {$ne: req.profile._id}},(err, users) => {
        if (err) {
            console.log(" recommend function error");
            return res.status(400).json({
                error: err
            });
        }

        console.log("user >>>", users);
        users.forEach(function (value) {
            console.log("userName >>",typeof (value.name));
            console.log("req.profile._id >>> " , typeof(req.profile._id));
            // if (value._id.equals(req.profile._id)) continue;

            var interestOfuser = new Array();
            value.interests.forEach(function (oneitem){
                interestOfuser.push(oneitem.toString());
            })

            heap.push({ "name" : value.name , "jindex" : jaccard.index(userInterest,interestOfuser)});
        })
        console.log("heap top >>> ", heap.peek());

        res.json(heap.peek());
    }).select('_id name interests');
}


const editInterests = (req, res) => {
    req.profile.hashed_password = undefined;
    req.profile.salt = undefined;
    return res.json(req.profile);
};




const userPhoto = (req, res, next) => {
    if (req.profile.photo.data) {
        res.set(('Content-Type', req.profile.photo.contentType));
        return res.send(req.profile.photo.data);
    }
    next();
};

const deleteUser = (req, res, next) => {
    let user = req.profile;
    user.remove((err, user) => {
        if (err) {
            return res.status(400).json({
                error: err
            });
        }
        res.json({ message: 'User deleted successfully' });
    });
};

// follow unfollow they are together 
const addFollowing = (req, res, next) => {
    // push the clicked user to the following list
    User.findByIdAndUpdate(req.body.userId, { $push: { following: req.body.followId } }, (err, result) => {
        if (err) {
            return res.status(400).json({ error: err });
        }
        next();
    });
};

const addFollower = (req, res) => {
    User.findByIdAndUpdate(req.body.followId, { $push: { followers: req.body.userId } }, { new: true })
        .populate('following', '_id name')
        .populate('followers', '_id name')
        .exec((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: err
                });
            }
            result.hashed_password = undefined;
            result.salt = undefined;
            res.json(result);
        });
};

// remove follow unfollow
const removeFollowing = (req, res, next) => {
    // pull: take it out 
    User.findByIdAndUpdate(req.body.userId, { $pull: { following: req.body.unfollowId } }, (err, result) => {
        if (err) {
            return res.status(400).json({ error: err });
        }
        next();
    });
};

const removeFollower = (req, res) => {
    User.findByIdAndUpdate(req.body.unfollowId, { $pull: { followers: req.body.userId } }, { new: true })
        .populate('following', '_id name')
        .populate('followers', '_id name')
        .exec((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: err
                });
            }
            result.hashed_password = undefined;
            result.salt = undefined;
            res.json(result);
        });
};



const findPeople = (req, res) => {
    let following = req.profile.following;
    following.push(req.profile._id);
    User.find({ _id: { $nin: following } }, (err, users) => {
        if (err) {
            return res.status(400).json({
                error: err
            });
        }
        res.json(users);
    }).select('name');
};

exports.removeFollowing = removeFollowing
exports.findPeople = findPeople
exports.removeFollower = removeFollower
exports.addFollower = addFollower
exports.addFollowing = addFollowing
exports.deleteUser = deleteUser
exports.userPhoto = userPhoto
exports.userById = userById
exports.updateUser = updateUser
exports.getCurrentUser = getCurrentUser
exports.hasAuthorization = hasAuthorization
exports.allUsers = allUsers
exports.recommend = recommend
exports.editInterests = editInterests
