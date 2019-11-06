import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Text } from 'native-base'
class SelectUserButton extends Component {
    state = { users: [] }
    handleSelectUser = () => {
        this.context.navigation.navigate('SelectUser', {
            formType: this.props.type,
            key: this.props.name,
            ...this.props.params,
            onSubmit: (users) => {
                this.setState({ users: users })
                if (this.props.onSelected) {
                    this.props.onSelected(users)
                }
            }
        })
    }
    getButtonText = (users) => {
        const maxNum = 5
        if (users.length > 0) {
            let text = '已选'
            for (var i = 0; i < maxNum; i++) {
                if (i < users.length) {
                    text += ' ' + users[i].RealName;
                }
            }
            if (users.length > maxNum) {
                text += ' 等' + users.length + '人';

            }
            return text;
        }
        else {
            return '点击选择人员'
        }
    }

    getSelectedUsers = () => {
        return this.state.users
    }

    render() {
        return (
            <Button transparent onPress={this.handleSelectUser}>
                <Text>{this.getButtonText(this.state.users)}</Text>
            </Button>
        );
    }
}
SelectUserButton.contextTypes = {
    navigation: PropTypes.object.isRequired
}
SelectUserButton.propTypes = {
    name: PropTypes.string.isRequired,
    type: PropTypes.string,
    multiple: PropTypes.bool,
    onSelected: PropTypes.func,
    text: PropTypes.string,
    params: PropTypes.object
};

export default SelectUserButton;