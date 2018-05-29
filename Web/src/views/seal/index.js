import React, { Component } from 'react'
import { Menu, Alert } from 'antd'
import api from '../../models/api'
import ApplyList from '../forminfo_extend1/_list'
import ApplyFormModal from './apply'

class SealIndex extends Component {

    state = {
        list: [],
        flowId: api.Forms.Seal.ID,
        sealId: 0,
    }

    componentWillMount() {
        this.loadData();
    }

    loadData = () => {
        api.Seal.List(json => {
            var sealId = json.length > 0 ? json[0].ID : 0
            this.setState({ list: json, sealId })
        })
    }

    handleSubmit = () => this.loadData

    render() {
        if (this.state.loading) return null
        return (
            <div>
                <div className="toolbar">
                    <ApplyFormModal seals={this.state.list} onSubmit={this.handleSubmit} />
                </div>
                <Menu
                    mode="horizontal"
                    defaultSelectedKeys={[this.state.sealId.toString() || '']}
                    onClick={({ item, key, keyPath }) => {
                        this.setState({ sealId: key })
                    }}>

                    {this.state.list.map(item =>
                        <Menu.Item key={item.ID}>
                            <b>{item.Name}</b>
                        </Menu.Item>
                    )}
                </Menu>
                {this.state.sealId ?
                    <ApplyList
                        infoId={this.state.sealId}
                        formId={api.Forms.Seal.ID}
                        toolbar={false}
                    />
                    :
                    <Alert message="还没添加任何印章" />
                }
            </div>
        )
    }
}

export default SealIndex