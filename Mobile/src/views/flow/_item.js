import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Icon, Button, Row, Col, Text } from 'native-base'
import ListRow from '../shared/ListRow'
import moment from 'moment'
import FreeFlowDataList from '../freeflow/_list'

class FlowDataListItem extends Component {
    state = { showAll: false }

    handleClick = () => {
        this.setState({ showAll: !this.state.showAll })
    }

    render() {
        const data = this.props.data
        if (data == null) return null

        let title = data.Content
        if (!title) {
            title = data.Result === null ? data.FreeFlowData ? '传阅中' : '待审核' : data.Result ? '同意' : '不同意';
        }
        const iconName = data.Result === null ? "clock-o" : data.Result ? "check" : "minus-circle"
        const iconColor = data.Result === null ? "#999" : data.Result ? "green" : "red"
        return (
            <View>
                <ListRow
                    onClick={this.handleClick}
                    left={<Icon name={iconName} style={{ color: iconColor, fontSize: 16 }} />}
                    title={title}
                    subTitle={data.Signature + ' ' + (data.UpdateTime ? moment(data.UpdateTime).format('YYYY-MM-DD HH:mm') : '')}
                    right={
                        <Text note>{data.FlowNodeName} {data.FreeFlowData ?
                            <Icon name={`chevron-${this.state.showAll ? 'down' : 'right'}`} style={{ fontSize: 12 }} /> : null}
                        </Text>
                    }
                />
                {data.FreeFlowData ? <FreeFlowDataList data={data.FreeFlowData} showAll={this.state.showAll} /> : null}
            </View>
        );
    }
}

FlowDataListItem.propTypes = {
    data: PropTypes.object.isRequired
};

export default FlowDataListItem;