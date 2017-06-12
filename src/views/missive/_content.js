import React, { Component } from 'react'
import { Alert } from 'antd'
import api from '../../models/api';
class ContentTab extends Component {

    render() {
        // const infoId = (this.props.missive || {}).ID || 0
        // const fileUrl = infoId ? api.File.PreviewUrl(infoId) : null
        const wordId = (this.props.missive || {}).WordId || 0
        const editUrl = wordId ? api.File.EditUrl(wordId) : null
        if (editUrl) {
            return <iframe src={editUrl} className="iframe-word" />
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