import React, { Component } from 'react'
import { Input, DatePicker, Button, message, Select, Upload, Icon } from 'antd'
import FormModal from '../shared/_formmodal'
import SelectUser from '../shared/_user_select'
import api from '../../models/api'

class SealApplyModal extends Component {
    state = {}
    handleSubmit = formData => {
        let users = this.refs.selectUserForm.getSelectedUsers()
        if (users.length > 0) {
            formData.ApprovalUserId = users[0].ID
        }
        else {
            message.error("请先选择发送人")
            return false
        }

        let sealId = formData.ExtendInfoId;
        if (!sealId) {
            message.error("参数不正确");
            return false;
        }
        if (!formData.ScheduleBeginTime || !formData.ScheduleEndTime) {
            message.error("请选择使用日期")
            return false;
        }

        formData.ScheduleBeginTime = formData.ScheduleBeginTime.format()
        formData.ScheduleEndTime = formData.ScheduleEndTime.format()
        formData.AttachmentId = this.state.file ? this.state.file.ID : 0;
        api.Seal.Apply(formData, infoId => {
            message.success('申请完成，请等待审核');
            if (this.props.onSubmit) {
                this.props.onSubmit(infoId);
            }
        })
    }

    handleSelect = (users) => {
        if (!this.state.canComplete && this.state.result && users && users.length === 0) {
            message.error("请先选择发送人")
            return false
        }
        this.setState({ toUser: users[0] })
    }

    handleUploadAttachment = ({ file }) => {
        switch (file.status) {
            case 'uploading':
                //this.setState({ uploading: true })
                return;
            case 'done':
                //this.setState({ uploading: false })
                if (!file || !file.response) return
                let response = file.response
                if (response.Message) {
                    message.error(response.Message)
                    return;
                }
                if (this.state.file) {
                    api.File.Delete(this.state.file.ID)
                }
                this.setState({ file: response })
                break;
            default:
                //this.setState({ uploading: false })
                break;
        }
    }

    handleDeleteAttachment = () => {
        let fileId = this.state.file.ID;
        this.setState({ file: null })
        api.File.Delete(fileId)
    }

    render() {

        const model = this.props.model || {}
        return (
            <FormModal
                title="申请印章"
                trigger={this.props.trigger || <Button icon="plus" type="primary">申请</Button>}
                onSubmit={this.handleSubmit}
                children={[
                    { name: 'ExtendInfoId', render: <Input type="hidden" /> },
                    { title: '申请印章', render: model.Name },
                    { title: '开始日期', name: 'ScheduleBeginTime', render: <DatePicker />, rules: [{ required: true, message: '请选择开始日期' }], },
                    { title: '结束日期', name: 'ScheduleEndTime', render: <DatePicker />, rules: [{ required: true, message: '请选择结束日期' }], },
                    { title: '申请用途', name: 'Reason', render: <Input type="textarea" autosize={{ minRows: 2, maxRows: 4 }} />, rules: [{ required: true, message: '请填写车辆申请用途' }] },
                    {
                        title: '证明文件',
                        render:
                            <div>
                                <Upload.Dragger
                                    action={api.File.UploadUrl(0, 0, api.Forms.Seal.ID, 'attachment')}
                                    name="attachment"
                                    withCredentials={true}
                                    showUploadList={false}
                                    onChange={this.handleUploadAttachment}
                                    accept=".doc,.docx,.pdf,.tiff,.tif,.jpg,.jpge,.png"
                                >
                                    <p className="ant-upload-text">
                                        <i className="fa fa-file-o"></i>
                                        &nbsp;&nbsp; {this.state.file ? this.state.file.FileName : '支持pdf,jpg,doc,tif格式'}
                                    </p>
                                </Upload.Dragger>
                                {this.state.file ?
                                    <p className="ant-upload-text">
                                        <a onClick={this.handleDeleteAttachment}><Icon type="delete" />&nbsp;删除</a>
                                    </p>
                                    : null}
                            </div>
                    },
                    {
                        title: '审核人',
                        render: <SelectUser
                            formType="flow"
                            flowId={api.Forms.Seal.ID}
                            flowStep={2}
                            onSubmit={this.handleSelect}
                            ref="selectUserForm"
                        />,
                        extend: <span>{(this.state.toUser || {}).ID > 0 ? ' 已选 ' + this.state.toUser.RealName : ''}</span>
                    },
                ]}
            />
        )
    }
}

export default SealApplyModal