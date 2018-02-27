import React, { Component } from 'react'
import { Button, Table, Tag, Modal, Icon } from 'antd'
import moment from 'moment'
import EditModal from './_edit_sub_task'
import SubTaskCheckModal from './_sub_task_check'
import SubTaskSubmitModal from './_sub_task_submit'
import SubTaskFlowModal from './_sub_task_flow_modal'
import TodoEditModal from './_edit_todo'
import api from '../../models/api'
import auth from '../../models/auth'


class SubTaskList extends Component {
    state = {
        task: this.props.task,
        flowData: { Nodes: [] },
        canViewAllSubTasks: this.props.canViewAllSubTasks,
        canAddSubTask: this.props.canAddSubTask,
        list: [],
        loading: true
    }

    componentWillMount() {
        this.loadData();
    }

    loadData = () => {
        if (!this.state.loading) {
            this.setState({ loading: true })
        }
        const taskId = this.state.task.ID
        api.Task.SubTaskList(taskId, json => {
            let roots = json.filter(e => e.ParentId === 0);
            roots = roots.map(node => this.buildTreeData(node, json)).filter(e => this.canViewSubTask(e))
            api.FlowData.Model(this.props.flowdataId, taskId, data => {
                this.setState({
                    list: roots,
                    loading: false,
                    flowData: data.flowData
                })
            })
        });
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
        return true;
        // var result = this.state.canViewAllSubTasks
        //     || auth.isCurrentUser(subTask.CreatorId)
        //     || auth.isCurrentUser(subTask.ToUserId);

        // if (!result) {
        //     result = subTask.Todos.find(t => auth.isCurrentUser(t.ToUserId))
        // }
        // if (!result) {
        //     if (subTask.IsMaster) {
        //         result = subTask.children ? subTask.children.find(e => this.canViewSubTask(e)) : false;
        //     } else if (parent) {
        //         result = this.canViewSubTask(parent)
        //     }
        // }
        // if (!result) {
        //     result = this.state.flowData.Nodes.find(e => auth.isCurrentUser(e.UserId) && e.ExtendId === subTask.ID)
        // }
        // return result;
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
        let buttons = [];
        if (auth.isCurrentUser(subTask.CreatorId)) {
            buttons.push(
                <EditModal
                    model={subTask}
                    list={this.state.list}
                    trigger={<Button icon="edit">修改</Button>}
                    onSubmit={this.loadData}
                />
            )
        }
        switch (subTask.Status) {
            case 3:
            case 0:
                if (auth.isCurrentUser(subTask.ToUserId)) {
                    buttons.push(
                        <SubTaskSubmitModal
                            model={subTask}
                            onSubmit={this.loadData}
                            trigger={<Button type="primary" icon="check">提交</Button>}
                        />
                    );
                    buttons.push(
                        <TodoEditModal
                            title="添加子任务"
                            model={{ SubTaskId: subTask.ID }}
                            trigger={<Button icon="plus">子任务</Button>}
                            onSubmit={this.loadData}
                        />
                    )
                }
                else if (auth.isCurrentUser(subTask.CreatorId)) {
                    if (subTask.IsMaster && this.state.canAddSubTask) {
                        buttons.push(
                            <EditModal
                                trigger={<Button type="primary" icon="plus">协办</Button>}
                                model={{ TaskId: subTask.TaskId, ParentId: subTask.ID, }}
                                list={this.state.list}
                                onSubmit={this.loadData}
                            />
                        )

                    }
                    buttons.push(
                        <Button icon="delete" type="danger" onClick={() => this.handleDeleteSubTask(subTask)}>删除</Button>
                    )
                }
                break;
            case 2:
            case 1:
                let list = this.state.flowData.Nodes.sort((a, b) => a.ID - b.ID);
                let logs = list.filter(e => e.ExtendId === subTask.ID)
                let checkNodeData = list.find(e => !e.Submited && e.ExtendId === subTask.ID && auth.isCurrentUser(e.UserId));
                let parentNodeData = checkNodeData ? list.find(e => e.ID === checkNodeData.ParentId) : null
                buttons.push(
                    <SubTaskFlowModal list={logs}
                        trigger={<Button>审核记录</Button>}
                    />
                );
                if (checkNodeData) {
                    buttons.push(
                        <SubTaskCheckModal
                            model={checkNodeData}
                            parent={parentNodeData}
                            trigger={<Button>审核</Button>}
                            onSubmit={this.loadData}
                        />
                    )
                }
                break;
            default:
                break;
        }
        return buttons;
    }

