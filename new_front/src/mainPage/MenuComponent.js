import React from 'react';
import { Menu, Button } from 'antd';
import { Link} from 'react-router-dom';
import {AppstoreOutlined,MenuUnfoldOutlined,MenuFoldOutlined,PieChartOutlined,DesktopOutlined,ContainerOutlined,MailOutlined,} from '@ant-design/icons';

const { SubMenu } = Menu;
class MenuComponent extends React.Component {
    state = {
        collapsed: false,
    };
    toggleCollapsed = () => {
        this.setState({
          collapsed: !this.state.collapsed,
        });
    };
    render() {
        return (
            <div style={{ width: 256, height:900, backgroundColor: this.state.collapsed?"white":"black"}}>
                <Button type="primary" onClick={this.toggleCollapsed} style={{ marginBottom: 16 }}>
                {React.createElement(this.state.collapsed ? MenuUnfoldOutlined : MenuFoldOutlined)}
                </Button>
                <Menu defaultSelectedKeys={['recentPosts']} defaultOpenKeys={['posts']} mode="inline" theme="dark" inlineCollapsed={this.state.collapsed}>
                <Menu.Item key="profile" icon={<PieChartOutlined />}>
                    <Link to="/profile">Profile</Link>
                </Menu.Item>
                <Menu.Item key="users" icon={<DesktopOutlined />}>
                    <Link to="users">Users</Link>
                </Menu.Item>
                <Menu.Item key="friends" icon={<ContainerOutlined />}>
                    <Link to="find_friends">Find Friends</Link>
                </Menu.Item>
                <SubMenu key="posts" icon={<MailOutlined />} title="Posts">
                    <Menu.Item key="recentPosts"><Link to="recent_posts">Recent Posts</Link></Menu.Item>
                    <Menu.Item key="newPost"><Link to="new_post">New Post</Link></Menu.Item>
                </SubMenu>
                <SubMenu key="chatting" icon={<AppstoreOutlined />} title="Chatting">
                    <Menu.Item key="no"><Link to="no_securty">No security</Link></Menu.Item>
                    <Menu.Item key="rsa"><Link to="RSA">RSA</Link></Menu.Item>
                    <Menu.Item key="ecc"><Link to="ECC">ECC</Link></Menu.Item>
                </SubMenu>
                </Menu>
            </div>
        )
    }
}

export default MenuComponent;