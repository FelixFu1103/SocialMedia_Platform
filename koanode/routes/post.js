const koa = require('koa');
const koaJwt = require('koa-jwt');
const router = require('koa-router')();
const post =  require('../controllers/post');
const jwt = require('../middleware/jwt');

const { userById } = require('../controllers/user');
const validator = require('../validator');




router.get('/posts', post.getPosts); // working

// like unlike
router.put('/post/like', jwt, post.like); // working
router.put('/post/unlike', jwt, post.dislike); // working

// // comments

router.put('/post/comment', jwt, post.comment); // working
router.put('/post/uncomment', jwt, post.uncomment); // working
// router.put('/post/updatecomment', requireSignin, updateComment);

// // post routes
// // middleware require signin
router.post('/post/new/:userId', jwt, post.writePost, validator.writePostValidator); // inprogress
router.get('/posts/by/:userId', jwt, post.postsByUser); // working
// do single poist before do the delete operation
router.get('/post/:postId', post.singlePost); // working
// // middleware check if its same user
// router.put('/post/:postId', requireSignin, istheSamePoster, updatePost);
router.delete('/post/:postId', jwt, post.istheSamePoster, post.deletePost); // working

// // get the photo itself
router.get('/post/photo/:postId', post.getPostPhoto); // working

// router.param('userId', userById);

// router.param('postId', post.postById);

module.exports = router;
