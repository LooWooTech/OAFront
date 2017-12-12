import React, { Component } from 'react';
import { Button, Table, Popconfirm } from 'antd';
import moment from 'moment';
import HolidayFormModal from './holiday_form';
import api from '../../models/api';

class HolidayList extends Component {
    state = {
        total: 0,
        list: [],
        page: {}
    };

    componentWillMount() {
        this.loadData();
    };

    loadData = (page = 1) => {
        api.Holiday.List(page, json => {
            this.setState(json);
        })
    };
    handleDelete = id => api.Holiday.Delete(id, this.loadData);
    handleGenerateWeek = year => {
        api.Holiday.GenerateWeeks(year, json => {
            this.loadData()
        });
    }

    render() {

        const year = moment().year();
        return (
            <div>
                <div className="toolbar">
                    <HolidayFormModal
                        title="添加节假日"
                        onSubmit={this.loadData}
                        trigger={<Button type="primary" icon="file" >添加节假日</Button>}
                    />
                    &nbsp;&nbsp;
                    <Button.Group>
                        <Popconfirm
                            title="你确定要生成吗？"
                            onConfirm={() => this.handleGenerateWeek(year)}
                        >
                            <Button>自动生成 {year}年 周末</Button>
                        </Popconfirm>
                        <Popconfirm
                            title="你确定要生成吗？"
                            onConfirm={() => this.handleGenerateWeek(year + 1)}
                        >
                            <Button>自动生成 {year + 1}年 周末</Button>
                        </Popconfirm>
                    </Button.Group>
                </div>
                <Table
                    rowKey="ID"
                    dataSource={this.state.list}
                    columns={[
                        { title: '名称', dataIndex: 'Name' },
                        {
                            title: '起止日期', render: (text, item) => <span>
                                {moment(item.BeginDate).format('ll')} ~
                                {moment(item.EndDate).format('ll')}
                            </span>
                        },
                        {
                            title: '操作', render: (text, item) => <span>
                                <HolidayFormModal
                                    record={item}
                                    trigger={<Button icon="edit">修改</Button>}
                                    onSubmit={this.loadData}
                                    children={<Button></Button>}
                                />
                                <Popconfirm
                                    placement="topRight"
                                    title="你确定要删除吗？"
                                    onConfirm={() => this.handleDelete(item.ID)}
                                    okText="是"
                                    cancelText="否"
                                >
                                    <Button type="danger" icon="delete">删除</Button>
                                </Popconfirm>
                            </span>
                        }
                    ]}
                    pagination={{
                        size: 5, ...this.state.page,
                        onChange: (page, pageSize) => {
                            this.loadData(page)
                        },
                    }}
                />
            </div>
        );
    }
}

export default HolidayList;