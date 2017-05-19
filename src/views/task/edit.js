import React, { Component } from 'react';
import { Affix, Button, Tabs, message } from 'antd';
import api from '../../models/api';
import FormTab from './_form';
import FlowListTab from '../flowdata/list';
import FileListTab from '../file/info_file_list';

import SubmitFlowModal from '../flowdata/form';
import SubmitFreeFlowModal from '../freeflow/form';
import utils from '../../utils';

export default class TaskEdit extends Component {
    state = {}
    componentWillMount() {
        this.loadData();
    };

    loadData = () => {
        var id = parseInt(this.props.location.query.id || '0', 10);
        if (id === 0) {
            this.setState({
                activeItem: 'info',
                model: { FormId: api.Forms.Task.ID, },
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
        this.refs.form.validateFields((err, formData) => {
            if (err) return false;
            var model = formData;



            api.FormInfo.Save(model, json => {
                message.success('保存成功');
                utils.Redirect('/task/list?status=1');
            });

        })
    };

    handleExport = e => { };

    handleCancel = e => {
        if (!confirm('你确定要撤销流程吗?')) return false;
        api.FlowData.Cancel(this.state.model.ID, this.loadData);
    };

    render() {
        const model = this.state.model;
        if (!model) return null;
        const showFiles = model.ID > 0;
        const showFlow = !!model.FlowDataId;
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
                            children={<Button type="success" icon="check" htmlType="button">提交主流程</Button>}
                        />
                        : null}
                    {this.state.canSubmitFreeFlow ?
                        <SubmitFreeFlowModal
                            callback={this.loadData}
                            canSubmit={true}
                            infoId={model.ID}
                            flowNodeData={this.state.flowNodeData}
                            record={this.state.freeFlowNodeData}
                            children={<Button type="success" icon="retweet" htmlType="button">提交自由流程</Button>}
                        />
                        : null}
                    {this.state.canCancel ? <Button type="danger" icon="rollback" htmlType="button" onClick={this.handleCancel}>撤销</Button> : null}
                    <Button onClick={utils.GoBack} type="" icon="arrow-left" htmlType="button">返回</Button>
                </Button.Group>
            </Affix>
            <Tabs>
                <Tabs.TabPane tab="任务落实单" key="1" style={{ zIndex: 2 }}>
                    <FormTab info={model} disabled={!this.state.canEdit} ref="form" onSubmit={this.handleSave} />
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
                {
                    //   showResult ?
                    //     <Tabs.TabPane tab="成果预览" key="4">
                    //         <ResultTab data={model} />
                    //     </Tabs.TabPane>
                    //     : null
                }
            </Tabs>
        </div>;
    }
}