import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Icon, Button, Row, Col, Text } from 'native-base'
import ListRow from '../shared/ListRow'
import moment from 'moment'

const FreeFlowDataItem = ({ data }) => {
    if (!data) return null
    const iconName = data.Submited ? "check" : "clock-o"
    const iconColor = data.Submited ? "green" : "gray"
    const title = data.Content || (data.Submited ? '已阅' : '未读')
    return (
        <ListRow
            style={{ backgroundColor: '#f2f2f2', paddingLeft: 10, marginRight: 10 }}
            left={<Icon name={iconName} style={{ color: iconColor, fontSize: 13 }} />}
            title={title}
            subTitle={data.Signature + ' ' + (data.UpdateTime ? moment(data.UpdateTime).format('YYYY-MM-DD HH:mm') : '')}
            right={null}
        />
    )
}

class FreeFlowDataList extends Component {
    render() {
        const data = this.props.data
        if (!data) return null;

        let list = data.Nodes || []
        if (list.length === 0) return null
        if (!this.props.showAll) {
            list = list.filter(e => !e.IsCc || (e.Submited && e.Content));
        }
        //如果太长 就只展示提交过的
        if (list.length > 20) {
            list = list.filter(e => e.Submited)
        }
        list = list.sort((a, b) => a.ID - b.ID);
        return list.map(item => <FreeFlowDataItem key={item.ID} data={item} />);
    }
}

FreeFlowDataList.propTypes = {
    data: PropTypes.object.isRequired,
    showAll: PropTypes.bool
};

export default FreeFlowDataList;