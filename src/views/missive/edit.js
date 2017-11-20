import React, { Component } from 'react';
import { Button, Tabs, message, Modal } from 'antd';
import api from '../../models/api';
import FormTab from './_form';
import FlowListTab from '../flowdata/list';
import FileListTab from '../file/info_file_list';
import ResultTab from './_result'
import SubmitFreeFlowModal from '../freeflow/_modal';
import utils from '../../utils';
import auth from '../../models/auth'

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
        api.FlowData.Cancel(this.state.model.ID, () => {
            this.loadData();
        });
    };

    handleCloseFreeFlow = () => {
        let list = this.state.flowNodeData.FreeFlowData.Nodes.filter(e => !e.IsCc && !e.Submited).map(e => e.Signature);
        let content = '你确定要提前结束自由发送流程吗？\n'
        if (list.length > 0) {
            content += '还有人员没有发表意见：\n'
            content += list.join('\n');
        }
        Modal.confirm({
            title: '结束自由发送',
            content: content.split('\n').map((str, key) => <span key={key}>{str}<br /></span>),
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

    handleSubmitFlow = (data) => {
        let user = auth.getUser();
        //如果是最后一步，则添加上报记录
        if (this.state.formId === api.Forms.Missive.ID) {
            api.Missive.Report(this.state.model.ID);
        }
        //如果是局长审批则标记为重要
        if (user.JobTitle.Name.indexOf('局长') > -1) {
            api.Missive.UpdateImportant(this.state.model.ID, () => {
                utils.GoBack();
            });
        }
        else {
            utils.GoBack();
        }
    }

    handleSubmitFreeFlow = () => {
        Modal.confirm({
            title: '提醒',
            content: '确定已阅吗？',
            onOk: () => {
                let flowNodeData = this.state.flowNodeData
                api.FreeFlowData.Submit(flowNodeData.ID, this.state.model.ID, '', '', {
                    ID: this.state.freeFlowNodeData.ID,
                }, json => {
                    utils.GoBack();
                })
            }
        });
    }

    shouldComponentUpdate(nextProps, nextState) {
        return JSON.stringify(nextProps) !== JSON.stringify(this.props) || nextState !== this.state
    }
    
    render() {
        const model = this.state.model
        const missive = this.state.missive
        if (!model) return null
        const showFiles = model.ID > 0
        const showFlow = !!model.FlowDataId
        return <div>
            <div className="toolbar">
                <Button.Group>
                    {this.state.canEdit ?
                        <Button onClick={this.handleSave} type="primary" icon="save" htmlType="submit">保存</Button>
                        : null
                    }
                    {this.state.canSubmitFreeFlow && this.state.freeFlowNodeData && !this.state.freeFlowNodeData.Submited ?
                        <Button icon="check" type="primary" onClick={this.handleSubmitFreeFlow}>已阅</Button>
                        : null
                    }
                    {this.state.canSubmitFreeFlow ?
                        <SubmitFreeFlowModal
                            callback={this.loadData}
                            canSubmit={true}
                            infoId={model.ID}
                            flowNodeData={this.state.flowNodeData}
                            freeFlowNodeData={this.state.freeFlowNodeData}
                            onSubmit={this.handleSubmitFlow}
                            trigger={<Button type="danger" icon="retweet" htmlType="button">自由发送</Button>}
                        />
                        : null
                    }
                    {this.state.canCompleteFreeFlow ? <Button type="danger" icon="close" onClick={this.handleCloseFreeFlow}>结束自由发送</Button> : null}
                    {this.state.canCancel ? <Button type="danger" icon="rollback" htmlType="button" onClick={this.handleCancel}>撤销</Button> : null}
                    <Button onClick={utils.GoBack} type="" icon="arrow-left" htmlType="button">返回</Button>
                </Button.Group>
            </div>
            {missive ?
                <h2>{missive.WJ_BT}</h2>
                : null}
            <Tabs>
                <Tabs.TabPane tab="拟稿表单" key="1" style={{ zIndex: 2 }}>
                    <FormTab model={missive} formId={this.state.formId} disabled={!this.state.canEdit} ref="form" />
                </Tabs.TabPane>
                {showFlow ?
                    <Tabs.TabPane tab="审核流程" key="3">
                        <FlowListTab
                            infoId={model.ID}
                            flowData={model.FlowData}
                            flowNodeData={this.state.flowNodeData}
                            freeFlowNodeData={this.state.freeFlowNodeData}
                            canSubmitFlow={this.state.canSubmitFlow}
                            canSubmitFreeFlow={this.state.canSubmitFreeFlow}
                            onSubmit={this.handleSubmitFlow}
                            canBack={this.state.canBack}
                            canComplete={this.state.canComplete}
                        />
                    </Tabs.TabPane>
                    : ''
                }
                {showFiles ?
                    <Tabs.TabPane tab="附件清单" key="5">
                        <FileListTab infoId={model.ID} formId={model.FormId} canEdit={this.state.canEdit} inline={false} />
                    </Tabs.TabPane>
                    : ''
                }
                {showFlow && model.FormId === api.Forms.Missive.ID ?
                    <Tabs.TabPane tab="成果预览" key="4">
                        <ResultTab flowData={model.FlowData} missive={missive} />
                    </Tabs.TabPane>
                    : ''
                }
            </Tabs>
        </div>;
    }
}