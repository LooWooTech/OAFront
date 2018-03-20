import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer, inject } from 'mobx-react'
import { Container, Header, Left, Right, Body, Title, Content, View, Text, Button, ProgressBar, Icon, Footer, List, ListItem } from 'native-base'
import { Calendar, LocaleConfig } from 'react-native-calendars'
import BackButton from '../shared/BackButton'
import ListRow from '../shared/ListRow'
import NavbarPopover from '../shared/NavbarPopover'
import moment from 'moment'
import { FORMS } from '../../common/config';

@inject('stores')
@observer
class Attendance extends Component {

    menuData = []

    componentWillMount() {
        const userId = this.props.stores.userStore.user.ID
        this.menuData = [
            { label: '我要请假', value: 'Leave.Form', icon: 'calendar-plus-o' },
            {
                label: '请假记录', value: 'Extend1.List', icon: 'calendar-check-o',
                params: { formId: FORMS.Attendance.ID, userId: userId, approvalUserId: 0 }
            },
            {
                label: '请假审批', value: 'Extend1.List', icon: 'calendar-times-o',
                params: { formId: FORMS.Attendance.ID, status: 1, approvalUserId: userId, userId: 0 }
            }
        ]
        LocaleConfig.locales['zh'] = {
            monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
            monthNamesShort: ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二'],
            dayNames: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
            dayNamesShort: ['日', '一', '二', '三', '四', '五', '六']
        };
        LocaleConfig.defaultLocale = 'zh';

        this.props.stores.attendanceStore.loadData(new Date().getFullYear(), new Date().getMonth() + 1)
    }

    handleSelectMenu = (item) => {
        this.props.navigation.navigate(item.value, item.params);
    }

    showMenu = () => {
        this.refs.menu.show();
    }

    handleChangeMonth = (date) => {
        this.props.stores.attendanceStore.loadData(date.year, date.month)
    }

    handleSelectDay = (date) => {
        this.props.stores.attendanceStore.selectDate(new Date(date.year, date.month - 1, date.day))
    }

    handleClickLeave = () => {
        this.props.navigation.navigate('Leave.List')
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
                        <Title>我的考勤</Title>
                    </Body>
                    <Right>
                        <Button transparent onPress={this.showMenu}>
                            <Icon name="bars" />
                        </Button>
                    </Right>
                </Header>
                <Content style={{ backgroundColor: "#fff" }}>
                    <NavbarPopover ref="menu" data={this.menuData} onSelect={this.handleSelectMenu} />
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