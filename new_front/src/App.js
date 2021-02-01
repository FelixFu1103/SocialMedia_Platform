
import React from "react";
import { BrowserRouter } from "react-router-dom";
import MainRouter from "./MainRouter";
import 'antd/dist/antd.css';

const App = () => (
    <BrowserRouter>
        <MainRouter />
    </BrowserRouter>
);

export default App;
