import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { WebView, Dimensions } from "react-native";
import { observer, inject } from 'mobx-react'
import { Container, Header, Left, Body, Right, Title, Content, View, Text, Segment, Button, Icon, Tabs, Tab, TabHeading, List, ListItem, H2, Footer, H3 } from 'native-base'
import moment from 'moment'
import BackButton from '../shared/BackButton'
import AttachmentList from '../file/list'
import Detail from '../shared/Detail'

@inject('stores')
@observer
class MailDetail extends Component {

    componentWillMount() {
        const id = this.props.navigation.state.params.id
        this.props.stores.mailStore.getDetailData(id)
    }

    render() {
        const data = this.props.stores.mailStore.data
        if (!data) return null
        const { model, attachments } = data
        return (
            <Container>
                <Header hasTabs>
                    <Left>
                        <BackButton />
                    </Left>
                    <Body>
                        <Title>邮件详细</Title>
                    </Body>
                </Header>
                <Tabs>
                    <Tab key="subject" heading={<TabHeading><Text>主题</Text></TabHeading>}>
                        <Content>
                            <MailSubject data={data} />
                        </Content>
                    </Tab>
                    <Tab key="body" heading={<TabHeading><Text>正文</Text></TabHeading>}>
                        <Content>
                            <WebView source={{ html: model.Content, baseUrl: '' }} style={{ height: Dimensions.get('window').height - 195 }} />
                        </Content>
                    </Tab>
                    <Tab key="files" heading={<TabHeading><Text>附件</Text></TabHeading>}>
                        <Content>
                            <AttachmentList infoId={model.ID} navigation={this.props.navigation} />
                        </Content>
                    </Tab>
                </Tabs>
                <MailFooter data={data} />
            </Container>
        );
    }
}
export default MailDetail;

class MailSubject extends Component {
    getItems = () => {
        const { model, userMail, fromUser, toUsers, ccUsers, attachments } = this.props.data
        let items = [
            { title: '主题', name: 'subject', defaultValue: model.Subject },
            { title: '发件人', name: 'sender', defaultValue: fromUser.RealName },
            { title: '时间', name: 'createTime', defaultValue: moment(model.CreateTime).format('lll') },
            { title: '收件人', name: 'toUsers', defaultValue: toUsers.map(e => e.RealName).join() },
            { title: '抄送', name: 'ccUsers', defaultValue: ccUsers.map(e => e.RealName).join() },
        ];
        return items;
    }

    render() {
        const { model, userMail, fromUser } = this.props.data
        const canView = userMail || this.props.stores.userStore.isCurrentUser(fromUser.ID)
        if (!canView) {
            return <H3>您没有权限查看此邮件</H3>
        }
        return (
            <Detail items={this.getItems()} style={{ height: 300 }} />
        )
    }
}

class MailFooter extends Component {

    canReply = () => {
        return !!this.props.data.userMail;
    }

    render() {
        return (
            <Footer style={{backgroundColor:'#eee'}}>
                
            </Footer>
        )
    }
}

