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
export default class SealIndex extends Component {

    menuData = []

    componentWillMount() {
        this.props.stores.sealStore.getList();
        const userId = this.props.stores.userStore.user.ID
        this.menuData = [
            { label: '申请印章', value: 'Seal.Apply', icon: 'plus' },
            {
                label: '我的申请', value: 'Extend1.List', icon: 'history',
                params: { formId: FORMS.Seal.ID, applyUserId: userId, approvalUserId: 0, extendInfoId: 0 }
            },
            {
                label: '我的审核', value: 'Extend1.List', icon: 'check',
                params: { formId: FORMS.Seal.ID, status: 1, userId: userId, applyUserId: 0, extendInfoId: 0 }
            }
        ]
    }

    showMenu = () => this.refs.menu.show()
    handleSelectMenu = (item) => this.props.navigation.navigate(item.value, item.params);
    handleItemClick = (item) => {
        const userId = this.props.stores.userStore.user.ID
        const hasViewRight = this.props.stores.userStore.hasRight('Form.Seal.View')
        
        this.props.navigation.navigate('Extend1.List', {
            formId: FORMS.Seal.ID,
            extendInfoId: item.ID,
            applyUserId: 0,
            approvalUserId: 0,
            userId: hasViewRight ? 0 : userId
        })
    }

    render() {
        const { list } = this.props.stores.sealStore
        return (
            <Container>
                <Header>
                    <Left>
                        <BackButton />
                    </Left>
                    <Body>
                        <Title>申请印章</Title>
                    </Body>
                    <Right>
                        <Button transparent onPress={this.showMenu}>
                            <Icon name="bars" />
                        </Button>
                    </Right>
                </Header>
                <Content>
                    <NavbarPopover ref="menu" data={this.menuData} onSelect={this.handleSelectMenu} />
                    {list.map(item => <SealItem key={item.ID} model={item} onClick={this.handleItemClick} />)}
                </Content>
            </Container>
        )
    }
}
class SealItem extends Component {

    handleClick = () => {
        this.props.onClick(this.props.model)
    }

    render() {
        const model = this.props.model
        return (
            <ListRow
                key={model.ID}
                left={<Icon name={FORMS.Seal.Icon} style={{ color: model.Status === 0 ? "green" : model.Status === 2 ? "gray" : "red" }} />}
                title={model.Name}
                subTitle={model.Number}
                right={<Text note><Icon name="chevron-right" style={{ fontSize: 12 }} /></Text>}
                onClick={this.handleClick}
            />
        )
    }
}
SealItem.propTypes = {
    model: PropTypes.object.isRequired,
    onClick: PropTypes.func.isRequired
}