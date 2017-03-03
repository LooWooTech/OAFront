import React from 'react';
import { Affix, Table, Button, Popconfirm } from 'antd';
import NodeModal from './editnode';
import FlowModal from './editflow';
import api from '../../models/api';

export default class FlowList extends React.Component {
    state = { list: [] };
    flowNodeList = () => {
        return <Table
            columns={[
                { title: '节点名称', dataIndex: 'Name' },
                { title: '审核部门', dataIndex: 'DepartmentID' },
                { title: '审核人', dataIndex: 'UserID' },
                { title: '审核角色', dataIndex: 'RoleID' },
                {
                    title: '操作', dataIndex: 'ID', render: (text, item) =>
                        <Button.Group>
                            <Button icon="edit">编辑</Button>
                            <Button icon="delete">删除</Button>
                        </Button.Group>
                }
            ]}
        ></Table>
    }

    componentDidMount() {
        this.loadPageData();
    };
    componentWillUnmount() {
        api.Abort();
    };

    onEditSave = (err, values) => {
        api.Flow.Save(this, values, json => {
            this.loadPageData();
        });
        return false;
    };
    onExpand = (expended, record) => {
        console.log(expended);
        console.log(record);
    };
    loadPageData = () => {
        api.Flow.List(this, data => {
            this.setState({ list: data })
        });
    };
    render() {
        return <div>
            <Affix offsetTop={0} className="toolbar">
                <Button.Group>
                    <FlowModal children={<Button type="primary" icon="file">新建流程模板</Button>} onSubmit={this.onEditSave} />
                </Button.Group>
            </Affix>
            <Table
                rowKey="ID"
                loading={this.state.loading}
                expandedRowRender={this.flowNodeList}
                onExpand={this.onExpand}
                columns={[
                    { title: '名称', dataIndex: 'Name', },
                    {
                        title: '操作', dataIndex: 'ID', width: 200,
                        render: (text, item) => (
                            <span>
                                <FlowModal onOk={this.loadPageData} record={item} children={<Button icon="edit">编辑</Button>} />
                                <Popconfirm placement="topRight" title="你确定要删除吗？"
                                    onConfirm={() => api.Department.Delete(this, item.ID, this.loadPageData)}
                                    okText="是" cancelText="否">
                                    <Button type="danger" icon="delete">删除</Button>
                                </Popconfirm>
                            </span>
                        )
                    }
                ]}
                dataSource={this.state.list}
            >
            </Table>
        </div>;
    }
}