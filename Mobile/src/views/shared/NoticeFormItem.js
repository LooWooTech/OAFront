import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Row, Col, CheckBox, Text } from 'native-base'
import { inject } from 'mobx-react';

@inject('stores')
class NoticeFormItem extends Component {
    state = { sms: this.props.sms }
    handleClickSms = () => {
        this.setState({ sms: !this.state.sms })
    }
    render() {
        return (
            <Row style={{ alignItems: 'center' }} onTouchEnd={this.handleClickSms}>
                <Col size={1}><CheckBox checked={this.state.sms} /></Col>
                <Col size={9}><Text>{this.props.smsText || '发送短信'}</Text></Col>
            </Row>
        );
    }
}

NoticeFormItem.propTypes = {
    sms: PropTypes.bool,
    smsText: PropTypes.string
};

export default NoticeFormItem;