import React, { Component } from 'react';
import { Timeline } from 'antd';

class FlowDataList extends Component {

    render() {
        const model = this.props.data;
        if (!model) return null;
        const list = model.Nodes;
        if (list == null || list.length === 0) {
            return <span>流程尚未开始</span>;
        }
        return (
            <div>
                <Timeline>
                    {list.map(item => {
                        var color = item.Result === true ? 'green' : (item.Result === false ? 'red' : 'blue');
                        return <Timeline.Item color={color}>
                            {item.User.Department.Name}-{item.User.Name}{item.UpdateTime}
                            <span>{item.Content}</span>
                        </Timeline.Item>
                    })}
                </Timeline>
            </div>
        )
    }
}

export default FlowDataList