import React, { Component } from 'react'
import { Table, Button } from 'antd'
import EditModal from './_edit'
import api from '../../models/api'
class MeetingRoomList extends Component {

    state = { list: [], loading: false }
    componentWillMount() {
        this.loadData();
    }

    loadData = () => {
        api.MeetingRoom.List(json => {
            this.setState({
                list: json,
                loading: false
            })
        })
    }

    handleSubmit = (json) => {
        this.loadData();
    }

    handleDelete = (id) => {
        if (confirm("你确定要删除该会议室吗？")) {
            api.MeetingRoom.Delete(id, json => this.loadData);
        }
    }

    render() {
        return (
            <div>
                <div className="toolbar">
                    <EditModal
                        title="添加会议室"
                        trigger={<Button type="primary" icon="add">添加会议室</Button>}
                        onSubmit={this.handleSubmit}
                    />
                </div>
                <Table
                    rowKey="ID"
                    loading={this.state.loading}
                    columns={[
                        { title: '名称', dataIndex: 'Name' },
                        { title: '房号', dataIndex: 'Number' },
                        { title: '状态', dataIndex: 'status' },
                        {
                            title: '管理', render: (text, item) => <Button.Group>
                                <EditModal
                                    title="修改会议室"
                                    model={item}
                                    onSubmit={this.handleSubmit}
                                    trigger={<Button icon="edit">修改</Button>}
                                />

                                <Button icon="delete" type="danger" onClick={() => this.handleDelete(item.ID)}>删除</Button>
                            </Button.Group>
                        }
                    ]}
                    dataSource={this.state.list}
                    pagination={false}
                />
            </div>
        )
    }
}

export default MeetingRoomList