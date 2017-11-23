import React, { Component } from 'react';
import { Input, Upload, Button, Icon, Modal, message } from 'antd'
import SelectUser from '../shared/_user_select'
import Form from '../shared/_form'
import api from '../../models/api'
import utils from '../../utils'
import Editor from 'react-lz-editor'

class EmailForm extends Component {

    state = {}

    componentWillMount() {
        this.loadData();
    }

    loadData = () => {
        const { id, forwardId, replyId } = this.props.location.query;
        if (id || forwardId || replyId) {
            api.Mail.Model(id || forwardId || replyId, data => {
                this.setState({
                    id,
                    replyId,
                    forwardId,
                    ...data
                })
            })
        }
    }

    submitFormData = (callback) => {
        this.refs.form.validateFields((err, values) => {
            let formData = values;
            let toUsers = this.refs.toUsersForm.getSelectedUsers().map(e => { return { InfoId: formData.ID, UserId: e.ID }; });
            let ccUsers = this.refs.ccUsersForm.getSelectedUsers().map(e => { return { InfoId: formData.ID, UserId: e.ID, CC: true, }; });
            formData.Content = this.state.changed ? this.state.content : this.state.model ? this.state.model.Content : '';
            formData.Users = toUsers.concat(ccUsers);
            formData.attachments = this.state.attachments;

            callback(formData);
        });
    }

    handleSave = () => {
        this.submitFormData(data => {
            api.Mail.Save(data, json => {
                //跳转到草稿箱
                utils.Redirect('/email/?type=draft');
            });
        });
    }

    handleSend = () => {
        this.submitFormData(data => {
            if (!data.Users.find(e => !e.CC)) {
                message.error("请选择收件人");
                return false;
            }
            if (!data.Content) {
                message.error("请填写邮件正文");
                return false;
            }
            api.Mail.Send(data, json => {
                //跳转到发件箱
                utils.Redirect('/email/?type=send');
            })
        });
    }

    handleBack = () => {
        if (this.state.changed || (this.state.model === null && !this.state.content)) {
            Modal.confirm({
                title: '提醒',
                content: '邮件内容已经改变，尚未保存！\n你确定取消发送吗？',
                okText: '确认',
                cancelText: '取消',
                onOk: () => {
                    utils.GoBack();
                }
            });
        }
        else {
            utils.GoBack();
        }
    }

    handleUploadChange = ({ file, fileList }) => {
        if (file.status === 'done') {
            let response = file.response
            if (response.Message) {
                message.error(response.Message)
                return;
            }
        }
        this.setState({ attachments: fileList.map(e => e.response) })
    }

    handleContentChange = (content) => {
        this.setState({ content, changed: true })
    }
    getFormItems = () => {
        const model = this.state.model || {}
        const { id, forwardId, replyId } = this.props.location.query;
        var items = [
            { name: 'ID', defaultValue: id || 0, render: <Input type="hidden" /> },
            { name: 'ReplyId', defaultValue: replyId || 0, render: <Input type="hidden" /> },
            { name: 'ForwardId', defaultValue: forwardId || 0, render: <Input type="hidden" /> },
            {
                title: '收件人',
                rules: [{ required: true, message: '请选择收件人' }],
                render: <SelectUser
                    title="选择收件人"
                    multiple={true}
                    ref="toUsersForm"
                    defaultValue={replyId && !id ? [this.state.fromUser] : forwardId && !id ? [] : this.state.toUsers} />
            },
            {
                title: '抄送',
                render: <SelectUser
                    title="选择抄送人"
                    multiple={true}
                    ref="ccUsersForm"
                    nullable={true}
                    defaultValue={replyId && !id ? this.state.toUsers.concat(this.state.ccUsers || []) :forwardId && !id ? [] : this.state.ccUsers} />
            },
            {
                name: 'Subject',
                title: '主题',
                rules: [{ required: true, message: '请填写邮件主题' }],
                defaultValue: (replyId ? "回复：" : forwardId ? "转发：" : '') + (model.Subject || ''),
                render: <Input />
            },
            {
                title: '附件',
                itemLayout: { labelCol: { span: 3 }, wrapperCol: { span: 12 } },
                render: <Upload
                    action={api.File.UploadUrl(0, model.ID, api.Forms.Mail.ID, 'attachments')}
                    onChange={this.handleUploadChange}
                    name="attachments"
                    withCredentials={true}
                    defaultFileList={(this.state.attachments || []).map(file => {
                        return {
                            uid: file.ID,
                            name: file.FileName,
                            status: 'done',
                            reponse: file, // custom error message to show
                            url: api.File.FileUrl(file.ID),
                        }
                    })}
                >
                    <Button> <Icon type="upload" /> 选择文件 </Button>
                </Upload>
            },
            {
                title: '正文',
                render: <Editor
                    cbReceiver={this.handleContentChange}
                    importContent={this.state.content === undefined ? replyId > 0 ? `<p></p><br /><br /><label>------原文---------------------------------------------------------</label><pre><code>${model.Content}</code></pre>` : model.Content : this.state.content}
                    video={false}
                    audio={false}
                    image={false}
                    fullScreen={false}
                />
            }
        ];
        return items;
    }

    render() {
        const { id, forwardId, replyId } = this.props.location.query;

        if ((id || forwardId || replyId) && !this.state.model) {
            return null;
        }

        return (
            <div>
                <div className="toolbar">
                    <Button.Group>
                        <Button icon="mail" type="primary" onClick={this.handleSend}>发送</Button>
                        <Button icon="save" onClick={this.handleSave}>保存草稿</Button>
                        <Button icon="rollback" onClick={this.handleBack}>取消</Button>
                    </Button.Group>
                </div>
                <Form
                    ref="form"
                    title="写邮件"
                    itemLayout={{ labelCol: { span: 3 }, wrapperCol: { span: 18 } }}
                    onSubmit={this.handleSend}
                    children={this.getFormItems()}
                />
            </div>
        );
    }
}

export default EmailForm;