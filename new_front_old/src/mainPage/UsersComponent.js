import React from 'react';
import { list } from '../helper/user';
import DefaultProfile from "../images/avatar.jpg";
import { Card } from 'antd';
const { Meta } = Card;

class UsersComponent extends React.Component {
    constructor() {
        super();
        this.state = {
            users: []
        };
    }

    componentDidMount() {
        list().then(data => {
            if (data.error) {
                console.log(data.error);
            } else {
                this.setState({ users: data });
            }
        });
    }
    render(){
        const {users} = this.state;
        return (
            <div style={{marginLeft:80, marginTop:50}}>
                {users.map((user)=> (
                    <Card hoverable style={{ width: 240 }}
                        cover={<img
                            style={{ height: "200px", width: "auto" }}
                            className="img-thumbnail"
                            src={`${process.env.REACT_APP_API_URL}/user/photo/${
                                user._id
                            }`}
                            onError={i => (i.target.src = `${DefaultProfile}`)}
                            alt={user.name}
                        />}
                    >
                        <Meta title={user.name} description={user.email} />
                    </Card>
                ))}
                
            </div>
        )
    }
}

export default UsersComponent;