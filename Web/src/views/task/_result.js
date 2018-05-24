import React, { Component } from 'react'
import { Table, Tag, Row, Col, Alert } from 'antd'
import moment from 'moment'
import api from '../../models/api'

class ResultTab extends Component {
    state = {
        task: this.props.task || {},
        flowData: this.props.flowData,
        canViewAllSubTasks: this.props.canViewAllSubTasks,
        list: [],
        loading: true,
    }
    componentWillMount() {
        this.loadData();
    }

    loadData = () => {
        const taskId = this.state.task.ID
        api.Task.SubTaskList(taskId, json => {
            let roots = json.filter(e => e.ParentId === 0);
            roots = roots.map(node => this.buildTreeData(node, json))
            this.setState({ list: roots, loading: false })
        })
    }

    buildTreeData = (node, list) => {
        node.children = list.filter(e => e.ParentId === node.ID);
        node.children.map(child => {
            child.Parent = node;
            this.buildTreeData(child, list);
            return child;
        })
        return node
    }

    getTaskStatusRender = (text, item) => {
        switch (item.Status) {
            default:
            case 0:
                return <Tag color="#108ee9">执行</Tag>
            case 1:
                return <Tag color="#f50">审核</Tag>
            case 2:
                return <Tag color="#87d068">完成</Tag>
            case 3:
                return <Tag color="#ff0">退回</Tag>
        }
    }

    getTaskNameRender = (text, model) => {
        return <span>
            {model.Content.split('\n').map((item, key) => <span key={key}>{item}<br /></span>)}
            {model.IsMaster ? this.state.flowData.Nodes.filter(e => e.ExtendId === model.ID)
                .sort((a, b) => a.ID - b.ID)
                .map(item => <div key={item.ID} className="task-flownode">{this.getFlowNodeRender(item)}</div>)
                : null}
        </span>
    }

    getLDPSRender = () => {
        let model = this.state.flowData.Nodes.sort((a, b) => a.ID - b.ID).find(e => e.FlowNodeName.indexOf('局领导') > -1);
        return model ? model.Result === null ? null : this.getFlowNodeRender(model) : null
    }

    getFlowNodeRender = (model) => {
        if (!model || model.Result === null) return ''
        return <div className="flownode">
            <p>
                <span className="signature">{model.Signature}</span>
                <span className="datetime">{model.UpdateTime ? moment(model.UpdateTime).format('YYYY-MM-DD HH:mm') : null}</span>
            </p>
            <p className="content"> {model.Content}</p>
        </div>;
    }

    render() {
        if (this.state.loading) return null;
        let task = this.props.task || {}

        //const flowData = this.props.flowData || {};

        return (
            <div className="task-table">
                <h1>定海分局具体工作任务落实单
                </h1>
                <div className="sub-title">
                    <span>单号：{task.Number || ''}</span>
                    <span>日期：{moment(task.CreateTime).format('ll')}</span>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th rowSpan="2">任务事项</th>
                            <th colSpan="3">任务来源</th>
                            <th rowSpan="2">工作目标任务</th>
                            <th rowSpan="2">计划完成时间</th>
                            <th rowSpan="2">责任领导</th>
                            <th colSpan="2">责任单位</th>
                        </tr>
                        <tr>
                            <th>省{task.FromType === 1 ? "√" : ""}</th>
                            <th>市{task.FromType === 2 ? "√" : ""}</th>
                            <th>区{task.FromType === 3 ? "√" : ""}</th>
                            <th>主办单位</th>
                            <th>协办单位</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{task.Name}</td>
                            <td colSpan="3">{task.From}</td>
                            <td>{task.Goal}</td>
                            <td>{task.ScheduleDate ? moment(task.ScheduleDate).format('ll') : ''}</td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                        <tr>
                            <th colSpan="10">工作进展</th>
                        </tr>
                        <tr>
                            <td colSpan="10">
                                <Table
                                    rowKey="ID"
                                    loading={this.state.loading}
                                    indentSize={15}
                                    defaultExpandAllRows={true}
                                    columns={[
                                        {
                                            title: '任务目标', dataIndex: 'Content',
                                            render: this.getTaskNameRender
                                        },
                                        {
                                            title: '状态', dataIndex: 'Status', width: 60,
                                            render: this.getTaskStatusRender,
                                        },
                                        {
                                            title: '科室', width: 180,
                                            render: (text, item) => <span>
                                                {item.IsMaster ? "[主]" : "[协]"}
                                                {item.ToDepartmentName}
                                            </span>
                                        },
                                        { title: '责任人', width: 80, render: (text, item) => item.ToUserName || '未指派' },
                                        { title: '创建时间', width: 120, dataIndex: 'CreateTime', render: (text) => text ? moment(text).format('lll') : '' },
                                        { title: '计划完成时间', width: 120, dataIndex: 'ScheduleDate', render: (text) => text ? moment(text).format('ll') : '' },
                                        { title: '提交完成时间', width: 120, dataIndex: 'UpdateTime', render: (text) => text ? moment(text).format('lll') : '' },

                                    ]}
                                    dataSource={this.state.list}
                                    pagination={false}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td colSpan="10">
                                <div>
                                    领导批示：{this.getLDPSRender()}
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        )
    }
}

export default ResultTab