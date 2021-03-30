const _ = require('lodash');
const User = require('../models/user');
const formidable = require('formidable');
const fs = require('fs');
const jaccard = require('jaccard');
const Heap = require('heap');
const send = require('koa-send');
const getId = require('../middleware/id')
const getId2 = require('../middleware/id2')
const getuserInfo = require('../middleware/getpostInfo');

let controller = {
    
    userById: async (ctx, next, id) => {
        //console.log("id: ", id);
        // let id = ctx;
        // let userProfile;
        // console.log("ctx ", ctx);
        // const user = await User.findById(ctx)
        //     // populate followers and following users array
        //     .populate('following', '_id name')
        //     .populate('followers', '_id name')
        //     .then(user => {
        //         ctx.body = user
        //         console.log("post: ", user);
        //         controller.getCurrentUser(user);
        //     })
        //     .catch(err => console.log(err));
        // //controller.getCurrentUser(user);
        //     console.log("next")
        next();
    
    },
    
    // // middleware
    hasAuthorization : async(ctx, next, id) => {
        id = getId(ctx, 6);
        //ctx.body = user; 
        console.log("id: ", id)

        const user = await User.findById(id)
        console.log("user: ", user)
        // let sameUser = req.profile && req.auth && req.profile._id == req.auth._id;
        // //let adminUser = req.profile && req.auth && req.auth.role === 'admin';
        next();
    },
    allUsers: async (ctx, next) => {
            console.log("found");

            const users = 
                await User.find({})
                         // .select('name email updated created role photo')
                          .exec();
            console.log("ctx: ", ctx.req.profile);

            ctx.response.body = users
            console.log("ctx.body: ", ctx.body);
            console.log("all users: ", users);
        },
    
    getCurrentUser : async (ctx, next, id) => {

        id = getId(ctx, 6);
        //ctx.body = user; 
        console.log("id: ", id)

        const user = await User.findById(id)
            // populate followers and following users array

            .populate('following', '_id name')
            .populate('followers', '_id name')
            .exec();
            ctx.response.body = user;
            ctx.req.profile = user;
            console.log("user", user);
            console.log(ctx.response.body);

    },
    
    
    // // update user profile photo and password
    // deal with later
    updateUser : async(ctx, next) => {
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
            user = _.extend(user, fields);
    
            user.updated = Date.now();
    
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
    },
    
    recommend : async(ctx, next, id) => {
        //
        console.log("Inside recommend");
        id = getId2(ctx, 6, 30);
        console.log("id2: ", id);

        const user = await User.findById(id).exec();
        console.log("user__interests: ", user.interests);
        var userInterest = new Array();

        user.interests.forEach(function (value) {
            console.log("value >>>> ", value);
            userInterest.push(value.toString());
            console.log("userInterest: ", userInterest)
        });

        
        var heap = new Heap(function(a,b) {
            return b.jindex - a.jindex;
        });
        const users = 
                await User.find({_id: {$ne: user._id}})
                        .select('_id name interests').exec();
            console.log("user >>>", users);
            users.forEach(function (value) {
                console.log("userName >>",typeof (value.name));
                console.log("req.profile._id >>> " , typeof(user._id));
                // if (value._id.equals(req.profile._id)) continue;
    
                var interestOfuser = new Array();
                value.interests.forEach(function (oneitem){
                    interestOfuser.push(oneitem.toString());
                })
    
                heap.push({ "name" : value.name , "jindex" : jaccard.index(userInterest,interestOfuser)});
            })
            console.log("heap top >>> ", heap.peek());
    
            ctx.response.body = heap.peek();

    },
    
    
    // editInterests = (req, res) => {
    //     req.profile.hashed_password = undefined;
    //     req.profile.salt = undefined;
    //     return res.json(req.profile);
    // },
    

    // ******//
    getUserPhoto : async (ctx, next, id) => {
        id = getId2(ctx, 12, 36);

        console.log("id in here: ", id);
        const user = await User.findById(id)
            // populate followers and following users array
            .exec();
            //ctx.body = user;
            //console.log("Profile: ", user);
            console.log("User photo: ", user.photo);
            // add the photo to the photo property
            if (user.photo.data) {
                ctx.response.set(('Content-Type', user.photo.contentType))
                ctx.body = user.photo.data;
            }
            next();
    },
    
    deleteUser : async(ctx, next, id) => {
        //let user = req.profile;
        id = getId2(ctx, 6, 30);
        //ctx.body = user; 
        //console.log("ctx.request.url: ", ctx.request);
        console.log("id: ", id);

        const user = await User.findById(id).exec();
        user.remove((err, user) => {
            if (err) {
                console.log("error: ", err);
            }
            console.log('User deleted successfully' );
        });
    },
    
    // // follow unfollow they are together 
    addFollowing : async(ctx, next) => {
        // push the clicked user to the following list
        //console.log("ctx: ", ctx);
        //console.log("req.body.userId: ", JSON.stringify(ctx.request.body));
        let followId = getuserInfo.getUserFollowId(ctx);
        let userId = getuserInfo.getUserId(ctx);
        let postInfo = JSON.stringify(ctx.request.body);
        let postInfoJson = JSON.parse(postInfo);
        console.log("postIn: ", postInfo);

        console.log("UserId: ", userId);
        console.log("Following userid: ", followId);
        // following userId: ctx.request.body.followId
        //await User.findByIdAndUpdate()
        // await User.findByIdAndUpdate(userId, { $push: { following: followId } })
        //                 .populate('following', '_id name')
        //                 .populate('followers', '_id name').exec();
        // //ctx.body = res;
        // const res = await User.findById(followId).exec();
        // console.log("result in addfollowing: ", res);
        // ctx.body = res;
        // next();
    },
    
    addFollower : async (ctx, next) => {
        console.log("Inside addFollower");
        console.log("req.body.userId: ", JSON.stringify(ctx.request.body));
        // let followId = getuserInfo.getUserFollowId(ctx);
        // let userId = getuserInfo.getUserId(ctx);
        // await User.findByIdAndUpdate(followId, { $push: { followers: userId } }, { new: true })
        //     .populate('following', '_id name')
        //     .populate('followers', '_id name')
        //     .exec();

        // // should go to the followed user page
        // const res = await User.findById(followId).exec();
        // console.log("result in addfollower: ", res);
        // ctx.body = res;
    },
    
    // remove follow unfollow
    removeFollowing : async (ctx, next) => {
        // pull: take it out 
        //let unfollowId = getuserInfo.getUserunFollowId(ctx);
        let userId = getuserInfo.getUserId(ctx);
        console.log("userId: ", userId);
        //console.log("followInfoJson: ", followInfoJson);

        let postInfo = JSON.stringify(ctx.request.body);
        let postInfoJson = JSON.parse(postInfo);
        console.log("postInfoJson: ", postInfoJson);
        // await User.findByIdAndUpdate(userId, { $pull: { following: unfollowId } })
        //         .populate('following', '_id name')
        //         .populate('followers', '_id name')
        //         .exec();
        // const res = await User.findById(unfollowId).exec();
        // console.log("result in removefollowing: ", res);
        // ctx.body = res;

        // next();
    },
    
    removeFollower : async (ctx, next) => {
        let unfollowId = getuserInfo.getUserunFollowId(ctx);
        let userId = getuserInfo.getUserId(ctx);
        //console.log("followInfoJson: ", followInfoJson);
        // await User.findByIdAndUpdate(unfollowId, { $pull: { followers: userId } }, { new: true })
        //     .populate('following', '_id name')
        //     .populate('followers', '_id name')
        //     .exec();
        // const res = await User.findById(unfollowId).exec();

        // console.log("result in removefollower: ", res);
        // ctx.body = res;
    },
    
    
    
    // findPeople = (req, res) => {
    //     let following = req.profile.following;
    //     following.push(req.profile._id);
    //     User.find({ _id: { $nin: following } }, (err, users) => {
    //         if (err) {
    //             return res.status(400).json({
    //                 error: err
    //             });
    //         }
    //         res.json(users);
    //     }).select('name');
    // }
};

module.exports = controller

