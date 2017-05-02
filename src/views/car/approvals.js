import React, { Component } from 'react'
import { Table, Affix, Button, Radio } from 'antd'
import api from '../../models/api'

class CarApproval extends Component {
    state = {
        loading: true,
        searchKey: '',
        status: this.props.location.query.status,
        page: {
            pageSize: 20,
            current: this.props.location.query.page || 1,
            total: 0
        },
        data: []
    }

    componentWillMount() {
        this.loadData();
    }

    loadData = (page) => {
        api.FormInfo.List(api.Form.ID.Car,
            this.props.params.userId || 0,
            1,//在办
            '',
            page || this.state.page.current || 1,
            this.state.page.pageSize,
            data => {
                this.setState({
                    loading: false,
                    data: data.List,
                    page: data.Page,
                })
            });
    }

    render() {
        return (
            <div>
                <Affix offsetTop={0} className="toolbar">
                    <Radio.Button defaultValue={this.state.status} onChange={value => {
                        this.setState({ status: value });
                        this.loadData();
                    }}>
                        <Radio value={1}>待审核</Radio>
                        <Radio value={2}>已审核</Radio>
                    </Radio.Button>

                </Affix>
                <Table
                    rowKey="ID"
                    loading={this.state.loading}
                    columns={[
                        { title: '名称', dataIndex: 'Data.Name' },
                        { title: '车牌', dataIndex: 'Data.Number' },
                        { title: '申请日期', dataIndex: 'CreateTime' },
                        { title: '使用时间范围', dataIndex: 'DateRange' },
                        { title: '审批流程', dataIndex: 'FlowStep' },
                        { title: '处理日期', dataIndex: 'UpdateTime' },
                    ]}
                    dataSource={this.state.data}
                    pagination={{
                        size: 5, ...this.state.page,
                        onChange: (page, pageSize) => {
                            this.loadPageData(page)
                        },
                    }}
                />
            </div>
        )
    }
}

export default CarApproval