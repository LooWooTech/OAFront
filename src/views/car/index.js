import React, { Component } from 'react'
import { Menu } from 'antd'
import api from '../../models/api'
import ApplyList from '../forminfo_extend1/_list'
import ApplyFormModal from './apply'

class CarIndex extends Component {

    state = {
        list: [],
        flowId: api.Forms.Car.ID,
        carId: 0,
    }

    componentWillMount() {
        this.loadData();
    }

    loadData = () => {
        api.Car.List(json => {
            var carId = json.length > 0 ? json[0].ID : 0
            this.setState({ list: json, carId })
        })
    }

    handleSubmit = () => this.loadData

    render() {
        if (this.state.loading) return null
        if (!this.state.carId) return null;
        return (
            <div>
                <div className="toolbar">
                    <ApplyFormModal cars={this.state.list} onSubmit={this.handleSubmit} />
                </div>
                <Menu
                    mode="horizontal"
                    defaultSelectedKeys={[this.state.carId.toString() || '']}
                    onClick={({ item, key, keyPath }) => {
                        this.setState({ carId: key })
                    }}>

                    {this.state.list.map(item =>
                        <Menu.Item key={item.ID}>
                            <b>{item.Name}</b> （{item.Number}）
                        </Menu.Item>
                    )}
                </Menu>
                <ApplyList infoId={this.state.carId} />
            </div>
        )
    }
}

export default CarIndex