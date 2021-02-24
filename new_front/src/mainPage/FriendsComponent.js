import React from 'react';
import { isAuthenticated, signout } from "../helper";
import {withRouter } from 'react-router-dom';
import { read } from '../helper/user';
import DefaultProfile from "../images/avatar.jpg";
import { listByUser } from '../helper/posts';
import { Card, Button, Checkbox } from 'antd';
import history from './History';
import { recommendfriend } from '../helper/friends';
import { getAllInterests, readInterests, assignInterest } from '../helper/interest';


class FriendsComponent extends React.Component {
    constructor() {
        super();
        this.state = {
          user: { following: [], followers: [] },
          redirectToSignin: false,
          following: false,
          interests: [],
          allInterests: [],
          changedInterests: [],
          error: "",
          posts: [],
          recommendfriend: "",
        };
        // this.onChange = this.onChange.bind(this);

    }

      init = userId => {
        const token = isAuthenticated().token;
        read(userId, token).then(data => {
          console.log("data >>> ", data);
          if (data.error) {
            this.setState({ redirectToSignin: true });
          } else {
            this.setState({ user: data});
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
              if (data.jindex > 0.2) {
                this.setState({recommendfriend: data});
                console.log("recommendfriend work");
              } else {
                console.log("No friends for recommendation");
              }
          }
        } )

        getAllInterests().then(data => {
          if (data.error) {
            console.log("Get all interests failed");
          } else {
            this.setState({allInterests: data});
            console.log("recommendfriend work");
          }
        } )
      };
    

    updateInterests = () => {
      const jwt = isAuthenticated();
      const token = jwt.token;
      const userId = jwt.user._id;
      const userInterests = this.state.changedInterests;
      assignInterest(userId, token, userInterests).then(data => {
        if (data.error) {
          console.log("Assign interest failed");
        } else {
          console.log("Assign interest work");
        }
        window.location.reload();
      })
    };


    onChange = e => {
      this.setState({changedInterests : e})
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
        const {user, interests, recommendfriend, allInterests} = this.state;     

        // const interests = user.interests;   
        return (
            <div style={{ marginLeft:20, marginTop:20}}  vertical layout>
              <div> 
                <h3>Your Interests</h3>
                <ul>
                    {interests.map((value, index) => {
                        return <li> {value.title}</li>
                    })}
                </ul>
              </div>
            <div> 
              <h3>Recommending Friends</h3>
              <ul>
                {recommendfriend.name}
              </ul>
            </div>
            <div>
              <h3>Edit Your Interests</h3>
              <Checkbox.Group style={{width: "500px"}} options={allInterests.map(column => ({label:column.title, value: column._id}))}  onChange={this.onChange}/>
            </div>

            <button  onClick={this.updateInterests} className="btn  btn-primary">
                Update interests
            </button>
          </div>
        )
    }
}

export default withRouter(FriendsComponent);