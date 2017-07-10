import React, { Component } from 'react';
import { Affix, Button, Modal, Tabs, message } from 'antd';
import api from '../../models/api';
import FormTab from './_form';
import ProgressTab from './_progress'
import ResultTab from './_result';
import FlowListTab from '../flowdata/list';
import FileListTab from '../file/info_file_list';

import FlowModal from '../flowdata/form';
import FreeFlowModal from '../freeflow/form';
import utils from '../../utils';

export default class TaskEdit extends Component {
    state = {
        id: this.props.location.query.id || 0,
        formId: api.Forms.Task.ID,
    }
    componentWillMount() {
        this.loadData();
    };

    loadData = () => {
        const { id, formId } = this.state
        if (!id) {
            this.setState({
                activeItem: 'info',
                extendModel: {},
                canView: true,
                canEdit: true,
                canSubmit: false,
                canCancel: false,
                canBack: false,
                model: { FormId: formId, }
            });
        }
        else {
            api.FormInfo.Model(id, data => {

                if (data.flowNodeData) {
                    data.flowNodeData = data.model.FlowData.Nodes.find(n => n.$id === data.flowNodeData.$ref);
                }

                if (data.freeFlowNodeData) {
                    data.freeFlowNodeData = data.flowNodeData.Nodes.find(n => n.$id === data.freeFlowNodeData.$ref);
                }

                this.setState({ ...data });
            });
            api.Task.Model(id, data => {
                this.setState({ extendModel: data })
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

    handleExport = e => { };

    handleCancel = e => {
        if (!confirm('你确定要撤销流程吗?')) return false;
        api.FlowData.Cancel(this.state.model.ID, this.loadData);
    };

    handleCloseFreeFlow = () => {
        Modal.confirm({
            title: '结束自由发送',
            content: '你确定要提前结束自由发送流程吗？',
            onOk: () => {
                let flowNodeData = this.state.flowNodeData
                api.FreeFlowData.Complete(flowNodeData.ID, this.state.model.ID, () => {
                    flowNodeData.FreeFlowData.Completed = true
                    this.setState({
                        flowNodeData,
                        canSubmitFreeFlow: false,
                        canCompleteFreeFlow: false
                    })
                })
            }
        })
    }

    handleSubmitFreeFlow = () => {
        if (confirm("你确定提交此次传阅吗？")) {
            let flowNodeData = this.state.flowNodeData
            api.FreeFlowData.Submit(flowNodeData.ID, this.state.model.ID, '', {
                ID: this.state.freeFlowNodeData.ID,
            }, json => {
                this.setState({ reload: Math.random() })
            })
        }
    }

    handleSubmitFlow = (flowData) => {
        //this.setState({flowData})
        //如果是第一步，则指定责任人
        let model = this.state.model
        api.Task.UpdateZRR(model.ID)
        this.loadData()
    }

    render() {
        const model = this.state.model;
        const extendModel = this.state.extendModel;
        if (!model) return null;
        const showFiles = model.ID > 0;
        const showFlow = !!model.FlowDataId;
        const isFirstNode = model && model.FlowData && model.FlowData.Nodes.length === 1;
        return <div>
            <Affix offsetTop={0} className="toolbar">
                <Button.Group>
                    {this.state.canEdit ?
                        <Button onClick={this.handleSave} type="primary" icon="save" htmlType="submit">保存</Button>
                        : null}
                    {this.state.canSubmitFlow ?
                        <FlowModal
                            title={isFirstNode ? "发布任务" : "完成任务"}
                            flowDataId={model.FlowDataId}
                            callback={this.handleSubmitFlow}
                            infoId={model.ID}
                            trigger={<Button type="success" icon="check" htmlType="button">{isFirstNode ? "发布任务" : "完成任务"}</Button>}
                        />
                        : null}
                    {this.state.canSubmitFreeFlow && this.state.freeFlowNodeData && !this.state.freeFlowNodeData.UpdateTime ?
                        <Button icon="check" type="primary" onClick={this.handleSubmitFreeFlow}>完成</Button>
                        : null
                    }
                    {this.state.canSubmitFreeFlow ?
                        <FreeFlowModal
                            title="转发任务"
                            callback={this.loadData}
                            canSubmit={true}
                            infoId={model.ID}
                            flowNodeData={this.state.flowNodeData}
                            record={this.state.freeFlowNodeData}
                            trigger={<Button type="danger" icon="retweet" htmlType="button">转发任务</Button>}
                        />
                        : null}
                    {this.state.canCompleteFreeFlow ? <Button type="danger" icon="close" onClick={this.handleCloseFreeFlow}>结束自由发送</Button> : null}
                    {this.state.canCancel ? <Button type="danger" icon="rollback" htmlType="button" onClick={this.handleCancel}>撤销</Button> : null}
                    <Button onClick={utils.GoBack} type="" icon="arrow-left" htmlType="button">返回</Button>
                </Button.Group>
            </Affix>
            <Tabs>
                <Tabs.TabPane tab="任务落实单" key="1">
                    <FormTab model={extendModel} disabled={!this.state.canEdit} ref="form" />
                </Tabs.TabPane>
                {showFlow ?
                    <Tabs.TabPane tab="任务进度" key="2">
                        <ProgressTab taskId={model.ID} />
                    </Tabs.TabPane>
                    : null}
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
                {/*showFlow ?
                    <Tabs.TabPane tab="成果预览" key="4">
                        <ResultTab data={model} />
                    </Tabs.TabPane>
                    : null
                */}
            </Tabs>
        </div>;
    }
}