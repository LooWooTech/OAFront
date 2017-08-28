import React, { Component } from 'react'
import { Card, Icon, Dropdown, Menu, Pagination } from 'antd'
import { Link } from 'react-router'
import moment from 'moment'
import api from '../../models/api'
import auth from '../../models/auth'

class FeedIndex extends Component {

    state = {
        scope: 'all',
        loading: true,
        userId: this.props.params.userId || 0,
        list: [],
        page: {
            pageSize: 10,
            current: this.props.location.query.page || 1,
            total: 0
        },
    }

    componentWillMount() {
        this.loadData(this.state.userId);
    }

    componentWillReceiveProps(nextProps) {
        var scope = nextProps.location.query.scope;
        if (scope !== this.props.location.query.scope) {
            this.loadData(scope)
        }
    }


    loadData = (scope, userId = 0, page = 1) => {
        scope = scope || this.state.scope
        switch (scope) {
            default:
            case 'all':
                break;
            case 'my':
                userId = auth.getUser().ID
                break;
            case 'star':

                break;
        }
        api.Feed.List(userId, page, this.state.page.pageSize, data => {
            this.setState({
                loading: false,
                scope: scope,
                fromUserId: userId,
                list: data.List,
                page: data.Page
            })
        })
    }

    handleDelete = id => api.Feed.Delete(id, json => this.loadData())

    getFeedContent = item => {
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
                link = `/extend1/${item.FormId}/approvals`;
                break;
        }
        return <Link to={link}>{item.Title}</Link>
    }

    render() {

        const currentUser = auth.getUser();

        return (
            <div className="feeds">
                {this.state.list.map(item =>
                    <Card key={item.ID}
                        title={<div className="title">
                            <a href="#">{item.FromUser}</a>
                            {item.Action}了{item.FormName}{item.Type}
                            <span className="datetime"> {moment(item.CreateTime).format('lll')}</span>
                        </div>}
                        extra={<Dropdown overlay={<Menu>
                            {currentUser.ID === item.FromUserId ? <Menu.Item key="delete">删除</Menu.Item> : null}
                        </Menu>}><Icon type="down" /></Dropdown>}
                    >

                        <div className="content">
                            {this.getFeedContent(item)}
                        </div>
                    </Card>
                )}
                <Pagination defaultCurrent={1} {...this.state.page} onChange={page => {
                    this.loadData(null, null, page)
                }}
                    style={{ padding: '20px', float: 'right' }}
                />
            </div>
        )
    }
}

export default FeedIndex