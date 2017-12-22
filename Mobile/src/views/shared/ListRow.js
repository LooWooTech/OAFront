import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Left, Body, Right, ListItem, Icon, Text } from 'native-base'

class ListRow extends Component {
    render() {
        const { left, right, title, subTitle, onClick, height, fontSize } = this.props
        return (
            <ListItem icon onPress={onClick} style={{ marginLeft: 0, paddingLeft: 10, height: null }}>
                {left ? <Left style={{ height: null }}>
                    {left}
                </Left> : null}
                <Body style={{ height: height || null, paddingTop: 8, paddingBottom: 8 }}>
                    <Text style={{ fontSize: fontSize || 16, lineHeight: 25 }}>{title}</Text>
                    {subTitle ? <Text note>{subTitle}</Text> : null}
                </Body>
                <Right style={{ height: null }}>
                    {right || <Icon name="chevron-right" />}
                </Right>
            </ListItem>
        );
    }
}

ListRow.propTypes = {
    left: PropTypes.element,
    right: PropTypes.element,
    title: PropTypes.string.isRequired,
    subTitle: PropTypes.string,
    onClick: PropTypes.func,
    height: PropTypes.number,
    fontSize: PropTypes.number,
    style: PropTypes.object
};

export default ListRow;