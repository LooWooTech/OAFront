import React, { Component } from 'react';
import { TouchableOpacity, View, Text } from 'react-native'
import { Grid, Col, Row, Icon } from 'native-base'
import { observer, inject } from 'mobx-react'

class GridItem extends Component {
    handleClick = () => {
        this.props.onClick(this.props.data)
    }
    render() {
        const form = this.props.data
        return (
            <TouchableOpacity onPress={this.handleClick}>
                <View style={{ width: '100%', alignItems: 'center', paddingTop: 10, paddingBottom: 10, }}>
                    <Icon name={form.Icon} style={{ color: form.Color || '#666', fontSize: 25 }} />
                    <Text style={{ lineHeight: 25 }}>{form.Name}</Text>
                </View>
            </TouchableOpacity>
        );
    }
}

@inject('stores')
@observer
class HomeFormGrid extends Component {

    getFormRows = (cols) => {
        const list = this.props.stores.formStore.getForms();
        const rows = [];
        let row = []
        for (var i = 0; i < list.length; i++) {
            if (i % cols === 0) {
                row = []
                rows.push(row);
            }
            row.push(list[i])
        }
        return rows;
    }

    render() {
        return (
            <Grid style={{ borderTopWidth: 1, borderTopColor: '#f7f7f7', borderLeftWidth: 1, borderLeftColor: '#f7f7f7' }}>
                {this.getFormRows(2).map((row, i) => <Row key={'row-' + i} style={{ borderBottomWidth: 1, borderBottomColor: '#f7f7f7' }}>
                    {row.map(form => (
                        <Col key={form.ID} style={{ borderRightWidth: 1, borderRightColor: '#f7f7f7' }}>
                            <GridItem data={form} onClick={this.props.onClick} />
                        </Col>
                    ))}
                </Row>)}
            </Grid>
        );
    }
}

export default HomeFormGrid;