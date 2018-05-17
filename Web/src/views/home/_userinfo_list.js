import React, { Component } from 'react'
import { Card, Icon } from 'antd'
import { Link } from 'react-router'
import moment from 'moment'
import api from '../../models/api'
export default class UserInfoList extends Component {

    state = { list: [], formName: '' }

    componentWillMount() {
        this.loadData()
    }

    loadData = () => {
        const formId = this.props.formId;
        const formName = api.Form.GetName(formId)
        api.UserInfo.MyList(formId, (list) => {
            this.setState({ list, formName })
        })
    }

    updateTimeColumnRender = (text) => text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : null

    itemLinkRender = item => {
        var form = api.Form.GetForm(item.FormId);
        if (!form) return null;

        var link = form.InfoLink.replace('{ID}', item.InfoId);
        return (
            <p>
                <Link to={link}>
                    {item.Reminded ? <Icon type="exclamation" className="red" /> : null}
                    {item.Title}
                </Link> <br />
                {item.Poster}：{this.updateTimeColumnRender(item.UpdateTime)}
            </p>
        )
    }

    render() {
        return (
            <Card title={this.props.title || this.state.formName} className="card">
                {this.state.list.map(this.itemLinkRender)}
            </Card>
        )
    }
}
