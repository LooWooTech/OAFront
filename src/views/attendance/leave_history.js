import React, { Component } from 'react';
import { Button, Table, Pagination, Popconfirm } from 'antd';
import LeaveFormModal from './leave_form';
import api from '../../models/api';

import auth from '../../models/auth';

class LeaveHistory extends Component {
    componentWillMount() {
        this.loadPageData();
    }
    loadPageData = (page = 1) => {
        api.Leave.List(this, { page, userId: auth.getUser().ID }, json => {
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
            { title: '起止日期', render: (text, item) => <span>{item.BeginDate}~{item.EndDate}</span> },
            { title: '状态', render: (text, item) => item.Result === null ? '未审核' : (item.Result ? '已通过' : '未通过') },
            {
                title: '操作', render: (text, item) => <span>
                    {item.Result === null ? <LeaveFormModal
                        record={item}
                        onSubmit={this.onEditSave}
                        children={<Button>修改</Button>}
                    /> : <span></span>}
                    <Popconfirm
                        placement="topRight"
                        title="你确定要删除吗？"
                        onConfirm={() => this.onDelete(item.ID)}
                        okText="是"
                        cancelText="否"
                    >
                        <Button type="danger" icon="delete">删除</Button>
                    </Popconfirm>
                </span>
            }
        ];
        return (
            <div>
                <div className="toolbar">
                    <LeaveFormModal onSubmit={this.onEditSave}>
                        <Button type="primary" icon="file" >申请假期</Button>
                    </LeaveFormModal>
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

export default LeaveHistory;