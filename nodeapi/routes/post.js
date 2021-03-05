const express = require('express');
const {
    getPosts,
    writePost,
    postsByUser,
    postById,
    istheSamePoster,
    updatePost,
    deletePost,
    photo,
    singlePost,
    like,
    unlike,
    comment,
    uncomment,
    updateComment
} = require('../controllers/post');
const { requireSignin } = require('../controllers/auth');
const { userById } = require('../controllers/user');
const { createPostValidator } = require('../validator');

const router = express.Router();

router.get('/posts', getPosts);

// like unlike
router.put('/post/like', requireSignin, like);
router.put('/post/unlike', requireSignin, unlike);

// comments
router.put('/post/comment', requireSignin, comment);
router.put('/post/uncomment', requireSignin, uncomment);
router.put('/post/updatecomment', requireSignin, updateComment);

// post routes
// middleware require signin
router.post('/post/new/:userId', requireSignin, writePost, createPostValidator);
router.get('/posts/by/:userId', requireSignin, postsByUser);
router.get('/post/:postId', singlePost);
router.put('/post/:postId', requireSignin, istheSamePoster, updatePost);
router.delete('/post/:postId', requireSignin, istheSamePoster, deletePost);
// photo
router.get('/post/photo/:postId', photo);

router.param('userId', userById);

router.param('postId', postById);

module.exports = router;
