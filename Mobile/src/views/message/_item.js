import React, { Component } from 'react';
import { observer, inject } from 'mobx-react'
import { Left, Body, Right, ListItem, Icon, Text } from 'native-base'
import moment from 'moment'
import ListRow from '../shared/ListRow'

@inject('stores')
class MessageItem extends Component {
    handleClick = () => {
        const { model } = this.props
    }

    render() {
        const { model } = this.props
        const form = this.props.stores.formStore.getForm(model.FormId)
        return (
            <ListRow
                height={105}
                title={model.Title}
                left={<Icon name={form.Icon} style={{ color: form.Color, }} />}
                subTitle={`${model.FromUser || ''}  ${moment(model.CreateTime).format('ll')}`}
                onClick={this.handleClick}
            />
        );
    }
}
export default MessageItem;