import React from 'react'
import { Input, DatePicker, Radio, message, AutoComplete, Icon } from 'antd'
import Form from '../shared/_form'
import moment from 'moment'
import api from '../../models/api'
import utils from '../../utils'

class TaskForm extends React.Component {
    state = {
        formId: api.Forms.Task.ID,
        LY_LX: 0
    }

    handleSubmit = () => {
        this.refs.form.validateFields((err, values) => {
            if (err) {
                return false
            }
            let formData = values
            formData.JH_SJ = formData.JH_SJ ? formData.JH_SJ.format() : ''
            formData.LY_LX = this.state.LY_LX || 1;
            api.Task.Save(formData, json => {
                message.success('保存成功')
                utils.Redirect(`/task/?status=1`)
            });
        })
    }

    getItems = () => {
        let model = this.props.model || {};
        const disabled = this.props.disabled
        console.log(this.state.LY_LX || model.LY_LX)
        var items = [
            { name: 'ID', defaultValue: model.ID || 0, render: <Input type="hidden" /> },
            { name: 'FormId', defaultValue: this.state.formId, render: <Input type="hidden" /> },
            {
                name: 'MC', title: '任务事项', defaultValue: model.MC || '',
                rules: [{ required: true, message: '请填写任务事项' }], render: <Input disabled={disabled} />
            },
            {
                name: 'LY', title: '任务来源', defaultValue: model.LY || '',
                render: <Input disabled={disabled} />,
                before: <Radio.Group defaultValue={this.state.LY_LX || model.LY_LX}
                    onChange={e => this.setState({ LY_LX: e.target.value })} disabled={disabled}>
                    <Radio.Button value={1}>省</Radio.Button>
                    <Radio.Button value={2}>市</Radio.Button>
                    <Radio.Button value={3}>区</Radio.Button>
                </Radio.Group>
            },
            {
                name: 'GZ_MB', title: '工作目标任务', defaultValue: model.GZ_MB || '',
                rules: [{ required: true, message: '请填写任务内容' }],
                render: <Input type="textarea" autosize={{ minRows: 2, maxRows: 6 }} disabled={disabled} />
            },
            {
                name: 'JH_SJ', title: '计划完成时间', defaultValue: model.JH_SJ ? moment(model.JH_SJ) : null,
                //rules: [{ required: true, message: '请选择计划完成时间' }],
                render: <DatePicker disabled={disabled} />
            },
            { name: 'ZB_DW', title: '主办单位', defaultValue: model.ZB_DW || '', render: <Input disabled={disabled} />, },
            { name: 'XB_DW', title: '协办单位', defaultValue: model.XB_DW || '', render: <Input disabled={disabled} />, }
        ];
        if (model.ZRR_ID) {
            items = items.concat([{ name: 'ZRR_ID', defaultValue: this.state.ZRR_ID || model.ZRR_ID || 0, render: <Input type="hidden" /> },
            { title: '责任人', render: model.ZRR ? model.ZRR.RealName : '' },
            { title: '协办人', name: 'XBR', defaultValue: model.XBR, render: <Input type='textarea' autosize disabled={disabled} /> },
            ]);
        }
        return items;
    }

    render() {
        return (
            <div>
                <Form
                    ref="form"
                    onSubmit={this.handleSubmit}
                    children={this.getItems()}
                    itemLayout={{ labelCol: { span: 4 }, wrapperCol: { span: 8 } }}
                />
            </div>
        )
    }
}

export default TaskForm