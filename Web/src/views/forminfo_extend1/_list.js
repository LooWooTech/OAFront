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
        approvalUserId: this.props.approvalUserId || 0,
        infoId: this.props.infoId || 0,
        status: this.props.status || 0,
        formId: this.props.formId,
        page: {
            pageSize: window.defaultRows,
            current: this.context.router.location.query.page || 1,
            total: 0
        },
    }


    componentWillMount() {
        this.loadData()
    }

    componentWillReceiveProps(nextProps) {
        let formId = nextProps.formId
        let infoId = nextProps.infoId
        let status = nextProps.status
        if (formId !== this.state.formId
            || infoId !== this.state.infoId
            || status !== this.state.status
        ) {
            this.loadData(nextProps);
        }
    }

    loadData = (props) => {
        props = props || {}
        let parameter = {
            formId: this.state.formId,
            infoId: props.infoId || this.state.infoId || 0,
            userId: this.state.userId,
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
        api.FormInfoExtend1.Approval(flowData.InfoId || 0, json => {
            this.loadData();
        });
    }

    getColumns = () => {
        var columns = []
        let { userId, formId } = this.state
        let formName = api.Form.GetName(formId)
        columns.push({ title: formName, dataIndex:'title', render: (text, item) => <span key={item.ID}>{item.Title}<br />{item.Reason}</span> })
        if (!userId) {
            columns.push({ title: '申请人', dataIndex: 'ApplyUser' })
        }
        columns = columns.concat([
            { title: '审批人', dataIndex: 'ApprovalUser' },
            {
                title: '申请日期', dataIndex: 'CreateTime',
                render: (text, item) => moment(text).format('ll')
            },
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
            {
                title: '处理日期', dataIndex: 'UpdateTime',
                render: (text, item) => text ? moment(text).format('ll') : null
            },
            {
                title: '操作', render: this.props.buttons
            }
        ]);
        return columns;
    }

    handlePageChange = page => {
        utils.ReloadPage({ page })
    }

    handleStatusChange = val => {
        utils.ReloadPage({ status: val })
    }

    reload = () => {
        this.loadData()
    }

    render() {
        if (!this.state.formId) {
            return <Alert message="缺少formId参数" type="error" />
        }

        return (
            <div>
                {this.props.toolbar !== false ?
                    <div className="toolbar">
                        <h2>{this.props.title || ''}</h2>
                        <Radio.Group defaultValue={this.state.status} onChange={e => this.handleStatusChange(e.target.value)}>
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