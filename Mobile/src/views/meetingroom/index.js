import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Container, Header, Body, Left, Text, Right, Content, Title, Icon, Button } from 'native-base'
import { observer, inject } from 'mobx-react'
import { FORMS } from '../../common/config';
import BackButton from '../shared/BackButton'
import ListRow from '../shared/ListRow'
import NavbarPopover from '../shared/NavbarPopover'

@inject('stores')
@observer
export default class MeetingRoomIndex extends Component {

    menuData = []

    componentWillMount() {
        this.props.stores.meetingroomStore.getList();
        const userId = this.props.stores.userStore.user.ID
        this.menuData = [
            { label: '申请会议室', value: 'MeetingRoom.Apply', icon: 'plus' },
            {
                label: '申请记录', value: 'Extend1.List', icon: 'history',
                params: { formId: FORMS.MeetingRoom.ID, applyUserId: userId, approvalUserId: 0, extendInfoId: 0 }
            },
            {
                label: '申请审批', value: 'Extend1.List', icon: 'check',
                params: { formId: FORMS.MeetingRoom.ID, status: 1, userId: userId, applyUserId: 0, extendInfoId: 0 }
            }
        ]
    }

    showMenu = () => this.refs.menu.show()
    handleSelectMenu = (item) => this.props.navigation.navigate(item.value, item.params);
    handleItemClick = (item) => this.props.navigation.navigate('Extend1.List', {
        formId: FORMS.MeetingRoom.ID,
        extendInfoId: item.ID,
    })

    render() {
        const { list } = this.props.stores.meetingroomStore
        console.log(list)
        return (
            <Container>
                <Header>
                    <Left>
                        <BackButton />
                    </Left>
                    <Body>
                        <Title>会议室</Title>
                    </Body>
                    <Right>
                        <Button transparent onPress={this.showMenu}>
                            <Icon name="bars" />
                        </Button>
                    </Right>
                </Header>
                <Content>
                    <NavbarPopover ref="menu" data={this.menuData} onSelect={this.handleSelectMenu} />
                    {list.map(item => <MeetingRoomItem key={item.ID} model={item} onClick={this.handleItemClick} />)}
                </Content>
            </Container>
        )
    }
}
class MeetingRoomItem extends Component {

    handleClick = () => {
        this.props.onClick(this.props.model)
    }

    render() {
        const model = this.props.model
        return (
            <ListRow
                key={model.ID}
                left={<Icon name={FORMS.MeetingRoom.Icon} style={{ color: model.Status === 0 ? "green" : model.Status === 2 ? "gray" : "red" }} />}
                title={model.Name}
                subTitle={model.Number}
                right={<Text note><Icon name="chevron-right" style={{ fontSize: 12 }} /></Text>}
                onClick={this.handleClick}
            />
        )
    }
}
MeetingRoomItem.propTypes = {
    model: PropTypes.object.isRequired,
    onClick: PropTypes.func.isRequired
}