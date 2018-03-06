import React, { Component } from 'react'
import { Button, Table, Row, Col } from 'antd'
import api from '../../models/api'
import utils from '../../utils'

class SalaryList extends Component {
    state = {
        loading: true,
        years: [new Date().getFullYear()],
        currentYear: this.props.location.query.year || new Date().getFullYear(),
        salaryId: this.props.location.query.salaryId || 0,
        searchKey: this.props.location.query.searchKey || '',
        userId: this.props.location.query.userId || 0,
    }

    componentWillMount() {
        this.loadData()
    }

    loadData = (year) => {
        api.Salary.SalaryDatas({
            userId: this.state.userId,
            salaryId: this.state.salaryId,
            searchKey: this.state.searchKey,
            page: 1,
            rows: 9999,
        }, json => {
            this.setState({ list: json.List, loading: false })
        });
    }

    expandedRowRender = (model) => {
        let data = model.Data;
        let keys = Object.keys(data);
        return <Row>
            {keys.map(key => {
                let val = data[key]
                let num = parseFloat(val)
                if (!isNaN(num)) {
                    val = num.toFixed(2).replace(".00", "")
                }
                return <Col key={key} span={6}><label>{key}：</label> <span>{val}</span></Col>;
            })}
        </Row>
    }
    render() {
        return (
            <div>
                <div className="toolbar">
                    <h3>工资单列表</h3>
                    <Button onClick={() => utils.GoBack()}>返回</Button>
                </div>
                <Table
                    rowKey="ID"
                    loading={this.state.loading}
                    dataSource={this.state.list}
                    pagination={false}
                    columns={[{ title: '姓名', dataIndex: 'UserName' }]}
                    expandedRowRender={this.expandedRowRender}
                />
            </div>
        )
    }
}

export default SalaryList