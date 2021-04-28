import React, {createElement} from 'react';
import { Comment, Tooltip, Row, Col, Switch} from 'antd';
import { LikeOutlined, LikeFilled } from '@ant-design/icons';
import moment from 'moment';
import {isAuthenticated} from '../helper';
import {remove, like, unlike} from '../helper/posts';
import DefaultPost from "../images/mountains.jpg";

class SinglePostComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            like: this.checkLike(this.props.post.likes),
            likes: this.props.post.likes.length,
            comments: [],
            showImg: false
        }
    }
    updateComments = comments => {
        this.setState({ comments });
    };
    onChange = () => {
        const temp = !this.state.showImg;
        this.setState({showImg: temp})
    }
    likeToggle = () => {
        let callApi = this.state.like ? unlike : like;
        const userId = isAuthenticated().user._id;
        const postId = this.props.post._id;
        const token = isAuthenticated().token;

        callApi(userId, token, postId).then(data => {
            if (data.error) {
                console.log(data.error);
            } else {
                this.setState({
                    like: !this.state.like,
                    likes: data.likes.length
                });
            }
        });
    };
    deletePost = () => {
        const token = isAuthenticated().token;
        remove(this.props.post._id, token);
        window.location.reload();
    };
    checkLike = (likes) => {
        const userId = isAuthenticated().user._id;
        likes.map((id)=>{
            if (id === userId) {
                return true;
            }
        })
        return false;
    }
    render(){
        const {post} = this.props;
        const actions = [
            <Tooltip key="comment-basic-like" title="Like">
              <span onClick={this.likeToggle}>
                {createElement(this.state.like ? LikeFilled : LikeOutlined)}
                <span className="comment-action">{this.state.likes}</span>
              </span>
            </Tooltip>,
            <span key="comment-basic-reply-to">Reply to</span>,
            isAuthenticated().user._id===post.postedBy._id?<span onClick={this.deletePost} key="comment-basic-delete">delete</span>:null,
          ];
        return (
           <div>
           <Comment actions={actions} author={<a>{post.postedBy.name}</a>} 
                content={
                    <div>
                        <p>{post.title}</p>
                        <br/>
                        <p>{post.body}</p>   
                        {this.state.showImg?<img src={`${process.env.REACT_APP_API_URL}/post/photo/${post._id}`} alt={post.title} 
                        onError={i =>(i.target.src = `${DefaultPost}`)} style={{'width':200, 'height':200}}/>:null}   
                    </div>
                }
                datetime={<Tooltip title={moment(post.created).format('YYYY-MM-DD HH:mm:ss')}>
                    <span>{moment(post.created).fromNow()}</span>
                    <Switch checked={this.state.showImg} unCheckedChildren="more" onChange={this.onChange} />
                    </Tooltip>}
            />
            
            </div>
        )
    }
}

export default SinglePostComponent;