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

    isIOS = Platform.OS === 'ios';

    state = { inProgress: false, progress: '0', downloaded: this.isIOS }

    componentWillMount() {
        if (!this.isIOS) {
            const task = RNFS.exists(this.getLocalPath())
            task.then(exists => {
                if (exists) {
                    this.setState({ downloaded: true })
                }
            });
        }
    }

    handleDownloadFile = () => {
        const file = this.props.navigation.state.params.file
        const source = this.props.stores.fileStore.getSource(file.ID)
        const task = RNFS.downloadFile({
            fromUrl: source.uri,
            toFile: this.getLocalPath(),
            headers: source.headers,
            background: false,
            progressDivider: 10,
            begin: () => {
                this.setState({ inProgress: true, progress: '0' })
            },
        })
        task.promise.then((res) => {
            this.setState({ inProgress: false, downloaded: true })
        })

    }

    getLocalPath = () => {
        const file = this.props.navigation.state.params.file
        return "file://" + (RNFS.MainBundlePath || RNFS.DocumentDirectoryPath) + '/' + file.SavePath
    }

    handleOpenFile = () => {
        const file = this.props.navigation.state.params.file
        if (this.isIOS) {
            //IOS
            const source = this.props.stores.fileStore.getSource(file.ID)
            const url = source.uri + '&token=' + source.headers.token
            Linking.openURL(url).catch(err => console.error(err))
        } else {
            //Android
            OpenFile.openDoc([{
                url: this.getLocalPath(),
                fileName: file.FileName,
                cache: false,
                fileType: file.FileExt.substring(1)
            }], (error, url) => {
                if (error) {
                    console.error(error);
                } else {
                    console.log(url)
                }
            })
        }
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
                        {this.state.downloaded || this.isIOS ?
                            <Button iconLeft success full transparent onPress={this.handleOpenFile}>
                                <Icon name="folder-open-o" />
                                <Text>打开文件</Text>
                            </Button>
                            :
                            <Button iconLeft full transparent onPress={this.handleDownloadFile}>
                                <Icon name="download" />
                                <Text>{this.state.inProgress ? "下载中" : "下载文件"}</Text>
                            </Button>
                        }
                    </Body>
                </Footer>
            </Container>
        );
    }
}

export default FilePreview;