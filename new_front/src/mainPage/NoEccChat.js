import React, { Component } from "react";
import socket,{ws} from '../helper/socket';
import {Button} from 'antd';


export default class index extends Component {
    state = {
        content:'',
    }
    componentDidMount(){
        socket.initSocket()
        ws.onmessage=(msg)=>{
            let msgdata = JSON.parse(msg.data)
            let msgObj = JSON.parse(msgdata.info);
            let userInfo = localStorage.jwt?JSON.parse(localStorage.jwt):{user:{_id:''}}
            if(!userInfo.user._id||!msgObj.msg) return false
            const chatBody =document.getElementById('chatBody')
            if(msgObj._id==userInfo.user._id){
                const self = document.createElement('div')
                const selfMsg = document.createElement('div')
                const selfImg = document.createElement('div')
                const selfContent=document.createElement('div')
                const selfName = document.createElement('p')
                selfName.className="chat_name"
                selfName.innerHTML=msgObj.name||'guest'
                self.className="chat_self"
                selfMsg.className="chat_msg"
                selfMsg.innerHTML = msgObj.msg
                selfImg.className="chat_img";
                selfImg.innerHTML = `<img src="https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=1235408669,1544530317&fm=26&gp=0.jpg"/>`
                selfContent.appendChild(selfName)
                selfContent.appendChild(selfMsg)
                self.appendChild(selfContent)
                self.appendChild(selfImg)
                chatBody.appendChild(self)
            }else{
                const other = document.createElement('div')
                const otherMsg = document.createElement('div')
                const otherImg = document.createElement('div')
                const otherContent=document.createElement('div')
                const otherName = document.createElement('p')
                otherName.className="chat_name"
                otherName.innerHTML=msgObj.name||'tourist'
                other.className="chat_other"
                otherMsg.className="chat_msg"
                otherMsg.innerHTML = msgObj.msg
                otherImg.className="chat_img";
                otherImg.innerHTML = `<img src="https://dss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=1007923841,2418143080&fm=26&gp=0.jpg"/>`
                other.appendChild(otherImg)
                otherContent.appendChild(otherName)
                otherContent.appendChild(otherMsg)
                other.appendChild(otherContent)
                chatBody.appendChild(other)
            }
        }
    }
    send = ()=>{
        const {content} = this.state;
        if(!content){return false}
        let userInfo = localStorage.jwt?JSON.parse(localStorage.jwt):null
        let userObj = userInfo?{
            _id:userInfo.user._id,
            name:userInfo.user.name,
            msg:content
        }:{
            msg:content
        }
        const sendMsg = {
            info:JSON.stringify(userObj),
        }
        socket.send(JSON.stringify(sendMsg))
        this.setState({content:''})
    }
    clear = ()=>{this.setState({content:''})}
    render() {
        return (
            <div className="flexBox">
                <div className="chatBox">
                    <div className="chatHead"><p>EccChat</p></div>
                    <div className="chatBody" id="chatBody">
                    </div>
                    <div className="chatFooter">
                        <textarea rows={5} style={{resize:'none'}} value={this.state.content} onChange={(e)=>{
                            this.setState({content:e.target.value.trim()})
                        }} />
                        <div className="chat_bt">
                            <Button className="btn btn-raised btn-info chat_btchild" onClick={()=>this.clear()}>clear</Button>
                            <Button type="primary" className="btn btn-raised btn-primary chat_btchild" onClick={()=>this.send()}>send</Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
