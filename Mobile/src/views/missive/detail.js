import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer, inject } from 'mobx-react'
import { Container, Header, Left, Body, Right, Title, Content, View, Text, Segment, Button, Icon, Tabs, Tab, TabHeading, List, ListItem, H2 } from 'native-base'
import BackButton from '../shared/BackButton'
import AttachmentList from '../file/list'
import MissiveForm from './_form'
import FlowDataList from '../flow/list'
@inject('stores')
@observer
class MissiveDetail extends Component {

    componentWillMount() {
        console.log('MissiveDetail')
        const id = this.props.navigation.state.params.id
        if (id === 0) {
            throw new Error('公文参数不正确');
        }
        this.props.stores.missiveStore.getModel(id)
        this.props.stores.formInfoStore.getModel(id)
    }

    render() {
        const missive = this.props.stores.missiveStore.model || {}
        const infoId = this.props.navigation.state.params.id
        return (
            <Container>
                <Header hasTabs>
                    <Left>
                        <BackButton />
                    </Left>
                    <Body>
                        <Title>公文详细内容</Title>
                    </Body>
                    <Right>
                    </Right>
                </Header>
                <Content>
                    <Tabs style={{ borderBottomWidth: 0 }}>
                        <Tab heading={<TabHeading><Text>拟稿表单</Text></TabHeading>}>
                            <MissiveForm model={missive} disabled={true} />
                        </Tab>
                        <Tab heading={<TabHeading><Text>审核流程</Text></TabHeading>}>
                            <FlowDataList infoId={infoId} />
                        </Tab>
                        <Tab heading={<TabHeading><Text>附件信息</Text></TabHeading>}>
                            <AttachmentList infoId={infoId} />
                        </Tab>
                    </Tabs>
                </Content>
            </Container>
        );
    }
}

export default MissiveDetail;