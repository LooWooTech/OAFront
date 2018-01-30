import React, { Component } from 'react';
import { inject, observer } from 'mobx-react'
import { Container, Header, Left, Body, Right, Title, View, Content, Text, Button, Footer, Icon, ListItem } from 'native-base'
import BackButton from '../shared/BackButton'
import Form from '../shared/Form'
import Toast from '@remobile/react-native-toast'
import moment from 'moment'
import { FORMS } from '../../common/config';

@inject('stores')
@observer
class FormExtend1Check extends Component {

    componentWillMount() {
        this.props.stores.userStore.getLeaders()
    }

    getBackTitle = (model) => {
        switch (model.FormId) {
            case FORMS.Car.ID:
                return '还车时间';
            default:
                return '结束时间';
            case FORMS.MeetingRoom.ID:
                return '结束时间';
            case FORMS.Attendance.ID:
                return '结束时间';
        }
    }

    getFormItems = (model) => {
        const leaders = this.props.stores.userStore.leaders
        let items = [
            { name: 'id', value: model.ID, type: 'hidden' },
            { title: '申 请 人', defaultValue: model.ApplyUser, type: 'text', disabled: true },
            { title: '申请日期', value: model.CreateTime, type: 'datetime', disabled: true },
            { title: '申请原由', defaultValue: model.Reason, type: 'text', disabled: true },
            { title: '开始时间:', value: model.ScheduleBeginTime, type: 'datetime', disabled: true },
            { title: '结束时间:', value: model.ScheduleEndTime, type: 'datetime', disabled: true },
        ]
        //判断是否可以结束
        if (!model.RealEndTime) {
            if (model.Result && this.props.stores.userStore.isCurrentUser(model.UserId)) {
                items.push({ title: this.getBackTitle(), name: 'backTime', type: 'datetime' })
            }
        }
        else {
            items.push({ title: this.getBackTitle(), name: 'backTime', type: 'datetime', value: model.RealEndTime, disabled })
        }
        //判断是否审批
        if (this.props.stores.userStore.isCurrentUser(model.ApprovalUserId)) {
            items = items.concat([
                { title: '是否同意', name: 'result', value: true, type: 'switch' },
                {
                    title: '审 核 人', name: 'toUserId', type: 'select',
                    placeholder:'如需要领导审批，请选择',
                    options: leaders.map(user => ({ label: user.RealName, value: user.ID }))
                }
            ]);
        }

        return items;
    }

    handleSubmit = () => {
        let formData = this.refs.form.getData()
        console.log(formData)
        return
        this.props.stores.extend1Store.submitCheck(formData.id, formData.result, formData.toUserId);
        this.props.navigation.goBack()
    }

    handleBack = () => {
        let formData = this.refs.form.getData()
        this.props.stores.extend1Store.back(formData.id, formData.backTime)
    }

    getFooterButtons = () => {
        const model = this.props.stores.extend1Store.model
        const buttons = []
        const canApproval = model.Result === null && this.props.stores.userStore.isCurrentUser(model.ApprovalUserId)
        if (canApproval) {
            buttons.push(
                <Button key="btn-approval" iconLeft transparent onPress={this.handleSubmit}>
                    <Icon name="check" />
                    <Text>提交申请</Text>
                </Button>
            )
        }

        const canBack = !model.RealEndTime && model.Result && this.props.stores.userStore.isCurrentUser(model.UserId)
        if (canBack) {
            let buttonText = "归还";
            switch (model.FormId) {
                case FORMS.Car.ID:
                    buttonText = '还车';
                    break;
                case FORMS.MeetingRoom.ID:
                    buttonText = '使用完毕';
                    break;
                case FORMS.Attendance.ID:
                    buttonText = '请假结束';
                    break;
            }
            buttons.push(
                <Button key="btn-back" iconLeft transparent onPress={this.handleBack}>
                    <Icon name="repeat" />
                    <Text>{buttonText}</Text>
                </Button>
            )
        }
        return buttons
    }

    render() {
        const model = this.props.stores.extend1Store.model
        const form = this.props.stores.formStore.getForm(model.FormId)
        const buttons = this.getFooterButtons()
        return (
            <Container>
                <Header>
                    <Left>
                        <BackButton />
                    </Left>
                    <Body>
                        <Title>{form.Name}审批</Title>
                    </Body>
                </Header>
                <Content>
                    <Form
                        ref="form"
                        items={this.getFormItems(model)}
                    />
                </Content>
                {buttons.length == 0 ? null : <Footer>{buttons}</Footer>}
            </Container>
        );
    }
}

export default FormExtend1Check;