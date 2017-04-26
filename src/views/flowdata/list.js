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
        const getContent = content => content ? content.split('\n').map((str, key) => <span key={key}>{str}<br /></span>) : null;
        const freeList = nodes =>
            <div className="sub-timeline">
                <Timeline>
                    {nodes.map(item => {
                        var color = item.Submited ? 'green' : 'blue';
                        var icon = item.Submited ? 'check' : 'clock-circle-o';
                        return <Timeline.Item color={color} icon={icon} key={item.ID}>
                            <span className="flownode-sign">{item.Signature}</span>
                            <span className="flownode-datetime">{item.UpdateTime ? moment(item.UpdateTime).format('YYYY-MM-DD HH:mm') : ''}</span>
                            <div className="flownode-content">{getContent(item.Content)}</div>
                        </Timeline.Item>

                    })}
                </Timeline>
            </div>;
        return (
            <div style={{ padding: '20px', marginLeft: '20px' }}>
                <Timeline>
                    {list.sort((a, b) => a.ID > b.ID).map(item => {
                        var color = item.Result === true ? 'green' : (item.Result === false ? 'red' : 'blue');
                        var icon = color === 'green' ? 'check' : color === 'red' ? 'close' : 'clock-circle-o';
                        return <Timeline.Item dot={<Icon type={icon} style={{ fontSize: '1rem' }} />} color={color} key={item.ID}>
                            <span className="flownode-sign">{item.Signature}</span>
                            （<span className="flownode-name">{item.FlowNodeName}</span>）
                        <span className="flownode-datetime">{item.UpdateTime ? moment(item.UpdateTime).format('YYYY-MM-DD HH:mm') : ''}</span>
                        <div className="flownode-content">{getContent(item.Content)}</div>
                        {item.Nodes && item.Nodes.length > 0 ? freeList(item.Nodes) : null}
                    </Timeline.Item>
                })}
            </Timeline>
            </div>
        )
    }
}

export default FlowDataList