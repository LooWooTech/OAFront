import React, { Component } from 'react'
import api from '../../models/api';


class ContentTab extends Component {

    render() {
        const file = this.props.file;
        return (
            <iframe src={api.File.FileUrl(file.ID)} style={{
                border: "none",
                width: "100%", height: "100%",
            }} />
        )
    }
}

export default ContentTab