import React, { Component } from 'react'
import { Button } from 'antd'
import CheckLogModal from '../shared/_check_log_modal'
import BackModal from './_back_modal'
import List from './_list'
import auth from '../../models/auth'
import api from '../../models/api'

class ApplyList extends Component {
    state = {
        status: 1,
        formId: parseInt(this.props.params.formId, 10) || 0
    }

    handleBackSubmit = () => {
        this.refs.list.reload();
    }

    defaultButtonsRender = (text, item) => {
        let buttons = [];
        if (item.UpdateTime) {
            buttons.push(<CheckLogModal key={'checklog-' + item.ID} flowData={item.FlowData} />)
        }
        if (!item.RealEndTime && item.Result === true && auth.isCurrentUser(item.UserId)) {
            let text = '归还';
            switch (this.state.formId) {
                case api.Forms.Car.ID:
                    text = '还车';
                    break;
                case api.Forms.MeetingRoom.ID:
                    text = '使用完毕';
                    break;
                case api.Forms.Leave.ID:
                    text = '请假结束';
                    break;
                default:
                    text = '归还'
                    break;
            }
            buttons.push(<BackModal
                title={text}
                id={item.ID}
                key={'backmodal-' + item.ID}
                trigger={<Button>{text}</Button>}
                onSubmit={this.handleBackSubmit}
            />)
        }
        return buttons;
    }

    render() {
        let user = auth.getUser()
        return <List
            ref="list"
            title={'我的' + api.Form.GetName(this.state.formId) + '记录'}
            applyUserId={user.ID}
            formId={this.state.formId}
            buttons={this.defaultButtonsRender}
            status={this.props.location.query.status}
        />
    }
}

export default ApplyList