import React, { Component } from 'react';
import { Col, Row, Button } from 'antd'
import { Link } from 'react-router'
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
            this.setState({ ...json })
        })
    }

    canReply = () => {
        return false;
    }

    canForward = () => {

    }

    handleDelete = () => {

    }

    render() {
        if (!this.state.model) return null;
        const model = this.state.model;
        return (
            <div>
                <div className="toolbar">
                    <Button.Group>
                        {this.canReply() ?
                            <Button icon="reply" type="primary" onClick={() => utils.Redirect('/email/post?replyId=' + model.ID)}>回复</Button>
                            : null}
                        {this.canForward() ?
                            <Button icon="forward" onClick={() => utils.Redirect('/email/post?forwardId=' + model.ID)}>转发</Button>
                            : null}
                        <Button icon="delete" type="danger" onClick={this.handleDelete}>删除</Button>
                        <Button icon="back" onClick={utils.GoBack}>返回</Button>
                    </Button.Group>
                </div>
                <div className="mail-header">
                    <h3>邮件主题：{this.state.model.Subject}</h3>
                    <Row>
                        <Col span={2}><label>发件人：</label></Col>
                        <Col>{this.state.fromName}</Col>
                    </Row>
                    <Row>
                        <Col span={2}><label>时间：</label></Col>
                        <Col>{moment(this.state.model.CreateTime).format('lll')}</Col>
                    </Row>
                    <Row>
                        <Col span={2}><label>收件人：</label></Col>
                        <Col>{this.state.toUsers.map(user => user.RealName).join()}</Col>
                    </Row>
                    <Row>
                        <Col span={2}><label>抄送：</label></Col>
                        <Col>{this.state.ccUsers.map(user => user.RealName).join()}</Col>
                    </Row>
                    <Row>
                        <Col span={2}><label>附件：</label></Col>
                        <Col>{this.state.attachments.length > 0 ? this.state.attachments.map(file => <Link to={api.File.FileUrl(file.ID)}>{file.FileName}</Link>) : '无'} <br /></Col>
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