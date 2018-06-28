import React from 'react';
import { Affix, Table, Button, Popconfirm } from 'antd';
import EditModal from './edit';
import api from '../../models/api';

export default class DepartmentList extends React.Component {
    state = { list: [] };

    componentDidMount() {
        this.loadData();
    };
    componentWillUnmount() {
        api.Abort();
    };

    onEditSave = () => {
        this.loadData()
    };
    onDelete = item => {
        api.Category.Delete(item.ID, this.loadData);
    };

    loadData = () => {
        let formId = this.props.location.query.formId || 0;
        api.Category.List(formId, data => {
            let tree = this.getTree(data)
            this.setState({ list: tree, formId })
        });
    };

    getTree = (list) => {
        let roots = list.filter(e => e.ParentId === 0);
        roots.map(item => this.getChildren(item, list));
        return roots;
    }

    getChildren = (node, list) => {
        const depth = this.props.location.query.depth;
        if (depth && node.depth >= depth) {
            return [];
        }
        node.children = list.filter(e => e.ParentId === node.ID);
        node.children.map(item => this.getChildren(item, list));
        return node.children;
    }

    render() {
        const depth = this.props.location.query.depth;
        return <div>
            <Affix offsetTop={0} className="toolbar">
                <Button.Group>
                    <EditModal
                        trigger={<Button type="primary" icon="file">添加分类</Button>}
                        model={{ FormId: this.state.formId }}
                        onSubmit={this.onEditSave}
                    />
                </Button.Group>
            </Affix>
            <Table
                rowKey="ID"
                loading={this.state.loading}
                columns={[
                    { title: '名称', dataIndex: 'Name', },
                    {
                        title: '操作', dataIndex: 'ID', width: 300,
                        render: (text, item) => (
                            <span>
                                <EditModal onSubmit={this.loadData} model={item} trigger={<Button icon="edit">编辑</Button>} />
                                {!depth || item.depth < depth ?
                                    <EditModal onSubmit={this.loadData} model={{ ParentId: item.ID, FormId: item.FormId }} trigger={<Button icon="add">添加子类</Button>} />
                                    : null}
                                <Popconfirm placement="topRight" title="你确定要删除吗？"
                                    onConfirm={() => this.onDelete(item)}
                                    okText="是" cancelText="否">
                                    <Button type="danger" icon="delete">删除</Button>
                                </Popconfirm>
                            </span>
                        )
                    }
                ]}
                dataSource={this.state.list}
                pagination={false}
            >
            </Table>
        </div>;
    }
}