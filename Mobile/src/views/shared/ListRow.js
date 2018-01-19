import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Left, Body, Right, ListItem, Icon, Text } from 'native-base'

class ListRow extends Component {
    render() {
        const { style, left, body, right, title, subTitle, onClick, onLongPress, height, fontSize } = this.props
        return (
            <ListItem icon
                onPress={onClick}
                onLongPress={onLongPress}
                style={{ backgroundColor: null, height: null, ...style }}
            >
                {left ? <Left style={{ height: height || null }}>
                    {left}
                </Left> : null}
                {body || this.props.children || <Body style={{ height: height || null, paddingTop: 8, paddingBottom: 8 }}>
                    <Text style={{ fontSize: fontSize || 16, lineHeight: 25 }}>{title}</Text>
                    {subTitle ? <Text note>{subTitle}</Text> : null}
                </Body>
                }
                {right ? <Right style={{ height: height || null }}>
                    {right}
                </Right> : null}
            </ListItem>
        );
    }
}

ListRow.propTypes = {
    left: PropTypes.element,
    body: PropTypes.element,
    right: PropTypes.element,
    title: PropTypes.string,
    subTitle: PropTypes.string,
    onClick: PropTypes.func,
    height: PropTypes.number,
    fontSize: PropTypes.number,
    style: PropTypes.object
};

export default ListRow;