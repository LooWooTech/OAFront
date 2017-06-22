import React, { Component } from 'react'
import { Table, Input, Upload, Radio, Button } from 'antd'
import EditModal from './_redtitle_edit'
import api from '../../models/api'

class MissiveRedTitleList extends Component {
    state = { list: [] }
    componentWillMount() {
        this.loadData();
    }

    loadData = () => {
        api.Missive.RedTitleList(json => {
            this.setState({ list: json })
        })
    }

    render() {
        return (
            <div>
                <div className="toolbar">
                    <EditModal
                        title="添加红头"
                        trigger={<Button type="primary" icon="file">添加红头</Button>}
                        onSubmit={() => this.loadData()}
                    />
                </div>
                <Table
                    rowKey="ID"
                    loading={this.state.loading}
                    columns={[
                        { title: '文件字', dataIndex: 'Name' },
                        {
                            title: '操作', render: (text, item) => <span>
                                <EditModal
                                    title="修改红头"
                                    model={item}
                                    trigger={<Button icon="edit">修改</Button>}
                                    onSubmit={() => this.loadData()}
                                />
                                <Button icon="delete" type="danger" onClick={e => this.handleDelete(item.ID)}>删除</Button>
                            </span>
                        }
                    ]}
                    dataSource={this.state.list}
                    pagination={false}

                />
            </div>
        )
    }
}

export default MissiveRedTitleList