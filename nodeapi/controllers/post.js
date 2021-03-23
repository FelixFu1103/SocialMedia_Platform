const Post = require('../models/post');
const formidable = require('formidable');
const fs = require('fs');
const _ = require('lodash');

const postById = (req, res, next, id) => {
    Post.findById(id)
        .populate('postedBy', '_id name')
        .populate('comments.postedBy', '_id name')
        .populate('postedBy', '_id name role')
        .select('_id title body created likes comments photo')
        .exec((err, post) => {
            if (err || !post) {
                return res.status(400).json({
                    error: err
                });
            }
            req.post = post;
            next();
        });
};

// with pagination
// api only

const getPosts = async (req, res) => {
    // get current page from req.query or use default value of 1
    const currentPage = req.query.page || 1;
    // return 3 posts per page
    const perPage = 6;
    let totalItems;

    const posts = await Post.find()
        // countDocuments() gives you total count of posts
        .countDocuments()
        .then(count => {
            totalItems = count;
            return Post.find()
                .skip((currentPage - 1) * perPage)
                .populate('comments', 'text created')
                .populate('comments.postedBy', '_id name')
                .populate('postedBy', '_id name')
                .select('_id title body created likes')
                .limit(perPage)
                .sort({ created: -1 });
        })
        .then(posts => {
            res.status(200).json(posts);
        })
        .catch(err => console.log(err));
};

const createPost = (req, res, next) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: 'Image could not be uploaded'
            });
        }
        console.log("fields: ", fields);
        let post = new Post(fields);
        //console.log("req.profile.hashed_password ", req);
        req.profile.hashed_password = undefined;
        req.profile.salt = undefined;
        post.postedBy = req.profile;
        console.log("new post: ", post);
        console.log("user: ", req.profile);
        console.log("files.photo: ", files.photo);
        console.log("files.photo.path: ", files.photo.path);
        
        if (files.photo) {
            post.photo.data = fs.readFileSync(files.photo.path);
            post.photo.contentType = files.photo.type;
        }
        post.save((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: err
                });
            }
            res.json(result);
        });
    });
};

const postsByUser = (req, res) => {
    Post.find({ postedBy: req.profile._id })
        .populate('postedBy', '_id name')
        .select('_id title body created likes')
        .sort('_created')
        .exec((err, posts) => {
            if (err) {
                return res.status(400).json({
                    error: err
                });
            }
            res.json(posts);
        });
};

const isPoster = (req, res, next) => {
    console.log("req: ", req);
    console.log("req.post: ", req.post);
    console.log("req.auth: ", req.auth);
    let sameUser = req.post && req.auth && req.post.postedBy._id == req.auth._id;
    //let adminUser = req.post && req.auth && req.auth.role === 'admin';

    // console.log("req.post ", req.post, " req.auth ", req.auth);
    // console.log("SAMEUSER: ", sameUser, " ADMINUSER: ", adminUser);

    let isPoster = sameUser || adminUser;

    if (!isPoster) {
        return res.status(403).json({
            error: 'User is not authorized'
        });
    }
    next();
};

const updatePost = (req, res, next) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: 'Photo could not be uploaded'
            });
        }
        // save post
        let post = req.post;
        post = _.extend(post, fields);
        post.updated = Date.now();

        if (files.photo) {
            post.photo.data = fs.readFileSync(files.photo.path);
            post.photo.contentType = files.photo.type;
        }

        post.save((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: err
                });
            }
            res.json(post);
        });
    });
};

const deletePost = (req, res) => {
    let post = req.post;
    post.remove((err, post) => {
        if (err) {
            return res.status(400).json({
                error: err
            });
        }
        res.json({
            message: 'Post deleted successfully'
        });
    });
};

const photo = (req, res, next) => {
    console.log(req.post);
    res.set('Content-Type', req.post.photo.contentType);
    return res.send(req.post.photo.data);
};

const singlePost = (req, res) => {
    return res.json(req.post);
};

const like = (req, res) => {
    console.log("postId: ", req.body.postId);
    console.log("userId: ", req.body.userId);
    Post.findByIdAndUpdate(req.body.postId, { $push: { likes: req.body.userId } }, { new: true }).exec(
        (err, result) => {
            if (err) {
                return res.status(400).json({
                    error: err
                });
            } else {
                console.log("res: ", result);
                res.json(result);
            }
        }
    );
};

const unlike = (req, res) => {
    Post.findByIdAndUpdate(req.body.postId, { $pull: { likes: req.body.userId } }, { new: true }).exec(
        (err, result) => {
            if (err) {
                return res.status(400).json({
                    error: err
                });
            } else {
                res.json(result);
            }
        }
    );
};

const comment = (req, res) => {
    let comment = req.body.comment;
    comment.postedBy = req.body.userId;

    Post.findByIdAndUpdate(req.body.postId, { $push: { comments: comment } }, { new: true })
        .populate('comments.postedBy', '_id name')
        .populate('postedBy', '_id name')
        .exec((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: err
                });
            } else {
                res.json(result);
            }
        });
};

const uncomment = (req, res) => {
    let comment = req.body.comment;

    Post.findByIdAndUpdate(req.body.postId, { $pull: { comments: { _id: comment._id } } }, { new: true })
        .populate('comments.postedBy', '_id name')
        .populate('postedBy', '_id name')
        .exec((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: err
                });
            } else {
                res.json(result);
            }
        });
};


const updateComment = (req, res) => {
    let comment = req.body.comment;

    Post.findByIdAndUpdate(req.body.postId, { $pull: { comments: { _id: comment._id } } }).exec((err, result) => {
        if (err) {
            return res.status(400).json({
                error: err
            });
        } else {
            Post.findByIdAndUpdate(
                req.body.postId,
                { $push: { comments: comment, updated: new Date() } },
                { new: true }
            )
                .populate('comments.postedBy', '_id name')
                .populate('postedBy', '_id name')
                .exec((err, result) => {
                    if (err) {
                        return res.status(400).json({
                            error: err
                        });
                    } else {
                        res.json(result);
                    }
                });
        }
    });
};

exports.postById = postById
exports.getPosts = getPosts
exports.createPost = createPost
exports.postsByUser = postsByUser
exports.isPoster = isPoster
exports.updatePost = updatePost
exports.deletePost = deletePost
exports.photo = photo
exports.singlePost = singlePost
exports.like = like
exports.unlike = unlike
exports.comment = comment
exports.uncomment = uncomment
exports.updateComment = updateComment
