import React from 'react';
import { Link } from 'react-router';
import { Button, Input, Table, Popconfirm, Icon } from 'antd';
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
            pageSize: window.defaultRows,
            current: this.props.location.query.page || 1,
            total: 0
        },
        data: []
    };

    loadData = (formId, query) => {
        query = query || this.props.query || {}
        let parameter = {
            formId: formId || this.state.formId,
            status: query.status || this.state.status,
            searchKey: query.searchKey || '',
            page: query.page || this.state.page.current || 1,
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
        let nextFormId = nextProps.params.formId
        let nextStatus = nextProps.location.query.status
        let nextQuery = nextProps.location.query

        if (nextFormId !== this.props.params.formId
            || nextStatus !== this.props.location.query.status
        ) {
            nextQuery.page = 1;
            nextQuery.searchKey = ''
        }

        if (nextFormId !== this.props.params.formId || nextProps.location.search !== this.props.location.search) {
            this.loadData(nextFormId, nextQuery);
        }
    }

    componentWillMount() {
        this.loadData();
    }

    componentWillUnmount() {
        api.Abort();
    }

    handleSearch = searchKey => {
        utils.ReloadPage({ searchKey, page: 1 })
    };

    handlePageChange = page => {
        utils.ReloadPage({ page })
    }

    handleDelete = id => {
        api.FormInfo.Delete(id, () => {
            this.loadData()
        })
    }

    handleReport = id => {
        api.Missive.Report(id, () => {
            utils.ReloadPage({ time: Math.random() })
        });
    }

    getColumns = () => {
        let items = [
            { title: '文号', dataIndex: 'WJ_ZH', width: 200, },
            {
                title: '标题', dataIndex: 'WJ_BT',
                render: (text, item) => <span>
                    {item.JJ_DJ ? <Icon type="exclamation" className="red" /> : null}
                    {item.Important ? <Icon type="flag" /> : null}
                    <Link to={`/missive/edit/${this.state.formId}/?id=${item.ID}`}>
                        {text}
                    </Link>
                </span>
            },
            { title: '办理期限', width: 130, dataIndex: 'QX_RQ', render: (text, item) => text ? moment(text).format('ll') : null },
            { title: '所在流程', width: 150, dataIndex: 'FlowStep' },
            { title: '处理日期', width: 130, dataIndex: 'UpdateTime', render: (text, item) => text ? moment(text).format('ll') : null },
            {
                title: '操作', width: 120, render: (text, item) => {
                    var buttons = [];
                    if (auth.isCurrentUser(item.PostUserId)) {
                        if (item.Completed) {
                            if (!item.Uid) {
                                buttons.push(<Popconfirm title="你确定要上报吗？"
                                    onConfirm={() => this.handleReport(item.ID)} >
                                    <Button type="primary">上报</Button>
                                </Popconfirm>);
                            }
                        }
                        else {
                            buttons.push(<Popconfirm title="删除后无法恢复，你确定要删除吗? "
                                onConfirm={() => this.handleDelete(item.ID)} >
                                <Button type="danger" icon="delete"></Button>
                            </Popconfirm>);
                        }
                    }
                    return buttons;
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
                        <Input.Search defaultValue={this.state.searchKey} onSearch={this.handleSearch} placeholder="文号、标题..." />
                    </div>
                </div>
                <Table
                    rowKey="ID"
                    loading={this.state.loading}
                    columns={this.getColumns()}
                    dataSource={this.state.data}
                    pagination={{
                        size: 5, ...this.state.page,
                        onChange: this.handlePageChange,
                    }}
                />
            </div>
        )
    }
}
