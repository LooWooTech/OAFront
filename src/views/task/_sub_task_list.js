import React, { Component } from 'react'
import { Button, Table, Tag,  Modal } from 'antd'
import moment from 'moment'
import EditModal from './_edit_sub_task'
import SubTaskCheckModal from './_sub_task_check'
import SubTaskSubmitModal from './_sub_task_submit'
import TodoEditModal from './_edit_todo'
import api from '../../models/api'
import auth from '../../models/auth'


class SubTaskList extends Component {
    state = {
        task: this.props.task,
        flowData: this.props.flowData,
        canViewAllSubTasks: this.props.canViewAllSubTasks,
        canAddSubTask: this.props.canAddSubTask,
        list: [],
        loading: true
    }

    componentWillMount() {
        this.loadData();
    }

    loadData = () => {
        const taskId = this.state.task.ID
        api.Task.SubTaskList(taskId, json => {
            let roots = json.filter(e => e.ParentId === 0);
            roots = roots.map(node => this.buildTreeData(node, json)).filter(e => this.canViewSubTask(e))
            this.setState({ list: roots, loading: false })
        })
    }

    handleUpdateStatus = (item) => {
        let self = this;
        Modal.confirm({
            title: '任务完成',
            content: item.Completed ? '当前操作将会设置该项任务为“未完成”状态，你确定还未完成吗？' : '当前操作将会设置该项任务为“已完成"状态，你确定已经完成该项任务了吗？',
            onOk: function () {
                api.Task.UpdateTodoStatus(item.ID, json => {
                    self.loadData()
                })
            }
        })
    }

    canViewSubTask = (subTask, parent = null) => {
        if (!subTask) return false;

        var result = this.state.canViewAllSubTasks
            || auth.isCurrentUser(subTask.CreatorId)
            || auth.isCurrentUser(subTask.ToUserId);

        if (!result) {
            result = subTask.Todos.find(t => auth.isCurrentUser(t.ToUserId))
        }
        if (!result) {
            if (subTask.IsMaster) {
                result = subTask.children ? subTask.children.find(e => this.canViewSubTask(e)) : false;
            } else if (parent) {
                result = this.canViewSubTask(parent)
            }
        }
        if (!result) {
            result = this.state.flowData.Nodes.find(e => auth.isCurrentUser(e.UserId))
        }
        return result;
    }

    buildTreeData = (node, list) => {
        node.children = list.filter(e => e.ParentId === node.ID && this.canViewSubTask(e, node));
        node.children.map(child => {
            child.Parent = node;
            this.buildTreeData(child, list);
            return child;
        })
        return node
    }

    handleDeleteSubTask = subTask => {
        let self = this;
        Modal.confirm({
            title: '删除提醒',
            content: '你确定要删除这项子任务吗？',
            onOk: function () {
                api.Task.DeleteSubTask(subTask.ID, () => {
                    self.loadData();
                })
            }
        })
    }

    handleDeleteTodo = todo => {
        let self = this;
        Modal.confirm({
            title: '删除提醒',
            content: '你确定要删除这项子任务吗？',
            onOk: function () {
                api.Task.DeleteTodo(todo.ID, () => {
                    self.loadData();
                })
            }
        })
    }

    getButtons = (subTask) => {
        switch (subTask.Status) {
            case 3:
            case 0:
                if (auth.isCurrentUser(subTask.ToUserId)) {
                    return <span>
                        <SubTaskSubmitModal
                            model={subTask}
                            onSubmit={this.loadData}
                            trigger={<Button>提交</Button>}
                        />
                        <TodoEditModal
                            title="添加子任务"
                            model={{ SubTaskId: subTask.ID }}
                            trigger={<Button>添加子任务</Button>}
                            onSubmit={this.loadData}
                        />
                    </span>
                }
                if (auth.isCurrentUser(subTask.CreatorId)) {
                    return <span>
                        <EditModal
                            model={subTask}
                            list={this.state.list}
                            trigger={<Button icon="edit">修改</Button>}
                            onSubmit={this.loadData}
                        />
                        <Button icon="delete" onClick={() => this.handleDeleteSubTask(subTask)}>删除</Button>
                    </span>
                }
                break;
            case 2:
                return "已完成";
            case 1:
                var list = this.state.flowData.Nodes || [];
                let checkNodeData = list.sort((a, b) => a.ID < b.ID).find(e => !e.Submited && e.ExtendId === subTask.ID);
                if (checkNodeData) {
                    return <SubTaskCheckModal
                        model={checkNodeData}
                        trigger={<Button>审核</Button>}
                        onSubmit={this.loadData}
                    />
                }
                break;
            default:
                return null;
        }
    }

    expandedRowRender = (subTask) => {
        let list = subTask.Todos;
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
                        {auth.isCurrentUser(item.ToUserId) ?
                            <span>
                                <Button type="success" onClick={() => this.handleUpdateStatus(item)}>{item.Completed ? '标记未完成' : '标记完成'}</Button>
                            </span>
                            : null
                        }
                        {auth.isCurrentUser(item.CreatorId) ?
                            <span>
                                <TodoEditModal
                                    model={item}
                                    trigger={<Button icon="edit">修改</Button>}
                                    onSubmit={this.loadData}
                                />
                                <Button type="error" icon="delete" onClick={() => this.handleDeleteTodo(item)}>删除</Button>
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
        const taskId = this.props.task.ID
        if (this.state.loading) return null;
        return (
            <div>
                {this.state.canAddSubTask ?
                    <EditModal
                        trigger={<Button type="primary" icon="plus">添加子任务</Button>}
                        model={{ TaskId: taskId }}
                        list={this.state.list}
                        onSubmit={this.loadData}
                    /> : null}
                <Table
                    rowKey="ID"
                    loading={this.state.loading}
                    indentSize={0}
                    defaultExpandAllRows={true}
                    columns={[
                        {
                            title: '状态', dataIndex: 'Completed', width: 90,
                            render: (text, item) => {
                                switch (item.Status) {
                                    default:
                                    case 0:
                                        return <Tag color="#108ee9">执行</Tag>
                                    case 1:
                                        return <Tag color="#f50">审核</Tag>
                                    case 2:
                                        return <Tag color="#87d068">完成</Tag>
                                    case 3:
                                        return <Tag color="#ff0">退回</Tag>
                                }
                            }
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
                                {this.getButtons(item)}
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