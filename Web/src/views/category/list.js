import React from 'react';
import { Affix, Table, Button, Popconfirm } from 'antd';
import EditModal from './edit';
import api from '../../models/api';

function buildTreeData(list) {
    var roots = [];
    list.map(item => {
        if (item.ParentID === 0) {
            roots.push(getChildren(item, list));
        }
        return null;
    });
    return roots;
}
function getChildren(node, list) {
    list.map(item => {
        if (item.ParentID === node.ID) {
            if (!node.children) node.children = [];
            node.children.push(getChildren(item, list));
        }
        return null;
    });
    return node;
}

export default class DepartmentList extends React.Component {
    state = { list: [] };

    componentDidMount() {
        this.loadPageData();
    };
    componentWillUnmount() {
        api.Abort();
    };

    onEditSave = (err, values) => {
        api.Category.Save(values, json => {
            this.loadPageData();
        });
        return false;
    };
    onDelete = item => {
        api.Category.Delete(item.ID, this.loadPageData);
    };
    loadPageData = () => {
        let formId = this.props.location.query.formId || 0;
        api.Category.List({ formId }, data => {
            var tree = buildTreeData(data);
            this.setState({ list: tree })
        });
    };
    render() {
        return <div>
            <Affix offsetTop={0} className="toolbar">
                <Button.Group>
                    <EditModal children={<Button type="primary" icon="file">新建分类</Button>} onSubmit={this.onEditSave} />
                </Button.Group>
            </Affix>
            <Table
                rowKey="ID"
                loading={this.state.loading}
                columns={[
                    { title: '名称', dataIndex: 'Name', },
                    {
                        title: '操作', dataIndex: 'ID', width: 200,
                        render: (text, item) => (
                            <span>
                                <EditModal onSubmit={this.loadPageData} record={item} children={<Button icon="edit">编辑</Button>} />
                                <EditModal onSubmit={this.loadPageData} parent={item} children={<Button icon="add">添加子类</Button>} />
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