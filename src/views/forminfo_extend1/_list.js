import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Table, Button, Tag } from 'antd'
import moment from 'moment'
import api from '../../models/api'
import auth from '../../models/auth'
import SubmitFlowModal from '../flowdata/form'

class Extend1ListComponent extends Component {

    state = {
        list: [],
        loading: true,
        userId: this.props.userId || 0,
        infoId: this.props.infoId || 0,
        status: this.props.status || 0,
        page: 1
    }

    componentWillMount() {
        this.loadData()
    }

    componentWillReceiveProps(nextProps) {
        let nextUserId = nextProps.userId
        let nextInfoId = nextProps.infoId
        let nextStatus = nextProps.status
        if (nextUserId !== this.state.userId
            || nextInfoId !== this.state.infoId
            || nextStatus !== this.state.status
        ) {
            this.loadData(nextInfoId, nextUserId, nextStatus, this.state.page)
        }
    }

    loadData = (infoId, userId, status, page) => {
        let parameter = {
            infoId: infoId === 0 ? 0 : (infoId || this.state.infoId || 0),
            userId: userId === 0 ? 0 : (userId || this.state.userId || 0),
            status: status === 0 ? 0 : (status || this.state.status || 0),
            page: page || this.state.page || 1,
        }
        api.FormInfoExtend1.List(parameter, json => {
            this.setState({ list: json.List, ...parameter, loading: false })
        })
    }

    handleSubmitFlowCallback = flowData => {
        if (!flowData) return;
        api.FormInfoExtend1.Approval(flowData.InfoId || 0, json => {
            this.loadData();
        });
    }

    handleBack = infoId => {
        if (confirm(`你确定要已归还了吗？`)) {
            api.FormInfoExtend1.Back(infoId, json => {
                this.loadData();
            })
        }
    }


    getColumns = () => {
        var columns = []
        let infoId = this.props.infoId || 0;
        let userId = this.props.userId || 0;
        let formId = this.props.formId || 0;
        let formName = ''
        for (var key in api.Forms) {
            if (api.Forms.hasOwnProperty(key)) {
                let form = api.Forms[key]
                if (form.ID.toString() === formId) {
                    formName = api.Forms[key].Name
                }
            }
        }

        let currentUser = auth.getUser();
        if (!infoId) {
            columns.push({ title: formName, render: (text, item) => <span>{item.Title}<br />{item.Reason}</span> })
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
                        <Button icon="reply" type="primary" onClick={() => this.handleBack(item.ID)}>归还</Button>
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
                            this.loadData(this.state.infoId, this.state.userId, this.state.status, page)
                        },
                    }}
                />
            </div>
        );
    }
}

export default Extend1ListComponent;