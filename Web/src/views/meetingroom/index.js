import React, { Component } from 'react'
import { Menu, Alert } from 'antd'
import api from '../../models/api'
import ApplyList from '../forminfo_extend1/_list'
import ApplyFormModal from './apply'

class MeetingRoomIndex extends Component {

    state = {
        list: [],
        flowId: api.Forms.MeetingRoom.ID,
        roomId: 0,
    }

    componentWillMount() {
        this.loadData();
    }

    loadData = () => {
        api.MeetingRoom.List(json => {
            var roomId = json.length > 0 ? json[0].ID : 0
            this.setState({ list: json, roomId })
        })
    }

    handleSubmit = () => this.loadData

    render() {
        if (this.state.loading) return null
        return (
            <div>
                <div className="toolbar">
                    <ApplyFormModal rooms={this.state.list} onSubmit={this.handleSubmit} />
                </div>
                <Menu
                    mode="horizontal"
                    defaultSelectedKeys={[this.state.roomId.toString() || '']}
                    onClick={({ item, key, keyPath }) => {
                        this.setState({ roomId: key })
                    }}>

                    {this.state.list.map(item =>
                        <Menu.Item key={item.ID}>
                            <b>{item.Name}</b> （{item.Number}）
                        </Menu.Item>
                    )}
                </Menu>
                {this.state.roomId ?
                    <ApplyList
                        extendInfoId={this.state.roomId}
                        formId={api.Forms.MeetingRoom.ID}
                        toolbar={false}
                    />
                    :
                    <Alert message="还没添加任何会议室" />
                }
            </div>
        )
    }
}

export default MeetingRoomIndex