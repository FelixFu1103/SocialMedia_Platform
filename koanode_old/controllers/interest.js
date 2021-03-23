const Interest = require('../models/interest');
const User = require('../models/user');
const _ = require('lodash');
const { UserRefreshClient } = require('google-auth-library');
const getId = require('../middleware/id')
let interest = {
    // const createInterest = async (req, res) => {
    //     const interestExists = await Interest.findOne({ title: req.body.title });
    //     if (interestExists)
    //         return res.status(403).json({
    //             error: 'The interest exists!'
    //         });
        
    //     const interest = await new Interest(req.body);
    //     await interest.save();
    //     res.status(200).json({ message: 'Interest created' });
    // };
    
    
    allInterests : async(ctx, next) => {
        //console.log("ctx: ", ctx);
        const interests = await Interest.find()
        .then(interests => {
            ctx.response.body = interests
        })
        .catch(err => console.log(err));
    },
    
    userInterests : async(ctx, next, id) => {
        console.log("Inside userInterests");

        // req.profile.hashed_password = undefined;
        // req.profile.salt = undefined;
        id = getId(ctx, 11);
        console.log("user id: ", id);
        const user = await User.findById(id).exec();
        console.log("user__: ", user);
        const interests = await Interest.find({_id : { $in : user.interests}}).exec();
        ctx.response.body = interests
        console.log("Interests__: ", interests);
    },
    
    // // assign interests
    // // the second argument of findByIdAndUpdate is the target object
    assignInterest : async(ctx, next, id) => {
        console.log("inside assign interest");
        console.log("ctx.request.body: ", JSON.stringify(ctx.request.body));
        id = getId(ctx, 11);
        let interests = JSON.stringify(ctx.request.body.interests);
        let correctTypedInterests = JSON.parse(interests);
        console.log("interests__: ", correctTypedInterests);
        User.findByIdAndUpdate(id, { $set: { interests: correctTypedInterests} }) 
            .then(res => {
                console.log("success update!")
            })
            .catch(err => console.log(err));
    
    }
    
};

module.exports = interest;
