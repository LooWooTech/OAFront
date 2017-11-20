import React, { Component } from 'react';
import { Input, Upload, Button, Icon, Modal, message } from 'antd'
import SelectUser from '../shared/_user_select'
import Form from '../shared/_form'
import api from '../../models/api'
import utils from '../../utils'
import Editor from './_editor'

class EmailForm extends Component {

    state = {
        id: this.props.location.query.forwardId || 0,
        forwardId: this.props.location.query.forwardId || 0,
    }

    componentWillMount() {
        this.loadData(this.state.id, this.state.forwardId);
    }

    loadData = (id, forwardId) => {
        if (id || forwardId) {
            api.Mail.Model(id || forwardId, data => {
                this.setState({
                    id,
                    forwardId,
                    model: data,
                    attachments: data.Attachments,
                })
            })
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.location.query.forwardId !== this.state.forwardId
            || nextProps.location.query.id !== this.state.id
        ) {
            this.loadData(nextProps.location.query.id || 0, nextProps.location.query.forwardId || 0);
        }
    }


    submitFormData = (callback) => {
        this.refs.form.validateFields((err, values) => {
            var formData = values;
            formData.ToUserIds = this.refs.toUsersForm.getSelectedUsers().map(e => e.ID).join();
            formData.CcUserIds = this.refs.ccUsersForm.getSelectedUsers().map(e => e.ID).join();
            formData.Content = this.state.content;
            formData.attachments = this.state.attachments;
            formData.Content = this.refs.editor.getContent() || '';

            if (!formData.ToUserIds) {
                message.error("请选择收件人");
                return false;
            }
            if (!formData.Content) {
                message.error("请填写邮件正文");
                return false;
            }
            console.log(formData);
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
                content: '你确定取消发送吗？',
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

    handleUploadFile = ({ file, fileList }) => {
        this.setState({ uploading: false })
        if (!file || !file.response) return
        let response = file.response
        if (response.Message) {
            message.error(response.Message)
            return;
        }
        this.setState({ attachments: fileList.map(e => e.response) })
    }

    handleDeleteFile = (file) => {

    }

    getFormItems = () => {
        const model = this.state.model || {}
        var items = [
            { name: 'ID', defaultValue: this.state.id || 0, render: <Input type="hidden" /> },
            { name: 'ForwardId', defaultValue: this.state.forwardId, render: <Input type="hidden" /> },
            {
                title: '收件人',
                rules: [{ required: true, message: '请选择收件人' }],
                render: <SelectUser
                    title="选择收件人"
                    multiple={true}
                    ref="toUsersForm"
                    defaultValue={model.ToUsersIds} />
            },
            {
                title: '抄送',
                render: <SelectUser
                    title="选择抄送人"
                    multiple={true}
                    ref="ccUsersForm"
                    nullable={true}
                    defaultValue={model.CcUserIds} />
            },
            {
                name: 'Subject',
                title: '主题',
                rules: [{ required: true, message: '请填写邮件主题' }],
                defaultValue: model.Subject,
                render: <Input />
            },
            {
                title: '附件',
                itemLayout: { labelCol: { span: 3 }, wrapperCol: { span: 12 } },
                render: <Upload
                    action={api.File.UploadUrl(0, model.ID, api.Forms.Mail.ID, 'attachments')}
                    onChange={this.handleUploadFile}
                    name="attachments"
                    onRemove={this.handleDeleteFile}
                    withCredentials={true}
                    defaultFileList={this.state.attachments || []}
                >
                    <Button> <Icon type="upload" /> 选择文件 </Button>
                </Upload>
            },
            {
                title: '正文',
                render: <Editor ref="editor" />
            }
        ];

        return items;
    }

    render() {
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