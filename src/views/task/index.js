import React, { Component } from 'react';
import { Button, Table, Tabs, Icon } from 'antd';
import api from '../../models/api';

class TaskIndex extends Component {
    state = {
        sends: [],
        receives: [],
        completed: [],
    };
    componentWillMount() {
        this.loadPageData();
    };

    loadPageData = (page = 1, userId = 0) => {
        api.Task.List(this, { page, userId }, json => {
            let { current, total, pageSize } = json.Page;
            let list = json.List;
            this.setState({ current, total, pageSize, list });
        })
    };
    onCreateClick = () => {

    };
    onTaskClick = (item) => {

    }

    render() {
        return (
            <div>
                <Tabs defaultActiveKey="2">
                    <Tabs.Pane tab={<span><Icon type="check" />我指派的任务</span>} key="1">
                        Tab 1
                    </Tabs.Pane>
                    <Tabs.Pane tab={<span><Icon type="android" />我收到的任务</span>} key="2">
                        Tab 2
                    </Tabs.Pane>
                </Tabs>
                <div className="toolbar">
                    <Button icon="new">新建任务</Button>
                </div>
                <Table
                    rowKey="ID"
                    columns={[
                        { title: '任务名称', dataIndex: 'Name', render: (text, item) => <a onClick={this.onTaskClick(item)}>{item.Name}</a> },
                        { title: '' }
                    ]}
                />
            </div>
        );
    }
}

export default TaskIndex;