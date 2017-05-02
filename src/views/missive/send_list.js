import React from 'react';
import { Link } from 'react-router';
import { Affix, Button, Input, Table } from 'antd';
import utils from '../../utils';
import api from '../../models/api';

export default class MissiveSendList extends React.Component {
    state = {
        loading: true,
        searchKey: '',
        status: this.props.location.query.status,
        page: {
            pageSize: 20,
            current: this.props.location.query.page || 1,
            total: 0
        },
        data: []
    };
    loadData = (page, searchKey = '', status) => {
        api.FormInfo.List(
            api.Form.ID.Missive, 
            0,
            status || this.state.status,
            searchKey || this.state.searchKey,
            page || this.state.page.current || 1,
            this.state.page.pageSize,
            data => {
                this.setState({
                    loading: false,
                    data: data.List,
                    page: data.Page,
                    searchKey,
                    status,
                    request: true
                });
            });
    };

    componentWillReceiveProps(nextProps) {
        const status = nextProps.location.query.status;
        if (status !== this.state.status) {
            this.loadData(this.state.page.current, this.state.searchKey, status);
        }
    }

    componentWillMount() {
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
                        { title: '文号', dataIndex: 'Data.GW_WH' },
                        { title: '标题', dataIndex: 'Title', render: (text, item) => <Link to={`/missive/edit?id=${item.InfoId}`}>{text}</Link> },
                        { title: '密级', dataIndex: 'Data.GW_MJ' },
                        { title: '主送机关', dataIndex: 'Data.ZS_JG' },
                        { title: '期限', dataIndex: 'Data.QX_RQ' },
                        { title: '审批流程', dataIndex: 'FlowStep' },
                        { title: '处理日期', dataIndex: 'UpdateTime' },
                    ]}
                    dataSource={this.state.data}
                    pagination={{
                        size: 5, ...this.state.page,
                        onChange: (page, pageSize) => {
                            this.loadPageData(page)
                        },
                    }}
                />
            </div>
        )
    }
}
