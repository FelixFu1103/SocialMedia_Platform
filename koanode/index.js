
const koa = require('koa');
const mongoose = require('mongoose');
const morgan = require('koa-morgan');
const formidable = require('koa2-formidable');
const bodyParser = require('koa-bodyparser')
const koaBody = require('koa-body');
const convert = require('koa-convert');
const cookieParser = require('koa-cookie-parser');
const koaValidator = require('koa-middle-validator');
const koasession = require('koa-session');
// const expressValidator = require('express-validator');
const cors = require('koa-cors');
const Router = require('koa-router');
const router = new Router();


const dotenv = require('dotenv');
dotenv.config();
const http = require('http');


const app = new koa();

const userRoute = require('./routes/user');
const postRoute = require('./routes/post');
const authRoute = require('./routes/auth');
const interestRoute = require('./routes/interest')
// db
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true
}).then(() => console.log('DB Connected'));

mongoose.connection.on('error', err => {
    console.log(`DB connection error: ${err.message}`);
});

app.use(morgan('dev'));
app.use(koaBody({
    multipart: true,
    keepExtensions : true,
    formidable: {
        maxFileSize: 200*1024*1024    
    }
}));

app.use(bodyParser());
app.use(koaValidator());
app.use(cors());


app.use(userRoute.routes())
  .use(userRoute.allowedMethods())
    .use(postRoute.routes())
    .use(postRoute.allowedMethods())
    .use(authRoute.routes())
    .use(authRoute.allowedMethods())
    .use(interestRoute.routes())
    .use(interestRoute.allowedMethods());

const port = process.env.PORT || 8080;

http.createServer(app.callback()).listen(port, () => console.log(`A Node Js API is listening on port: ${port}`));

//websocket
const WebSocketServer = require('websocket').server;
const ws =  new WebSocketServer({httpServer:http.createServer(app.callback())});
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
