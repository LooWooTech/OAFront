import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Alert } from 'react-native'
import { Container, Header, Content, Left, Body, Title, Right, Text, View, Icon, Button, CheckBox, ListItem, Col, Row, Label, Footer, Toast } from 'native-base'
import BackButton from '../shared/BackButton'
import Form from '../shared/Form'
import { inject, observer } from 'mobx-react';
import SelectUserButton from '../shared/SelectUserButton'
import ListRow from '../shared/ListRow'

@inject('stores')
@observer
export default class MailForm extends Component {

    componentWillMount() {
        const { id, replyId, forwardId } = this.props.navigation.state.params || {};
        this.props.stores.mailStore.getDetailData(id || replyId || forwardId)
    }

    getFormData = () => {
        let data = this.refs.form.getData()
        let toUsers = this.refs.toUsers.getSelectedUsers().map(user => ({ InfoId: data.ID, UserId: user.ID }))
        let ccUsers = this.refs.ccUsers.getSelectedUsers().map(user => ({ InfoId: data.ID, UserId: user.ID, CC: true }))
        data.Users = toUsers.concat(ccUsers);
        return data;
    }

    handleSubmit = () => {
        const formData = this.getFormData();
        if (!formData.Users.find(e => !e.CC)) {
            Toast.show({ text: '没有选择收件人', position: 'top' })
            return;
        }
        if (!formData.Content) {
            Toast.show({ text: '没有填写邮件正文', position: 'top' });
            return;
        }
        this.props.stores.mailStore.send(formData);
        Toast.show({ text: '发送成功', position: 'top', type: 'success' })
        this.props.navigation.goBack()
    }

    handleSave = () => {
        const formData = this.getFormData();
        this.props.stores.mailStore.save(formData)
        Toast.show({ text: '保存成功', position: 'top', type: 'success' })
        this.props.navigation.goBack()
    }

    getFormItems = (data) => {
        const { id, replyId, forwardId } = this.props.navigation.state.params || {};
        const { model, userMail, fromUser, toUsers, ccUsers, attachments } = data || { model: {}, toUsers: [], ccUsers: [] }
        const toUsersDefaultValue = replyId && !id ? [fromUser] : forwardId && !id ? [] : toUsers
        const ccUsersDefaultValue = replyId && !id ? toUsers.concat(ccUsers || []) : forwardId && !id ? [] : ccUsers
        let items = [
            { name: 'ID', type: 'hidden', defaultValue: id },
            { name: 'ReplyId', type: 'hidden', defaultValue: replyId || model.ReplyID },
            { name: 'ForwardId', type: 'hidden', defaultValue: forwardId || model.ForwardId },
            {
                title: '收件人', name: 'toUsers',
                render: (
                    <Body>
                        <SelectUserButton name="mailToUsers" ref="toUsers" params={{ multiple: true, users: toUsersDefaultValue }} />
                    </Body>
                )
            },
            {
                title: '抄送', name: 'ccUsers',
                render: (
                    <Body>
                        <SelectUserButton name="mailCcUsers" ref="ccUsers" params={{ multiple: true, users: toUsersDefaultValue }} />
                    </Body>
                )

            },
            {
                title: '主题', name: 'Subject', defaultValue: (replyId ? "回复：" : forwardId ? "转发：" : '') + (model.Subject || '')
            },
            { title: '正文', name: 'Content', type: 'textarea', defaultValue: model.Content }
        ];
        return items;
    }

    render() {

        const data = this.props.stores.mailStore.data

        return (
            <Container>
                <Header>
                    <Left>
                        <BackButton />
                    </Left>
                    <Body>
                        <Title>发送邮件</Title>
                    </Body>
                </Header>
                <Content>
                    <Form ref="form" items={this.getFormItems(data)} />
                </Content>
                <Footer>
                    <Button iconLeft transparent onPress={this.handleSubmit}>
                        <Icon name="send-o" />
                        <Text>立即发送</Text>
                    </Button>
                    <Button iconLeft transparent onPress={this.handleSave}>
                        <Icon name="save" />
                        <Text>保存草稿</Text>
                    </Button>
                </Footer>
            </Container>
        );
    }
}