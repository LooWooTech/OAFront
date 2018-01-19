import React, { Component } from 'react';
import PropTypes, { number } from 'prop-types';
import { observer, inject } from 'mobx-react'
import { Container, Header, Left, Body, Right, Title, Content, View, Text, Segment, Button, Icon, Tabs, Tab, TabHeading, List, ListItem, H2 } from 'native-base'
import BackButton from '../shared/BackButton'
import AttachmentList from '../file/list'
import TaskInfo from './_info'
import SubTaskList from './_subTaskList'
@inject('stores')
@observer
class TaskDetail extends Component {

    componentWillMount() {
        const id = this.props.navigation.state.params.id
        this.props.stores.taskStore.getModel(id)
        this.props.stores.formInfoStore.loadData(id)
    }

    render() {
        const task = this.props.stores.taskStore.model
        const data = this.props.stores.formInfoStore.data
        if (!task || !data) return null
        const info = data.model
        return (
            <Container>
                <Header hasTabs>
                    <Left>
                        <BackButton />
                    </Left>
                    <Body>
                        <Title>{info.Form.Name}详细</Title>
                    </Body>
                </Header>
                <Tabs tabBarPosition="top" locked>
                    <Tab heading={<TabHeading><Text>任务列表</Text></TabHeading>}>
                        <Content>
                            <SubTaskList taskId={task.ID} />
                        </Content>
                    </Tab>
                    <Tab heading={<TabHeading><Text>任务落实单</Text></TabHeading>}>
                        <Content>
                            <TaskInfo data={task} />
                        </Content>
                    </Tab>
                    <Tab heading={<TabHeading><Text>附件信息</Text></TabHeading>}>
                        <Content>
                            <AttachmentList infoId={task.ID} navigation={this.props.navigation} />
                        </Content>
                    </Tab>
                </Tabs>
            </Container>
        );
    }
}
export default TaskDetail;