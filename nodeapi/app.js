const express = require('express');
const app = express();
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
const expressValidator = require('express-validator');
const fs = require('fs');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
const http = require('http');
const server = http.createServer(app);

// db
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true
}).then(() => console.log('DB Connected'));

mongoose.connection.on('error', err => {
    console.log(`DB connection error: ${err.message}`);
});

// bring in routes
const postRoutes = require('./routes/post');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const interestRoutes = require('./routes/interest');

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    next();
});

// apiDocs
app.get('/', (req, res) => {
    fs.readFile('allApis/apis.json', (err, data) => {
        if (err) {
            res.status(400).json({
                error: err
            });
        }
        const docs = JSON.parse(data);
        res.json(docs);
    });
});

// middleware -
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(expressValidator());
app.use(cors());
app.use('/api', postRoutes);
app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', interestRoutes);
app.use(function(err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        res.status(401).json({ error: 'Unauthorized!' });
    }
});

const port = process.env.PORT || 8080;
server.listen(port, () => {
    console.log(`A Node Js API is listening on port: ${port}`);
});

//websocket
const WebSocketServer = require('websocket').server;
const ws =  new WebSocketServer({httpServer:server});
//connect
ws.on('request',(req)=>{
    const userInfo = req.resource.replace('/','')
    const connection = req.accept(null,req.origin)
    connection.on('message',function(msg){
        let data = JSON.parse(msg.utf8Data)
        ws.connections.map((item,index)=>{
            item.send(JSON.stringify(data))
        })
    })

    //break
    connection.on('close',function(reasonCode,description){
        // console.log(`\x1B[31m${'user'}disconnected>>>>>>`);
    })
})
