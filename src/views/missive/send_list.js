import React from 'react';
import { Link } from 'react-router';
import { Affix, Button, Input, Table, Pagination } from 'antd';
import utils from '../../utils';
import api from '../../models/api';

export default class MissiveSendList extends React.Component {
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
    loadData = (page, searchKey, status) => {
        api.FormInfo.List(this, {
            formId: api.FormType.Missive,
            page: page || this.state.page.current || 1,
            searchKey: searchKey || this.state.searchKey,
            status: status || this.state.status,
        }, data => {
            this.setState({ data: data.List, page: data.Page, searchKey, status });
        });
    };

    componentDidMount() {
        this.loadData();
    }

    handleSearch = searchKey => {
        this.loadData(1, searchKey);
    };

    render() {
        return (
            <div>
                <Affix offsetTop={0} className="toolbar">
                    <Button.Group>
                        <Button type="primary" icon="file" onClick={() => utils.Redirect('/missive/edit')}>新建拟稿</Button>
                        {/*<Button type="danger" icon="export">导出公文</Button>*/}
                    </Button.Group>
                    <div className="right">
                        <Input.Search onSearch={this.handleSearch} placeholder="文号、标题..." />
                    </div>

                </Affix>
                <Table
                    rowKey="ID"
                    loading={this.state.loading}
                    columns={[
                        { title: '文号', dataIndex: 'Info.Data.Data.GW_WH' },
                        { title: '标题', dataIndex: 'Info.Title', render: (text, item) => <Link to={`/missive/edit?id=${item.Info.ID}`}>{text}</Link> },
                        { title: '密级', dataIndex: 'Info.Data.Data.GW_MJ' },
                        { title: '种类', dataIndex: 'Category.Name' },
                        { title: '机关部门', dataIndex: 'BornOrgan.Name' },
                        { title: '发往单位', dataIndex: 'ToOrgan.Name' },
                        { title: '审批流程', dataIndex: 'FlowNode.Name' },
                    ]}
                    dataSource={this.state.data}
                    pagination={<Pagination
                        total={this.state.page.total}
                        pageSize={this.state.page.pageSize}
                        onChange={(page, pageSize) => {
                            this.loadData(page)
                        }}
                    />}
                >
                </Table>

            </div >
        )
    }
}
