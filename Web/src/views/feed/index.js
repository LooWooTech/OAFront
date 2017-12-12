import React, { Component } from 'react'
import { Alert, Pagination } from 'antd'
import { Link } from 'react-router'
import moment from 'moment'
import api from '../../models/api'
import utils from '../../utils'

class FeedIndex extends Component {
    state = {
        scope: 'all',
        loading: true,
        userId: this.props.params.userId || 0,
        list: [],
        page: {
            pageSize: window.defaultRows,
            current: parseInt(this.props.location.query.page || 1, 10),
            total: 0
        },
    }

    componentWillMount() {
        this.loadData(this.props.location.query);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.location.search !== this.props.location.search) {
            this.loadData(nextProps.location.query)
        }
    }

    loadData = (params) => {
        let formId = params.formId || ''
        params.rows = this.state.page.pageSize
        api.Feed.List(params, data => {
            this.setState({
                loading: false,
                formId: formId,
                list: data.List,
                page: data.Page
            })
        })
    }

    handleDelete = id => api.Feed.Delete(id, json => this.loadData())

    handlePageChange = page => {
        utils.ReloadPage({ page })
    }

    itemContentRender = item => {
        var form = api.Form.GetForm(item.FormId);
        if (!form) return null;

        var link = form.InfoLink.replace('{ID}', item.InfoId);
        return <Link to={link}>{item.Title}</Link>
    }

    render() {
        if (this.state.loading) return null
        return (
            <div className="feeds">
                {this.state.list.length > 0 ? this.state.list.map(item =>
                    <div key={item.ID} className="item-feed">
                        <div className="item-feed-header">
                            <a href="#">{item.FromUser}</a>
                            {item.Action}了{item.FormName}{item.Type === item.FormName ? '' : item.Type}
                            <span className="datetime"> {moment(item.CreateTime).format('lll')}</span>
                        </div>
                        <div className="item-feed-body">
                            {this.itemContentRender(item)}
                        </div>
                    </div>
                ) : <span>
                        <Alert message="Tips" description="暂无相关动态" />
                    </span>}
                <Pagination {...this.state.page} onChange={this.handlePageChange}
                    style={{ padding: '20px', float: 'right' }}
                />
            </div>
        )
    }
}

export default FeedIndex