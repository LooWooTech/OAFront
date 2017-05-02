import React, { Component } from 'react'
import { Table, Affix, Button, Tag } from 'antd'
import api from '../../models/api'
import ApplyFormModal from './apply'
import EditFormModal from './edit'

class CarIndex extends Component {

    state = { list: [], flowId: api.Flow.ID.Car }

    componentWillMount() {
        this.loadData()
    }

    loadData = () => {
        api.Car.List(json => this.setState({ list: json }))
    }

    render() {

        return (
            <div>
                <Affix offsetTop={0} className="toolbar">
                    <Button.Group>
                        <EditFormModal
                            onSubmit={this.loadData}
                            trigger={<Button type="primary" icon="plus">添加车辆</Button>}
                        />
                    </Button.Group>
                </Affix>
                <Table
                    rowKey="ID"
                    columns={[
                        { dataIndex: 'Name', title: '名称' },
                        { dataIndex: 'Number', title: '号码' },
                        {
                            dataIndex: 'Type', title: '类型', width: 150,
                            render: (text, item) => {
                                let name = '其他';
                                let color = '';
                                switch (item.Type) {
                                    case 1:
                                        name = '轿车';
                                        color = '#2db7f5';
                                        break;
                                    case 2:
                                        name = 'SUV越野车';
                                        color = '#f50';
                                        break;
                                    default: break;
                                }
                                return <Tag color={color}>{name}</Tag>
                            }
                        },
                        {
                            dataIndex: 'Status', title: '状态', width: 150,
                            render: (text, item) => {
                                let name = '无法使用';
                                let color = 'gray';
                                switch (item.Status) {
                                    case 0:
                                        name = '闲置';
                                        color = 'green';
                                        break;
                                    case 1:
                                        name = '使用中';
                                        color = 'red';
                                        break;
                                    default:
                                        name = '维修中';
                                        break;
                                }
                                return <Tag color={color}>{name}</Tag>
                            }
                        },
                        {
                            title: '操作', width: 200, render: (text, item) =>
                                <span>
                                    {item.Status === 0 ? <ApplyFormModal flowId={this.state.flowId} car={item} onSubmit={this.loadData} /> : null}
                                    <EditFormModal
                                        title="修改车辆信息"
                                        trigger={<Button icon="edit">修改</Button>}
                                        record={item}
                                        onSubmit={this.loadData}
                                    />
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

export default CarIndex