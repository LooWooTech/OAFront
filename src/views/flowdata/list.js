import React, { Component } from 'react';
import { Timeline } from 'antd';
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
            <div>
                <Timeline>
                    {list.map(item => {
                        var color = item.Result === true ? 'green' : (item.Result === false ? 'red' : 'blue');
                        return <Timeline.Item color={color} key={item.ID}>
                            {item.Department}-{item.Signature}
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            {item.UpdateTime ? moment(item.UpdateTime).format('YYYY-MM-DD HH:mm') : ''}
                            <div>{item.Content}</div>
                        </Timeline.Item>
                    })}
                </Timeline>
            </div>
        )
    }
}

export default FlowDataList