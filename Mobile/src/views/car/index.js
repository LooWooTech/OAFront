import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Container, Header, Body, Left, Text, View, Right, Content, Title, Icon, Button, List, ListItem, Item, H1, Input } from 'native-base'
import { observer, inject } from 'mobx-react'
import { FlatList, Dimensions } from 'react-native'
import { FORMS } from '../../common/config';
import BackButton from '../shared/BackButton'
import ListRow from '../shared/ListRow'
import NavbarPopover from '../shared/NavbarPopover'

@inject('stores')
@observer
export default class CarIndex extends Component {

    menuData = []

    componentWillMount() {
        this.props.stores.carStore.getList();
        const userId = this.props.stores.userStore.user.ID
        this.menuData = [
            { label: '申请用车', value: 'Car.Form', icon: 'calendar-plus-o' },
            {
                label: '申请记录', value: 'Extend1.List', icon: 'calendar-check-o',
                params: { formId: FORMS.Car.ID, userId: userId, approvalUserId: 0 }
            },
            {
                label: '用车审批', value: 'Extend1.List', icon: 'calendar-times-o',
                params: { formId: FORMS.Car.ID, status: 1, approvalUserId: userId, userId: 0 }
            }
        ]
    }

    showMenu = () => this.refs.menu.show()
    handleSelectMenu = (item) => this.props.navigation.navigate(item.value, item.params);
    handleItemClick = (item) => this.props.navigation.navigate('Extend1.List', {
        formId: FORMS.Car.ID,
        infoId: item.ID,
    })

    render() {
        const { list } = this.props.stores.carStore
        return (
            <Container>
                <Header>
                    <Left>
                        <BackButton />
                    </Left>
                    <Body>
                        <Title>车辆申请</Title>
                    </Body>
                    <Right>
                        <Button transparent onPress={this.showMenu}>
                            <Icon name="plus" />
                        </Button>
                    </Right>
                </Header>
                <Content>
                    <NavbarPopover ref="menu" data={this.menuData} onSelect={this.handleSelectMenu} />
                    {list.map(item => <CarItem key={item.ID} model={item} onClick={this.handleItemClick} />)}
                </Content>
            </Container>
        )
    }
}
class CarItem extends Component {

    handleClick = () => {
        this.props.onClick(this.props.model)
    }

    render() {
        const model = this.props.model
        return (
            <ListRow
                key={model.ID}
                left={<Icon name="car" style={{ color: model.Status === 0 ? "green" : model.Status === 2 ? "gray" : "red" }} />}
                title={model.Name}
                subTitle={model.Number}
                right={<Text note><Icon name="chevron-right" style={{ fontSize: 12 }} /></Text>}
                onClick={this.handleClick}
            />
        )
    }
}
CarItem.propTypes = {
    model: PropTypes.object.isRequired,
    onClick: PropTypes.func.isRequired
}