import React, { Component } from 'react'
import { Button } from 'antd'
import BackModal from './_back_modal'
import List from './_list'
import auth from '../../models/auth'
import api from '../../models/api'

class ApplyList extends Component {
    state = {
        status: 1,
        infoId: parseInt(this.props.infoId || (this.props.params && this.props.params.infoId), 10) || 0,
        formId: parseInt(this.props.formId || (this.props.params && this.props.params.formId), 10) || 0
    }

    handleBackSubmit = () => {
        this.refs.list.reload();
    }

    defaultButtonsRender = (text, item) => {
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
            return <BackModal
                title={text}
                id={item.ID}
                trigger={<Button>{text}</Button>}
                onSubmit={this.handleBackSubmit}
            />
        }
    }

    render() {
        let user = auth.getUser()
        return <List
            ref="list"
            userId={user.ID}
            formId={this.state.formId}
            infoId={this.props.infoId}
            buttons={this.defaultButtonsRender}
        />
    }
}

export default ApplyList