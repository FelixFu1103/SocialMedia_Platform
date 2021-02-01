import React from 'react';
import { isAuthenticated, signout } from "../helper";
import {withRouter } from 'react-router-dom';
import { read } from '../helper/user';
import DefaultProfile from "../images/avatar.jpg";
import { listByUser } from '../helper/posts';
import { Card, Button } from 'antd';
import history from './History';

class ProfileComponent extends React.Component {
    constructor() {
        super();
        this.state = {
          user: { following: [], followers: [] },
          redirectToSignin: false,
          following: false,
          error: "",
          posts: []
        };
    }
    checkFollow = user => {
        const jwt = isAuthenticated();
        const match = user.followers.find(follower => {
          // one id has many other ids (followers) and vice versa
          return follower._id === jwt.user._id;
        });
        return match;
      };
    
      clickFollowButton = callApi => {
        const userId = isAuthenticated().user._id;
        const token = isAuthenticated().token;
    
        callApi(userId, token, this.state.user._id).then(data => {
          if (data.error) {
            this.setState({ error: data.error });
          } else {
            this.setState({ user: data, following: !this.state.following });
          }
        });
      };
    
      init = userId => {
        const token = isAuthenticated().token;
        read(userId, token).then(data => {
          if (data.error) {
            this.setState({ redirectToSignin: true });
          } else {
            let following = this.checkFollow(data);
            this.setState({ user: data, following });
            this.loadPosts(data._id);
          }
        });
      };
    
      loadPosts = userId => {
        const token = isAuthenticated().token;
        listByUser(userId, token).then(data => {
          if (data.error) {
            console.log(data.error);
          } else {
            this.setState({ posts: data });
          }
        });
      };
    
      componentDidMount() {
        const userId = isAuthenticated().user._id;
        this.init(userId);
      }
    
      componentWillReceiveProps(props) {
        const userId = isAuthenticated().user._id;
        this.init(userId);
      }
    
    render(){
        const {user} = this.state;
        console.log(user)
        return (
            <div className="site-card-border-less-wrapper" style={{marginLeft:50, marginTop:100}}>
                <Card title={user.name} bordered={false} style={{ width: 800 }}>
                    <p>Email: {user.email}</p>
                    <p>{`Joined ${new Date(user.created).toDateString()}`}</p>
                    <p>Following: {user.following.length}</p>
                    <p>Follower: {user.followers.length}</p>
                </Card>
                <Button onClick={() => signout(()=>history.push('/'))}>Sign out</Button>
            </div>
        )
    }
}

export default withRouter(ProfileComponent);