import React from 'react';
import { Link } from 'react-router';
import { Button, Input, Table, Popconfirm } from 'antd';
import utils from '../../utils';
import api from '../../models/api';
import auth from '../../models/auth';
import moment from 'moment'

export default class MissiveList extends React.Component {
    state = {
        loading: true,
        searchKey: '',
        formId: this.props.params.formId,
        status: this.props.location.query.status,
        page: {
            pageSize: 20,
            current: this.props.location.query.page || 1,
            total: 0
        },
        data: []
    };

    loadData = (formId, page, searchKey = '', status) => {
        let parameter = {
            formId: formId || this.state.formId,
            status: status || this.state.status,
            searchKey: searchKey || this.state.searchKey,
            page: page || this.state.page.current || 1,
            rows: this.state.page.pageSize
        };

        api.Missive.List(parameter,
            data => {
                this.setState({
                    loading: false,
                    formId: parameter.formId,
                    data: data.List,
                    page: data.Page,
                    searchKey: parameter.searchKey,
                    status: parameter.status,
                });
            });
    };

    componentWillReceiveProps(nextProps) {
        const nextStatus = nextProps.location.query.status
        const nextFormId = nextProps.params.formId

        if (nextStatus !== this.props.location.query.status || nextFormId !== this.props.params.formId) {
            this.loadData(nextFormId, 1, this.state.searchKey, nextStatus);
        }
    }

    componentWillMount() {
        this.loadData();
    }

    handleSearch = searchKey => {
        this.loadData(this.state.formId, this.state.page.current, searchKey);
    };

    handleDelete = item => {
        api.FormInfo.Delete(item.ID, () => {
            this.loadData()
        })
    }

    getColumns = () => {
        let items = [
            { title: '文号', dataIndex: 'WJ_ZH' },
            { title: '标题', dataIndex: 'WJ_BT', render: (text, item) => <Link to={`/missive/edit/${this.state.formId}/?id=${item.ID}`}>{text}</Link> },
            { title: '密级', dataIndex: 'WJ_MJ' },
            { title: '主送机关', dataIndex: 'ZS_JG' },
            { title: '办理期限', dataIndex: 'QX_RQ', render: (text, item) => text ? moment(text).format('ll') : null },
            { title: '所在流程', dataIndex: 'FlowStep' },
            { title: '处理日期', dataIndex: 'UpdateTime', render: (text, item) => text ? moment(text).format('ll') : null },
            {
                title: '操作', render: (text, item) => {
                    if (auth.isCurrentUser(item.PostUserId)) {

                        return <Popconfirm title="删除后无法恢复，你确定要删除吗? " onConfirm={() => this.handleDelete(item)} >
                            <Button type="danger" icon="remove">删除</Button>
                        </Popconfirm>
                    }
                }
            }
        ];
        return items
    }

    render() {
        if (!this.state.formId) return <span>参数异常，缺少FormId</span>
        return (
            <div>
                <div className="toolbar">
                    <Button.Group>
                        <Button type="primary" icon="file" onClick={() => utils.Redirect(`/missive/edit/${this.state.formId}/`)}>
                            新建{this.state.formId === api.Forms.Missive.ID.toString() ? '发文拟稿' : '收文文档'}
                        </Button>
                        {/*<Button type="danger" icon="export">导出公文</Button>*/}
                    </Button.Group>
                    <div className="right">
                        <Input.Search onSearch={this.handleSearch} placeholder="文号、标题..." />
                    </div>
                </div>
                <Table
                    rowKey="ID"
                    loading={this.state.loading}
                    columns={this.getColumns()}
                    dataSource={this.state.data}
                    pagination={{
                        size: 5, ...this.state.page,
                        onChange: (page, pageSize) => {
                            this.loadData(this.state.formId, page)
                        },
                    }}
                />
            </div>
        )
    }
}
