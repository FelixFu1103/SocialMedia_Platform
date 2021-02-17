import React from 'react';
import { isAuthenticated, signout } from "../helper";
import {withRouter } from 'react-router-dom';
import { read } from '../helper/user';
import DefaultProfile from "../images/avatar.jpg";
import { listByUser } from '../helper/posts';
import { Card, Button, Checkbox } from 'antd';
import history from './History';
import { readInterests, recommendfriend } from '../helper/friends';

class FriendsComponent extends React.Component {
    constructor() {
        super();
        this.state = {
          user: { following: [], followers: [], interests: [] },
          redirectToSignin: false,
          following: false,
          interests: [],
          error: "",
          posts: [],
          recommendfriend: ""
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
          console.log("data >>> ", data);
          if (data.error) {
            this.setState({ redirectToSignin: true });
          } else {
            let following = this.checkFollow(data);
            this.setState({ user: data});
            this.loadPosts(data._id);
          }
        });

        readInterests(userId).then(data => {
            if (data.error) {
              this.setState({ redirectToSignin: true });
            } else {
                this.setState({interests: data});
                console.log("readInterests work");
            }
          });
        
        recommendfriend(userId, token).then(data => {
            if (data.error) {
              console.log("Recommending friends failed");
            } else {
              this.setState({recommendfriend: data});
              console.log("recommendfriend work");
          }


        } )

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
        // const interests = this.state.user.interests;
        const {user} = this.state;     
        const {interests} = this.state;
        const {recommendfriend} = this.state;
        // const interests = user.interests;   
        return (
            <div vertical layout>
              <div> 
              <h1>Your Interests</h1>
              <ul>
                  {interests.map((value, index) => {
                      return <li> {value.title}</li>
                  })}
            </ul>
            </div>
            <div> 
              <h1>Recommending Friends</h1>
              <ul>
                {recommendfriend.name}
              </ul>
            </div>
            
            <Checkbox>checkbox</Checkbox>

           </div>

        )
        

    }
}

export default withRouter(FriendsComponent);