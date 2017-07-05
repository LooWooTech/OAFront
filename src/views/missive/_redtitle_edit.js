import React, { Component } from 'react'
import { Input, Upload, Radio } from 'antd'
import FormModal from '../shared/_formmodal'
import api from '../../models/api'

class RedTitleEditModal extends Component {
    state = {}
    handleSubmit = data => {
        if (this.state.upload) {
            data.Template = this.state.upload
            data.TemplateId = data.Template.ID
        }
        if (data.TemplateId) {
            data.Template = null;
        }
        api.Missive.SaveRedTitle(data, json => {
            this.props.onSubmit(json)
        })
    }

    handleUpload = ({ file }) => {
        if (!file || !file.response) return
        var response = file.response
        if (response.Message) {
            alert(response.Message)
            return;
        }
        this.setState({ upload: response })
    }

    getFormItems = () => {
        let model = this.props.model || {};
        const template = this.state.upload || model.Template || {}
        let items = [
            { name: 'ID', defaultValue: model.ID, render: <Input type="hidden" /> },
            { name: 'TemplateId', defaultValue: model.TemplateId, render: <Input type="hidden" /> },
            {
                name: 'Name', title: '文件字', defaultValue: model.Name, render: <Input />,
                rules: [{ required: true, message: '请填写文件字' }]
            },
            {
                name: 'FormId', title: '类型', defaultValue: model.FormId,
                render: <Radio.Group>
                    <Radio.Button value={api.Forms.Missive.ID}>发文</Radio.Button>
                    <Radio.Button value={api.Forms.ReceiveMissive.ID}>收文</Radio.Button>
                </Radio.Group>
            },
            {
                name: 'Template', title: '红头模板', defaultValue: template,
                render: <Upload.Dragger
                    action={api.File.UploadUrl(0, model.ID, 'template', true)}
                    name="template"
                    onChange={this.handleUpload}
                    accept=".doc,.docx"
                    withCredentials={true}
                    showUploadList={false}
                >
                    {template.ID ? template.FileName : '选择红头模板文件(.doc .docx)'}
                </Upload.Dragger>
            }
        ];
        return items;
    }

    render() {
        return (
            <FormModal
                title={this.props.title}
                onSubmit={this.handleSubmit}
                trigger={this.props.trigger}
                children={this.getFormItems()}
            />
        )
    }
}

export default RedTitleEditModal