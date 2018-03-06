import React, { Component } from 'react';
import { observer, inject } from 'mobx-react'
import { FlatList, Dimensions } from 'react-native'
import { Container, Header, Body, Left, Text, View, Right, Content, Title, Icon, Button, List, ListItem, Item, H1, Input } from 'native-base'
import BackButton from '../shared/BackButton'
import ListRow from '../shared/ListRow'

class SalaryDetail extends Component {

    getItems = () => {
        const data = this.props.navigation.state.params.data.Data

        return Object.keys(data).map(key => {
            let val = data[key]
            let num = parseFloat(val)
            if (!isNaN(num)) {
                val = num.toFixed(2).replace(".00", "")
            }

            return { key, value: val }
        })
    }

    render() {
        const data = this.props.navigation.state.params.data
        const items = this.getItems();
        return (
            <Container>
                <Header>
                    <Left>
                        <BackButton />
                    </Left>
                    <Body>
                        <Title>工资单明细</Title>
                    </Body>
                </Header>
                <Content>
                    <ListRow
                        title="工资单"
                        right={<Text>{data.Title}</Text>}
                    />
                    {items.map((kv, id) =>
                        <ListRow
                            key={id}
                            title={kv.key}
                            right={<Text>{kv.value}</Text>}
                        />)}
                </Content>
            </Container>
        );
    }
}

export default SalaryDetail;