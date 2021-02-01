const express = require('express');
const { createInterest, allInterests, assignInterest, userInterests  } = require('../controllers/interest');
const { requireSignin, hasAuthorization} = require('../controllers/auth');
const {userById} = require("../controllers/user");

const router = express.Router();


// router.get('/interests', getInterest);

// create interests
router.post('/interests',  createInterest);
router.get('/interests',  allInterests);
router.get('/interests/:userId',  userInterests);
// router.post('/interests/:userId', requireSignin, hasAuthorization, assignInterest);
router.put('/interests/', requireSignin, assignInterest);

// any route containing :userId, our app will first execute userByID()
router.param("userId", userById);

module.exports = router;