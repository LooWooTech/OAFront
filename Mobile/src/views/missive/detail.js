import React, { Component } from 'react';
import PropTypes, { number } from 'prop-types';
import { observer, inject } from 'mobx-react'
import { Container, Header, Left, Body, Right, Title, Content, View, Text, Segment, Button, Icon, Tabs, Tab, TabHeading, List, ListItem, H2 } from 'native-base'
import BackButton from '../shared/BackButton'
import AttachmentList from '../file/list'
import MissiveInfo from './_info'
import FlowDataList from '../flow/list'
import MissiveFooter from './_footer'

@inject('stores')
@observer
class MissiveDetail extends Component {

    componentWillMount() {
        const id = this.props.navigation.state.params.id
        if (id === 0) {
            throw new Error('公文参数不正确');
        }
        this.props.stores.missiveStore.getModel(id)
        this.props.stores.formInfoStore.loadData(id)
    }

    render() {
        const missive = this.props.stores.missiveStore.model
        const data = this.props.stores.formInfoStore.data
        if (!missive || !data) return null
        const info = data.model
        return (
            <Container>
                <Header hasTabs>
                    <Left>
                        <BackButton />
                    </Left>
                    <Body>
                        <Title>{info.Form.Name}详细</Title>
                    </Body>
                </Header>
                <Tabs tabBarPosition="top">
                    <Tab heading={<TabHeading><Text>拟稿表单</Text></TabHeading>}>
                        <Content>
                            <MissiveInfo formId={info.FormId} data={missive} />
                        </Content>
                    </Tab>
                    <Tab heading={<TabHeading><Text>审核流程</Text></TabHeading>}>
                        <Content>
                            <FlowDataList data={info.FlowData.Nodes} />
                        </Content>
                    </Tab>
                    <Tab heading={<TabHeading><Text>附件信息</Text></TabHeading>}>
                        <Content>
                            <AttachmentList infoId={info.ID}  navigation={this.props.navigation}/>
                        </Content>
                    </Tab>
                </Tabs>
                <MissiveFooter data={data} navigation={this.props.navigation} />
            </Container>
        );
    }
}
export default MissiveDetail;