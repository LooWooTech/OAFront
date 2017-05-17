import React, { Component } from 'react'
import api from '../../models/api';


class ContentTab extends Component {
    state = { info: this.props.info, fileId: 0 }

    componentWillMount() {
        let infoId = this.state.info.ID
        console.log(infoId)
        if (infoId) {
            api.Missive.GetPdf(infoId, data => {
                this.setState({ fileId: data.ID })
            })
        }
    }

    render() {
        return this.state.fileId ?
            <iframe src={api.File.FileUrl(this.state.fileId)} style={{
                border: "none",
                width: "100%", height: "100%",
            }} />
            : <div>
                请先上传Word文档。
            </div>
    }
}

export default ContentTab