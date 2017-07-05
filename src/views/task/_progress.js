import React, { Component } from 'react'
import { Button } from 'antd'
import moment from 'moment'
import EditModal from './_edit_progress'
import api from '../../models/api'
import auth from '../../models/auth'

class TaskProgressList extends Component {
    state = {
        taskId: this.props.taskId || 0,
        list: [],
    }
    componentWillMount() {
        this.loadData();
    }

    loadData = () => {
        api.Task.ProgressList(this.state.taskId, json => {
            this.setState({ list: json })
        })
    }

    handleDelete = item => {
        if (auth.isCurrentUser(item.UserId)) {
            if (confirm("你确定要删除吗？")) {
                api.Task.DeleteProgress(item.ID, () => {
                    this.loadData()
                })
            }
        }
    }

    render() {
        return (
            <div>
                <EditModal
                    model={{ TaskId: this.state.taskId, Content: '' }}
                    trigger={<Button type="primary" icon="plus">添加进度</Button>}
                    onSubmit={() => this.loadData()}
                />
                {this.state.list.map(item => <div key={item.ID}>
                    <div className="item-progress">
                        <div className="item-header">
                            <span>{item.RealName}</span>
                            <span>{moment(item.CreateTime).format('lll')}</span>
                            {auth.isCurrentUser(item.UserId) ? <span>
                                <EditModal
                                    model={item}
                                    trigger={<a>修改</a>}
                                    onSubmit={() => this.loadData()}
                                />
                                <a onClick={() => this.handleDelete(item)}>删除</a>
                            </span> : null}
                        </div>
                        <div className="item-body">
                            {item.Content}
                        </div>

                    </div>
                </div>)}
            </div>
        )
    }
}

export default TaskProgressList