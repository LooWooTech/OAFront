import React, { Component } from 'react'
import { Alert } from 'antd'
import api from '../../models/api';
class ContentTab extends Component {

    render() {
        const infoId = (this.props.missive || {}).ID || 0
        const fileUrl = infoId ? api.File.GetPreviewFileUrl(infoId) : null
        if (fileUrl) {
            return <iframe src={fileUrl} style={{
                border: "none",
                width: "100%", height: "100%",
            }} />
        } else {
            return <Alert
                message="错误"
                description="无法预览或者您还未上传附件"
                type="error"
            />
        }
    }
}

export default ContentTab