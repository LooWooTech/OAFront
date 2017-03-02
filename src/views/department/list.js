import React from 'react';
import { Affix, Table, Button, Popconfirm } from 'antd';
import EditModal from './edit';
import api from '../../models/api';

export default class DepartmentList extends React.Component {
    state = { list: [] };

    componentDidMount() {
        this.loadPageData();
    };
    componentWillUnmount() {
        api.Abort();
    };

    onEditSave = (err, values) => {
        api.Department.Save(this, values, json => {
            this.loadPageData();
        });
        return false;
    };
    loadPageData = () => {
        api.Department.List(this, data => {
            this.setState({ list: data })
        });
    };
    render() {
        return <div>
            <Affix offsetTop={0} className="toolbar">
                <Button.Group>
                    <EditModal children={<Button type="primary" icon="file">新建部门</Button>} onSubmit={this.onEditSave} />
                </Button.Group>
            </Affix>
            <Table
                rowKey="ID"
                loading={this.state.loading}
                columns={[
                    { title: '部门名称', dataIndex: 'Name', },
                    {
                        title: '操作', dataIndex: 'ID', width: 200,
                        render: (text, item) => (
                            <span>
                                <EditModal onOk={this.loadPageData} record={item} children={<Button icon="edit">编辑</Button>} />
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