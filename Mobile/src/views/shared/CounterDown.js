import React, { Component } from 'react';
import PropTypes, { number } from 'prop-types';

class CounterDown extends Component {
    state = { duration: this.props.duration }
    timerId = null
    componentWillMount() {
        timerId = setInterval(this.timer, this.props.interval || 1000);
    }
    timer = () => {
        if (this.props.break && this.props.break()) {
            console.log('clearInterval')
            clearInterval(this.timerId)
            this.timerId = null
        } else {
            this.setState({ duration: this.state.duration - 1 })
        }
    }

    componentWillUnmount() {
        if (timerId) {
            clearInterval(timerId)
            timerId = null
        }
    }

    render() {
        if (this.state.duration <= 0) {
            return this.props.children
        }
        return null
    }
}

CounterDown.propTypes = {
    duration: PropTypes.number.isRequired,
    interval: PropTypes.number,
    break: PropTypes.func
};

export default CounterDown;