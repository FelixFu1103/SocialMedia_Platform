import React from 'react';
import { isAuthenticated, signout } from "../helper";
import {withRouter } from 'react-router-dom';
import { read } from '../helper/user';
import DefaultProfile from "../images/avatar.jpg";
import { Card, Button, Descriptions, Tag, Avatar, Col, Row} from 'antd';
import history from './History';
import {list} from '../helper/posts';
import _ from 'lodash';
import SinglePostComponent from './SinglePostComponent';
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';

const { Meta } = Card;
class ProfileComponent extends React.Component {
    constructor() {
        super();
        this.state = {
          user: {followers: []},
          myPost:[]
        };
    }
    
    componentDidMount() {
      const userId = this.props.match.params.userId;
      const token = isAuthenticated().token;
      list(1).then(data => {
        if (data.error) {
            console.log(data.error);
        } else {
            const temp = _.filter(data, (d) => {return d.postedBy._id === userId})
            this.setState({myPost : temp})
        }
      });
      read(userId, token).then(data => {
        if (data.error) {
          console.log("data.error: ", data.error);
        } else {
          this.setState({ user: data});
        }
      }); 
    }

    returnToHome = () => {
      history.push('/');  
    }

    render(){
        const {user, myPost} = this.state;
        return (
          <div style={{marginLeft:40, marginTop:30}}>
            <Button type="primary" style={{marginLeft:40, backgroundColor:"GrayText"}} onClick={()=>signout(this.returnToHome)}>Sign out</Button>
            <Card title={user.name} bordered={false} style={{ width: 1500 }}>
            
              <Descriptions size="small" column={3}>
                <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
                <Descriptions.Item label="Create Time">{new Date(user.created).toDateString()}</Descriptions.Item>
              </Descriptions>
              <Descriptions size="small" column={10}>
                <Descriptions.Item label="Followers">{_.map(user.followers,(key)=><Tag color="purple">{key.name}</Tag>)}</Descriptions.Item>
              </Descriptions>
            </Card>
            <Row style={{marginTop:30}}>
              {_.map(myPost,(post)=> (
                <Col span={5} offset={1}>
                  <Card
                    style={{ width: 250 }}
                    cover={<img src={`${process.env.REACT_APP_API_URL}/post/photo/${post._id}`} alt={post.title} />}
                    actions={[<SettingOutlined key="setting" />, <EditOutlined key="edit" />, <EllipsisOutlined key="ellipsis" />,]}>
                    <Meta title={post.title} description={post.body}/>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
            
        )
    }
}

export default withRouter(ProfileComponent);