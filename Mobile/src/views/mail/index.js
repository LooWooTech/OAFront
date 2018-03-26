import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { observer, inject } from 'mobx-react'
import { FlatList, Dimensions } from 'react-native'
import { Container, Header, Body, Left, Text, View, Right, Content, Title, Icon, Button, List, ListItem, Item, H1, Input } from 'native-base'
import BackButton from '../shared/BackButton'
import NavbarPopover from '../shared/NavbarPopover'
import ListEmptyComponent from '../shared/ListEmptyComponent'
import ListRow from '../shared/ListRow'
import moment from 'moment'

const menuData = [
    { label: '写邮件', path: 'Mail.Form', value: 'edit', icon: 'edit' },
    { label: '收件箱', value: 'receive', icon: 'envelope-open-o' },
    { label: '星标邮件', value: 'star', icon: 'star-o' },
    { label: '草稿箱', value: 'draft', icon: 'pencil' },
    { label: '已发送', value: 'send', icon: 'send-o' },
    { label: '已删除', value: 'trash', icon: 'trash' },
]

@inject('stores')
@observer
export default class MailList extends Component {
    showPopover = () => this.refs.menu.show();
    handleChangeSearchKey = (key) => this.props.stores.mailStore.setParams({ searchKey: key })
    handleSubmitSearch = () => this.refreshData()
    handleSelectMenu = item => {
        if (item.path == 'Mail.Form') {
            this.props.navigation.navigate(item.path);
            return;
        }
        this.props.navigation.setParams({ type: item.value })
        this.props.stores.mailStore.setParams({ type: item.value })
        this.refreshData()
    }
    componentWillMount() {
        this.props.stores.mailStore.setParams(this.props.navigation.state.params)
        this.props.stores.mailStore.refreshData()
    }
    loadNextPageData = () => {
        this.props.stores.mailStore.loadNextPageData()
    }
    refreshData = () => {
        this.props.stores.mailStore.refreshData()
    }
    keyExtractor = (item, index) => item.ID;
    handleClickItem = (item) => this.props.navigation.navigate(`Mail.${this.props.navigation.state.params.type === 'draft' ? 'Form' : 'Detail'}`, { id: item.MailId })
    renderItem = ({ item }) => <MailItem model={item} onClick={this.handleClickItem} type={this.props.navigation.state.params.type} />

    render() {
        const { stores, navigation } = this.props
        let { type, searchKey } = navigation.state.params
        const { list } = stores.mailStore
        const menu = menuData.find(e => e.value == type)

        const loading = stores.mailStore.loading
        return (
            <Container>
                <Header searchBar rounded>
                    <Item>
                        <BackButton />
                        <Input placeholder={menu.label}
                            onChangeText={this.handleChangeSearchKey}
                            onSubmitEditing={this.handleSubmitSearch}
                        />
                        <Button transparent onPress={this.handleSubmitSearch}>
                            <Icon name="search" />
                        </Button>
                        <Button transparent onPress={this.showPopover}>
                            <Icon name="bars" />
                        </Button>
                    </Item>
                </Header>
                <Content>
                    <NavbarPopover ref="menu" data={menuData} onSelect={this.handleSelectMenu} />
                    <FlatList
                        data={list}
                        renderItem={this.renderItem}
                        onEndReachedThreshold={0.1}
                        keyExtractor={this.keyExtractor}
                        onEndReached={this.loadNextPageData}
                        onRefresh={this.refreshData}
                        refreshing={loading}
                        style={{ height: Dimensions.get('window').height - 80, backgroundColor: '#fff' }}
                        ListEmptyComponent={<ListEmptyComponent icon='envelope-o' text={`暂无邮件`} loading={loading} />}
                    />
                </Content>
            </Container>
        );
    }
}

class MailItem extends Component {

    handleClick = () => {
        this.props.onClick(this.props.model)
    }

    render() {
        const { model, onClick, type } = this.props
        const menu = menuData.find(e => e.value == type)
        if (!menu) return null
        let isSend = type === 'send' || type === 'draft';
        let subTitle = ''
        let icon = ''
        switch (type) {
            default:
                icon = model.Read ? 'envelope-o' : 'envelope-open-o'
                break;
            case 'draft':
                icon = 'paper-o';
                break;
        }
        if (model.Starred) icon = 'star-o'

        if (isSend) {
            const names = model.ToUsers.slice(0, 3).map(e => e.RealName).join()
            subTitle = `收件人：${names}`
        } else {
            subTitle = `发件人：${model.FromUser}`
        }
        subTitle += ` 时间：${moment(model.CreateTime).format('YYYY-MM-DD HH:mm')}`
        return (
            <ListRow
                left={<Icon name={menu.icon} />}
                title={model.Subject}
                subTitle={subTitle}
                onClick={this.handleClick}
            />
        )
    }
}
MailItem.propTypes = {
    model: PropTypes.object.isRequired,
    onClick: PropTypes.func.isRequired,
    type: PropTypes.string.isRequired
}
