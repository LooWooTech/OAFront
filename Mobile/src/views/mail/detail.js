import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { WebView, Dimensions, Alert } from "react-native";
import { observer, inject } from 'mobx-react'
import { Container, Header, Left, Body, Right, Title, Content, View, Text, Segment, Button, Icon, Tabs, Tab, TabHeading, List, ListItem, H2, Footer, H3, Toast } from 'native-base'
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

    getItems = () => {
        const { model, userMail, fromUser, toUsers, ccUsers, attachments } = this.props.stores.mailStore.data
        let items = [
            { title: '主题', name: 'subject', defaultValue: model.Subject },
            { title: '发件人', name: 'sender', defaultValue: fromUser.RealName },
            { title: '时间', name: 'createTime', defaultValue: moment(model.CreateTime).format('lll') },
            { title: '收件人', name: 'toUsers', defaultValue: toUsers.map(e => e.RealName).join() },
            { title: '抄送', name: 'ccUsers', defaultValue: ccUsers.map(e => e.RealName).join() },
        ];
        return items;
    }

    handleEdit = () => {
        const id = this.props.stores.mailStore.data.model.ID
        this.props.navigation.navigate('Mail.Form', { id })
    }

    handleForward = () => {
        const id = this.props.stores.mailStore.data.model.ID
        this.props.navigation.navigate('Mail.Form', { forwardId: id })
    }
    handleReply = () => {
        const id = this.props.stores.mailStore.data.model.ID
        this.props.navigation.navigate('Mail.Form', { replyId: id })
    }

    handleRecovery = () => {
        const id = this.props.stores.mailStore.data.model.ID
        this.props.stores.userInfoStore.recovery(id)
        Toast.show({ text: '恢复完毕', position: 'top', type: 'success' })
        this.props.stores.mailStore.getDetailData(id)
    }

    isCreator = () => {
        const { model, fromUser, userMail } = this.props.stores.mailStore.data
        return this.props.stores.userStore.isCurrentUser(fromUser.ID)
    }

    handleDelete = () => {
        const { model, userMail } = this.props.stores.mailStore.data
        const id = model.ID
        let tips = userMail.Trash ? '彻底删除将无法恢复，你确定要彻底删除吗？' : '你确定要将此封邮件移动到回收站吗？'
        if (this.isCreator() && model.IsDraft) {
            tips = '你确定要删除此草稿吗？'
        }
        Alert.alert('提醒', tips, [
            {
                text: '确定',
                onPress: () => {
                    this.props.stores.mailStore.delete(id)
                    this.props.stores.mailStore.refreshData();
                    this.props.navigation.goBack()
                }
            }, {
                text: '取消',
                onPress: () => { }
            }
        ])     
    }

    getButtons = () => {
        const { model, userMail, fromUser, toUsers, ccUsers, attachments } = this.props.stores.mailStore.data
        let buttons = [];
        if (userMail && userMail.Trash) {
            buttons.push(<Button key="undo" iconLeft transparent onPress={this.handleRecovery}>
                <Icon name="undo" />
                <Text>恢复</Text>
            </Button>)
        }
        else {
            buttons.push(
                <Button key="delete" iconLeft danger transparent onPress={this.handleDelete}>
                    <Icon name="trash" />
                    <Text>删除</Text>
                </Button>
            )
        }
        if (this.isCreator() && userMail.Trash) {
            buttons.push(
                <Button key="delete" iconLeft danger transparent onPress={this.handleDelete}>
                    <Icon name="remove" />
                    <Text>删除</Text>
                </Button>
            );
        }
        if (!userMail) {
            <Button key="reply" iconLeft primary transparent onPress={this.handleReply}>
                <Icon name="reply" />
                <Text>回复</Text>
            </Button>
        }
        if (!model.IsDraft) {
            buttons.push(
                <Button key="share" iconLeft primary transparent onPress={this.handleForward}>
                    <Icon name="share" />
                    <Text>转发</Text>
                </Button>
            )
        } else {
            buttons.push(
                <Button key="edit" iconLeft primary transparent onPress={this.handleEdit}>
                    <Icon name="edit" />
                    <Text>修改</Text>
                </Button>
            )
        }
        return buttons;
    }

    render() {
        const data = this.props.stores.mailStore.data
        if (!data) return null
        const { model, userMail, fromUser, attachments } = data
        const canView = userMail || this.props.stores.userStore.isCurrentUser(fromUser.ID)
        if (!canView) {
            this.context.navigation.goBack();
            return null;
        }
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
                            <Detail items={this.getItems()} style={{ height: 300 }} />
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
                <Footer>
                    {this.getButtons()}
                </Footer>
            </Container>
        );
    }
}
export default MailDetail;