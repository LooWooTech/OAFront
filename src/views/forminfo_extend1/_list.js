import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Table, Tag, Radio } from 'antd'
import moment from 'moment'
import api from '../../models/api'
import utils from '../../utils'


class Extend1ListComponent extends Component {

    state = {
        list: [],
        loading: true,
        userId: this.props.userId || 0,
        approvalUserId: this.props.approvalUserId || 0,
        infoId: this.props.infoId || 0,
        status: this.props.status || 0,
        formId: this.props.formId,
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
            formId: this.state.formId,
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

    getColumns = () => {
        var columns = []
        let { userId, approvalUserId, formId } = this.state
        let formName = ''
        for (var key in api.Forms) {
            if (api.Forms.hasOwnProperty(key)) {
                let form = api.Forms[key]
                if (form.ID.toString() === formId) {
                    formName = api.Forms[key].Name
                }
            }
        }

        columns.push({ title: formName, render: (text, item) => <span>{item.Title}<br />{item.Reason}</span> })
        if (!userId) {
            columns.push({ title: '申请人', dataIndex: 'ApplyUser' })
        }
        columns = columns.concat([
            { title: '审批人', dataIndex: 'ApprovalUser' },
            { title: '申请日期', dataIndex: 'CreateTime', render: (text, item) => moment(text).format('ll') },
            { title: '时间范围', render: (text, item) => <span>{moment(item.ScheduleBeginTime).format('ll')} ~ {moment(item.ScheduleEndTime).format('ll')}</span> },
            {
                title: '申请结果', dataIndex: 'Result', render: (text, item) => {
                    switch (item.Result) {
                        case true:
                            return <Tag color="green">通过</Tag>
                        case false:
                            return <Tag color="red">失败</Tag>
                        default:
                            return <Tag>审核中</Tag>
                    }
                }
            },
            { title: '处理日期', dataIndex: 'UpdateTime', render: (text, item) => text ? moment(text).format('ll') : null },
            {
                title: '操作', render: this.props.buttons
            }
        ]);
        return columns;
    }

    handlePageChange = page => {
        let parameter = this.state
        parameter.page = page;
        let url = api.FormInfoExtend1.ListUrl(parameter)
        utils.Redirect(url)
    }

    handleStatusChange = val => {
        let parameter = this.state
        parameter.status = val
        let url = api.FormInfoExtend1.ListUrl(parameter)
        utils.Redirect(url)
    }

    reload = () => {
        this.loadData()
    }

    render() {
        return (
            <div>
                <div className="toolbar">
                    <Radio.Group defaultValue={this.state.status} onChange={e => this.handleStatusChange(e.target.value)}>
                        <Radio.Button value={0}>全部</Radio.Button>
                        <Radio.Button value={1}>待审核</Radio.Button>
                        <Radio.Button value={2}>已审核</Radio.Button>
                    </Radio.Group>
                </div>
                <Table
                    rowKey="ID"
                    loading={this.state.loading}
                    columns={this.getColumns()}
                    dataSource={this.state.list}
                    pagination={{
                        size: 5, ...this.state.page,
                        onChange: this.handlePageChange,
                    }}
                />
            </div>
        );
    }
}
Extend1ListComponent.propTypes = {
    formId: PropTypes.number.isRequired,
}
export default Extend1ListComponent;