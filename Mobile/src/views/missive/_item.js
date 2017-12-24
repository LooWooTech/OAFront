import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer, inject } from 'mobx-react'
import { Text, StyleSheet } from 'react-native'
import { Icon } from 'native-base'
import moment from 'moment'
import ListRow from '../shared/ListRow'

class MissiveListItem extends Component {
    handleClick = () => {
        const model = this.props.model
        
        this.props.onClick(model)
    }
    render() {
        const model = this.props.model
        const iconName = model.Important ? 'flag' : model.JJ_DJ ? 'warning' : model.Uid ? 'link' : 'file-o'
        const iconColor = model.Important ? '#21b384' : model.JJ_DJ ? '#b32121' : model.Uid ? '#215ab3' : '#666'
        return (
            <ListRow
                title={model.Title}
                left={<Icon name={iconName} style={{ color: iconColor }} />}
                subTitle={`${model.FlowStep ? '所在流程：' + model.FlowStep : ''}     ${model.UpdateTime ? moment(model.UpdateTime).format('ll') : ''}`}
                onClick={this.handleClick}
            />
        );
    }
}

MissiveListItem.propTypes = {
    model: PropTypes.object.isRequired
}

export default MissiveListItem;