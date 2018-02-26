import React, { Component } from 'react'
import { Popconfirm, Input, Button, Table, Row, Col } from 'antd'
import { Link } from 'react-router'
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

    componentWillMount() {
        this.loadData({ year: new Date().getFullYear(), month: new Date().getMonth() + 1 })
    }

    loadData = (query) => {
        query = query || this.props.query || {}
        let parameter = {
            page: query.page || this.state.page.current || 1,
            rows: this.state.page.pageSize
        };

        api.Salary.Salaries(parameter, json => {
            this.setState({ ...parameter, list: json.List, page: json.Page, loading: false, })
        });
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.location.search !== this.props.location.search)
            this.loadData(nextProps.location.query)
    }

    handleDelete = (id) => {
        api.Salary.Delete(id, () => {
            this.loadData(this.state.currentYear)
        });
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

    expandedRowRender = (model) => {
        let data = model.Data;
        let keys = Object.keys(data);
        return <Row>
            {keys.map(key => <Col key={key} span={6}><label>{key}：</label> <span>{data[key]}</span></Col>)}
        </Row>
    }
    render() {
        let years = []
        const currentYear = new Date().getFullYear()
        if (this.state.currentYear === currentYear) {
            years = [(currentYear - 1).toString(), currentYear.toString()]
        }
        else {
            for (var i = this.state.currentYear; i <= currentYear; i++) {
                years.push(i.toString());
            }
        }
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
                                    name: 'searchKey',
                                    render: <Input placeholder="工资单" style={{ width: '200px' }} />
                                },
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
                            title: '工资单名称', dataIndex: 'Title',
                            render: (text, item) => <Link to={`/salary/list?salaryId=${item.ID}`}>{text}</Link>
                        },
                        {
                            title: '操作', dataIndex: 'ID', render: (text, item) => (
                                <Popconfirm title="删除后无法恢复，你确定要删除吗? " key={item.ID}
                                    onConfirm={() => this.handleDelete(item.ID)} >
                                    <Button type="danger" icon="delete"></Button>
                                </Popconfirm>
                            )
                        }
                    ]}
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