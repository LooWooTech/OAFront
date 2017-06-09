import React, { Component } from 'react';
import { Table, Button, Tag } from 'antd'
import moment from 'moment'
import api from '../../models/api'
import auth from '../../models/auth'
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
        let currentUser = auth.getUser() ;
        if (!carId) {
            columns.push({ title: '车辆', render: (text, item) => <span>{item.Car.Name}（{item.Car.Number}）<br />{item.Reason}</span> })
        }
        if (!userId) {
            columns.push({ title: '申请人', dataIndex: 'RealName' })
        }
        columns = columns.concat([
            { title: '申请日期', dataIndex: 'CreateTime', render: (text, item) => moment(text).format('ll') },
            { title: '使用时间范围', render: (text, item) => <span>{moment(item.ScheduleBeginTime).format('ll')} ~ {moment(item.ScheduleEndTime).format('ll')}</span> },
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
            { title: '处理日期', dataIndex: 'UpdateTime', render: (text, item) => text ? moment(text).format('ll') : null },
            {
                title: '操作',
                render: (text, item) => <span>
                    {!item.Result && item.ApprovalUserId === currentUser.ID ? <SubmitFlowModal infoId={item.ID} trigger={<Button>审批</Button>} /> : null}
                    {!item.RealEduTime && item.UserId === currentUser.ID ? <Button>还车</Button> : null}
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
                    dataSource={this.state.list}
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