import React, { Component } from 'react';
import { Affix, Button, Tabs, message } from 'antd';
import api from '../../models/api';
import FormTab from './_form';
import ContentTab from './_content';
import FlowListTab from '../flowdata/list';
import FileListTab from '../file/info_file_list';
import ResultTab from './_result'

import SubmitFlowModal from '../flowdata/form';
import SubmitFreeFlowModal from '../freeflow/form';
import utils from '../../utils';

export default class MissiveEdit extends Component {
    state = {
        id: this.props.location.query.id || 0,
        formId: parseInt(this.props.params.formId, 10),
    }
    componentWillMount() {
        this.loadData();
    };

    loadData = () => {
        const { id, formId } = this.state

        if (!id) {
            this.setState({
                missive: {},
                activeItem: 'info',
                canView: true,
                canEdit: true,
                canSubmit: false,
                canCancel: false,
                canBack: false,
                model: {
                    ID: id,
                    FormId: formId
                }
            });
        }
        else {
            api.FormInfo.Model(id, data => {
                if (data.flowNodeData) {
                    data.flowNodeData = data.model.FlowData.Nodes.find(n => n.$id === data.flowNodeData.$ref);
                }

                if (data.freeFlowNodeData) {
                    data.freeFlowNodeData = data.flowNodeData.FreeFlowData.Nodes.find(n => n.$id === data.freeFlowNodeData.$ref);
                }
                this.setState({ ...data });
            });
            api.Missive.Get(id, data => {
                this.setState({ missive: data })
            })
        }
    };

    handleSave = e => {
        if (!this.state.canEdit) {
            message.error("不可编辑");
            return;
        }
        this.refs.form.handleSubmit()
    };

    handleCancel = e => {
        if (!confirm('你确定要撤销流程吗?')) return false;
        api.FlowData.Cancel(this.state.model.ID, this.loadData);
    };

    handleCloseFreeFlow = () => {
        if (confirm("你确定要提前结束该流程吗？")) {
            let flowNodeData = this.state.flowNodeData
            api.FreeFlowData.Complete(flowNodeData.ID, () => {
                flowNodeData.FreeFlowData.Completed = true
                this.setState({
                    flowNodeData,
                    canSubmitFreeFlow: false,
                    canCompleteFreeFlow: false
                })
            })
        }
    }

    render() {
        const model = this.state.model
        const missive = this.state.missive
        if (!model) return null
        const showFiles = model.ID > 0
        const showFlow = !!model.FlowDataId

        return <div>
            <Affix offsetTop={0} className="toolbar">
                <Button.Group>
                    {this.state.canEdit ?
                        <Button onClick={this.handleSave} type="primary" icon="save" htmlType="submit">保存</Button>
                        : null}
                    {this.state.canSubmitFlow ?
                        <SubmitFlowModal
                            flowDataId={model.FlowDataId}
                            callback={this.loadData}
                            children={<Button type="success" icon="check" htmlType="button">提交审批</Button>}
                        />
                        : null}
                    {this.state.canSubmitFreeFlow ?
                        <SubmitFreeFlowModal
                            callback={this.loadData}
                            canSubmit={true}
                            infoId={model.ID}
                            flowNodeData={this.state.flowNodeData}
                            record={this.state.freeFlowNodeData}
                            children={<Button type="danger" icon="check" htmlType="button">{this.state.canSubmitFlow ? '创建传阅流程' : '审阅'}</Button>}
                        />
                        : null}
                    {this.state.canCompleteFreeFlow ? <Button type="danger" icon="close" onClick={this.handleCloseFreeFlow}>结束传阅流程</Button> : null}
                    {this.state.canCancel ? <Button type="danger" icon="rollback" htmlType="button" onClick={this.handleCancel}>撤销</Button> : null}
                    <Button onClick={utils.GoBack} type="" icon="arrow-left" htmlType="button">返回</Button>
                </Button.Group>
            </Affix>
            <Tabs style={{ position: 'absolute', left: '210px', top: '55px', bottom: '10px', right: '10px', overflow: 'auto', overflowX: 'hidden' }}>
                <Tabs.TabPane tab="拟稿表单" key="1" style={{ zIndex: 2 }}>
                    <FormTab model={missive} formId={this.state.formId} disabled={!this.state.canEdit} ref="form" />
                </Tabs.TabPane>
                <Tabs.TabPane tab="文档预览" key="2">
                    <div style={{ position: 'absolute', left: '10px', top: '50px', bottom: '10px', right: '0', zIndex: 1 }}>
                        <ContentTab missive={missive} />
                    </div>
                </Tabs.TabPane>
                {showFiles ?
                    <Tabs.TabPane tab="附件清单" key="5">
                        <FileListTab infoId={model.ID} formId={model.FormId} canEdit={this.state.canEdit} inline={false} />
                    </Tabs.TabPane>
                    : null
                }
                {showFlow ?
                    <Tabs.TabPane tab="审批流程" key="3">
                        <FlowListTab data={model.FlowData} />
                    </Tabs.TabPane>
                    : null
                }
                {showFlow && model.FormId === api.Forms.Missive.ID ?
                    <Tabs.TabPane tab="成果预览" key="4">
                        <ResultTab flowData={model.FlowData} missive={missive} />
                    </Tabs.TabPane>
                    : null
                }
            </Tabs>
        </div>;
    }
}