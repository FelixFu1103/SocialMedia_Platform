let getPostInfo = {
    getpostId : (context) => {
        let postInfo = JSON.stringify(context.request.body);
        let postInfoJson = JSON.parse(postInfo);
        let postId = postInfoJson.postId;
        return postId;
    },

    getuserId : (context) => {
        let postInfo = JSON.stringify(context.request.body);
        let postInfoJson = JSON.parse(postInfo);
        let userId = postInfoJson.userId;
        return userId;
    },
    
    getUserComment : (context) => {
        let postInfo = JSON.stringify(context.request.body);
        let postInfoJson = JSON.parse(postInfo);
        let comment = postInfoJson.comment;
        return comment;
    },
    getUserFollowId : (context) => {
        let postInfo = JSON.stringify(context.request.body);
        let postInfoJson = JSON.parse(postInfo);
        return postInfoJson.followId;
    },
    getUserunFollowId : (context) => {
        let postInfo = JSON.stringify(context.request.body);
        let postInfoJson = JSON.parse(postInfo);
        return postInfoJson.unfollowId;
    },
    getUserId : (context) => {
        let postInfo = JSON.stringify(context.request.body);
        let postInfoJson = JSON.parse(postInfo);
        return postInfoJson.userId;
    },
};




module.exports = getPostInfo;