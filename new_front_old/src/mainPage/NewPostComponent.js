import React from 'react';
import {isAuthenticated} from '../helper';
import {create} from '../helper/posts';
import { Form, Input, message, Button, Upload } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import './style.css';

function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
}
  
function beforeUpload(file) {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
}
class NewPostComponent extends React.Component {
    constructor() {
        super();
        this.state = {
            title: "",
            content: "",
            photo: "",
            error: "",
            user: {},
            fileSize: 0,
            loading: false,
            redirectToProfile: false
        };
    }
    componentDidMount() {
        this.setState({ user: isAuthenticated().user });
    }
    handlePhotoChange = info => {
        if (info.file.status === 'uploading') {
          this.setState({ loading: true });
          return;
        }
        if (info.file.status === 'done') {
          // Get this url from response in real world.
          getBase64(info.file.originFileObj, imageUrl =>
            this.setState({
              imageUrl,
              loading: false,
            }),
          );
        }
    };
    onFinish = (values) => {
        const postData = new FormData();
        const userId = isAuthenticated().user._id;
        const token = isAuthenticated().token;
        postData.set("title", values.title);
        postData.set("body", values.body);
        postData.set("photo", values.photo.file);
        create(userId, token, postData);
        this.setState({title: values.title, content: values.content})
    }
    render(){
        const { loading, imageUrl } = this.state;
        const uploadButton = (
        <div>
            {loading ? <LoadingOutlined /> : <PlusOutlined />}
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
        );
        return (
            <div style={{marginTop:150, marginLeft:400}}>
                <Form className="newPostForm" onFinish={this.onFinish}>
                    <Form.Item name="title" label="Title" rules={[{required: true,message: 'Please input your Title!',},]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="body" label="Content" rules={[{required: true,message: 'Please input your Content!',},]}>
                        <Input.TextArea style={{minHeight:200}}/>
                    </Form.Item>
                    <Form.Item name="photo" label="Photo" rules={[{required: true,message: 'Please upload your Photo!',},]}>
                        <Upload
                            name="avatar"
                            listType="picture-card"
                            className="avatar-uploader"
                            showUploadList={false}
                            action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                            beforeUpload={beforeUpload}
                            onChange={this.handlePhotoChange}>
                            {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
                        </Upload>
                    </Form.Item>
                    <Button type="primary" htmlType="submit" style={{marginTop:50, marginLeft:250}}>Submit</Button>
                </Form>
            </div>
        )
    }
}
export default NewPostComponent;