import React, { Component } from 'react'
import { Table, Affix, Button, Radio } from 'antd'
import api from '../../models/api'
import moment from 'moment'
import SubmitFlowModal from '../flowdata/form'

class CarApproval extends Component {
    state = {
        loading: true,
        userId: this.props.params.userId || 0,
        completed: false,
        page: {
            pageSize: 20,
            current: this.props.location.query.page || 1,
            total: 0
        },
        data: []
    }

    componentWillMount() {
        this.loadData(this.state.userId);
    }

    loadData = (userId, completed, page) => {
        let parameter = {
            formId: api.Forms.Car.ID,
            postUserId: userId || 0,
            status: completed ? '' : userId > 0 ? 2 : 1,
            completed: completed || false,
            page: page || this.state.page.current || 1,
            rows: this.state.page.pageSize
        };

        api.FormInfo.List(parameter, data => {
            this.setState({
                loading: false,
                userId: parameter.userId,
                completed: parameter.completed,
                data: data.List,
                page: data.Page,
            })
        });
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.params.userId !== this.props.params.userId) {
            this.loadData(nextProps.params.userId, false);
        }
    }

    render() {
        return (
            <div>
                <Affix offsetTop={0} className="toolbar">
                    <Radio.Group value={this.state.completed} onChange={e => {
                        this.loadData(this.state.userId, e.target.value);
                    }}>
                        <Radio.Button value={false}>待审批</Radio.Button>
                        <Radio.Button value={true}>已审批</Radio.Button>
                    </Radio.Group>

                </Affix>
                <Table
                    rowKey="ID"
                    loading={this.state.loading}
                    columns={[
                        { title: '名称', dataIndex: 'Data.Name' },
                        { title: '车牌', dataIndex: 'Data.Number' },
                        { title: '申请日期', dataIndex: 'CreateTime', render: (text, item) => moment(text).format('lll') },
                        { title: '使用时间范围', render: (text, item) => <span>{moment(item.Data.BeginDate).format('l')} ~ {moment(item.Data.EndDate).format('l')}</span> },
                        { title: '审批流程', dataIndex: 'FlowStep' },
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
                    ]}
                    dataSource={this.state.data}
                    pagination={{
                        size: 5, ...this.state.page,
                        onChange: (page, pageSize) => {
                            this.loadData(this.state.userId, this.state.completed, page)
                        },
                    }}
                />
            </div>
        )
    }
}

export default CarApproval