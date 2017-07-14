import React, { Component } from 'react';
import { Table, Input, Button } from 'antd';
import EditModal from './_edit';
import api from '../../models/api';

class SystemConfig extends Component {
    state = { list: [] }
    componentWillMount() {
        this.loadData()
    }

    loadData = () => {
        api.Config.List(json => {
            this.setState({ list: json })
        })
    }
    getItems = () => {
        var items = [];
        this.state.list.map(item => {
            items.push({
                title: 'Key',
                name: 'Keys',
                defaultValue: item.Key,
                render: <Input />
            });
            items.push({
                title: 'value',
                name: 'Values',
                defaultValue: item.Value,
                render: <Input />
            });
        });
        return items;
    }

    handleDelete = item => {
        api.Config.Delete(item.Key, json => {
            this.loadData();
        })
    }

    render() {
        return (
            <div>
                <div className="toolbar">
                    <EditModal
                        trigger={<Button type="primary" icon="file" >添加参数</Button>}
                        onSubmit={this.loadData}
                    />
                </div>
                <Table
                    rowKey="Key"
                    loading={this.state.loading}
                    columns={[
                        { title: '键', dataIndex: 'Key', rules: [{ required: true, message: '请填写参数名称' }] },
                        { title: '值', dataIndex: 'Value', rules: [{ required: true, message: '请填写参数值' }], },
                        {
                            title: '操作', width: 180, render: (text, item) => <span>
                                <EditModal
                                    model={item}
                                    trigger={<Button>修改</Button>}
                                    onSubmit={this.loadData}
                                />
                            </span>
                        }
                    ]}
                    dataSource={this.state.list}
                    pagination={false}
                />
            </div>
        );
    }
}

export default SystemConfig;