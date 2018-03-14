import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Platform, Linking } from 'react-native'
import { inject, observer } from 'mobx-react'
import { Container, Header, Left, Right, Body, Title, Content, View, Text, Button, ProgressBar, Icon, Footer } from 'native-base'
import BackButton from '../shared/BackButton'
import SharedDetail from '../shared/Detail'
import OpenFile from 'react-native-doc-viewer'
import RNFS from 'react-native-fs'
@inject('stores')
@observer
class FilePreview extends Component {

    handleOpenFile = () => {
        const file = this.props.navigation.state.params.file
        const source = this.props.stores.fileStore.getSource(file.ID)
        Linking.openURL(source.uri).catch(err => console.error(err))
    }

    render() {
        const file = this.props.navigation.state.params.file
        if (!file) return null;
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
                <Content style={{ backgroundColor: "#fff" }}>
                    <SharedDetail
                        items={[
                            { name: 'filename', title: '文件名称', defaultValue: file.FileName },
                            { name: 'filesize', title: '文件大小', defaultValue: file.DisplaySize },
                            { name: 'createtime', title: '上传日期', defaultValue: file.CreateTime, type: 'date' }
                        ]}
                    />
                </Content>
                <Footer>
                    <Body>
                        <Button iconLeft success full transparent onPress={this.handleOpenFile}>
                            <Icon name="folder-open-o" />
                            <Text>打开文件</Text>
                        </Button>
                    </Body>
                </Footer>
            </Container>
        );
    }
}

export default FilePreview;