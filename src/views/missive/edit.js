import React, { Component } from 'react';
import { Affix, Button, Tabs, message } from 'antd';
import api from '../../models/api';
import FormTab from './_form';
import ResultTab from './_result';
import ContentTab from './_content';
import FlowList from '../flowdata/list';
import SubmitFlowModal from '../flowdata/form';
import SubmitFreeFlowModal from '../freeflow/form';
import utils from '../../utils';

export default class MissiveEdit extends Component {
    state = {}
    componentWillMount() {
        this.loadData();
    };

    loadData = () => {
        var id = parseInt(this.props.location.query.id || '0', 10);
        if (id === 0) {
            this.setState({
                activeItem: 'info',
                model: {
                    FormId: api.FormType.Missive,
                    Data: {
                        Word: {},
                        Excels: []
                    }
                },
                canView: true,
                canEdit: true,
                canSubmit: false,
                canCancel: false,
                canBack: false
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
        }
    };

    handleSave = e => {
        if (!this.state.canEdit) {
            message.error("不可编辑");
            return;
        }
        var model = this.refs.form.getFieldsValue();
        model.Title = model.Data.WJ_BT;
        model.Keywords = model.Data.GW_WH + "," + model.Data.GW_ZTC;
        model.Data.FW_RQ = model.Data.FW_RQ ? model.Data.FW_RQ.format() : '';
        model.Data.QX_RQ = model.Data.QX_RQ ? model.Data.QX_RQ.format('YYYY-MM-DD') : '';
        model.Data.Pdf = model.Pdf;
        if (model.Word && model.Word.file) {
            model.Data.Word = model.Word.file.response;
        } else {
            model.Data.Word = model.Word || {};
        }
        
        var isAdd = model.ID === 0;
        api.FormInfo.Save(model, json => {
            message.success('保存成功');
            //如果id=0，则需要更新附件的infoId
            if (isAdd) {
                var fileIds = [];
                if (this.state.word.ID > 0) {
                    fileIds.push(this.state.word.ID);
                }
                this.state.excels.map(v => fileIds.push(v.ID));
                api.File.UpdateRelation(fileIds, json.ID);
            }
            utils.Redirect('/missive/sendlist?status=1');
        });

    };

    handleExport = e => { };

    handleCancel = e => {
        if (!confirm('你确定要撤销流程吗?')) return false;
        api.FlowData.Cancel(this.state.model.ID, data => {
            this.loadData();
        });
    };
    handleSubmitFlow = () => {
        this.loadData();
    };
    render() {
        const model = this.state.model;
        if (!model) return null;
        const showResult = !!model.FlowDataId;
        const showFlow = !!model.FlowDataId;
        const showPreview = model.Data.Word && model.Data.Word.ID > 0 && model.Data.Pdf && model.Data.Pdf.ID > 0;
        return <div>
            <Affix offsetTop={0} className="toolbar">
                <Button.Group>
                    {this.state.canEdit ?
                        <Button onClick={this.handleSave} type="primary" icon="save" htmlType="submit">保存</Button>
                        : null}
                    {this.state.canSubmitFlow ?
                        <SubmitFlowModal
                            callback={this.handleSubmitFlow}
                            canComplete={this.state.canComplete}
                            canBack={this.state.canBack}
                            flowData={model.FlowData}
                            record={this.state.flowNodeData}
                            children={<Button type="success" icon="check" htmlType="button">提交主流程</Button>}
                        />
                        : null}
                    {this.state.canSubmitFreeFlow ?
                        <SubmitFreeFlowModal
                            callback={this.handleSubmitFlow}
                            canSubmit={true}
                            infoId={model.ID}
                            flowNodeData={this.state.flowNodeData}
                            record={this.state.freeFlowNodeData}
                            children={<Button type="success" icon="retweet" htmlType="button">提交自由流程</Button>}
                        />
                        : null}
                    {this.state.canCancel ? <Button type="danger" icon="rollback" htmlType="button" onClick={this.handleCancel}>撤销</Button> : null}
                    <Button onClick={() => utils.Redirect('/missive/sendlist?status=' + (this.state.status || 0))} type="" icon="arrow-left" htmlType="button">返回</Button>
                </Button.Group>
            </Affix>
            <Tabs style={{ position: 'absolute', left: '200px', top: '50px', bottom: '0', right: '0', overflow: 'auto', overflowX: 'hidden' }}>
                <Tabs.TabPane tab="拟稿表单" key="1">
                    <FormTab data={model} canEdit={this.state.canEdit} ref="form" />
                </Tabs.TabPane>
                {showPreview ?
                    <Tabs.TabPane tab="附件预览" key="2">
                        <div style={{ position: 'absolute', left: '10px', top: '50px', bottom: '10px', right: '0' }}>
                            <ContentTab file={model.Data.Pdf} />
                        </div>
                    </Tabs.TabPane>
                    : null
                }
                {showFlow ?
                    <Tabs.TabPane tab="审批流程" key="3">
                        <div style={{ padding: '20px', marginLeft: '20px' }}>
                            <FlowList data={model.FlowData} />
                        </div>
                    </Tabs.TabPane>
                    : null
                }
                {showResult ?
                    <Tabs.TabPane tab="成果预览" key="4">
                        <ResultTab data={model} />
                    </Tabs.TabPane>
                    : null
                }
            </Tabs>
        </div>;
    }
}