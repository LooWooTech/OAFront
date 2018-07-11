import React, { Component } from 'react'
import { Table, Button, Tag } from 'antd'
import EditModal from './_edit'
import ApplyModal from './_apply'
import api from '../../models/api'
import auth from '../../models/auth'

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

    handleApplySubmit = () => {

    }

    hasEditRight = () => auth.hasRight('Form.Seal.Edit') || auth.getUser().Role === 2;

    statusColumnRender = (text, item) => {
        if (text === 0) return <Tag color="green">空闲</Tag>;
        return <Tag color="red">使用中</Tag>
    }
    buttonsColumnRender = (text, item) => {
        let btns = []
        if (item.Status === 0) {
            btns.push(<ApplyModal key="apply" model={item} onSubmit={this.handleApplySubmit} />)
        }
        if (this.hasEditRight()) {
            btns.push(<Button.Group key="edit">
                <EditModal
                    title="修改印章"
                    model={item}
                    onSubmit={this.handleSubmit}
                    trigger={<Button icon="edit">修改</Button>}
                />

                <Button icon="delete" type="danger" onClick={() => this.handleDelete(item.ID)}>删除</Button>
            </Button.Group>)
        };
        return btns;
    }

    handleDelete = (id) => {
        api.Seal.Delete(id, json => this.loadData);
    }

    render() {
        return (
            <div>
                <div className="toolbar">
                    <h3>印章列表</h3>
                    {this.hasEditRight() ?
                        <EditModal
                            title="添加印章"
                            trigger={<Button type="primary" icon="add">添加印章</Button>}
                            onSubmit={this.handleSubmit}
                        />
                        : null}
                </div>
                <Table
                    rowKey="ID"
                    loading={this.state.loading}
                    columns={[
                        { title: '名称', dataIndex: 'Name' },
                        { title: '操作', render: this.buttonsColumnRender }
                    ]}
                    dataSource={this.state.list}
                    pagination={false}
                />
            </div>
        )
    }
}

export default SealList