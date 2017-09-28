import React, { Component } from 'react'
import { Table, Button } from 'antd'
import EditModal from './_edit'
import api from '../../models/api'
class SealList extends Component {

    state = { list: [], loading: false }
    componentWillMount() {
        this.loadData();
    }

    loadData = () => {
        api.Seal.List(json => {
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
        api.Seal.Delete(id, json => this.loadData);
    }

    render() {
        return (
            <div>
                <div className="toolbar">
                    <EditModal
                        title="添加图章"
                        trigger={<Button type="primary" icon="add">添加图章</Button>}
                        onSubmit={this.handleSubmit}
                    />
                </div>
                <Table
                    rowKey="ID"
                    loading={this.state.loading}
                    columns={[
                        { title: '名称', dataIndex: 'Name' },
                        { title: '状态', dataIndex: 'status' },
                        {
                            title: '管理', render: (text, item) => <Button.Group>
                                <EditModal
                                    title="修改图章"
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

export default SealList