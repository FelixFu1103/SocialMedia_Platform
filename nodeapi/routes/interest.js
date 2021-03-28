const express = require('express');
const { createInterest, deleteInterest, allInterests, userInterests, assignInterest, unassignInterest } = require('../controllers/interest');
const { requireSignin, hasAuthorization} = require('../controllers/auth');
const {userById} = require("../controllers/user");

const router = express.Router();


// router.get('/interests', getInterest);

// create interests
router.post('/interests',  createInterest);
router.delete('/interests', requireSignin, deleteInterest);
router.get('/interests',  allInterests);
router.get('/interests/:userId',  userInterests);
// router.post('/interests/:userId', requireSignin, hasAuthorization, assignInterest);
router.put('/interests/:userId', requireSignin, assignInterest);
router.delete('/interests/:userId', requireSignin, unassignInterest);

// any route containing :userId, our app will first execute userByID()
router.param("userId", userById);

module.exports = router;