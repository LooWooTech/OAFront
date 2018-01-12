import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Container, Header, Body, Left, Right, Title, Content, Footer, Button, Text, Input, View, ListItem, List, CheckBox, Item, Icon, Grid, Row, Col } from 'native-base'
import BackButton from './BackButton'
import ListRow from './ListRow'
import { inject, observer } from 'mobx-react';
import { Keyboard } from 'react-native'

@inject('stores')
@observer
class SelectUserModal extends Component {

    state = { selectAll: false }
    componentWillMount() {
        Keyboard.dismiss()
        let params = this.props.navigation.state.params
        this.props.stores.userSelectStore.setParams(params)
        this.props.stores.userSelectStore.data.loadData()
    }

    componentWillUnmount() {
        const onSubmit = this.props.navigation.state.params.onSubmit
        if (onSubmit) {
            onSubmit(this.props.stores.userSelectStore.data.users.filter(e => e.selected))
        }
    }

    handleChangeSearchKey = (val) => {
        this.props.stores.userSelectStore.setParams({ searchKey: val })
    }
    handleSubmitSearch = () => {
        this.props.stores.userSelectStore.data.loadData()
    }

    handleRemove = (user) => {
        user.selected = false
    }

    handleSelectAll = () => {
        const selected = !this.state.selectAll
        this.setState({ selectAll: selected })
        this.props.stores.userSelectStore.data.setAllUserSelected(selected)
    }

    handleSubmit = () => {
        this.props.navigation.goBack()
    }

    render() {
        const { users, departments, multiple } = this.props.stores.userSelectStore.data
        return (
            <Container>
                <Header searchBar rounded>
                    <Item>
                        <BackButton />
                        <Input placeholder="输入姓名查询"
                            onChangeText={this.handleChangeSearchKey}
                            onSubmitEditing={this.handleSubmitSearch}
                        />
                    </Item>
                    <Button transparent onPress={this.handleSubmitSearch}>
                        <Icon name="search" />
                    </Button>
                </Header>
                {multiple ? (
                    <Grid style={{ backgroundColor: '#fff' }}>
                        <Col size={3}>
                            <Content>
                                {departments.map(item => <DepartmentRow key={item.ID} data={item} />)}
                            </Content>
                        </Col>
                        <Col size={2}>
                            <Content>
                                {users.filter(e => e.selected).map(user => (
                                    <ListRow key={user.ID}
                                        title={user.RealName}
                                        right={<Icon name="close" onPress={() => this.handleRemove(user)} />} />
                                ))}
                            </Content>
                        </Col>
                    </Grid>
                ) : <Content>
                        {departments.map(item => <DepartmentRow key={item.ID} data={item} />)}
                    </Content>
                }
                <Footer>
                    <Left>
                        {multiple ?
                            <Button iconLeft transparent onPress={this.handleSelectAll}>
                                <Icon name={this.state.selectAll ? "check-square" : "square-o"} />
                                <Text>全选</Text>
                            </Button>
                            : <Text> 已选：{((users || []).find(e => e.selected) || {}).RealName || ''}</Text>}
                    </Left>
                    <Right>
                        <Button iconLeft primary transparent onPress={this.handleSubmit}>
                            <Icon name="check" />
                            <Text>确定</Text>
                        </Button>
                    </Right>
                </Footer>
            </Container>
        );
    }
}
export default SelectUserModal;

@inject('stores')
@observer
class DepartmentRow extends Component {
    state = {
        show: false,
    }
    handleClick = () => {
        this.setState({ show: !this.state.show })
    }
    handleCheck = () => {
        const data = this.props.data
        this.props.stores.userSelectStore.data.setDepartmentSelected(data.ID, !data.selected)
    }
    render() {
        const data = this.props.data
        const { users, multiple } = this.props.stores.userSelectStore.data
        return (
            <View>
                <ListItem itemDivider style={{ borderBottomWidth: 0.5, borderBottomColor: '#ddd', backgroundColor: '#f8f8f8' }}>
                    {multiple ? <CheckBox checked={data.selected} onPress={this.handleCheck} /> : null}
                    <Body>
                        <Text onPress={this.handleClick}>{data.Name}</Text>
                    </Body>
                    <Right>
                        <Icon onPress={this.handleClick} name={`chevron-${this.state.show ? 'down' : 'right'}`} style={{ fontSize: 14 }} />
                    </Right>
                </ListItem>
                {!this.state.show ? null :
                    users.filter(user => user.Departments.find(d => d.ID === data.ID))
                        .map(user => <UserRow key={data.ID + '-' + user.ID} data={user} />)
                }
            </View>
        );
    }
}

@inject('stores')
@observer
class UserRow extends Component {
    handleClick = () => {
        const data = this.props.data
        this.props.stores.userSelectStore.data.setUserSelected(data.ID, !data.selected)
    }
    render() {
        const data = this.props.data
        return (
            <ListRow
                onClick={this.handleClick}
                left={<Icon name="user" style={{ fontSize: 12, color: '#666' }} />}
                title={data.RealName}
                right={data.selected ? <Icon name="check" style={{ fontSize: 14 }} /> : null}
            />
        );
    }
}