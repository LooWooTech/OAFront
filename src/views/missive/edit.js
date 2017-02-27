import React, { Component } from 'react';
import { Link } from 'react-router';
import { Tabs, Form } from 'antd';

import api from '../../models/api';
import utils from '../../utils';

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

                    </Tabs.TabPane>
                    <Tabs.TabPane tab="审批流程" key="3">Content of tab 3</Tabs.TabPane>
                    <Tabs.TabPane tab="成果预览" key="4">Content of tab 3</Tabs.TabPane>
                </Tabs>
        </div>;
    }
}
const MissiveEditForm = Form.create()(MissiveEdit);
export default MissiveEditForm;