import React, { Component } from 'react';
import { Table, Button } from 'antd'
import GroupModal from './_group_edit'
import api from '../../models/api'

class AttendanceGroupList extends Component {

    state = { loading: true }

    componentWillMount() {
        this.loadData()
    }


    loadData = () => {
        api.Attendance.Groups(json => {
            this.setState({ list: json, loading: false })
        })
    }

    handleSubmit = () => {
        this.loadData()
    }

    render() {
        return (
            <div>
                <div className="toolbar">
                    <GroupModal trigger={<Button icon="plus">添加组</Button>} onSubmit={this.handleSubmit} />
                </div>
                <Table
                    rowKey="ID"
                    loading={this.state.loading}
                    dataSource={this.state.list}
                    columns={[
                        {
                            title: '名称', dataIndex: 'Name',
                            render: (text, item) => <span>
                                {text}{item.Default ? "（默认）" : ""}
                            </span>
                        },
                        { title: '上午开始', dataIndex: 'AMBeginTime' },
                        { title: '上午结束', dataIndex: 'AMEndTime' },
                        { title: '下午开始', dataIndex: 'PMBeginTime' },
                        { title: '下午结束', dataIndex: 'PMEndTime' },
                        { title: '接口域名/IP', dataIndex: 'API' },
                        {
                            title: '操作', dataIndex: 'ID', render: (text, item) => <Button.Group>
                                <GroupModal
                                    trigger={<Button icon='edit'>修改</Button>}
                                    model={item}
                                    onSubmit={this.handleSubmit}
                                />
                            </Button.Group>
                        }
                    ]}
                    pagination={false}
                />
            </div>
        );
    }
}

export default AttendanceGroupList;