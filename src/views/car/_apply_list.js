import React, { Component } from 'react';
import { Table, Button, Tag } from 'antd'
import moment from 'moment'
import api from '../../models/api'
import SubmitFlowModal from '../flowdata/form'

class CarApplyList extends Component {

    state = {
        list: [],
        loading: true,
        userId: this.props.userId || 0,
        carId: this.props.carId || 0,
        status: this.props.status || 0,
        page: 1
    }


    componentWillMount() {
        this.loadData(this.state.carId, this.state.userId, this.state.status, 1)
    }

    componentWillReceiveProps(nextProps) {
        let nextUserId = nextProps.userId
        let nextCarId = nextProps.carId
        let nextStatus = nextProps.status
        if (nextUserId !== this.state.userId
            || nextCarId !== this.state.carId
            || nextStatus !== this.state.status
        ) {
            this.loadData(nextCarId, nextUserId, nextStatus, this.state.page)
        }
    }

    loadData = (carId = 0, userId = 0, status = 0, page = 1) => {
        api.Car.ApplyList({
            carId, userId, page, status
        }, json => {
            this.setState({
                list: json.List,
                carId,
                userId,
                status,
                page,
                loading: false
            })
        })
    }


    getColumns = () => {
        var columns = []
        let carId = this.props.carId || 0;
        let userId = this.props.userId || 0;

        if (!carId) {
            columns.push({ title: '车辆', render: (text, item) => <span>{item.Car.Name}（{item.Car.Number}）</span> })
        }
        if (!userId) {
            columns.push({ title: '申请人', dataIndex: 'RealName' })
        }
        columns = columns.concat([
            { title: '申请日期', dataIndex: 'CreateTime', render: (text, item) => moment(text).format('lll') },
            { title: '使用时间范围', render: (text, item) => <span>{moment(item.Data.ScheduleBeginTime).format('l')} ~ {moment(item.Data.ScheduleEndTime).format('l')}</span> },
            {
                title: '申请结果', dataIndex: 'Result', render: (text, item) => {
                    switch (text) {
                        case "True":
                            return <Tag color="green">通过</Tag>
                        case "False":
                            return <Tag color="red">失败</Tag>
                        default:
                            return <Tag>未审核</Tag>
                    }
                }
            },
            { title: '处理日期', dataIndex: 'UpdateTime', render: (text, item) => moment(text).format('lll') },
            {
                title: '操作',
                render: (text, item) => <span>
                    {this.state.userId > 0 ?
                        <span>

                        </span> :
                        <SubmitFlowModal
                            callback={this.loadData}
                            flowDataId={item.FlowDataId}
                            children={<Button type="success" icon="check" htmlType="button">审批</Button>}
                        />
                    }
                </span>
            }
        ]);
        return columns;
    }


    render() {
        return (
            <div>
                <Table
                    rowKey="ID"
                    loading={this.state.loading}
                    columns={this.getColumns()}
                    dataSource={this.state.applies}
                    pagination={{
                        size: 5, ...this.state.page,
                        onChange: (page) => {
                            this.loadData(this.state.carId, this.state.userId, this.state.status, page)
                        },
                    }}
                />
            </div>
        );
    }
}

export default CarApplyList;