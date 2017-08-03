import React, { Component } from 'react'
import { Button, Table, Tag, Icon } from 'antd'
import moment from 'moment'
import EditModal from './_edit_sub_task'
import TodoEditModal from './_edit_todo'
import api from '../../models/api'
import auth from '../../models/auth'


class SubTaskList extends Component {
    state = {
        info: this.props.info || {},
        list: [],
        todo: {}
    }

    componentWillMount() {
        this.loadData();
    }

    loadData = () => {
        api.Task.SubTaskList(this.state.info.ID, json => {
            let roots = json.filter(e => e.ParentId === 0 && (auth.isCurrentUser(this.state.info.PostUserId) || auth.isCurrentUser(e.CreatorId) || auth.isCurrentUser(e.ToUserId) || e.Todos.find(t => auth.isCurrentUser(t.ToUserId))));
            roots = roots.map(node => this.buildTreeData(node, json))
            this.setState({ list: roots })
        })
    }

    buildTreeData = (node, list) => {
        node.children = list.filter(e => e.ParentId === node.ID && (auth.isCurrentUser(this.state.info.PostUserId) || auth.isCurrentUser(e.CreatorId) || auth.isCurrentUser(e.ToUserId) || e.Todos.find(t => auth.isCurrentUser(t.ToUserId))));
        node.children.map(child => this.buildTreeData(child, list))
        return node
    }

    handleDelete = item => {
        if (confirm("你确定要删除吗？")) {
            api.Task.DeleteSubTask(item.ID, () => {
                this.loadData()
            })
        }
    }
    expandedRowRender = (item) => {

        let list = item.Todos;
        if (list.length === 0) {
            return null;
        }
        return <Table
            rowKey="ID"
            columns={[
                {
                    title: '状态', dataIndex: 'Completed', width: 60,
                    render: (text, item) => <Tag color={item.Completed ? "green" : ''}>{item.Completed ? "完成" : '未完成'}</Tag>
                },
                {
                    title: '内容', dataIndex: 'Content',
                    render: text => text.split('\n').map((item, key) => <span key={key}>{item}<br /></span>)
                },
                { title: '负责人', width: 100, dataIndex: 'ToUserName' },
                { title: '创建时间', width: 150, dataIndex: 'CreateTime', render: (text) => text ? moment(text).format('ll') : '' },
                { title: '计划完成时间', width: 150, dataIndex: 'ScheduleDate', render: (text) => text ? moment(text).format('ll') : '' },
                {
                    title: '操作', width: 240, render: (text, item) => <span>
                        {(auth.isCurrentUser(item.ToUserId)) ?
                            <Button type="success" onClick={() => this.handleUpdateStatus(item)}>{item.Completed ? '未完成' : '标记完成'}</Button>
                            : null
                        }
                        {auth.isCurrentUser(item.CreatorId) ?
                            <span>
                                <TodoEditModal
                                    model={item}
                                    trigger={<Button icon="edit"></Button>}
                                    onSubmit={this.loadData}
                                />
                                <Button type="error" icon="delete" onClick={() => this.handleDelete(item)}></Button>
                            </span>
                            : null}
                    </span>
                }
            ]}
            pagination={false}
            dataSource={list}
        />
    }
    render() {
        const info = this.props.info;
        const taskId = info.ID;
        return (
            <div>
                {auth.isCurrentUser(info.PostUserId) ?
                    <EditModal
                        trigger={<Button type="primary" icon="plus">添加子任务</Button>}
                        model={{ TaskId: taskId }}
                        list={this.state.list}
                        onSubmit={this.loadData}
                    /> : null}
                <Table
                    rowKey="ID"
                    loading={this.state.loading}
                    indentSize={30}
                    defaultExpandAllRows={true}
                    columns={[
                        {
                            title: '状态', dataIndex: 'Completed', width: 90,
                            render: (text, item) => <Tag color={item.Completed ? "green" : ''}>{item.Completed ? "完成" : '未完成'}</Tag>
                        },
                        {
                            title: '任务目标', dataIndex: 'Content',
                            render: (text, item) => <div style={{ paddingLeft: item.ParentId > 0 ? '30px' : '0' }}>{text.split('\n').map((item, key) => <span key={key}>{item}<br /></span>)}</div>
                        },
                        {
                            title: '科室', width: 180,
                            render: (text, item) => <span>
                                {item.IsMaster ? "[主]" : "[协]"}
                                {item.ToDepartmentName}
                            </span>
                        },
                        { title: '责任人', width: 100, render: (text, item) => item.ToUserName || '未指派' },
                        { title: '创建时间', width: 160, dataIndex: 'CreateTime', render: (text) => text ? moment(text).format('ll') : '' },
                        { title: '计划完成时间', width: 160, dataIndex: 'ScheduleDate', render: (text) => text ? moment(text).format('ll') : '' },
                        {
                            title: '操作', width: 300, render: (text, item) => <span>
                                {auth.isCurrentUser(item.ToUserId) ?
                                    <Button type="success" onClick={() => this.handleUpdateStatus(item)}>{item.Completed ? '未完成' : '完成任务'}</Button>
                                    : null
                                }
                                {(auth.isCurrentUser(item.CreatorId)) ?
                                    <span>
                                        <TodoEditModal
                                            title="添加子任务"
                                            model={{ SubTaskId: item.ID }}
                                            trigger={<Button>添加子任务</Button>}
                                            onSubmit={this.loadData}
                                        />
                                        <EditModal
                                            model={item}
                                            list={this.state.list}
                                            trigger={<Button icon="edit"></Button>}
                                            onSubmit={this.loadData}
                                        />
                                        <Button icon="delete" onClick={() => this.handleDelete(item)}></Button>
                                    </span>
                                    :
                                    null
                                }
                            </span>
                        }
                    ]}
                    dataSource={this.state.list}
                    pagination={false}
                    expandedRowRender={this.expandedRowRender}
                />
            </div>
        )
    }
}

export default SubTaskList