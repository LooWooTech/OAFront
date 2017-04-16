import React, { Component } from 'react';
import { Timeline, Icon } from 'antd';
import moment from 'moment';

class FlowDataList extends Component {

    render() {
        const model = this.props.data;
        if (!model) return null;
        const list = model.Nodes;
        if (list == null || list.length === 0) {
            return <span>流程尚未开始</span>;
        }
        return (
            <Timeline>
                {list.sort((a, b) => a.ID > b.ID).map(item => {
                    var color = item.Result === true ? 'green' : (item.Result === false ? 'red' : 'blue');
                    var icon = color === 'green' ? 'check' : color === 'red' ? 'close' : 'clock-circle-o';
                    return <Timeline.Item dot={<Icon type={icon} style={{ fontSize: '1rem' }} />} color={color} key={item.ID}>
                        <span className="flownode-name">{item.FlowNodeName}</span>
                        <span className="flownode-sign">{item.Signature}</span>
                        <span className="flownode-datetime">{item.UpdateTime ? moment(item.UpdateTime).format('YYYY-MM-DD HH:mm') : ''}</span>
                        <div className="flownode-content">{item.Content}</div>
                    </Timeline.Item>
                })}
            </Timeline>
        )
    }
}

export default FlowDataList