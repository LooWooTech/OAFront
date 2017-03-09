import React from 'react';
import { Modal, Form, Input, Radio, DatePicker } from 'antd';
import moment from 'moment';

const FormItem = Form.Item;

class LeaveFormModal extends React.Component {
    state = { visible: false };

    showModelHandler = (e) => {
        if (e) e.stopPropagation();
        this.setState({ visible: true, });
    };
    hideModelHandler = () => {
        this.setState({ visible: false, });
    };

    handleSubmit = () => {
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.props.onSubmit(err, values);
                this.hideModelHandler();
            }
        });
    };

    render() {
        const { children, } = this.props;
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 14 },
        };
        const record = this.props.record || {};
        const dateFormat = 'YYYY-MM-DD';
        return (
            <span>
                <span onClick={this.showModelHandler}>
                    {children}
                </span>
                <Modal title={record.ID > 0 ? '修改申请' : '申请假期'}
                    visible={this.state.visible}
                    onOk={this.handleSubmit}
                    onCancel={this.hideModelHandler}
                >
                    <Form horizontal onSubmit={this.handleSubmit}>
                        {
                            getFieldDecorator('ID', {
                                initialValue: (record.ID || 0)
                            })(<Input type="hidden" />)
                        }
                        <FormItem {...formItemLayout} label="请假类型" >
                            {getFieldDecorator('type', {
                                initialValue: (record.Type || 1),
                            })(<Radio.Group>
                                <Radio value={1}>公事</Radio>
                                <Radio value={2}>私事</Radio>
                                <Radio value={3}>年假</Radio>
                                <Radio value={4}>病假</Radio>
                                <Radio value={5}>调休</Radio>
                            </Radio.Group>)}
                        </FormItem>
                        <FormItem {...formItemLayout} label="请假时段" >
                            {getFieldDecorator('Range', {
                                initialValue: [moment(record.BeginTime || '2017-03-09', dateFormat),
                                moment(record.EndTime || '2017-03-15', dateFormat)],
                            })(<DatePicker.RangePicker />)}
                        </FormItem>
                        <FormItem {...formItemLayout} label="请假事由" >
                            {getFieldDecorator('Reason', {
                                initialValue: record.Reason,
                            })(<Input type="textarea" autosize={{ minRows: 2, maxRows: 6 }} />)}
                        </FormItem>
                    </Form>
                </Modal>
            </span>
        );
    }
}

export default Form.create()(LeaveFormModal);