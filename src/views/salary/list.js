import React, { Component } from 'react'
import { Button, Table, Row, Col } from 'antd'
import api from '../../models/api'

class SalaryList extends Component {
    state = {
        loading: true,
        years: [new Date().getFullYear()],
        currentYear: this.props.location.query.year || new Date().getFullYear()
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

    loadData = (year) => {
        api.Salary.List({ year }, json => {
            this.setState({ list: json.List, loading: false })
        });
    }

    getToolbarRender = () => {
        return <Button.Group>
            {this.state.years.map(year => <Button key={year} onClick={() => this.loadData(year)}>{year}年</Button>)}
        </Button.Group>
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
                    <h3>我的工资单</h3>
                    {this.getToolbarRender()}
                </div>
                <Table
                    rowKey="ID"
                    loading={this.state.loading}
                    dataSource={this.state.list}
                    pagination={false}
                    columns={[
                        {
                            title: '年/月', dataIndex: 'ID',
                            render: (text, item) => { return item.Year + '年' + item.Month + '月' }
                        },
                    ]}
                    expandedRowRender={this.expandedRowRender}
                />
            </div>
        )
    }
}

export default SalaryList