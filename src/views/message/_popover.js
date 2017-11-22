import React, { Component } from 'react';
import { Popover, Icon, Badge, Button } from 'antd';
import moment from 'moment'
import api from '../../models/api'
import utils from '../../utils'

class MessagePopover extends Component {
    state = { count: 0, list: [] }
    componentWillMount() {
        this.loadData();
        var intervalId = setInterval(this.loadData, 1000 * 5);
        this.setState({ intervalId: intervalId });
    }

    componentWillUnmount() {
        clearInterval(this.state.intervalId);
    }

    loadData = () => {
        api.Message.Unreads(10, json => {
            if (json.Page.total !== this.state.count) {
                this.setState({ list: json.List, count: json.Page.total || 0 })
            }
        });
    }

    handleClear = () => {
        api.Message.ReadAll(json => {
            this.loadData();
        })
    }

    gotoHistoryPage = () => {
        this.setState({ visible: false })
        utils.Redirect('/message/?action=receive')
    }

    handleVisibleChange = (visible) => {
        this.setState({ visible });
    }

    handleMessageLink = (msgId, link) => {
        this.setState({ visible: false })
        api.Message.Read(msgId)
        utils.Redirect(link)
    }

    getMessageItemRender = item => {
        const form = api.Form.GetForm(item.FormId);
        if (!form) return null;
        const link = form.InfoLink.replace('{ID}', item.InfoId);
        return <div className="message-item" key={item.ID} onClick={() => this.handleMessageLink(item.MessageId, link)}>
            <div className={`form-icon form-icon-${form.ID}`}>
                <i className={form.Icon}></i>
            </div>
            <div className="message-content">
                <p>{item.FromUser}向你提交了{form.Name}流程</p>
                <p>{item.Title}</p>
                <p className="datetime">
                    {moment(item.CreateTime).fromNow()}
                </p>
            </div>
        </div>
    }

    getNotificationBox = () => {
        const emptyMsgRender = <div className="message-empty">
            <img src="/images/message_empty.svg" role="presentation" />
            <h3>没有新消息</h3>
        </div>
            ;
        return <div className="message-popover">
            <div className="message-list">
                {this.state.list.length === 0 ? emptyMsgRender : this.state.list.map(this.getMessageItemRender)}
            </div>
            <div className="bottom">
                <Button onClick={this.handleClear}><i className="fa fa-bell-slash-o"></i> 标记所有未读</Button>
                <Button onClick={this.gotoHistoryPage}><i className="fa fa-clock-o"></i> 查看历史消息</Button>
            </div>
        </div>
    }
    render() {
        return (
            <Popover className="message-box"
                visible={this.state.visible}
                onVisibleChange={this.handleVisibleChange}
                placement="bottomRight"
                trigger="click"
                content={this.getNotificationBox()}
                style={{padding:'0'}}
            >
                <span className="message_icon">
                    <Badge count={this.state.count} className="badge">
                        <Icon type="bell" />
                    </Badge>
                </span>
            </Popover>
        );
    }
}

export default MessagePopover;