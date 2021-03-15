const Post = require('../models/post');
const User = require('../models/user');
const formidable = require('koa2-formidable');
const fs = require('fs');
const _ = require('lodash');
const getId = require('../middleware/id');
const getId2 = require('../middleware/id2');
const getpostInfo = require('../middleware/getpostInfo');
let controller = {
    // postById : async (ctx, next, id) => {
    //     console.log("inside postbyid");
    //     console.log("ctx: ", ctx);
    //     id = ctx;
    //     Post.findById(id)
    //         .populate('postedBy', '_id name')
    //         .populate('comments.postedBy', '_id name')
    //         .populate('postedBy', '_id name role')
    //         .select('_id title body created likes comments photo')
    //         .exec();
    //     //req.post = post;

    //     await next;
        
    // },
    
    // // with pagination
    // // api only
    getPosts: async(ctx, next) => {
        console.log("showing all post");
        //console.log("ctx request req", ctx.request.req);
        const currPage = ctx.request.query.page || 1;
        const eachPage = 6;
        let totalPosts;
        //console.log(ctx);
        const posts = await Post.find()
                .countDocuments()
                .then(total => {
                    totalPosts = total;
                    return Post.find()
                    // fields to be determined
                    .skip((currPage - 1) * eachPage)
                    .select('_id title body created likes photo')
                    .populate('comments', 'text created')
                    .populate('comments.postedBy', '_id name')
                    .populate('postedBy', '_id name')
                    .limit(eachPage)
                    .sort({ created: -1 });
                })
                .then(posts => {
                    ctx.body = posts
                    //console.log("post: ", posts);
                })
                .catch(err => console.log(err));
    },
  
    // need to fix bug
    writePost : async(ctx, next, id) => {
        console.log("inside writepost");

        //var form = new formidable.IncomingForm();

        // const form = formidable({ multiples: true });
        // form.keepExtensions = true;
        //console.log("ctx.request.profile: ", JSON.stringify(ctx.request.profile));
        id = getId(ctx, 10);
        const user = await User.findById(id).exec();
       // console.log("user: ", user);
        // var formFields = await new Promise((resolve, reject) => {

            // form.parse(ctx, (err, fields, files) => {
            //     if (err) {
            //         //reject(err);
            //         console.log("Image could not be uploaded");
            //         // return res.status(400).json({
            //         //     error: 'Image could not be uploaded'
            //         // });
            //     }
                //let post = new Post(fields);
                console.log("ctx.request.body: ", ctx.request);
                // user.hashed_password = undefined;
                // user.salt = undefined;
                // post.postedBy = user;
        
                
            //     if (files.photo) {
            //         post.photo.data = fs.readFileSync(files.photo.path);
            //         post.photo.contentType = files.photo.type;
            //     }
            //     post.save((err, result) => {
            //         if (err) {
            //             console.log("error: ", err);
            //         }
            //         ctx.response.body = result;
            //     });
            // // resolve(fields);
            // });  
        next();
    },
    
    
    postsByUser : async(ctx, next) => {
       // ctx.body = "new";
        
        console.log("postsbyuser");
        // let url = ctx.request.url;
        // id = url.slice(10);

        let id = getId(ctx, 10);
        console.log("ctx.url.id ", id);

        const posts = await Post.find({ postedBy: id })
            .populate('postedBy', '_id name')
            .select('_id title body created likes')
            .sort('_created')
            .exec();
            ctx.response.body = posts
            console.log("post: ", posts);

    },
    
    // // middleware
    istheSamePoster : async(ctx, next) => {

        //console.log("ctx: ", req);
        console.log("ctx.request.post: ", ctx.request.post);
        next();
    },
    
    // updatePost = (req, res, next) => {
    //     let form = new formidable.IncomingForm();
    //     form.keepExtensions = true;
    //     form.parse(req, (err, fields, files) => {
    //         if (err) {
    //             return res.status(400).json({
    //                 error: 'Photo could not be uploaded'
    //             });
    //         }
    //         // save post
    //         let post = req.post;
    //         post = _.extend(post, fields);
    //         post.updated = Date.now();
    
    //         if (files.photo) {
    //             post.photo.data = fs.readFileSync(files.photo.path);
    //             post.photo.contentType = files.photo.type;
    //         }
    
    //         post.save((err, result) => {
    //             if (err) {
    //                 return res.status(400).json({
    //                     error: err
    //                 });
    //             }
    //             res.json(post);
    //         });
    //     });
    // },
    
    
    // need to remove promise
    getPostPhoto : async (ctx, next, id) => {
        //console.log("ctx: ", ctx);
        // ctx.set('Content-Type', req.post.photo.contentType);
        // return res.send(req.post.photo.data);
        console.log("inside getpostPhoto");
        id = getId(ctx, 12);
        console.log("postid: ", id);
        const user = await Post.findById(id)
            .exec();
            console.log("User photo: ", user.photo);
            // add the photo to the photo property
            if (user.photo.data) {
                ctx.response.set(('Content-Type', user.photo.contentType))
                ctx.body = user.photo.data;
            }
        next();
        
    },
    
    singlePost : async(ctx, next, id) => {
        //return res.json(req.post);
        id = getId(ctx, 6);
        //console.log("id__:", id);
        //console.log("ctx.req: ", ctx.req);
        const post = await Post.findById(id)
            .populate('postedBy', '_id name')
            .populate('comments.postedBy', '_id name')
            .populate('postedBy', '_id name role')
            .select('_id title body created likes comments photo')
            .exec();
            ctx.request.post = post;
            //console.log("ctx.request.post", ctx.request.post);
            ctx.body = post;
    },
    
    deletePost : async (ctx, next, id) => {
        //let post = req.post;
        // get the post info by postid
        const post1 = await Post.find();
        console.log("all posts: ", post1);
        id = getId(ctx, 6);
        console.log("iddd: ", id);
        Post.deleteOne({ _id: id }, err => {
            if (!err) {
                console.log("Post deleted");
            } else {
                console.log('Error deleting user!');
            }
        }).exec();
        
        const post2 =  await Post.find();
        console.log("all posts after deletion: ", post2);
        // let post = await Post.findOneAndDelete({_id : id});
        // console.log("post to delete: ", post);
        // post.remove((err, post) => {
        //     if (err) {
        //         console.log("err: ", err);
        //     }
        //     ctx.response.body = "delete successfully";
        //     console.log("delete successfully");
        // });
    },
    
    like : async(ctx, next) => {
        console.log("inside like");
        console.log("ctx.request.body: ", JSON.stringify(ctx.request.body));
        let postId = getpostInfo.getpostId(ctx);
        let userId = getpostInfo.getuserId(ctx);
        //console.log("postId: ", postId);
        //console.log("userId: ", userId);
        const post = 
            await Post.findByIdAndUpdate(postId, { $push: { likes: userId } }, { new: true })
            .exec();
        console.log("Post to like: ", post);
        ctx.body = post;
        // ctx.response.body = JSON.stringify(res);
        //console.log("res: ", res);
    },
    
    dislike : async(ctx, next) => {
        let postId = getpostInfo.getpostId(ctx);
        let userId = getpostInfo.getuserId(ctx);
        console.log("postId: ", postId);
        console.log("userId: ", userId);
        const post = 
            await Post.findByIdAndUpdate(postId, { $pull: { likes: userId } }, { new: true })
            .exec();
        console.log("Post to dislike: ", post);
        ctx.body = post;
    },
    
    comment : async(ctx, next) => {
        // need to get user comment and userId
        let comment = getpostInfo.getUserComment(ctx);
        comment.postedBy = getpostInfo.getuserId(ctx);

        let postId = getpostInfo.getpostId(ctx);
        const post = 
            await Post.findByIdAndUpdate(postId, { $push: { comments: comment } }, { new: true })
            .select('_id title body created likes comments photo')
            .populate('comments.postedBy', '_id name')
            .populate('postedBy', '_id name')
            .exec();
        ctx.body = post;
    },
    
    uncomment : async(ctx, next) => {
        let comment = getpostInfo.getUserComment(ctx);
        let postId = getpostInfo.getpostId(ctx);

        const post = 
            await Post.findByIdAndUpdate(postId, { $pull: { comments: { _id: comment._id } } }, { new: true })
            .populate('comments.postedBy', '_id name')
            .populate('postedBy', '_id name')
            .exec();
            ctx.body = post;
    }
    
    
    // updateComment = (req, res) => {
    //     let comment = req.body.comment;
    
    //     Post.findByIdAndUpdate(req.body.postId, { $pull: { comments: { _id: comment._id } } })
    //         .exec((err, result) => {
    //             if (err) {
    //                 console.log("No comment found");
    //                 return res.status(400).json({
    //                     error: err
    //                 });
    //             } else {
    //                 Post.findByIdAndUpdate(
    //                     req.body.postId,
    //                     { $push: { comments: comment, updated: new Date() } },
    //                     { new: true }
    //                 )
    //                     .populate('comments.postedBy', '_id name')
    //                     .populate('postedBy', '_id name')
    //                     .exec((err, result) => {
    //                         if (err) {
    //                             return res.status(400).json({
    //                                 error: err
    //                             });
    //                         } else {
    //                             res.json(result);
    //                         }
    //                     });
    //             }
    //     });
    // }
};


module.exports = controller
