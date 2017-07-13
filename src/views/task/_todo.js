import React, { Component } from 'react'
import { Button, Table, Tag, Icon } from 'antd'
import moment from 'moment'
import EditModal from './_edit_todo'
import api from '../../models/api'
import auth from '../../models/auth'


class TodoTab extends Component {
    state = {
        taskId: this.props.taskId || 0,
        list: [],
    }
    componentWillMount() {
        this.loadData();
    }

    loadData = () => {
        api.Task.TodoList(this.state.taskId, json => {
            this.setState({ list: json })
        })
    }

    handleDelete = item => {
        if (auth.isCurrentUser(item.UserId)) {
            if (confirm("你确定要删除吗？")) {
                api.Task.DeleteTodo(item.ID, () => {
                    this.loadData()
                })
            }
        }
    }

    handleUpdateStatus = item => {
        api.Task.UpdateTodoStatus(item.ID, json => {
            this.loadData()
        })
    }

    render() {
        return (
            <div>
                <EditModal
                    trigger={<Button type="primary" icon="plus">添加任务</Button>}
                    model={{ TaskId: this.state.taskId }}
                    onSubmit={this.loadData}
                />
                <Table
                    rowKey="ID"
                    loading={this.state.loading}
                    columns={[
                        {
                            title: '状态', dataIndex: 'Completed', width: 60,
                            render: (text, item) => <Tag color={item.Completed ? "green" : ''}>{item.Completed ? "√ 完成" : '未完成'}</Tag>
                        },
                        {
                            title: '内容', dataIndex: 'Content',
                            render: text => text.split('\n').map((item, key) => <span key={key}>{item}<br /></span>)
                        },
                        { title: '负责人', width: 100, render: (text, item) => item.ToUser ? item.ToUser.RealName : '' },
                        { title: '创建时间', width: 150, dataIndex: 'CreateTime', render: (text) => (text) => text ? moment(text).format('ll') : '' },
                        { title: '计划完成时间', width: 150, dataIndex: 'ScheduleTime', render: (text) => text ? moment(text).format('ll') : '' },
                        {
                            title: '操作', width: 180, render: (text, item) => <span>
                                <Button onClick={() => this.handleUpdateStatus(item)}>{item.Completed ? '未完成' : '标记完成'}</Button>
                                <EditModal
                                    model={item}
                                    trigger={<Button>修改</Button>}
                                    onSubmit={this.loadData}
                                />
                                {auth.isCurrentUser(item.UserId) ? <Button onClick={() => this.handleDelete(item)}>删除</Button> : ''}
                            </span>
                        }
                    ]}
                    dataSource={this.state.list}
                    pagination={null}
                />
            </div>
        )
    }
}

export default TodoTab