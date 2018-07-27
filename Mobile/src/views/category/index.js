import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Container, Header, Body, Left, Right, Title, Content, Footer, Button, Text, Input, View, ListItem, List, CheckBox, Item, Icon, Grid, Row, Col } from 'native-base'
import BackButton from '../shared/BackButton'
import ListRow from '../shared/ListRow'
import { inject, observer } from 'mobx-react';
import { FORMS } from '../../common/config';

@inject('stores')
@observer
export default class CategoryList extends Component {
    componentWillMount() {
        this.loadData()
    }

    loadData = () => {
        const formId = this.props.navigation.state.params.formId
        this.props.stores.categoryStore.getList(formId);
    }

    handleItemClick = item => {

        const returnPage = this.props.navigation.state.params.return;
        if (returnPage) {
            this.props.navigation.navigate(returnPage, { categoryId: item.ID })
        }
        else {
            const onSelect = this.props.navigation.state.params.onSelect;
            if (onSelect) {
                onSelect(item.ID)
            }
            this.props.navigation.goBack()
        }
    }

    render() {
        const formId = this.props.navigation.state.params.formId
        const form = Object.keys(FORMS).find(key => FORMS[key].ID === formId);
        const list = this.props.stores.categoryStore.list || []
        if (!list.find(e => e.ID === 0)) {
            list.push({ Name: '所有分类', ID: 0 })
        }
        return (
            <Container>
                <Header>
                    <Left>
                        <BackButton />
                    </Left>
                    <Body>
                        <Title>{form.Name}分类</Title>
                    </Body>
                </Header>
                <Content>
                    {list.map(item => <CategoryItem key={'category_item_' + item.ID} model={item} onClick={this.handleItemClick} />)}
                </Content>
            </Container>
        )
    }
}
class CategoryItem extends Component {
    handleClick = () => {
        this.props.onClick(this.props.model)
    }
    render() {
        const model = this.props.model
        return (
            <ListRow
                key={model.ID}
                title={model.Name}
                right={<Text note><Icon name="chevron-right" style={{ fontSize: 12 }} /></Text>}
                onClick={this.handleClick}
            />
        )
    }
}
CategoryItem.propTypes = {
    model: PropTypes.object.isRequired,
    onClick: PropTypes.func.isRequired
}