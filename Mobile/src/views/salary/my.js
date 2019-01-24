import React, { Component } from 'react';
import { observer, inject } from 'mobx-react'
import { FlatList, Dimensions } from 'react-native'
import { Container, Header, Body, Left, Text, View, Right, Content, Title, Icon, Button, List, ListItem, Item, H1, Input } from 'native-base'
import BackButton from '../shared/BackButton'
import NavbarPopover from '../shared/NavbarPopover'
import SalaryItem from './_item'
import ListEmptyComponent from '../shared/ListEmptyComponent'

@inject('stores')
@observer
class MySalaryList extends Component {
    state = {
        userId: this.props.stores.userStore.user.ID,
        year: new Date().getFullYear()
    }

    componentWillMount() {
        this.loadYears();
        this.loadData(this.state.year);
    }

    loadYears = () => {
        this.props.stores.salaryStore.getYears(this.state.userId);
    }

    loadData = (year) => {
        this.props.stores.salaryStore.getSalaryDatas({ userId: this.state.userId, year, rows: 100 })
    }

    showPopover = () => this.refs.menu.show()
    handleSelectMenu = item => this.loadData(item.value)

    handleClickItem = (item) => this.props.navigation.navigate('Salary.Detail', { data: item })

    render() {
        const { salaryDatas, years } = this.props.stores.salaryStore
        return (
            <Container>
                <Header>
                    <Left>
                        <BackButton />
                    </Left>
                    <Body>
                        <Title>我的工资单</Title>
                    </Body>
                    <Right>
                        <Button transparent onPress={this.showPopover}>
                            <Icon name="bars" />
                        </Button>
                    </Right>
                </Header>
                <Content>
                    <NavbarPopover ref="menu" data={years.map(year => ({ label: year, value: year }))} onSelect={this.handleSelectMenu} />
                    <List>
                        {salaryDatas.map((item) => <SalaryItem key={item.ID} model={item} onClick={this.handleClickItem} />)}
                    </List>
                </Content>
            </Container>
        );
    }
}

export default MySalaryList;