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
        var formdata = MissiveEditForm.getFieldsValue();
        formdata.Title = formdata.Data.WJ_BT;
        formdata.Keywords = formdata.Data.GW_WH + "," + formdata.Data.GW_ZTC;
        formdata.Data.FW_RQ = formdata.Data.FW_RQ ? formdata.Data.FW_RQ.format() : '';
        formdata.Data.QX_RQ = formdata.Data.QX_RQ ? formdata.Data.QX_RQ.format('YYYY-MM-DD') : '';

        if (formdata.Word && formdata.Word.file) {
            formdata.Data.Word = formdata.Word.file.response;
        } else {
            formdata.Data.Word = formdata.Word || {};
        }
        if (formdata.Excels && formdata.Excels.fileList) {
            var files = [];
            formdata.Excels.fileList.map(file => {
                files.push(file.response);
            });
            //console.log(files);
            formdata.Data.Excels = files;
        }
        else {
            formdata.Data.Excels = formdata.Excels || [];
        }
        var isAdd = formdata.ID === 0;
        api.FormInfo.Save(this, formdata, json => {
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
        return <div>
            <Affix offsetTop={0} className="toolbar">
                <Button.Group>
                    <Button onClick={this.handleSave} type="primary" icon="save" htmlType="submit">保存</Button>
                    {this.state.canSubmit ?
                        <SubmitFlowModal
                            canSubmit={this.state.canSubmit}
                            info={model}
                            nodeData={model.flownodeData}
                            children={<Button type="success" icon="check" htmlType="button">提交</Button>}
                        />
                        : null}
                    {this.state.canCancel ? <Button type="error" icon="rollback" htmlType="button">撤销</Button> : null}
                    <Button onClick={() => utils.Redirect('/missive/sendlist')} type="" icon="arrow-left" htmlType="button">返回</Button>
                </Button.Group>
            </Affix>
            <Tabs>
                <Tabs.TabPane tab="基本信息" key="1">
                    <FormTab data={model} ref={instance => {
                        if (!instance) return;
                        var form = instance.getForm();
                        MissiveEditForm = form;
                        //this.setState({ form: form });
                    }} />
                </Tabs.TabPane>
                <Tabs.TabPane tab="附件预览" key="2">
                    <ContentTab />
                </Tabs.TabPane>
                <Tabs.TabPane tab="审批流程" key="3">
                    <FlowList data={model.FlowData} />
                </Tabs.TabPane>
                <Tabs.TabPane tab="成果预览" key="4">
                    <ResultTab />
                </Tabs.TabPane>
            </Tabs>
        </div>;
    }
}