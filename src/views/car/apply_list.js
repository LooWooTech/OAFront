import React, { Component } from 'react'
import { Radio } from 'antd'
import ApplyList from './_apply_list'

class CarApproval extends Component {
    state = {
        userId: this.props.userId ||this.props.params.userId ||  0,
        status: 0,
    }

    render() {
        return (
            <div>
                <div className="toolbar">
                    <Radio.Group defaultChecked={this.state.status} onChange={e => {
                        
                    }}>
                        <Radio.Button value={0}>全部</Radio.Button>
                        <Radio.Button value={1}>待审批</Radio.Button>
                        <Radio.Button value={2}>已审批</Radio.Button>
                    </Radio.Group>

                </div>
                <ApplyList userId={this.state.userId} status={this.state.status} />
            </div>
        )
    }
}

export default CarApproval