var URL = "127.0.0.1:8080"
var lockReconnect=false;//if there is a successful connection
var timeoutnum = null;
var serverTimeoutObj = null;
var timeout = 6000;
var timeoutObj = null;
var times = 0;
var heartTimes =0;
var ws = null;
export {ws}
export default {
        //websocket connection
        initSocket() {
            // socket instance
            const userInfo = localStorage.jwt?JSON.parse(localStorage.jwt):{user:{_id:''}}
            ws = new WebSocket(`ws://${process.env.REACT_APP_WS_URL}/${userInfo.user._id}`)
            // listen socket connection
            ws.onopen = this.open.bind(this)
            // listen socket error msg
            ws.onerror = this.error.bind(this)
            // listen socket msg
            ws.onmessage = this.getMessage.bind(this)
            //close listening
            ws.onclose = this.onclose.bind(this)
        },
        open() {
            times = 0
            let un = localStorage.getItem('userName')
            let newKey = localStorage.getItem('key')
            if(newKey&&un&&localStorage.getItem('token')){
                let sendMsg = [{name:un,key:newKey}]
                this.send(JSON.stringify(sendMsg))
            }
            this.start()

            console.log('\n' + " %c websocket connect successfully " + '\n', 'color: white; background: #009999; padding:5px 0; font-size:12px;');
        },
        error() {
            console.log("connect error")
            this.reconnect()
        },
        getMessage(msg) {
            // lockReconnect = true
            // clearInterval(serverTimeout)
            this.reset()
            console.log(msg);

        },
        send(data) {
            ws.send(data)
            console.log('\n' + " %c msg sent " + '\n', 'color: white; background: #009999; padding:5px 0; font-size:12px;');
        },
        close() {
            ws.close()
        },
        onclose(){
                console.log("socket closed")
                heartTimes = 0
                this.reconnect()
        },
        reconnect() {//reconnect
            if(lockReconnect) {
                return;
            }
            lockReconnect = true;
            times++;
            console.log('\n' + " %c "+times+"reconnect WebSocket... " + '\n', 'color: white; background: #009999; padding:5px 0; font-size:12px;');
            //没连接上会一直重连，设置延迟避免请求过多
            timeoutnum && clearTimeout(timeoutnum);
            timeoutnum = setTimeout(()=> {
                //new connection
                this.initSocket();
                lockReconnect = false;
            },3000);
        },
        reset(){//reset
            //clear time
            clearTimeout(timeoutObj);
            clearTimeout(serverTimeoutObj);
            //restart
            this.start();
        },
        start(){//start
            if(localStorage.getItem('userName')){
                timeoutObj && clearTimeout(timeoutObj);
                serverTimeoutObj && clearTimeout(serverTimeoutObj);
                timeoutObj = setTimeout(()=>{
                    //sent to backend，
                    if (ws.readyState == 1) {//if connection is good
                        heartTimes++;
                        ws.send(`${localStorage.getItem('userName')} ${heartTimes}`);
                    }else{//reconnect
                        this.reconnect();
                    }
                    serverTimeoutObj = setTimeout(()=>{
                        //close
                        ws.close();
                    }, timeout);
                },timeout)
            }
        },
}
