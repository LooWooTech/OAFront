import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Button, Card } from 'antd'
import moment from 'moment';
class CheckButton extends Component {

    state = { now: moment() }

    componentWillMount() {
        var intervalId = setInterval(this.timer, 1000);
        this.setState({ intervalId: intervalId });
    }

    componentWillUnmount() {
        clearInterval(this.state.intervalId);
    }

    timer = () => {
        this.setState({ now: moment() })
    }

    getLogsOfDate = (logs, date) => logs.filter(e => moment(e.CreateTime).format('YYYYMMDD') === date.format('YYYYMMDD'))

    render() {
        const config = {};
        for(var key in this.props.config){
            config[key] = moment(this.props.config[key]);
        }
        const logs = this.props.logs || [];
        const onClick = this.props.onClick;
        if (!config) return null;

        const now = moment();
        let hasChecked = false;
        let canCheck = false;

        //如果在上午打卡区间
        if (now >= config.AMBeginTime && now <= config.AMLastTime) {
            canCheck = true;
            hasChecked = this.getLogsOfDate(logs, now).find(e => moment(e.CreateTime) >= config.AMBeginTime && moment(e.CreateTime) <= config.AMLastTime);
        }
        //如果在下午打卡区间
        else if (now >= config.PMEarlyTime && now <= config.PMEndTime) {
            canCheck = true;
            hasChecked = this.getLogsOfDate(logs, now).find(e => moment(e.CreateTime) >= config.PMEarlyTime && moment(e.CreateTime) <= config.PMEndTime);
        }
        if (canCheck) {
            return <Card>
                <Button icon="check" type="primary" onClick={onClick} className="btn-checkInOut">
                    {hasChecked ? "已打卡" : "立即打卡"}
                </Button>
            </Card>;
        }
        else {
            return <Card>
                <Button icon="clock" disabled={true} className="btn-checkInOut">
                    {this.state.now.format('LTS')} <br />
                    <span style={{ fontSize: '0.8rem' }}>当前时间不能打卡</span>
                </Button>
            </Card>;
        }
    }
}

CheckButton.propTypes = {
    config: PropTypes.object.isRequired,
    logs: PropTypes.array,
    onClick: PropTypes.func.isRequired
}

export default CheckButton