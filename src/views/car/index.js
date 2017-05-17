import React, { Component } from 'react'
import { Card, Spin, Table, Affix, Button, Tag } from 'antd'
import api from '../../models/api'
import ApplyFormModal from './apply'
import EditFormModal from './edit'

class CarIndex extends Component {

    state = { list: [], flowId: api.FormId.Car }

    componentWillMount() {
        this.loadData()
    }

    loadData = () => {
        api.Car.List(json => this.setState({ list: json, loading: false }))
    }

    getStatus = item => {
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
                <Spin spinning={this.state.loading}>
                    {this.state.list.map(item =>
                        <Card key={item.ID} style={{ width: '240px', float: 'left', marginBottom: '20px', marginRight: '20px' }} bordered={false} bodyStyle={{ padding: 0 }} title={item.Name} extra={this.getStatus(item)}>
                            <div className="car-image">
                                <img alt={item.Number.toUpperCase()} src={item.PhotoId > 0 ? api.File.FileUrl(item.PhotoId) : `/static/images/car_${item.Type}.jpg`} />
                            </div>
                            <div className="cardbar">
                                <Button.Group>
                                    {item.Status === 0 && !item.Applied ? <ApplyFormModal flowId={this.state.flowId} car={item} onSubmit={this.loadData} /> : null}
                                    <EditFormModal
                                        title="修改车辆信息"
                                        trigger={<Button icon="edit">修改</Button>}
                                        record={item}
                                        onSubmit={this.loadData}
                                    />
                                </Button.Group>
                            </div>
                        </Card>
                    )}
                </Spin>
            </div>
        )
    }
}

export default CarIndex