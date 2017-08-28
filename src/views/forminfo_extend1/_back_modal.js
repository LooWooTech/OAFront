import React, { Component } from 'react'
import { DatePicker } from 'antd'
import moment from 'moment'
import Modal from '../shared/_formmodal'
import api from '../../models/api'

class BackModal extends Component {

    state = {}

    handleSubmit = data => {
        var time = data.RealTime;
        api.FormInfoExtend1.Back(this.props.id, moment(time).format('ll'), json => {
            if (this.props.onSubmit) {
                this.props.onSubmit();
            }
        })
    }

    render() {
        return (
            <Modal
                title={this.props.title || '归还'}
                children={[
                    {
                        title: '具体时间', name: 'RealTime', defaultValue: moment(),
                        render: <DatePicker showTime format="YYYY-MM-DD HH:mm" />,
                        rules: [{ required: true, message: '请选择具体时间' }],
                    }
                ]}
                trigger={this.props.trigger}
                onSubmit={this.handleSubmit}
            />
        )
    }
}

export default BackModal