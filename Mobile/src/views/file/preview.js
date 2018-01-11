import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react'
import { WebView, Dimensions } from 'react-native';
import { Container, Header, Left, Right, Body, Title, Content, View, Text, Button } from 'native-base'
import BackButton from '../shared/BackButton'

@inject('stores')
@observer
class FilePreview extends Component {
    render() {
        const id = this.props.navigation.state.params.id
        if (!id) {
            return null
        }
        const source = this.props.stores.fileStore.getSource(id)
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
                    <WebView
                        source={source}
                        style={{
                            flex: 1,
                            width: Dimensions.get('window').width,
                            height: Dimensions.get('window').height - 80
                        }}
                        onLoad={() => {
                            console.log('onLoad')
                        }}
                        onNavigationStateChange={(info) => {
                            console.log(info)
                        }}
                    />
                </Content>
            </Container>
        );
    }
}

export default FilePreview;