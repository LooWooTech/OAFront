import React from 'react';
import { Affix, Table, Button, Popconfirm, Input, TreeSelect } from 'antd';
import EditModal from '../shared/_formmodal';
import api from '../../models/api';
const TreeNode = TreeSelect.TreeNode;
export default class DepartmentList extends React.Component {
    componentDidMount() {
        this.loadData();
    };
    componentWillUnmount() {
        api.Abort();
    };

    onEditSave = (values) => {
        api.Department.Save(values, json => {
            this.loadData();
        });
    };
    loadData = () => {
        api.Department.List(data => {
            let roots = data.filter(e => e.ParentId === 0)
            roots = roots.map(node => this.buildTreeData(node, data))
            this.setState({ list: roots })
        });
    };

    buildTreeData = (node, list) => {
        node.children = list.filter(e => e.ParentId === node.ID)
        node.children.map(child => this.buildTreeData(child, list))
        return node
    }

    getTreeNode = (node) => <TreeNode value={node.ID.toString()} title={node.Name} key={node.ID}>
        {node.children && node.children.length > 0 ? node.children.map(child => this.getTreeNode(child)) : null}
    </TreeNode>

    getFormItems = record => {
        record = record || { ID: 0, Name: '' };
        return [{
            name: 'ID',
            defaultValue: record.ID,
            render: <Input type="hidden" />
        }, {
            title: '名称',
            name: 'Name',
            defaultValue: record.Name,
            render: <Input />
        }, {
            title: '所属部门',
            name: 'ParentId',
            defaultValue: (record.ParentId || '').toString(),
            render: <TreeSelect
                dropdownStyle={{ maxHeight: '400px' }}
                treeDefaultExpandAll={true}
            >
                {this.getTreeNode({ ID: 0, Name: '定海国土局', children: this.state.list.filter(e => e.ParentId === 0) })}
            </TreeSelect>
        }, {
            title: '排序',
            name: 'Sort',
            defaultValue: (record.Sort || 0),
            layout: { labelCol: { span: 6 }, wrapperCol: { span: 3 } },
            render: <Input />
        }
        ];
    };
    render() {
        if (!this.state) return null;

        return <div>
            <Affix offsetTop={0} className="toolbar">
                <Button.Group>
                    <EditModal
                        name="添加部门"
                        children={this.getFormItems()}
                        trigger={<Button type="primary" icon="file">添加部门</Button>}
                        onSubmit={this.onEditSave}
                    />
                </Button.Group>
            </Affix>
            <Table
                rowKey="ID"
                loading={this.state.loading}
                indentSize={30}
                defaultExpandAllRows={true}
                columns={[
                    { title: '部门名称', dataIndex: 'Name', },
                    {
                        title: '操作', width: 200,
                        render: (text, item) => (
                            <span>
                                <EditModal
                                    name="编辑部门"
                                    onSubmit={this.onEditSave}
                                    children={this.getFormItems(item)}
                                    trigger={<Button icon="edit">编辑</Button>}
                                />
                                <Popconfirm placement="topRight" title="你确定要删除吗？"
                                    onConfirm={() => api.Department.Delete(item.ID, this.loadData)}
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