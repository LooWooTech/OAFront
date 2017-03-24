import React, { Component } from 'react';
import { Button, Table, Pagination, Popconfirm } from 'antd';
import api from '../../models/api';

class LeaveList extends Component {
    state = {
        searchKey: '',
        status: null,
        page: {
            rows: 20,
            current: parseInt(this.props.location.query.page || '1', 10),
            total: 0
        },
        data: []
    };
    componentWillMount() {
        this.loadData();
    };
    
    loadData = (page) => {
        api.FormInfo.List(this, {
            formId: api.FormType.Leave,
            page: page || this.state.page.current || 1,
        }, data => {
            this.setState({ data: data.List, page: data.Page });
        });
    };

    onApproval = (item) => { };

    render() {

        const columns = [
            { title: '请假类型', dataIndex: 'Data.Type' },
            { title: '申请人', dataIndex: 'Data.Name' },
            { title: '申请日期', dataIndex: 'CreateTime' },
            { title: '时间范围', render: (text, item) => <span>{item.Data.BeginTime}~{item.Data.EndTime}</span> },
            { title: '审批流程', dataIndex: 'FlowNodeData.Name', render: (text, item) => <span>{text}</span> },
            {
                title: '操作', render: (text, item) => <span>
                    {item.FlowNodeData.Result === null ? '已审批' : <Button>

                    </Button>}
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
                    pagination={<Pagination
                        total={this.state.page.total}
                        pageSize={this.state.page.pageSize}
                        onChange={(page, pageSize) => {
                            this.loadData(page)
                        }}
                    />}
                />
            </div>
        );
    }
}

export default LeaveList;