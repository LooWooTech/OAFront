import React, { Component } from 'react';
import Editor from 'react-lz-editor'

class MailContentEditor extends Component {

    state = { content: this.props.content || '' }

    getContent = () => {
        return this.state.content;
    }
    
    handleContentChange = (content) => {
        this.setState({ content, changed: true })
    }

    render() {
        return (
            <Editor
                cbReceiver={this.handleContentChange}
                importContent={this.state.content}
                video={false}
                audio={false}
                image={false}
                fullScreen={false}
            />
        );
    }
}

export default MailContentEditor;