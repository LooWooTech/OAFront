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
export default class SealApplyForm extends Component {

    handleSubmit = () => {
        const formData = this.refs.form.getData()
        const users = this.refs.selectUser.getSelectedUsers() || [];
        formData.ApprovalUserId = users.length > 0 ? users[0].ID : 0;
        if (!formData.InfoId) {
            Toast.show({ text: '请先选择公章', position: 'top' })
            return false;
        }
        if (!formData.ScheduleBeginTime) {
            Toast.show({ text: '请选择开始时间', position: 'top' });
            return false;
        }
        if (!formData.ScheduleEndTime) {
            Toast.show({ text: '请选择结束时间', position: 'top' });
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
        this.props.stores.sealStore.apply(formData)
        this.props.navigation.goBack()
        Toast.show({ text: '申请完成，请等待审核', position: 'top' });
    }


    getFormItems = () => {
        let items = [
            {
                title: '选择公章', name: 'InfoId', type: 'select',
                options: this.props.stores.sealStore.list.map(item => ({
                    text: `${item.Name}(${item.Number})`,
                    value: item.ID
                }))
            },
            { title: '开始时间', name: 'ScheduleBeginTime', type: 'date' },
            { title: '结束时间', name: 'ScheduleEndTime', type: 'date' },
            { title: '申请用途', name: 'Reason', type: 'textarea' },
            {
                title: '审核人', render: (
                    <Body>
                        <SelectUserButton
                            ref="selectUser"
                            type="flow"
                            name="select_user"
                            params={{ flowId: FORMS.Seal.ID, flowStep: 2, multiple: false }}
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
                        <Title>申请公章</Title>
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
