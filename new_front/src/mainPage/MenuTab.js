import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { signout, isAuthenticated } from '../helper';
import LoginComponent from './LoginComponent';
import MenuComponent from './MenuComponent';

class MenuTab extends React.Component {
    render() {
        return (
            <div>
                {console.log(isAuthenticated())}
                {isAuthenticated() ? <MenuComponent/>:<LoginComponent/>}
            </div>
        )
    }
}

export default MenuTab;