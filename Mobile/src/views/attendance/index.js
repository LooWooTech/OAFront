import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer, inject } from 'mobx-react'
import { Container, Header, Left, Right, Body, Title, Content, View, Text, Button, ProgressBar, Icon, Footer, List, ListItem } from 'native-base'
import { Calendar, LocaleConfig } from 'react-native-calendars'
import BackButton from '../shared/BackButton'
import ListRow from '../shared/ListRow'

import moment from 'moment'

@inject('stores')
@observer
class Attendance extends Component {

    componentWillMount() {
        LocaleConfig.locales['zh'] = {
            monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
            monthNamesShort: ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二'],
            dayNames: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
            dayNamesShort: ['日', '一', '二', '三', '四', '五', '六']
        };
        LocaleConfig.defaultLocale = 'zh';

        this.props.stores.attendanceStore.loadData(new Date().getFullYear(), new Date().getMonth() + 1)
    }

    handleChangeMonth = (date) => {
        this.props.stores.attendanceStore.loadData(date.year, date.month)
    }

    handleSelectDay = (date) => {
        this.props.stores.attendanceStore.selectDate(new Date(date.year, date.month - 1, date.day))
    }

    render() {
        const { markedDates, currentLeaves, currentLogs } = this.props.stores.attendanceStore
        return (
            <Container>
                <Header>
                    <Left>
                        <BackButton />
                    </Left>
                    <Body>
                        <Title>考勤情况</Title>
                    </Body>
                    <Right>

                    </Right>
                </Header>
                <Content style={{ backgroundColor: "#fff" }}>
                    <Calendar
                        maxDate={moment().format('YYYY-MM-DD')}
                        onDayPress={this.handleSelectDay}
                        onMonthChange={this.handleChangeMonth}
                        markedDates={markedDates}
                        markingType={'multi-dot'}
                    />
                    <List>
                        <ListItem itemDivider>
                            <Text>打卡记录</Text>
                        </ListItem>
                        {currentLogs.length > 0 ? currentLogs.map(item => <ListRow key={item.ID} title={moment(item.CreateTime).format('YYYY-MM-DD HH:mm')} subTitle={JSON.parse(item.ApiContent).msg} />)
                            : <ListRow title="无打卡记录" />
                        }
                        <ListItem itemDivider>
                            <Text>请假记录</Text>
                        </ListItem>
                        {currentLeaves.length > 0 ? currentLeaves.map(item => <ListRow key={item.ID} title={`${moment(item.ScheduleBeginTime).format('YYYY-MM-DD HH:mm')}~${moment(item.ScheduleEndTime).format('YYYY-MM-DD HH:mm')}`} />)
                            : <ListRow title="无请假记录" />
                        }
                    </List>
                </Content>
            </Container>
        );
    }
}

export default Attendance;