import React from 'react'
import { Input, DatePicker, Radio, message } from 'antd'
import Form from '../shared/_form'
import moment from 'moment'
import api from '../../models/api'
import utils from '../../utils'

class TaskForm extends React.Component {
    state = {
        formId: api.Forms.Task.ID,
        FromType: 0
    }

    handleSubmit = () => {
        this.refs.form.validateFields((err, values) => {
            if (err) {
                return false
            }
            let formData = values
            formData.FromType = this.state.FromType || ''
            formData.ScheduleDate = formData.ScheduleDate ? formData.ScheduleDate.format() : ''
            api.Task.Save(formData, json => {
                message.success('保存成功')
                utils.Redirect(`/task/?status=1`)
            });
        })
    }

    getItems = () => {
        let model = this.props.model || {};
        const disabled = this.props.disabled
        var items = [
            { name: 'ID', defaultValue: model.ID || 0, render: <Input type="hidden" /> },
            { name: 'FormId', defaultValue: this.state.formId, render: <Input type="hidden" /> },
            {
                name: 'Number', title: '任务单号', defaultValue: model.Number || '',
                layout: { labelCol: { span: 3 }, wrapperCol: { span: 8 } },
                rules: [{ required: true, message: '请填写任务单号' }], render: <Input disabled={disabled} />
            },
            {
                name: 'Name', title: '任务事项', defaultValue: model.Name || '',
                rules: [{ required: true, message: '请填写任务事项' }], render: <Input disabled={disabled} />
            },
            {
                name: 'From', title: '任务来源', defaultValue: model.From || '',
                render: <Input disabled={disabled} />,
                before: <Radio.Group defaultValue={this.state.FromType || model.FromType || 0}
                    onChange={e => this.setState({ FromType: e.target.value })} disabled={disabled}>
                    <Radio.Button value={1}>省</Radio.Button>
                    <Radio.Button value={2}>市</Radio.Button>
                    <Radio.Button value={3}>区</Radio.Button>
                    <Radio.Button value={0}>不选</Radio.Button>
                </Radio.Group>
            },
            {
                name: 'Goal', title: '工作目标任务', defaultValue: model.Goal || '',
                rules: [{ required: true, message: '请填写任务内容' }],
                render: <Input type="textarea" autosize={{ minRows: 2, maxRows: 6 }} disabled={disabled} />
            },
            {
                name: 'ScheduleDate', title: '计划完成时间', defaultValue: model.ScheduleDate ? moment(model.ScheduleDate) : null,
                //rules: [{ required: true, message: '请选择计划完成时间' }],
                render: <DatePicker disabled={disabled} />
            }
        ];

        return items;
    }

    render() {
        return (
            <div>
                <Form
                    ref="form"
                    onSubmit={this.handleSubmit}
                    children={this.getItems()}
                    itemLayout={{ labelCol: { span: 3 }, wrapperCol: { span: 12 } }}
                />
            </div>
        )
    }
}

export default TaskForm