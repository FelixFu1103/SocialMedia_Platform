import React from 'react';
import { isAuthenticated, signout } from "../helper";
import {withRouter } from 'react-router-dom';
import { read, follow, unfollow} from '../helper/user';
import DefaultProfile from "../images/avatar.jpg";
import { listByUser } from '../helper/posts';
import { Button, Checkbox,Row, Col} from 'antd';
import history from './History';
import { recommendfriend} from '../helper/friends';
import { getAllInterests, readInterests, assignInterest, unassignInterest } from '../helper/interest';


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
          selectedInterests: [],
          error: "",
          posts: [],
          recommendfriend: "",
          newInterest : "",
          open : false
        };
    }

      init = userId => {
        const token = isAuthenticated().token;
        read(userId, token).then(data => {
          if (data.error) {
            this.setState({ redirectToSignin: true });
          } else {
            this.setState({ user: data});
            console.log("data >>>" , data);
          }
        });

        readInterests(userId).then(data => {
            if (data.error) {
              this.setState({ redirectToSignin: true });
            } else {
                this.setState({interests: data});
            }
          });
        
        recommendfriend(userId, token).then(data => {
            if (data.error) {
              console.log(data.error);
            } else {
              if (data.jindex > 0.2) {
                this.setState({recommendfriend: data});
              } else {
                console.log("No friends for recommendation");
              }
          }
        } )

        getAllInterests().then(data => {
          if (data.error) {
            console.log(data.error);
          } else {
            this.setState({allInterests: data});
          }
        } )
      };
    

    assignInterests = () => {
      const jwt = isAuthenticated();
      const token = jwt.token;
      const userId = jwt.user._id;
      const userInterests = this.state.selectedInterests;
      console.log("userInterests >>> ", userInterests);
      console.log("userId >>> ", userId);
       
      assignInterest(userId, token, userInterests).then(data => {
        if (data.error) {
          console.log(data.error);
        } else {
          this.setState({interests: userInterests});
        }
        window.location.reload();
      })
    };

    unassignInterests = (interestId) => {
      const jwt = isAuthenticated();
      const token = jwt.token;
      const userId = jwt.user._id;
      
      console.log("interestId >>>", interestId);
      unassignInterest(userId, token, interestId).then(data => {
        if (data.error) {
          console.log(data.error);
        } else {
            console.log("unassigned called");
        }
        window.location.reload();
      })
    };


    followThis = (followId, followName) => {
      const jwt = isAuthenticated();
      const token = jwt.token;
      const userId = jwt.user._id;

      follow(userId, token, followId).then(data => {
        if (data.error) {
            this.setState({ error: data.error });
        } else {
            this.setState({
                open: true,
                msg: `Following ${followName}`
            });
        }
        window.location.reload();
      });
    };


    unfollowThis = (unfollowId, unfollowName) => {
      const jwt = isAuthenticated();
      const token = jwt.token;
      const userId = jwt.user._id;

      unfollow(userId, token, unfollowId).then(data => {
        if (data.error) {
            this.setState({ error: data.error });
        } else {
            this.setState({
                open: true,
                msg: `Unfollowing ${unfollowName}`
            });
        }
        window.location.reload();
      });
    };


    onChange = e => {
      this.setState({selectedInterests : e})
    };

    handleChange = (event) => {
      this.setState({newInterest : event.target.value});
    }

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
        const {user, interests, recommendfriend, allInterests, open, msg} = this.state;     

        // const interests = user.interests;   
        return (
            <div style={{ marginLeft:40, marginTop:20}}  vertical layout>
              <div> 
                <h3>What you like</h3>
                <Row>
                  {Object.keys(interests).length > 0?                 
                  interests.map((value) => (        
                    <ul>
                      {value.title}
                      <Button  type='primary' onClick={() => this.unassignInterests(value._id)}  className="btn  btn-primary" style={{marginLeft:10}}>
                          Remove
                        </Button> 
                    </ul>       
                  )): null }   
                </Row>
                
              </div>

            <div style={{ marginTop:20}} > 
              <h3>Followings</h3>
              <Row>
              {Object.keys(user.following).length > 0? 

                user.following.map((value, index) => (
                <ul> 
                      {value.name}
                      <Button type='primary' onClick={() => this.unfollowThis(value._id, value.name)}  className="btn  btn-primary" style={{marginLeft:10}}>
                        Unfollow
                      </Button> 
                </ul>
                ))
                : null }
              </Row>
              

            </div>
            
            <div style={{  marginTop:20}} > 
              <h3>People you may want to follow</h3>
               {Object.keys(recommendfriend).length > 1?   
                <ul>
                  {recommendfriend.name}
                 <Button  type='primary' onClick={() => this.followThis(recommendfriend.userId, recommendfriend.name)}  className="btn  btn-primary" style={{marginLeft:10}}>
                    Follow
                </Button> 
                </ul>: <ul> No recommendation </ul>} 
            </div>

            <div>
              <h3>Add Your Interests</h3>
               <Checkbox.Group style={{width: "500px"}} options={allInterests.map(column => ({label:column.title, value: column._id}))}  onChange={this.onChange}/>

            </div>

            <Button  onClick={this.assignInterests} className="btn update interests">
                Add
            </Button>


            {open && (
                    <div className="alert alert-success">{msg}</div>
                )}
          </div>
        )
    }
}

export default withRouter(FriendsComponent);