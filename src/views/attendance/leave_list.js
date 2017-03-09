import React, { Component } from 'react';
import { Button, Table, Pagination, Popconfirm } from 'antd';
import api from '../../models/api';

class LeaveList extends Component {
    componentWillMount() {
        this.loadPageData();
    }
    loadPageData = (page = 1, userId = 0) => {
        api.Leave.List(this, { page, userId }, json => {
            let { current, total, pageSize } = json.Page;
            let list = json.List;
            this.setState({ current, total, pageSize, list });
        })
    };
    onEditSave = (err, values) => api.Leave.Save(this, values, json => this.loadPageData);
    onDelete = id => api.Leave.Delete(this, id, this.loadPageData);

    render() {
        const columns = [
            { title: '请假类型', render: (text, item) => item.TypeName },
            { title: '申请人', render: (text, item) => <a onClick={() => this.loadPageData(1, item.UserId)}>{item.User.Username}</a> },
            { title: '申请日期', dataIndex: 'CreateTime' },
            { title: '时间范围', render: (text, item) => <span>{item.BeginDate}~{item.EndDate}</span> },
            { title: '状态', render: (text, item) => item.Result === null ? '未审核' : (item.Result ? '已通过' : '未通过') },
            {
                title: '操作', render: (text, item) => <span>
                    <Popconfirm>

                    </Popconfirm>
                </span>
            }
        ];
        return (
            <div>
                <div className="toolbar">
                    <Button><i className="fa fa-export"></i>导出记录</Button>
                </div>
                <Table
                    rowKey="ID"
                    dataSource={this.state.list}
                    columns={columns}
                    expandedRowRender={item => <p>{item.Reson}</p>}
                    pagination={<Pagination total={this.state.total} pageSize={this.state.pageSize} onChange={page => this.loadPageData(page)} />}
                />
            </div>
        );
    }
}

export default LeaveList;