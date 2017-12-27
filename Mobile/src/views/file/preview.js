import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { WebView } from 'react-native';
import { Container, Header, Left, Right, Body, Title,Content, View, Text, Button } from 'native-base'
import BackButton from '../shared/BackButton'

class FilePreview extends Component {
    render() {
        return (
            <Container>
                <Header>
                    <Left>
                        <BackButton />
                    </Left>
                    <Body>
                        <Title>
                            文件预览/下载
                        </Title>
                    </Body>
                </Header>
                <Content>
                    <WebView />
                </Content>
            </Container>
        );
    }
}

FilePreview.propTypes = {

};

export default FilePreview;