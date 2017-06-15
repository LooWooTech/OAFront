import React, { Component } from 'react'
import { Input, Radio } from 'antd'
import FormModal from '../shared/_formmodal'
import api from '../../models/api'

class MeetingRoomEditModal extends Component {
    handleSubmit = values => {
        api.MeetingRoom.Save(values, json => {
            this.props.onSubmit(json)
        });
    }
    render() {
        const model = this.props.model || {};
        return (
            <FormModal
                title={model.ID ? '编辑会议室' : '添加会议室'}
                onSubmit={this.handleSubmit}
                trigger={this.props.trigger}
                children={[
                    { name: 'ID', defaultValue: model.ID || 0, render: <Input type="hidden" /> },
                    { title: '名称', name: 'Name', defaultValue: model.Name, render: <Input />, rules: [{ required: true, message: '请填写名称' }], },
                    { title: '房间编号', name: 'Number', defaultValue: model.Number, render: <Input />, rules: [{ required: true, message: '请填写车牌号' }], },
                    {
                        title: '类型', name: 'Type', defaultValue: model.Type || 1, render:
                        <Radio.Group>
                            <Radio.Button value={1}>小型</Radio.Button>
                            <Radio.Button value={2}>中型</Radio.Button>
                            <Radio.Button value={3}>大型</Radio.Button>
                        </Radio.Group>
                    },
                ]}
            />
        )
    }
}

export default MeetingRoomEditModal