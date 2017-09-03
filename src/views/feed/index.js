import React, { Component } from 'react'
import { Card, Alert, Pagination } from 'antd'
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
            pageSize: 10,
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

    itemRender = item => {
        //if (!item.) return null;

        var link = null;
        switch (item.FormId) {
            default:
                return null
            case api.Forms.Missive.ID:
            case api.Forms.ReceiveMissive.ID:
                link = `/missive/edit/${item.FormId}/?id=${item.InfoId}`
                break;
            case api.Forms.Task.ID:
                link = `/task/edit/?id=${item.InfoId}`
                break;
            case api.Forms.Car.ID:
            case api.Forms.MeetingRoom.ID:
            case api.Forms.Seal.ID:
            case api.Forms.Leave.ID:
                link = `/extend1/approvals/${item.FormId}`;
                break;
        }
        return <Link to={link}>{item.Title}</Link>
    }

    render() {
        return (
            <div className="feeds">
                {this.state.list.length > 0 ? this.state.list.map(item =>
                    <Card key={item.ID}
                        title={<div className="title">
                            <a href="#">{item.FromUser}</a>
                            {item.Action}了{item.FormName}{item.Type}
                            <span className="datetime"> {moment(item.CreateTime).format('lll')}</span>
                        </div>}
                    >

                        <div className="content">
                            {this.itemRender(item)}
                        </div>
                    </Card>
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