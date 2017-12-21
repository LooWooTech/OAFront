import React, { Component } from 'react';
import { TouchableOpacity, View, Text } from 'react-native'
import { Grid, Col, Row, Icon } from 'native-base'
import { observer, inject } from 'mobx-react'

class GridItem extends Component {
    handleClick = () => {
        this.props.onClick(this.props.model)
    }
    render() {
        const form = this.props.model
        return (
            <TouchableOpacity onPress={this.handleClick}>
                <View style={{ width: '100%', height: 100, alignItems: 'center', paddingTop: 20, paddingBottom: 20, }}>
                    <Icon name={form.Icon} style={{ color: form.Color || '#666', fontSize: 25 }} />
                    <Text style={{ lineHeight: 30 }}>{form.Name}</Text>
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
            <Grid>
                {this.getFormRows(3).map((row, i) => <Row key={'row-' + i}>
                    {row.map(form => (
                        <Col key={form.ID}>
                            <GridItem model={form} onClick={this.props.onClick} />
                        </Col>
                    ))}
                </Row>)}
            </Grid>
        );
    }
}

export default HomeFormGrid;