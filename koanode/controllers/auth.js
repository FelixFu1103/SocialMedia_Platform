const jwt = require('jsonwebtoken');
require('dotenv').config();
//const koaJwt = require('koa-jwt');
//const jwt = require('../middleware/jwt');
const User = require('../models/user');
const _ = require('lodash');


let controllers = {
    // sign up new user
    signup : async (ctx, next) => {
        console.log("sign up request: ", ctx.request);
        const hasUser = await User.findOne({email: ctx.request.body.email});
        //console.log("has user: ", hasUser);
        if (hasUser) {
            ctx.throw(403, 'Email is taken!');
        } else {
            const user = await new User(ctx.request.body);
            await user.save();

            ctx.throw(200, 'Signup success! Please login!');
        }
        
    },
    // // sign existed user in
    signin : async (ctx, next) => {
        // find the user based on email
        console.log("inside signin");
        const { email, password } = ctx.request.body;
        await User.findOne({ email }, (err, user) => {
            // if err or no user
            if (err || !user) {
            
                ctx.response.body = ({error : 'User with that email is not existed!'})

            } else if (!user.authenticate(password)) {     // if user existed, check if plain text password match with encrypted password
                ctx.response.body = ({error :  'Email and password do not match'});
            } else {
                //console.log("sign up");
                // generate a token with user id and secret
                const token = jwt.sign({ _id: user._id, role: user.role }, process.env.JWT_SECRET);
                console.log("token: ", token);
                // // put the token as 'ck' in cookie with expiry date

                ctx.cookies.set('ck', token, { expire: new Date() + 9999 });
                // // return back responses to front end
                const { _id, email, name, role } = user;
                // signin
                ctx.response.body = ({ token, user: { _id, email, name, role } });
            }
        });
    },


    logout : async (ctx, next) => {
        ctx.cookies.set('ck', null);
        ctx.response.body = ({ message: 'Logout success!' });
    }

};

module.exports = controllers;