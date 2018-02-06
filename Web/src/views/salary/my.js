import React, { Component } from 'react'
import { Button, Table, Row, Col, Input } from 'antd'
import api from '../../models/api'
import Form from '../shared/_form'
import utils from '../../utils'
import auth from '../../models/auth'
class MySalaryList extends Component {
    state = {
        years: [new Date().getFullYear()],
        currentYear: this.props.location.query.year || new Date().getFullYear(),
        searchKey: this.props.location.query.searchKey || '',
        userId: auth.getUser().ID,
        page: {
            pageSize: window.defaultRows,
            current: this.props.location.query.page || 1,
            total: 0
        },
    }
    componentWillMount() {
        api.Salary.Years(0, list => {
            this.setState({ years: list });
            if (list.length > 0) {
                this.loadData(list[list.length - 1]);
            } else {
                this.setState({ loading: false })
            }
        });
    }
    getToolbarRender = () => {
        return <Button.Group>
            {this.state.years.map(year => <Button key={year} onClick={() => utils.ReloadPage({ year })}>{year}年</Button>)}
        </Button.Group>
    }

    loadData = (year) => {
        let parameter = {
            userId: this.state.userId,
            searchKey: this.state.searchKey,
            page: this.state.page.current || 1,
            rows: this.state.page.pageSize,
            year: year || this.state.year || this.state.currentYear,
        };

        api.Salary.SalaryDatas(parameter, json => {
            this.setState({ ...parameter, list: json.List, page: json.Page, loading: false, })
        });
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.location.search !== this.props.location.search)
            this.loadData(nextProps.location.query.year)
    }


    handleSearch = data => {
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
                    <h3>我的工资单</h3>
                    {this.getToolbarRender()}
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
                    columns={[{ title: '工资单名称', dataIndex: 'Title' }]}
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

export default MySalaryList