import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { Toast, Container, Header, Left, Body, Right, Title, View, Content, Text, Button, Footer, Icon } from 'native-base'
import BackButton from '../shared/BackButton'
import Form from '../shared/Form'
import moment from 'moment'
import { FORMS } from '../../common/config';
import SelectUserButton from '../shared/SelectUserButton'

@inject('stores')
@observer
export default class CarApplyForm extends Component {

    handleSubmit = () => {
        const formData = this.refs.form.getData()
        const users = this.refs.selectUser.getSelectedUsers() || [];
        formData.ApprovalUserId = users.length > 0 ? users[0].ID : 0;
        if (!formData.InfoId) {
            Toast.show({ text: '请先选择一辆车', position: 'top' })
            return false;
        }
        if (!formData.ScheduleBeginTime) {
            Toast.show({ text: '请选择用车开始日期', position: 'top' });
            return false;
        }
        if (!formData.ScheduleEndTime) {
            Toast.show({ text: '请选择计划还车日期', position: 'top' });
            return false;
        }
        if (!formData.Reason) {
            Toast.show({ text: '没有填写申请用途', position: 'top' });
            return false;
        }
        if (!formData.ApprovalUserId) {
            Toast.show({ text: '请选择审批人', position: 'top' })
            return false;
        }
        this.props.stores.carStore.apply(formData)
        this.props.navigation.goBack()
        Toast.show({ text: '申请完成，请等待审核', position: 'top' });
    }


    getFormItems = () => {
        let items = [
            {
                title: '选择车辆', name: 'ExtendInfoId', type: 'select',
                options: this.props.stores.carStore.list.map(item => ({
                    label: `${item.Name}(${item.Number})`,
                    value: item.ID
                }))
            },
            { title: '用车日期', name: 'ScheduleBeginTime', type: 'date' },
            { title: '还车日期', name: 'ScheduleEndTime', type: 'date' },
            { title: '申请用途', name: 'Reason', type: 'textarea' },
            {
                title: '审核人', render: (
                    <Body>
                        <SelectUserButton
                            ref="selectUser"
                            type="flow"
                            name="select_user"
                            params={{ flowId: FORMS.Car.ID, flowStep: 2, multiple: false }}
                        />
                    </Body>)
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
                        <Title>申请用车</Title>
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
        )
    }
}
