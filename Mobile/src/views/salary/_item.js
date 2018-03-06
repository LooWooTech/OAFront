import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'native-base'
import ListRow from '../shared/ListRow'
import { FORMS } from '../../common/config'
class SalaryItem extends Component {

    handleClick = () => {
        const model = this.props.model
        if (this.props.onClick)
            this.props.onClick(model)
    }

    render() {
        const model = this.props.model
        return (
            <ListRow
                left={<Icon name="calculator" style={{ color: FORMS.Salary.Color, }} />}
                title={model.Title}
                onClick={this.handleClick}
            />
        );
    }
}

SalaryItem.propTypes = {
    model: PropTypes.object.isRequired
};

export default SalaryItem;