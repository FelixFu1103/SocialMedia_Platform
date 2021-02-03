const express = require('express');
const app = express();
app.set('view engine', 'ejs');
app.use(express.static('public'))
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
const expressValidator = require('express-validator');
const fs = require('fs');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

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
server = app.listen(port, () => {
    console.log(`A Node Js API is listening on port: ${port}`);
});

app.get('/chat/AES', (req, res) => {
    res.render('index')
})

const io = require('socket.io')(server,{
    cors: {
        origin: "http://localhost:8080",
        methods: ["GET", "POST"],
        transports: ['websocket', 'polling'],
        credentials: true
    },
    allowEIO3: true
})

var clients = {}
var numClients = 0
var clientToDisconnect = null
var disconnectedClientNum = 0
var updateCount = 0

removeClient = function (sockId) {
    for (var client in clients) {
        if (clients[client]['sockId'] == sockId) {
            clientToDisconnect = client
            disconnectedClientNum = client.charAt(6)
        }
    }
    console.log("Disconnected client: " + clientToDisconnect)
    delete clients[clientToDisconnect]
    var toReplaceNum = disconnectedClientNum
    for (var client in clients) {
        if (parseInt(client.charAt(6)) >= disconnectedClientNum) {
            var currNum = client.charAt(6)
            // console.log(currNum)
            // console.log(disconnectedClientNum)
            clients['Client' + toReplaceNum] = clients['Client' + currNum]
            delete clients['Client' + currNum]
            toReplaceNum++
        }
    }
    console.log(clients)
}

io.on('connection', (socket) => {
    console.log("A user connected")
    numClients++;
    //console.log(numClients + " connected");

    var id = "Client" + (numClients - 1);
    socket.emit('initPublicKeys', { q: 23, alpha: 5, id: id, sockId: socket.id })

    socket.on('disconnect', function () {
        console.log("A user disconnected")
        numClients--;
        //console.log(numClients + " connected");
        console.log(socket.id + " is disconnecting")
        removeClient(socket.id);
    })

    socket.username = "AnonymousUser"

    socket.on('changeUsername', (data) => {
        socket.username = data.username
    })

    socket.on('newMessage', (data) => {
        console.log("Username: " + socket.username + " Enc: " + data.message);
        io.sockets.emit('newMessage', { message: data.message, username: socket.username })
    })

    socket.on('typing', (data) => {
        socket.broadcast.emit('typing', { username: socket.username })
    })

    socket.on('updateYvals', (data) => {
        updateCount++;
        console.log('Inside updateYvals')
        var client = {
            sockId: data.sockId,
            Yval: data.Yval
        }
        clients[data.id] = client
        console.log(clients)

        socket.join(data.id)
        var tmp = updateCount
        setTimeout(function () {
            while (tmp == numClients) {
                for (var client in clients) {
                    var nextId = 0
                    var currId = parseInt(client.charAt(6))
                    var nextId = (currId + 1) % numClients

                    //console.log('Client' + currId + ' inside timeout')
                    console.log('Computenextval from upd sent to ' + 'Client' + nextId + ' from Client' + currId)
                    io.sockets.in('Client' + nextId).emit('ComputeNextYval', { Yval: clients[client]['Yval'], ret: 0, sourceClientId: 'Client' + currId, destClientId: 'Client' + nextId })
                }
                tmp = 0
            }
        }, 5000)
    })

    socket.on('sendToNextClient', (data) => {
        var newYval = data.newYval
        //console.log('New y from ' + data.clientId + ' : ' + newYval)
        var ret = data.ret
        var clientId = data.clientId
        console.log("ClientID: " + clientId + " Ret: " + ret)
        var clientNum = parseInt(clientId.charAt(6))
        if (ret == (numClients - 1)) {
            console.log('AESEncrypt sent to ' + clientId)
            io.sockets.in('Client' + clientNum).emit('AESEncrypt', { Yval: newYval, clientId: clientId })
        } else {
            var nextId = (clientNum + 1) % numClients
            console.log('Computenextval sent to ' + 'Client' + nextId + ' from ' + clientId)
            io.sockets.in('Client' + nextId).emit('ComputeNextYval', { Yval: newYval, ret: ret, sourceClientId: clientId, destClientId: 'Client' + nextId })
        }
    })
})
