import React, { Component } from 'react'
import { Badge, Row, Col } from 'antd'
import moment from 'moment'
import api from '../../models/api'

class ResultTab extends Component {

    state = {
        task: this.props.task || {},
        todos: [],
        flowData: {}
    }

    componentWillMount() {
        api.Task.TodoList(this.state.task.ID, json => {
            this.setState({ todos: json })
        })
    }


    render() {
        let task = this.props.task || {}

        const flowData = this.props.flowData || {};
        const nodes = (flowData.Nodes || []).sort((a, b) => a.ID < b.ID);
        const GetFreeFlowData = freeFlowData => {
            if (!freeFlowData) {
                return null
            }
            return <div className="freeflow">
                <div className="title">传阅审批：</div>
                {freeFlowData.Nodes.map(data => data.UpdateTime ? <div key={data.ID}>
                    <div className="header">
                        <span className="signature">{data.Signature}</span>
                        <span className="datetime">{moment(data.UpdateTime || data.CreateTime).format('lll')}</span>
                    </div>
                    <div className="content">{data.Content}</div>
                </div> : <span></span>)}
            </div>
        }

        return (
            <div className="task-table">
                <h1>定海分局具体工作任务落实单
                </h1>
                <div className="sub-title">
                    <span>单号：</span>
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
                            <th>省</th>
                            <th>市</th>
                            <th>区</th>
                            <th>主办单位</th>
                            <th>协办单位</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{task.MC}</td>
                            <td colSpan="3">{task.LY}</td>
                            <td>{task.GZ_MB}</td>
                            <td>{task.JH_SJ ? moment(task.JH_SJ).format('ll') : ''}</td>
                            <td>{}分管领导</td>
                            <td>{task.ZB_DW}</td>
                            <td>{task.XB_DW}</td>
                        </tr>
                        <tr>
                            <th colSpan="8">工作进展</th>
                            <th>备注</th>
                        </tr>
                        <tr>
                            <td colSpan="8">
                                {this.state.todos.map(item => <Row key={item.ID}>
                                    <Col lg={13}>
                                        <Badge status={item.Completed ? 'success' : moment() > moment(item.ScheduleTime) ? 'error' : 'default'} />
                                        {item.Content}
                                    </Col>
                                    <Col lg={5}>{item.ToUser ? item.ToUser.RealName : ''}</Col>
                                    <Col lg={6}>{item.ScheduleTime ? moment(item.ScheduleTime).format('ll') : ''}</Col>
                                </Row>)}
                                <div>
                                    经办人：
                                    责任人：{task.ZRR}
                                    日期：
                                </div>
                            </td>
                            <td rowSpan="3"></td>
                        </tr>
                        <tr>
                            <td colSpan="8">
                                <div>
                                    分管领导批示：
                                </div>
                                //TODO ：等流程确认之后才能制作
                            </td>
                        </tr>
                        <tr>
                            <td colSpan="8">
                                <div>
                                    领导批示：
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