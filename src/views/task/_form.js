import React, { Component } from 'react'
import { Button, Input, DatePicker, Timeline, message } from 'antd';
import SharedForm from '../shared/_form'
import moment from 'moment';
import api from '../../models/api';

class TaskForm extends Component {

    state = { info: this.props.info || {} }
    handleAddGZJZ = () => {
        let gzjz = this.state.GZJZ || [];
        let textarea = this.refs.gzjz.refs.input
        let text = textarea.value;
        if (!text) {
            textarea.focus()
            return false;
        }
        gzjz.push({ Content: text, CreateTime: moment().format() });
        textarea.value = ''
        this.setState({ GZJZ: gzjz })
    }
    getItems = () => {
        let model = this.state.model || {};
        var items = [
            { name: 'ID', defaultValue: model.ID || 0, render: <Input type="hidden" /> },
            { name: 'FormId', defaultValue: this.state.info.FormId, render: <Input type="hidden" /> },
            { name: 'Data.MC', title: '任务事项', defaultValue: model.MC || '', render: <Input /> },
            { name: 'Data.LY', title: '任务来源', defaultValue: model.LY || '', render: <Input /> },
            { name: 'Data.GZMB', title: '工作目标任务', defaultValue: model.GZMB || '', render: <Input type="textarea" autosize={{ minRows: 2, maxRows: 6 }} /> },
            { name: 'Data.JHWC_SJ', title: '计划完成时间', defaultValue: model.JHWC_SJ ? moment(model.JHWC_SJ) : null, render: <DatePicker /> },
            { name: 'Data.ZRLD', title: '责任领导', defaultValue: model.ZRLD || '', render: <Input />, layout: { labelCol: { span: 4 }, wrapperCol: { span: 4 } } },
            { name: 'Data.ZBDW', title: '主办单位', defaultValue: model.ZBDW || '', render: <Input />, layout: { labelCol: { span: 4 }, wrapperCol: { span: 6 } } },
            { name: 'Data.XBDW', title: '协办单位', defaultValue: model.XBDW || '', render: <Input />, layout: { labelCol: { span: 4 }, wrapperCol: { span: 6 } } },
            {
                title: '工作进展情况', render: <div>
                    <Input type="textarea" autosize={{ minRows: 2, maxRows: 6 }} ref="gzjz" />
                    <Button icon="plus" onClick={this.handleAddGZJZ}>添加工作进展</Button>
                    <Timeline>
                        {(this.state.GZJZ || model.GZJZ || []).map((item, key) => <Timeline.Item key={key}>
                            {moment(item.CreateTime).format('lll')}
                            <p>
                                {item.Content}
                            </p>
                        </Timeline.Item>)}
                    </Timeline>
                </div>,
            },
        ];

        return items;
    }

    render() {
        return (
            <div>
                <SharedForm
                    onSubmit={this.props.onSubmit}
                    children={this.getItems()}
                    layout={{ labelCol: { span: 4 }, wrapperCol: { span: 8 } }}
                />
            </div>
        )
    }
}

export default TaskForm