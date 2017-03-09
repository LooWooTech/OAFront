import React from 'react';
import { Modal, Form, Input, Radio, DatePicker } from 'antd';
import moment from 'moment';

const FormItem = Form.Item;

class HolidayFormModal extends React.Component {
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
        const beginDate = record.BeginDate ? moment(record.BeginDate, dateFormat) : moment();
        const endDate = record.endDate ? moment(record.EndDate, dateFormat) : moment();
        return (
            <span>
                <span onClick={this.showModelHandler}>
                    {children}
                </span>
                <Modal title={record.ID > 0 ? '修改节假日' : '添加节假日'}
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
                        <FormItem {...formItemLayout} label="节假日名称" >
                            {getFieldDecorator('name', {
                                initialValue: record.Name,
                            })(<Input />)}
                        </FormItem>
                        <FormItem {...formItemLayout} label="起止日期" >
                            {getFieldDecorator('Range', {
                                initialValue: [beginDate, endDate],
                            })(<DatePicker.RangePicker />)}
                        </FormItem>
                        <FormItem {...formItemLayout} label="备注" >
                            {getFieldDecorator('Note', {
                                initialValue: record.Note,
                            })(<Input type="textarea" autosize={{ minRows: 2, maxRows: 6 }} />)}
                        </FormItem>
                    </Form>
                </Modal>
            </span>
        );
    }
}

export default Form.create()(HolidayFormModal);