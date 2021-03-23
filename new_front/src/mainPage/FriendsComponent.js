import React from 'react';
import { isAuthenticated, signout } from "../helper";
import {withRouter } from 'react-router-dom';
import { read } from '../helper/user';
import DefaultProfile from "../images/avatar.jpg";
import { listByUser } from '../helper/posts';
import { Button, Checkbox,Form, Input } from 'antd';
import history from './History';
import { recommendfriend, follow } from '../helper/friends';
import { getAllInterests, readInterests, assignInterest, addInterest } from '../helper/interest';


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
    

    updateInterests = () => {
      const jwt = isAuthenticated();
      const token = jwt.token;
      const userId = jwt.user._id;
      //const userInterests = this.state.changedInterests;
      const userInterests = this.state.selectedInterests;
      assignInterest(userId, token, userInterests).then(data => {
        if (data.error) {
          console.log(data.error);
        } else {
          this.setState({interests: userInterests});
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
      });
    };

    // componentDidMount() {
    //   const userId = isAuthenticated().user._id;
    //   this.init(userId);
    
    createInterest = () => {
      const oneInterest = this.state.newInterest;
      addInterest(oneInterest).then (data =>{
        if (data.error) {
          this.setState({ error: data.error });
      } else {
        this.setState({
                open: true,
                msg: `${oneInterest} was added into interest list`  
            });
      }
      });
    }

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
        //const {user, interests, recommendfriend, allInterests} = this.state; 
        const {user, interests, recommendfriend, allInterests, open, msg} = this.state;     

        // const interests = user.interests;   
        return (
            <div style={{ marginLeft:40, marginTop:20}}  vertical layout>
              <div> 
                <h3>What you like</h3>
                <ul>
                  {this.state.interests.map((value, index) => {
                        return <li> {value.title}</li>
                    })}
                </ul>
              </div>
            <div>
              <div style={{  marginTop:20}} >
              <h3>Recommending Friends</h3>
              <ul>
                {recommendfriend.name}
              </ul>
            </div>
               {Object.keys(recommendfriend).length > 1? 
                <ul>
                  {recommendfriend.name}

                 <button  onClick={() => this.followThis(recommendfriend.userId, recommendfriend.name)}  className="btn  btn-primary" style={{marginLeft:10}}>
                    Follow
                </button> 
                </ul>: <ul> No recommendation </ul>} 

              </div> 

            <div>
            <h3>Edit Your Interests</h3>
              <Checkbox.Group style={{width: "500px"}} options={allInterests.map(column => ({label:column.title, value: column._id}))}  onChange={this.onChange}/>
              <h3>Choose Your Interests</h3>
               <Checkbox.Group style={{width: "500px"}} options={allInterests.map(column => ({label:column.title, value: column._id}))}  onChange={this.onChange}/>

            </div>

            <Button  onClick={this.updateInterests} className="btn update interests">
                Update interests
            </Button> 

            <div style={{marginTop:20}} >
              <h3>Add A New Interest</h3>
              <input 
                type="text" 
                id="userInput"  
                onChange={this.handleChange}
              />
              <button onClick={this.createInterest} className="btn add interest" style={{marginLeft:10}}>
                    Add
              </button> 
            </div>
            {open && (
                    <div className="alert alert-success">{msg}</div>
                )}
          </div>
        )
    }
}

export default withRouter(FriendsComponent);