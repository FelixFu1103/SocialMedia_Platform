const Interest = require('../models/interest');
const User = require('../models/user');
const _ = require('lodash');
const { UserRefreshClient } = require('google-auth-library');
const getId = require('../middleware/id')
let interest = {

    
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
        console.log("user id: ", id);
        let interests = JSON.stringify(ctx.request.body.interests);
        let correctTypedInterests = JSON.parse(interests);
        console.log("interests__: ", correctTypedInterests);
        const updatedinterests = 
        await User.findByIdAndUpdate(id, { $addToSet: { interests:{ $each: correctTypedInterests} } }) 
                    .exec();
        ctx.response.body = updatedinterests
    
    },
    deleteInterest : async(ctx,next) => {
        
    },
    unassignInterest : async(ctx, id, next) => {
        console.log("inside unassignInterest");
        console.log("id: ", JSON.stringify(id));
        id = getId(ctx, 11);
        console.log("user id: ", id);
        //let interest = JSON.stringify(ctx.);
        let interestId = JSON.stringify(ctx.request.body.interests);
        console.log("interestId: ", interestId);
        let correctTypedInterestId = JSON.parse(interestId);

        const updated = 
        await User.findByIdAndUpdate(id, { $pull: { interests:  correctTypedInterestId} }) 
                  .exec();
        ctx.response.body = updated
    }
};

module.exports = interest;
