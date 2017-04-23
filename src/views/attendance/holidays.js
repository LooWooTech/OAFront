import React, { Component } from 'react';
import { Button, Table, Popconfirm, Pagination } from 'antd';
import moment from 'moment';
import HolidayFormModal from './holiday_form';
import api from '../../models/api';

class HolidayList extends Component {
    state = {
        current: 1,
        page: 1,
        pageSize: 20,
        total: 0,
        list: []
    };

    componentWillMount() {
        this.loadPageData();
    };

    loadPageData = (page = 1) => {
        api.Holiday.List(page, json => {
            let { current, total, pageSize } = json.Page;
            let list = json.List;
            this.setState({ current, total, pageSize, list });
        })
    };
    onEditSave = (err, values) => api.Holiday.Save(values, json => this.loadPageData);
    onDelete = id => api.Holiday.Delete(id, this.loadPageData);
    onGenerateWeek = year => api.Holiday.GenerateWeeks(year, json => this.loadPageData);

    render() {

        const year = moment().year();
        return (
            <div>
                <div className="toolbar">
                    <HolidayFormModal onSubmit={this.onEditSave}>
                        <Button type="primary" icon="file" >添加节假日</Button>
                    </HolidayFormModal>
                    &nbsp;&nbsp;
                    <Button.Group>
                        <Button onClick={() => this.onGenerateWeek(year)}>自动生成 {year}年 周末</Button>
                        <Button onClick={() => this.onGenerateWeek(year + 1)}>自动生成 {year + 1}年 周末</Button>
                    </Button.Group>
                </div>
                <Table
                    rowKey="ID"
                    dataSource={this.state.list}
                    columns={[
                        { title: '名称', dataIndex: 'Name' },
                        { title: '起止日期', render: (text, item) => <span>{item.BeginDate}~{item.EndDate}</span> },
                        {
                            title: '操作', render: (text, item) => <span>
                                <HolidayFormModal
                                    record={item}
                                    onSubmit={this.onEditSave}
                                    children={<Button></Button>}
                                />
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
                    ]}
                    pagination={<Pagination total={this.state.total} pageSize={this.state.pageSize} onChange={page => this.loadPageData(page)} />}
                />
            </div>
        );
    }
}

export default HolidayList;