import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer, inject } from 'mobx-react'
import { Text, StyleSheet } from 'react-native'
import { Icon } from 'native-base'
import moment from 'moment'
import ListRow from '../shared/ListRow'

class GoodsItem extends Component {
    handleClick = () => {
        const model = this.props.model
        this.props.onClick(model)
    }
    render() {
        const model = this.props.model
        const iconName = model.Number > 0 ? model.Number > 2 ? "battery-4" : "battery-2" : "battery-0"
        const iconColor = model.Status ? model.Number > 2 ? "#3a76d0" : "#82a4d6" : "gray"
        return (
            <ListRow
                title={model.Name}
                left={<Icon name={iconName} style={{ color: iconColor }} />}
                subTitle={`分类：${model.Category.Name}  数量${model.Number}`}
                onClick={this.handleClick}
            />
        );
    }
}

GoodsItem.propTypes = {
    model: PropTypes.object.isRequired
}

export default GoodsItem;