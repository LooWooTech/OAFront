import React, { Component } from 'react'
import { Menu } from 'antd'
import api from '../../models/api'
import ApplyList from './_apply_list'
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
            var car1 = json.length > 0 ? json[0].ID : 0
            this.setState({ list: json, carId: car1.ID })
        })
    }

    handleSubmit = () => this.loadData

    render() {
        if (this.state.loading) return null

        return (
            <div>
                <div className="toolbar">
                    <ApplyFormModal cars={this.state.list} onSubmit={this.handleSubmit} />
                </div>
                <Menu
                    mode="horizontal"
                    defaultSelectedKeys={[this.state.carId || '']}
                    onClick={({ item, key, keyPath }) => {
                        this.setState({ carId: key })
                    }}>

                    {this.state.list.map(item =>
                        <Menu.Item key={item.ID}>
                            <b>{item.Name}</b> （{item.Number}）
                        </Menu.Item>
                    )}
                </Menu>
                <ApplyList carId={this.state.carId} />
            </div>
        )
    }
}

export default CarIndex