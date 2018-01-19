import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { Container, Header, Footer, Left, Body, Right, Title, Content, View, Text, Button, Icon, List, ListItem, Tabs, Tab, TabHeading } from 'native-base'
import BackButton from '../shared/BackButton'
import ListRow from '../shared/ListRow'
import Form from '../shared/Form'
import moment from 'moment'
import TodoList from './_todoList'

@inject('stores')
@observer
class SubTaskDetail extends Component {

    render() {
        const subTask = this.props.navigation.state.params.data
        const list = this.props.stores.formInfoStore.data.model.FlowData.Nodes.sort((a, b) => a.ID - b.ID);
        const logs = list.filter(e => e.ExtendId === subTask.ID && e.Result != null)

        let canSubmit = false;
        let canCheck = false;
        let canAddTodo = false;
        let canViewTodos = this.props.stores.formInfoStore.isMyFlow
            || this.props.stores.userStore.isCurrentUser(subTask.CreatorId)
            || this.props.stores.userStore.isCurrentUser(subTask.ToUserId)
            || subTask.Todos.find(t => this.props.stores.userStore.isCurrentUser(t.ToUserId));

        let checkNodeData = null;
        switch (subTask.Status) {
            case 3:
            case 0:
                canSubmit = this.props.stores.userStore.isCurrentUser(subTask.ToUserId);
                canAddTodo = this.props.stores.userStore.isCurrentUser(subTask.CreatorId);
                break;
            case 2:
            case 1:
                checkNodeData = list.find(e => !e.Submited && e.ExtendId === subTask.ID && this.props.stores.userStore.isCurrentUser(e.UserId));
                canCheck = checkNodeData != null;
                break;
        }

        const onlyLogsTab = !canCheck && !canSubmit && (!canViewTodos || subTask.Todos.length == 0);
        if (onlyLogsTab) {
            return (
                <Container>
                    <Header>
                        <Left>
                            <BackButton />
                        </Left>
                        <Body>
                            <Title>审核记录</Title>
                        </Body>
                    </Header>
                    <Content>
                        <SubTaskCheckList data={logs} />
                    </Content>
                </Container>
            )
        }

        return (
            <Container>
                <Header hasTabs>
                    <Left>
                        <BackButton />
                    </Left>
                    <Body>
                        <Title>{subTask.Content}</Title>
                    </Body>
                    <Right></Right>
                </Header>
                <Tabs tabBarPosition="top">
                    {canViewTodos && subTask.Todos.length > 0 ?
                        <Tab heading={<TabHeading><Text>子任务</Text></TabHeading>}>
                            <Content>
                                <TodoList data={subTask.Todos} />
                            </Content>
                        </Tab>
                        : null}
                    {canSubmit ? <Tab heading={<TabHeading><Text>提交任务</Text></TabHeading>}><SubmitSubTaskForm data={subTask} navigation={this.props.navigation} /></Tab> : null}
                    <Tab heading={<TabHeading><Text>审核记录</Text></TabHeading>}>
                        <Content>
                            <SubTaskCheckList data={logs} />
                        </Content>
                    </Tab>
                    {canCheck ? <Tab heading={<TabHeading><Text>审核任务</Text></TabHeading>}><CheckSubTaskForm data={checkNodeData} navigation={this.props.navigation} /></Tab> : null}
                </Tabs>
            </Container>

        );
    }
}

export default SubTaskDetail;

@inject('stores')
@observer
class SubmitSubTaskForm extends Component {
    handleClick = () => {
        const data = this.props.data
        const formData = this.refs.form.getData()
        this.props.stores.taskStore.submitSubTask(data.ID, formData.Content)
        this.props.navigation.goBack()
    }
    render() {
        return (
            <Content>
                <Form
                    ref="form"
                    items={[
                        { title: '完成说明', name: 'Content', type: 'textarea' },
                    ]}
                />
                <View style={{ margin: 10 }}>
                    <Button iconLeft full onPress={this.handleClick}>
                        <Icon name="check" />
                        <Text>提交任务</Text>
                    </Button>
                </View>
            </Content>
        );
    }
}

@inject('stores')
@observer
class CheckSubTaskForm extends Component {
    handleClick = () => {
        const data = this.props.data
        const formData = this.refs.form.getData()
        this.props.stores.taskStore.checkSubTask(data.ID, formData.Result, formData.Content)
        this.props.navigation.goBack()
    }
    render() {
        return (
            <Content>
                <Form
                    ref="form"
                    items={[
                        { title: '审核意见', name: 'Content', type: 'textarea' },
                        { title: '是否完成', name: 'Result', defaultValue: true, type: 'switch' }
                    ]}
                />
                <View style={{ margin: 10 }}>
                    <Button iconLeft full onPress={this.handleClick}>
                        <Icon name="check" />
                        <Text>提交任务</Text>
                    </Button>
                </View>
            </Content>
        );
    }
}

const SubTaskCheckList = ({ data }) => {
    if (data.length == 0) {
        return <ListItem><Text>暂无记录</Text></ListItem>
    }
    return data.map(item => <ListRow
        key={item.ID}
        left={<Icon name={item.Result ? 'check' : item.Result == false ? 'close' : 'ellipsis-h'} />}
        title={item.Content}
        subTitle={`提交人：${item.Signature} ${item.UpdateTime ? '时间：' + moment(item.UpdateTime).format('YYYY-DD-MM HH:mm') : null}`}
    />)
}