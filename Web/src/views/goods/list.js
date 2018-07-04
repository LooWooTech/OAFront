import React, { Component } from 'react'
import { Link } from 'react-router';
import { Input, Table, Select, Row, Col } from 'antd';
import utils from '../../utils';
import api from '../../models/api';
import auth from '../../models/auth';
import ApplyModal from './_apply'
import EditModal from './_edit'
import RegisterModal from './_register'

export default class GoodsList extends Component {

    state = {
        loading: true,
        searchKey: this.props.location.query.searchKey || '',
        categoryId: this.props.location.query.categoryId || 0,
        page: {
            pageSize: window.defaultRows,
            current: this.props.location.query.page || 1,
            total: 0
        },
        categories: [],
        list: []
    }

    componentWillMount() {
        this.loadCategories();
        this.loadData();
    }

    loadCategories = () => {
        api.Category.List(api.Forms.Goods.ID, list => {
            this.setState({ categories: list })
        })
    }

    loadData = (query) => {
        query = query || this.props.query || {}
        let parameter = {
            searchKey: query.searchKey || '',
            categoryId: query.categoryId || 0,
            page: query.page || this.state.page.current || 1,
            rows: this.state.page.pageSize
        };

        api.Goods.List(parameter,
            data => {
                this.setState({
                    loading: false,
                    list: data.List,
                    page: data.Page,
                    searchKey: parameter.searchKey,
                    categoryId: parameter.categoryId
                });
            });
    };
    componentWillUnmount() {
        api.Abort();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.location.search !== this.props.location.search) {
            this.loadData(nextProps.location.query)
        }
    }

    handleSearch = searchKey => {
        utils.ReloadPage({ searchKey, page: 1 })
    };

    handleCategoryChange = (val) => {
        utils.ReloadPage({ categoryId: val, page: 1 })
    }

    handlePageChange = page => {
        utils.ReloadPage({ page })
    }

    logColumnRender = (text, item) => <Link key='logs' to={`/goods/applies?goodsId=${item.ID}`}>查看</Link>

    buttonColumnRender = (text, item) => {
        var btns = [];
        if (item.Number > 0 && item.Status) {
            btns.push(<ApplyModal key='apply' model={item} onSubmit={this.loadData} />)
        }
        if (auth.hasRight('Form.Goods.Edit')) {
            btns.push(<RegisterModal key="register" model={item} onSubmit={this.loadData} />)
            btns.push(<EditModal key='edit' model={item} onSubmit={this.loadData} categories={this.state.categories} />)
        }
        return btns;
    }

    render() {

        return (
            <div>
                <div className="toolbar">
                    <div className="left">
                        <h3>物品列表</h3>
                        {this.state.categories.length > 0 && auth.hasRight('Form.Goods.Edit') ?
                            <EditModal
                                categories={this.state.categories}
                                onSubmit={this.loadData}
                            /> : null}
                    </div>
                    <div className="right" style={{ width: 400 }}>
                        <Row>
                            <Col span={12}>
                                <Select onChange={this.handleCategoryChange}
                                    placeholder="选择分类进行筛选"
                                    style={{ width: 200 }}
                                >
                                    {this.state.categories.map(c => <Select.Option key={c.ID}>{c.Name}</Select.Option>)}
                                </Select>
                            </Col>
                            <Col span={12}>
                                <Input.Search defaultValue={this.state.searchKey} onSearch={this.handleSearch}
                                    placeholder="物品名称" />
                            </Col>
                        </Row>
                    </div>
                </div>
                <Table
                    rowKey="ID"
                    loading={this.state.loading}
                    columns={[
                        { title: '物品名称', dataIndex: 'Name' },
                        { title: '现有数量', dataIndex: 'Number', width: 80 },
                        { title: '物品描述', dataIndex: 'Note' },
                        { title: '认领记录', width: 100, render: this.logColumnRender },
                        { title: '操作', width: 240, render: this.buttonColumnRender }
                    ]}
                    dataSource={this.state.list}
                    pagination={{
                        size: 5, ...this.state.page,
                        onChange: this.handlePageChange,
                    }}
                />
            </div>
        )
    }
}
