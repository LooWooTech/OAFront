import React, { Component } from 'react';
import { Col, Row, Button, Tag, Modal } from 'antd'
import api from '../../models/api'
import utils from '../../utils'
import moment from 'moment'

class EmailDetail extends Component {

    state = {
        id: this.props.location.query.id || 0
    }

    componentWillMount() {
        this.loadData();
    }

    loadData = () => {
        if (this.state.id === 0) return;
        api.Mail.Model(this.state.id, json => {
            json.userMail = json.model.Users.find(e => e.$id === json.userMail.$ref)
            this.setState({ ...json })
        })
    }

    canReply = () => {
        return !!this.state.userMail;
    }

    handleRecovery = () => {

    }

    handleDelete = () => {
        if (this.state.userMail.Trash) {
            Modal.confirm({
                title: '提醒',
                content: '彻底删除将无法恢复，你确定要彻底删除吗？',
                okText: '确认',
                cancelText: '取消',
                onOk: () => {
                    api.UserInfo.Delete(this.state.userMail.ID, json => {
                        utils.GoBack()
                    })
                }
            });
        } else {
            Modal.confirm({
                title: '提醒',
                content: '你确定要将此封邮件移动到回收站吗？',
                okText: '确认',
                cancelText: '取消',
                onOk: () => {
                    api.UserInfo.Trash(this.state.userMail.ID, json => {
                        utils.GoBack()
                    })
                }
            });
        }
    }

    render() {
        const { model, userMail, fromName, toUsers, ccUsers, attachments } = this.state;
        if (!model) return null;
        if (!userMail) return <div>您没有权限查看此邮件</div>;

        return (
            <div>
                <div className="toolbar">
                    <Button.Group>
                        {this.canReply() ?
                            <Button icon="enter" type="primary" onClick={() => utils.Redirect('/email/post?replyId=' + model.ID)}>回复</Button>
                            : null}
                        <Button icon="retweet" onClick={() => utils.Redirect('/email/post?forwardId=' + model.ID)}>转发</Button>
                        {userMail.Trash ?
                            <Button icon="rollback" type="success" onClick={this.handleRecovery}>恢复</Button>
                            :
                            <Button icon="delete" type="danger" onClick={this.handleDelete}>删除</Button>
                        }
                        <Button icon="delete" type="danger" onClick={this.handleDelete}>彻底删除</Button>
                        <Button icon="left" onClick={utils.GoBack}>返回</Button>
                    </Button.Group>
                </div>
                <div className="mail-header">
                    <h3>邮件主题：{model.Subject}</h3>
                    <Row>
                        <Col span={2}><label>发件人：</label></Col>
                        <Col>{fromName}</Col>
                    </Row>
                    <Row>
                        <Col span={2}><label>时间：</label></Col>
                        <Col>{moment(model.CreateTime).format('lll')}</Col>
                    </Row>
                    <Row>
                        <Col span={2}><label>收件人：</label></Col>
                        <Col>{toUsers.map(user => <Tag key={user.ID}>{user.RealName}</Tag>)}</Col>
                    </Row>
                    <Row>
                        <Col span={2}><label>抄送：</label></Col>
                        <Col>{ccUsers.map(user => <Tag key={user.ID}>{user.RealName}</Tag>)}</Col>
                    </Row>
                    <Row>
                        <Col span={2}><label>附件：</label></Col>
                        <Col>{attachments.length > 0 ? attachments.map(file => <a key={file.ID} href={api.File.FileUrl(file.ID)} target="_blank">{file.FileName}</a>) : '无'} <br /></Col>
                    </Row>
                </div>
                <Row className="mail-body">
                    <div dangerouslySetInnerHTML={{ __html: this.state.model.Content }} />
                </Row>
            </div>
        );
    }
}

export default EmailDetail;