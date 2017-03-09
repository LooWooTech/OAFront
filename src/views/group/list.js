import React from 'react';
import { Affix, Table, Button, Popconfirm } from 'antd';
import EditModal from './edit';
import api from '../../models/api';

export default class GroupList extends React.Component {
    state = { list: [] };

    componentDidMount() {
        this.loadPageData();
    };
    componentWillUnmount() {
        api.Abort();
    };
    loadPageData = () => {
        api.Group.List(this, data => {
            this.setState({ list: data })
        });
    };

    onEditSave = (err, values) => {
        api.Group.Save(this, values, this.loadPageData);
    }

    render() {
        return <div>
            <Affix offsetTop={0} className="toolbar">
                <Button.Group>
                    <EditModal children={<Button type="primary" icon="file">新建分组</Button>} onSubmit={this.onEditSave} />
                </Button.Group>
            </Affix>
            <Table
                rowKey="ID"
                loading={this.state.loading}
                columns={[
                    { title: '分组名称', dataIndex: 'Name', },
                    {
                        title: '操作', dataIndex: 'ID', width: 200,
                        render: (text, item) => (
                            <Button.Group>
                                <EditModal onSubmit={this.onEditSave} record={item} children={<Button icon="edit">编辑</Button>} />
                                <Popconfirm placement="topRight" title="你确定要删除吗？"
                                    onConfirm={() => api.Group.Delete(this, item.ID, this.loadPageData)}
                                    okText="是" cancelText="否">
                                    <Button type="danger" icon="delete">删除</Button>
                                </Popconfirm>
                            </Button.Group>
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