    contentRender = (text, item) => {
        return <div style={{ paddingLeft: item.ParentId > 0 ? '30px' : '0' }}>
            {text.split('\n').map((item, key) => <span key={key}>{item}<br /></span>)}
        </div>
    }

    canViewTodos = (subTask) => {
        var result = auth.isCurrentUser(subTask.ToUserId);

        if (!result) {
            result = subTask.Todos.find(t => auth.isCurrentUser(t.ToUserId))
        }
        return result;
    }

    todoStatusColumnRender = (text, item) => <Tag color={item.Completed ? "green" : ''}>{item.Completed ? "完成" : '未完成'}</Tag>
    contentColumnRender = (text, item) => (
        <span>
            {moment(item.ScheduleDate) <= moment() ? <Icon type="exclamation" className="red" /> : null}
            {text.split('\n').map((item, key) => <span key={key}>{item}<br /></span>)}
        </span>
    )
    createTimeColumnRender = (text, item) => text ? moment(text).format('YYYY-MM-DD HH:mm') : ''
    scheduleDateColumnRender = (text, item) => text ? moment(text).format('YYYY-MM-DD') : ''
    todoOperateColumnRender = (text, item) => (
        <span>
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
    )
    departmentColumnRender = (text, item) => (
        <span>
            {item.IsMaster ? <Tag color="green">主办</Tag> : <Tag color="blue">协办</Tag>}
            {item.ToDepartmentName}
        </span>
    )
    userNameColumnRender = (text, item) => item.ToUserName || '未指派'
    buttonsColumnRender = (text, item) => this.getButtons(item).map((item, key) => <span key={key}>{item}</span>)
    statusColumnRender = (text, item) => {
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
    expandedRowRender = (subTask) => {
        let list = subTask.Todos;
        if (list.length === 0) {
            return null;
        }
        if (!this.canViewTodos(subTask)) {
            return null;
        }

        return <Table
            rowKey="ID"
            columns={[
                { title: '状态', dataIndex: 'Completed', width: 60, render: this.todoStatusColumnRender },
                { title: '内容', dataIndex: 'Content', render: this.contentColumnRender },
                { title: '负责人', width: 100, dataIndex: 'ToUserName' },
                { title: '创建时间', width: 170, dataIndex: 'CreateTime', render: this.createTimeColumnRender },
                { title: '计划完成时间', width: 150, dataIndex: 'ScheduleDate', render: this.scheduleDateColumnRender },
                { title: '操作', width: 240, render: this.todoOperateColumnRender }
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
                        trigger={<Button type="primary" icon="plus">添加任务</Button>}
                        model={{ TaskId: taskId }}
                        list={this.state.list}
                        onSubmit={this.loadData}
                    /> : null}
                <Table
                    rowKey="ID"
                    loading={this.state.loading}
                    indentSize={0}
                    defaultExpandAllRows={true}
                    dataSource={this.state.list}
                    pagination={false}
                    expandedRowRender={this.expandedRowRender}
                    columns={[
                        { title: '状态', dataIndex: 'Completed', width: 90, render: this.statusColumnRender },
                        { title: '任务目标', dataIndex: 'Content', render: this.contentColumnRender },
                        { title: '科室', width: 170, render: this.departmentColumnRender },
                        { title: '责任人', width: 80, render: this.userNameColumnRender },
                        { title: '创建时间', width: 170, dataIndex: 'CreateTime', render: this.createTimeColumnRender },
                        { title: '计划完成时间', width: 130, dataIndex: 'ScheduleDate', render: this.scheduleDateColumnRender },
                        { title: '操作', width: 200, render: this.buttonsColumnRender }
                    ]}
                />
            </div>
        )
    }
}

export default SubTaskList