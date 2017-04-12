import React, { Component } from 'react';
import { Affix, Button, Tabs, message } from 'antd';
import api from '../../models/api';
import FormTab from './_form';
import ResultTab from './_result';
import ContentTab from './_content';
import FlowList from '../flowdata/list';
import SubmitFlowModal from '../flowdata/form';
import utils from '../../utils';

let MissiveEditForm = null;
export default class MissiveEdit extends Component {

    componentWillMount() {
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
                canCancel: false
            });
        }
        else {
            api.FormInfo.Model(this, id, data => {
                this.setState({
                    model: data.model,
                    canEdit: data.canEdit,
                    canSubmit: data.canSubmit,
                    canCancel: data.canCancel
                });
            });
        }
    };

    handleSave = e => {
        if (!MissiveEditForm) return;
        if (!this.state.canEdit) {
            message.error("不可编辑");
            return;
        }
        var model = MissiveEditForm.getFieldsValue();
        model.Title = model.Data.WJ_BT;
        model.Keywords = model.Data.GW_WH + "," + model.Data.GW_ZTC;
        model.Data.FW_RQ = model.Data.FW_RQ ? model.Data.FW_RQ.format() : '';
        model.Data.QX_RQ = model.Data.QX_RQ ? model.Data.QX_RQ.format('YYYY-MM-DD') : '';

        if (model.Word && model.Word.file) {
            model.Data.Word = model.Word.file.response;
        } else {
            model.Data.Word = model.Word || {};
        }
        if (model.Excels && model.Excels.fileList) {
            var files = [];
            model.Excels.fileList.map(file => {
                files.push(file.response);
            });
            //console.log(files);
            model.Data.Excels = files;
        }
        else {
            model.Data.Excels = model.Excels || [];
        }
        var isAdd = model.ID === 0;
        api.FormInfo.Save(this, model, json => {
            message.success('保存成功');
            //如果id=0，则需要更新附件的infoId
            if (isAdd) {
                var fileIds = [];
                if (this.state.word.ID > 0) fileIds.push(this.state.word.ID);
                this.state.excels.map(v => fileIds.push(v.ID));
                api.File.UpdateRelation(this, fileIds, json.ID);
            }
            utils.Redirect('/missive/sendlist');
        });

    };

    handleExport = e => { };

    render() {
        const model = this.state.model;
        if (!model) return null;

        const showFlow = !!model.FlowDataId;
        const showResult = !!model.FlowDataId;
        const showPreview = model.Data.Word && model.Data.Word.ID > 0;

        return <div>
            <Affix offsetTop={0} className="toolbar">
                <Button.Group>
                    {this.state.canEdit ?
                        <Button onClick={this.handleSave} type="primary" icon="save" htmlType="submit">保存</Button>
                        : null}
                    {this.state.canSubmit ?
                        <SubmitFlowModal
                            canSubmit={this.state.canSubmit}
                            info={model}
                            nodeData={model.flownodeData}
                            children={<Button type="success" icon="check" htmlType="button">提交</Button>}
                        />
                        : null}
                    {this.state.canCancel ? <Button type="danger" icon="rollback" htmlType="button">撤销</Button> : null}
                    <Button onClick={() => utils.Redirect('/missive/sendlist')} type="" icon="arrow-left" htmlType="button">返回</Button>
                </Button.Group>
            </Affix>
            <Tabs>
                <Tabs.TabPane tab="拟稿表单" key="1">
                    <FormTab data={model} canEdit={this.state.canEdit} ref={instance => {
                        if (!instance) return;
                        var form = instance.getForm();
                        MissiveEditForm = form;
                        //this.setState({ form: form });
                    }} />
                </Tabs.TabPane>
                {showPreview ?
                    <Tabs.TabPane tab="附件预览" key="2">
                        <ContentTab />
                    </Tabs.TabPane>
                    : null
                }
                {showFlow ?
                    <Tabs.TabPane tab="审批流程" key="3">
                        <FlowList data={model.FlowData} />
                    </Tabs.TabPane>
                    : null
                }
                {showResult ?
                    <Tabs.TabPane tab="成果预览" key="4">
                        <ResultTab />
                    </Tabs.TabPane>
                    : null
                }
            </Tabs>
        </div>;
    }
}