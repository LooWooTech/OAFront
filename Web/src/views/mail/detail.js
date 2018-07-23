import React, { Component } from 'react';
import { Col, Row, Button, Tag, Modal } from 'antd'
import api from '../../models/api'
import auth from '../../models/auth'
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
            this.setState({ ...json })
        })
    }

    canReply = () => {
        return !!this.state.userMail;
    }

    handleRecovery = () => {
        Modal.confirm({
            title: '提醒',
            content: '你确定要恢复此封邮件吗？',
            okText: '确认',
            cancelText: '取消',
            onOk: () => {
                api.UserInfo.Recovery(this.state.userMail.ID, () => {
                    utils.GoBack();
                })
            }
        })
    }

    handleDelete = () => {
        const { model, userMail } = this.state
        let tips = '你确定要删除此封邮件吗？'
        if (this.isCreator() && model.IsDraft) {
            tips = '你确定要删除此草稿吗？'
        }
        if(userMail.Trash){
            tips = '彻底删除将无法恢复，你确定要彻底删除吗？'
        }
        else{
            tips = '你确定要将此封邮件移动到回收站吗？'
        }
        Modal.confirm({
            title: '提醒',
            content: tips,
            okText: '确认',
            cancelText: '取消',
            onOk: () => {
                api.Mail.Delete(this.state.model.ID, () => {
                    utils.GoBack()
                })
            }
        })
    }

    isCreator = () => {
        return auth.isCurrentUser(this.state.fromUser.ID)
    }

    render() {
        const { model, userMail, fromUser, toUsers, ccUsers, attachments } = this.state;
        if (!model) return null;
        if (!userMail && !this.isCreator()) {
            return <div>您没有权限查看此邮件</div>;
        }

        return (
            <div>
                <div className="toolbar">
                    <Button.Group>
                        {this.canReply() ?
                            <Button icon="enter" type="primary" onClick={() => utils.Redirect('/mail/post?replyId=' + model.ID)}>回复</Button>
                            : null}
                        <Button icon="retweet" onClick={() => utils.Redirect('/mail/post?forwardId=' + model.ID)}>转发</Button>
                        {userMail && userMail.Trash ?
                            <Button icon="rollback" type="success" onClick={this.handleRecovery}>恢复</Button>
                            :
                            <Button icon="delete" type="danger" onClick={this.handleDelete}>删除</Button>
                        }
                        {!this.isCreator() ?
                            <Button icon="delete" type="danger" onClick={this.handleDelete}>彻底删除</Button>
                            : null}
                        <Button icon="left" onClick={utils.GoBack}>返回</Button>
                    </Button.Group>
                </div>
                <div className="mail-header">
                    <h3>邮件主题：{model.Subject}</h3>
                    <Row>
                        <Col span={2}><label>发件人：</label></Col>
                        <Col>{fromUser.RealName}</Col>
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