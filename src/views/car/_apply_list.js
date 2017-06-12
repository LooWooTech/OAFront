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
        this.loadData()
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

    loadData = (carId, userId, status, page) => {
        let parameter = {
            carId: carId === 0 ? 0 : (carId || this.state.carId || 0),
            userId: userId === 0 ? 0 : (userId || this.state.userId || 0),
            status: status === 0 ? 0 : (status || this.state.status || 0),
            page: page || this.state.page || 1,
        }
        api.Car.ApplyList(parameter, json => {
            this.setState({ list: json.List, ...parameter, loading: false })
        })
    }

    handleSubmitFlowCallback = flowData => {
        if (!flowData) return;
        api.Car.Approval(flowData.InfoId || 0, json => {
            this.loadData();
        });
    }

    handleBack = infoId => {
        if (confirm("你确定要已归还车辆了吗？")) {
            api.Car.Back(infoId, json => {
                this.loadData();
            })
        }
    }


    getColumns = () => {
        var columns = []
        let carId = this.props.carId || 0;
        let userId = this.props.userId || 0;
        let currentUser = auth.getUser();
        if (!carId) {
            columns.push({ title: '车辆', render: (text, item) => <span>{item.Car.Name}（{item.Car.Number}）<br />{item.Reason}</span> })
        }
        if (!userId) {
            columns.push({ title: '申请人', dataIndex: 'ApplyUser' })
        }
        columns = columns.concat([
            { title: '申请日期', dataIndex: 'CreateTime', render: (text, item) => moment(text).format('ll') },
            { title: '使用时间范围', render: (text, item) => <span>{moment(item.ScheduleBeginTime).format('ll')} ~ {moment(item.ScheduleEndTime).format('ll')}</span> },
            {
                title: '申请结果', dataIndex: 'Result', render: (text, item) => {
                    switch (item.Result) {
                        case true:
                            return <Tag color="green">通过</Tag>
                        case false:
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
                    {item.Result === null && item.ApprovalUserId === currentUser.ID ?
                        <SubmitFlowModal
                            infoId={item.ID}
                            trigger={<Button>审批</Button>}
                            callback={this.handleSubmitFlowCallback}
                        />
                        : null}
                    {item.Result === true && item.UserId === currentUser.ID && !item.RealEndTime ?
                        <Button icon="reply" type="primary" onClick={() => this.handleBack(item.ID)}>还车</Button>
                        : null}
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