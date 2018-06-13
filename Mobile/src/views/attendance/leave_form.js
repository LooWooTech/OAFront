import React, { Component } from 'react';
import { inject, observer } from 'mobx-react'
import { Toast, Container, Header, Left, Body, Right, Title, View, Content, Text, Button, Footer, Icon } from 'native-base'
import BackButton from '../shared/BackButton'
import Form from '../shared/Form'
import moment from 'moment'

@inject('stores')
@observer
class LeaveForm extends Component {
    componentWillMount() {
        this.props.stores.userStore.getLeaders()
    }

    handleSubmit = () => {
        const formData = this.refs.form.getData()
        if (!formData.ApprovalUserId) {
            Toast.show({ text: '请选择审批人', position: 'top' })
            return false;
        }
        if (!formData.Reason) {
            Toast.show({ text: '没有填写请假理由', position: 'top' });
            return false;
        }
        this.props.stores.attendanceStore.submitLeave(formData)
        this.props.navigation.goBack()
        Toast.show({ text: '申请完成，请等待审核', position: 'top' });
    }

    getFormItems = () => {
        const leaders = this.props.stores.userStore.leaders || []
        let items = [
            {
                title: '请假类型', name: 'ExtendInfoId', defaultValue: 1, type: 'select',
                defaultValue: 1,
                options: [
                    { text: '公事', value: 1 },
                    { text: '私事', value: 2 },
                    { text: '病假', value: 3 },
                    { text: '调休', value: 4 },
                ]
            },
            { title: '开始日期', name: 'ScheduleBeginTime', type: 'datetime', value: new Date(moment().format('ll')) },
            { title: '结束日期', name: 'ScheduleEndTime', type: 'datetime', value: new Date(moment().add(1, 'days').format('ll')) },
            { title: '请假事由', name: 'Reason', type: 'textarea' },
            {
                title: '审核人', name: 'ApprovalUserId', type: 'select',
                placeholder: '请选择审批领导',
                options: leaders.map(u => ({ text: u.RealName, value: u.ID }))
            }
        ]
        return items;
    }

    render() {
        return (
            <Container>
                <Header>
                    <Left>
                        <BackButton />
                    </Left>
                    <Body>
                        <Title>申请假期</Title>
                    </Body>
                </Header>
                <Content>
                    <Form
                        ref="form"
                        items={this.getFormItems()}
                    />
                </Content>
                <Footer>
                    <Button iconLeft transparent onPress={this.handleSubmit}>
                        <Icon name="check" />
                        <Text>提交申请</Text>
                    </Button>
                </Footer>
            </Container>
        );
    }
}

export default LeaveForm;