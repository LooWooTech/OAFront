import React, { Component } from 'react'
import { Alert } from 'antd'
import api from '../../models/api';
class ContentTab extends Component {

    render() {
        const model = this.props.missive || {}
        if (model.Content) {
            var fileUrl = api.File.PreviewUrl(model.ID)
            if (model.Content.IsWordFile) {
                fileUrl = api.File.EditUrl(model.ContentId)
            }
            return <iframe src={fileUrl} className="iframe-word" />
        }
        else {
            return <Alert
                message="错误"
                description="无法预览或者您还未上传附件"
                type="error"
            />
        }
    }
}

export default ContentTab