import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer, inject } from 'mobx-react'
import { Left, Body, Right, ListItem, Icon, Text } from 'native-base'
import moment from 'moment'
import ListRow from '../shared/ListRow'

@inject('stores')
class MessageItem extends Component {
    handleClick = () => {
        const data = this.props.data
    }

    render() {
        const data = this.props.data
        const form = this.props.stores.formStore.getForm(data.FormId)
        return (
            <ListRow
                height={105}
                title={data.Title}
                left={<Icon name={form.Icon} style={{ color: form.Color, }} />}
                subTitle={`${data.FromUser || ''}  ${moment(data.CreateTime).format('ll')}`}
                onClick={this.handleClick}
            />
        );
    }
}
MessageItem.propTypes = {
    data:PropTypes.object.isRequired
};
export default MessageItem;