import React from 'react';
import { list } from '../helper/user';
import { Table, Tag, Space } from 'antd';

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
    columns = [
        {
          title: 'Name',
          dataIndex: 'name',
          key: 'name',
          width:'200px',
          render: text => <a>{text}</a>,
        },
        {
          title: 'Start Date',
          dataIndex: 'created',
          key: 'created',
          width:'300px',
          render: text => <Space>{new Date(text).toDateString()}</Space>
        },
        {
          title: 'Email',
          dataIndex: 'email',
          key: 'email',
          width:'300px',
        },
        /*{
          title: 'Follower',
          key: 'followers',
          dataIndex: 'followers',
          width:'300px',
          sorter: (a, b) => a.followers.length - b.followers.length,
          render: followers => <Space>{followers.length}</Space> 
        },
        {
            title: 'Following',
            key: 'following',
            dataIndex: 'following',
            width:'300px',
            sorter: (a, b) => a.followers.length - b.followers.length,
            render: followers => <Space>{followers.length}</Space> 
          },*/
      ];

    render(){
        const {users} = this.state;
        return (
            <div style={{marginLeft:80, marginTop:50}}>
                {console.log(users)}
                <Table columns={this.columns} dataSource={users}/>
            </div>
        )
    }
}

export default UsersComponent;