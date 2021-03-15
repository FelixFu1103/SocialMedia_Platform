const koa = require('koa');
const router = require('koa-router')();
const auth = require('../controllers/auth');

// import password reset validator
const validator = require('../validator');
const { userById } = require('../controllers/user');
// validator.userSignupValidator,
// userSigninValidator,
router.post('/signup', auth.signup); // working
router.post('/signin', auth.signin); // working
router.get('/signout', validator.userSigninValidator, auth.logout); // working


//router.param('userId', userById);

module.exports = router;
