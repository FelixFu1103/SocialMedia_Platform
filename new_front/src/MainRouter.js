import React from "react";
import { Route} from "react-router-dom";
import MenuTab from './mainPage/MenuTab';
import ProfileComponent from './mainPage/ProfileComponent';
import UsersComponent from './mainPage/UsersComponent';
import PostsComponent from './mainPage/PostsComponent';
import NewPostComponent from './mainPage/NewPostComponent';
import {Row} from 'antd';

const MainRouter = () => (
    <Route>
        <Row>
            <Route component={MenuTab}/>
            <Route exact path="/profile" component={ProfileComponent} />  
            <Route exact path="/users" component={UsersComponent} />  
            <Route exact path="/recent_posts" component={PostsComponent} />  
            <Route exact path="/new_post" component={NewPostComponent} /> 
        </Row>
          
    </Route>
       

)
export default MainRouter;