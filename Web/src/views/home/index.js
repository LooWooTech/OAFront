import React, { Component } from 'react'
import { Row, Col } from 'antd';
import UserInfoList from './_userinfo_list'
import api from '../../models/api'

export default class Home extends Component {
    render() {
        return (
            <div className="list-myinfo">
                <Row gutter={16}>
                    <Col span={12}>
                        <UserInfoList formId={api.Forms.Missive.ID} title="待办发文" />
                    </Col>
                    <Col span={12}>
                        <UserInfoList formId={api.Forms.ReceiveMissive.ID} title="待办收文" />
                    </Col>
                </Row>
                <Row gutter={16} style={{ marginTop: '10px' }}>
                    <Col span={12}>
                        <UserInfoList formId={api.Forms.Task.ID} title="待办任务" />
                    </Col>
                    <Col span={12}>
                        <UserInfoList formId={api.Forms.Mail.ID} title="未读邮件" />
                    </Col>
                </Row>
            </div>
        );
    }
}