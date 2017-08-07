import React, { Component } from 'react'
import { Radio, Alert } from 'antd'
import List from './_list'

class ApplyList extends Component {
    state = {
        userId: this.props.userId || (this.props.location && this.props.location.query && this.props.location.query.userId) || 0,
        status: 1,
        infoId: this.props.infoId || 0,
        formId: parseInt(this.props.formId || (this.props.params && this.props.params.formId), 10) || 0
    }

    render() {
        return (
            <div>
                <div className="toolbar">
                    <Radio.Group defaultValue={this.state.status} onChange={e => {
                        this.setState({ status: e.target.value })
                    }}>
                        <Radio.Button value={0}>全部</Radio.Button>
                        <Radio.Button value={1}>待审核</Radio.Button>
                        <Radio.Button value={2}>已审核</Radio.Button>
                    </Radio.Group>

                </div>
                {this.state.formId ?
                    <List
                        userId={this.state.userId}
                        status={this.state.status}
                        formId={this.state.formId}
                        infoId={this.props.infoId}
                    />
                    : <Alert message="缺少FormId参数" type="info" />}
            </div>
        )
    }
}

export default ApplyList