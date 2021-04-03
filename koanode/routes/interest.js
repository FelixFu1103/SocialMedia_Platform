const router = require('koa-router')();
const interest = require('../controllers/interest');
const user = require('../controllers/user')
const {userById} = require("../controllers/user");
const jwt = require('../middleware/jwt');


// router.get('/interests', getInterest);

// create interests
// router.post('/interests',  createInterest);
router.get('/interests',  interest.allInterests); // working
router.get('/interests/:userId',  interest.userInterests); // working
// // router.post('/interests/:userId', requireSignin, hasAuthorization, assignInterest);
router.put('/interests/:userId', jwt, interest.assignInterest); // working

// any route containing :userId, our app will first execute userByID()
// router.param("userId", user.userById);

router.delete('/interests', jwt, interest.deleteInterest);
// delete method can not pass data in koa, so use post methood
router.post('/interests/:userId', jwt, interest.unassignInterest);
module.exports = router;