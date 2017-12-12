import React, { Component } from 'react'
import { Input, AutoComplete, Button, Table, Row, Col } from 'antd'
import api from '../../models/api'
import Form from '../shared/_form'
import utils from '../../utils'
class SalarySearch extends Component {
    state = {
        currentYear: this.props.location.query.year || new Date().getFullYear(),
        page: {
            pageSize: window.defaultRows,
            current: this.props.location.query.page || 1,
            total: 0
        },
    }

    loadData = (query) => {
        query = query || this.props.query || {}
        let parameter = {
            userId: query.userId || this.state.userId || 0,
            year: query.year || this.state.year || this.state.currentYear,
            month: query.month || this.state.month || 0,
            page: query.page || this.state.page.current || 1,
            rows: this.state.page.pageSize
        };

        api.Salary.List(parameter, json => {
            this.setState({ ...parameter, list: json.List, page: json.Page, loading: false, })
        });
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.location.search !== this.props.location.search)
            this.loadData(nextProps.location.query)
    }


    handleSearch = data => {
        data.userId = data.userId || 0;
        data.month = data.month || 0;
        utils.ReloadPage(data)
        return false
    }
    handlePageChange = page => {
        utils.ReloadPage({ page })
    }

    handleSearchUser = key => {
        api.User.List({ searchKey: key }, json => {
            this.setState({ users: json.List })
        })
    }

    expandedRowRender = (model) => {
        let data = model.Data;
        let keys = Object.keys(data);
        return <Row>
            {keys.map(key => <Col key={key} span={6}><label>{key}：</label> <span>{data[key]}</span></Col>)}
        </Row>
    }
    render() {
        return (
            <div>
                <div className="toolbar">
                    <h3>工资单查询</h3>
                    <div className="right">
                        <Form
                            onSubmit={this.handleSearch}
                            style={{ maxWidth: '400px', position: 'absolute', right: '10px', top: '10px' }}
                            layout="inline"
                            children={[
                                {
                                    name: 'userId',
                                    render: <AutoComplete
                                        placeholder="姓名"
                                        dataSource={this.state.users || []}
                                        style={{ width: '120px' }}
                                        onSearch={this.handleSearchUser}
                                    >
                                        {(this.state.users || []).map((item, key) =>
                                            <AutoComplete.Option key={key} value={(item.ID || '').toString()}>
                                                {item.RealName}
                                            </AutoComplete.Option>)}
                                    </AutoComplete>
                                },
                                { name: 'year', defaultValue: this.state.currentYear, render: <Input placeholder="年份" style={{ width: '60px' }} /> },
                                { name: 'month', defaultValue: new Date().getMonth(), render: <Input placeholder="月份" style={{ width: '60px' }} /> },
                                {
                                    render: <Button icon="search" type="primary" htmlType="submit" />
                                }
                            ]}
                        />
                    </div>
                </div>
                <Table
                    rowKey="ID"
                    loading={this.state.loading}
                    dataSource={this.state.list}
                    columns={[
                        {
                            title: '姓名', dataIndex: 'UserName', width: 120,
                        },
                        {
                            title: '年/月', dataIndex: 'ID',
                            render: (text, item) => { return item.Year + '年' + item.Month + '月' }
                        },
                    ]}
                    expandedRowRender={this.expandedRowRender}
                    pagination={{
                        size: 5, ...this.state.page,
                        onChange: this.handlePageChange,
                    }}
                />
            </div>
        )
    }
}

export default SalarySearch