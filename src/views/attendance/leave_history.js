import React, { Component } from 'react';
import { Button, Table, Popconfirm } from 'antd';
import api from '../../models/api';
import auth from '../../models/auth';

class MyLeaveList extends Component {
    state = {
        searchKey: '',
        status: null,
        page: {
            pageSize: 20,
            current: parseInt(this.props.location.query.page || '1', 10),
            total: 0
        },
        userId: 0,
        data: []
    };
    componentWillMount() {
        this.loadData();
    }

    loadData = (page) => {
        api.FormInfo.List(this, {
            formId: api.FormType.Leave,
            postUserId: auth.getUser().ID,
            page: page || this.state.page.current || 1,
            rows: this.state.page.pageSize
        }, data => {
            this.setState({ data: data.List, page: data.Page });
        });
    };

    onEditSave = (err, values) => api.Leave.Save(this, values, this.loadData);
    onDelete = id => api.FormInfo.Delete(this, id, this.loadData)

    render() {
        const columns = [
            { title: '请假类型', dataIndex: 'Data.QJ_LX' },
            { title: '申请人', dataIndex: 'Data.SQR' },
            { title: '申请日期', dataIndex: 'CreateTime' },
            { title: '时间范围', render: (text, item) => <span>{item.Data.KC_RQ}~{item.Data.JS_RQ}</span> },
            { title: '审批流程', dataIndex: 'FlowNodeData.Name', render: (text, item) => <span>{text}</span> },
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
                    expandedRowRender={item => <p>{item.Data.QJ_SM}</p>}
                    pagination={{
                        size: 5, ...this.state.page,
                        onChange: (page, pageSize) => {
                            this.loadPageData(page)
                        },
                    }}
                />
            </div>
        );
    }
}

export default MyLeaveList;