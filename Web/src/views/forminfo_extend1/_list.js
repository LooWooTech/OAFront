import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Table, Tag, Radio, Alert } from 'antd'
import moment from 'moment'
import api from '../../models/api'
import utils from '../../utils'

class Extend1ListComponent extends Component {

    static contextTypes = {
        router: PropTypes.object.isRequired
    }

    state = {
        list: [],
        loading: true,
        userId: this.props.userId || 0,
        applyUserId: this.props.applyUserId || 0,
        approvalUserId: this.props.approvalUserId || 0,
        extendInfoId: this.props.extendInfoId || 0,
        status: this.props.status || 0,
        formId: this.props.formId,
        page: {
            pageSize: window.defaultRows,
            current: this.props.page,
            total: 0
        },
    }

    componentWillMount() {
        this.loadData()
    }

    componentWillReceiveProps(nextProps) {
        if (JSON.stringify(nextProps) !== JSON.stringify(this.props)) {
            this.loadData(nextProps)
        }
    }

    loadData = (props) => {
        props = props || {}
        let parameter = {
            formId: this.state.formId,
            extendInfoId: props.extendInfoId || this.state.extendInfoId || 0,
            userId: this.state.userId,
            applyUserId: this.state.applyUserId,
            approvalUserId: this.state.approvalUserId,
            status: this.context.router.location.query.status || 0,
            page: this.context.router.location.query.page || this.state.page.current || 1,
            rows: this.state.page.pageSize
        };

        api.FormInfoExtend1.List(parameter, json => {
            this.setState({
                list: json.List,
                ...parameter,
                page: json.Page,
                loading: false
            })
        })
    }

    handleSubmitFlowCallback = flowData => {
        if (!flowData) return;
        api.FormInfoExtend1.Approval(flowData.ExtendInfoId || 0, json => {
            this.loadData();
        });
    }

    createTimeColumnRender = (text, item) => moment(text).format('YYYY-MM-DD HH:mm:ss')
    updateTimeColumnRender = (text, item) => text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : null
    resultColumnRender = (text, item) => {
        switch (item.Result) {
            case true:
                return <Tag color="green">通过</Tag>
            case false:
                return <Tag color="red">失败</Tag>
            default:
                return <Tag>审核中</Tag>
        }
    }
    titleColumnRender = (text, item) => <span key={item.ID}>{item.Title}<br />{item.Reason}</span>
    getColumns = () => {
        var columns = []
        let { applyUserId, formId } = this.state
        let formName = api.Form.GetName(formId)
        columns.push({ title: formName, dataIndex: 'title', render: this.titleColumnRender })
        if (!applyUserId) {
            columns.push({ title: '申请人', dataIndex: 'ApplyUser' })
        }
        let resonColumnName = '用途';
        switch (formId) {
            case api.Forms.Car.ID:
                resonColumnName = '人员名单及用途';
                break;
            default: break;
        }
        columns = columns.concat([
            { title: '审批人', dataIndex: 'ApprovalUser' },
            { title: resonColumnName, dataIndex: 'Reson' },
            { title: '申请日期', dataIndex: 'CreateTime', render: this.createTimeColumnRender },
            { title: '申请结果', dataIndex: 'Result', render: this.resultColumnRender },
            { title: '处理日期', dataIndex: 'UpdateTime', render: this.updateTimeColumnRender },
            { title: '操作', render: this.props.buttons }
        ]);
        return columns;
    }

    handlePageChange = page => utils.ReloadPage({ page })
    handleStatusChange = e => utils.ReloadPage({ status: e.target.value })
    reload = () => this.loadData()

    render() {
        if (!this.state.formId) {
            return <Alert message="缺少formId参数" type="error" />
        }

        return (
            <div>
                {this.props.toolbar !== false ?
                    <div className="toolbar">
                        <h2>{this.props.title || ''}</h2>
                        <Radio.Group defaultValue={this.state.status} onChange={this.handleStatusChange}>
                            <Radio.Button value={0}>全部</Radio.Button>
                            <Radio.Button value={1}>待审核</Radio.Button>
                            <Radio.Button value={2}>已审核</Radio.Button>
                        </Radio.Group>
                    </div>
                    : null}
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
export default Extend1ListComponent;