import React, { Component } from 'react';
import { Tabs, Form } from 'antd';

import FormTab from './_form';
import FlowTab from './_flow';
import ResultTab from './_result';
import ContentTab from './_content';

class MissiveEdit extends Component {


    state = { activeItem: 'info', model: {} }

    handleItemClick = (e, { name }) => this.setState({ activeItem: name })

    handleExport = e => {

    };

    render() {
        return <div>
            <Tabs>
                <Tabs.TabPane tab="基本信息" key="1">
                    <FormTab />
                </Tabs.TabPane>
                <Tabs.TabPane tab="附件预览" key="2">
                    <ContentTab />
                </Tabs.TabPane>
                <Tabs.TabPane tab="审批流程" key="3">
                    <FlowTab />
                </Tabs.TabPane>
                <Tabs.TabPane tab="成果预览" key="4">
                    <ResultTab />
                </Tabs.TabPane>
            </Tabs>
        </div>;
    }
}
const MissiveEditForm = Form.create()(MissiveEdit);
export default MissiveEditForm;