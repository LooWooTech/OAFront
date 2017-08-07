import React, { Component } from 'react';
import { Affix, Button, Tabs, message } from 'antd';
import api from '../../models/api';
import auth from '../../models/auth'
import FormTab from './_form';
import SubTaskTab from './_sub_task_list'
import ResultTab from './_result';
import FileListTab from '../file/info_file_list';
import SubmitFlowModal from '../flowdata/form';

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

                //是否可以查看所有任务列表（创建人和局长）
                if (data.flowNodeData.ParentId === 0) {
                    data.canViewAllSubTasks = auth.isCurrentUser(data.flowNodeData.UserId);
                }
                data.canAddSubTask = data.canViewAllSubTasks && data.canEdit && auth.isCurrentUser(data.model.PostUserId);

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


    render() {
        const model = this.state.model;
        const extendModel = this.state.extendModel;
        if (!model) return null;
        const showFiles = model.ID > 0;
        const showFlow = !!model.FlowDataId;
        return <div>
            <Affix offsetTop={0} className="toolbar">
                <Button.Group>
                    {this.state.canEdit ?
                        <Button onClick={this.handleSave} type="primary" icon="save" htmlType="submit">保存</Button>
                        : null}
                    {this.state.canSubmit && this.state.flowNodeData.ParentId === 0 && this.state.flowNodeData.FlowNodeName.indexOf('领导') >-1 ?
                        <SubmitFlowModal
                            flowDataId={model.FlowDataId}
                            callback={this.loadData}
                            infoId={model.ID}
                            trigger={<Button type="success" icon="check" htmlType="button">领导批示</Button>}
                        />
                        : null}
                    <Button onClick={utils.GoBack} type="" icon="arrow-left" htmlType="button">返回</Button>
                </Button.Group>
            </Affix>
            <Tabs>
                <Tabs.TabPane tab="任务落实单" key="1">
                    <FormTab model={extendModel} disabled={!this.state.canEdit} ref="form" />
                </Tabs.TabPane>
                {showFlow ?
                    <Tabs.TabPane tab="任务列表" key="2">
                        <SubTaskTab
                            task={extendModel}
                            flowData={model.FlowData}
                            canViewAllSubTasks={this.state.canViewAllSubTasks}
                            canAddSubTask={this.state.canAddSubTask}
                        />
                    </Tabs.TabPane>
                    : null}
                {showFiles ?
                    <Tabs.TabPane tab="附件清单" key="5">
                        <FileListTab infoId={model.ID} formId={model.FormId} canEdit={this.state.canEdit} inline={false} />
                    </Tabs.TabPane>
                    : null
                }
                {showFlow ?
                    <Tabs.TabPane tab="成果预览" key="4">
                        <ResultTab task={extendModel} flowData={model.FlowData} canViewAllSubTasks={this.state.canViewAllSubTasks}/>
                    </Tabs.TabPane>
                    : null
                }
            </Tabs>
        </div>;
    }
}