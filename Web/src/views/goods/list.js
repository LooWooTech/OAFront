import React, { Component } from 'react'
import { Link } from 'react-router';
import { Button, Input, Table, Popconfirm, Icon, Select, Row, Col } from 'antd';
import utils from '../../utils';
import api from '../../models/api';
import auth from '../../models/auth';
import moment from 'moment';
import ApplyModal from './_apply'
export default class GoodsList extends Component {

    state = {
        loading: true,
        searchKey: this.props.location.query.searchKey || '',
        page: {
            pageSize: window.defaultRows,
            current: this.props.location.query.page || 1,
            total: 0
        },
        categories: [],
        data: []
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
            page: query.page || this.state.page.current || 1,
            rows: this.state.page.pageSize
        };

        api.Goods.List(parameter,
            data => {
                this.setState({
                    loading: false,
                    data: data.List,
                    page: data.Page,
                    searchKey: parameter.searchKey,
                });
            });
    };
    componentWillUnmount() {
        api.Abort();
    }

    handleSearch = searchKey => {
        utils.ReloadPage({ searchKey, page: 1 })
    };

    handlePageChange = page => {
        utils.ReloadPage({ page })
    }

    buttonColumnRender = (text, item) => {
        var btns = [];
        if (item.Number > 0 && item.Status) {
            btns.push(<ApplyModal model={item} />)
        }
        btns.push(<Link to={`/goods/applylist?goodsId=${item.ID}`}>申请记录</Link>)

        return btns;
    }

    render() {
        return (
            <div>
                <div className="toolbar">
                    <div className="left">
                        <h3>物品列表</h3>
                    </div>
                    <div className="right" style={{ width: 400 }}>
                        <Row>
                            <Col span={12}>
                                <Input.Search defaultValue={this.state.searchKey} onSearch={this.handleSearch}
                                    placeholder="物品名称" />
                            </Col>
                            <Col span={12}>
                                <Select onChange={this.handleCategoryChange}
                                    placeholder="选择分类进行筛选"
                                    style={{ width: 200 }}
                                >
                                    {this.state.categories.map(c => <Select.Option value={c.ID}>{c.Name}</Select.Option>)}
                                </Select>
                            </Col>
                        </Row>
                    </div>
                </div>
                <Table
                    rowKey="ID"
                    loading={this.state.loading}
                    columns={[
                        { title: '物品名称', dataIndex: 'Name' },
                        { title: '现有数量', dataIndex: 'Number' },
                        { title: '物品描述', dataIndex: 'Note' },
                        { title: '操作', dataIndex: 'ID', render: this.buttonColumnRender }
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
