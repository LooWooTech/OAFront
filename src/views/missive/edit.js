import React, { Component } from 'react';
import { Affix, Button, Tabs, message, Modal } from 'antd';
import api from '../../models/api';
import FormTab from './_form';
import ContentTab from './_content';
import FlowListTab from '../flowdata/list';
import FileListTab from '../file/info_file_list';
import ResultTab from './_result'

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
                this.setState({ ...data });
            });
            api.Missive.Model(id, data => {
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

    handleSubmitFlow = () => {
        //如果当前提交的是局长、副局长，则将公文标记为重要

        this.loadData();
    }

    handleSubmitFreeFlow = () => {
        if (confirm("你确定提交此次传阅吗？")) {
            let flowNodeData = this.state.flowNodeData
            api.FreeFlowData.Submit(flowNodeData.ID, this.state.model.ID, '', {
                ID: this.state.freeFlowNodeData.ID,
            }, json => {
                let freeFlowNodeData = this.state.freeFlowNodeData;
                freeFlowNodeData.UpdateTime = new Date();
                this.setState({ freeFlowNodeData })
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
                        : null
                    }
                    {this.state.canSubmitFreeFlow && this.state.freeFlowNodeData && !this.state.freeFlowNodeData.UpdateTime ?
                        <Button icon="check" type="primary" onClick={this.handleSubmitFreeFlow}>已阅</Button>
                        : null
                    }
                    {this.state.canCompleteFreeFlow ? <Button type="danger" icon="close" onClick={this.handleCloseFreeFlow}>结束自由发送</Button> : null}
                    {this.state.canCancel ? <Button type="danger" icon="rollback" htmlType="button" onClick={this.handleCancel}>撤销</Button> : null}
                    <Button onClick={utils.GoBack} type="" icon="arrow-left" htmlType="button">返回</Button>
                </Button.Group>
            </Affix>
            <Tabs>
                <Tabs.TabPane tab="拟稿表单" key="1" style={{ zIndex: 2 }}>
                    <FormTab model={missive} formId={this.state.formId} disabled={!this.state.canEdit} ref="form" />
                </Tabs.TabPane>
                <Tabs.TabPane tab="文档预览" key="2">
                    <ContentTab missive={missive} />
                </Tabs.TabPane>
                {showFlow ?
                    <Tabs.TabPane tab="意见表" key="3">
                        <FlowListTab
                            flowData={model.FlowData}
                            canSubmitFlow={this.state.canSubmitFlow}
                            canSubmitFreeFlow={this.state.canSubmitFreeFlow}
                            canComplete={this.state.canComplete}
                            canBack={this.state.canBack}
                        />
                    </Tabs.TabPane>
                    : null
                }
                {showFiles ?
                    <Tabs.TabPane tab="附件清单" key="5">
                        <FileListTab infoId={model.ID} formId={model.FormId} canEdit={this.state.canEdit} inline={false} />
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