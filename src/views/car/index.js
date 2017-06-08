import React, { Component } from 'react'
import { Menu, Affix, Button, Tag } from 'antd'
import api from '../../models/api'
import ApplyList from './_apply_list'
import ApplyFormModal from './apply'
import EditFormModal from './edit'

class CarIndex extends Component {

    state = {
        list: [],
        flowId: api.Forms.Car.ID,
        carId: 0,
    }

    componentWillMount() {
        api.Car.List(json => {
            var car1 = json.length > 0 ? json[0].ID : 0
            this.setState({ list: json, carId: car1.ID })
        })
    }

    render() {
        if (this.state.loading) return null

        return (
            <div>
                <Affix offsetTop={0} className="toolbar">
                    <Button.Group>
                        <EditFormModal
                            onSubmit={this.loadData}
                            trigger={<Button type="primary" icon="plus">添加车辆</Button>}
                        />
                    </Button.Group>
                </Affix>
                <Menu
                    mode="horizontal"
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