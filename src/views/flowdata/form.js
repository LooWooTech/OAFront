import React, { Component } from 'react';
import { Form, Input, Button } from 'antd';

class SubmitForm extends Component {

    handlerSubmit = () => {

    };

    render() {
        const flowdata = this.props.flowdata;
        if (flowdata.ID == 0 || flowdata.Nodes.length === 0) return null;
        const model = flowdata.Nodes[flowdata.Nodes.length -1];
        var data ={};
        const { getFieldDecorator } = this.props.form;

        return (
            <div>
                <Form onSubmit={this.handlerSubmit}>
                    <Form.Item><Input type="hidden" name="ID" value={data.ID} /></Form.Item>
                    <Form.Item label="意见" >
                        {getFieldDecorator("Content", { initialValue: data.Content })(
                            <Input />
                        )}
                    </Form.Item>
                    <Form.Item wrapperCol={{ span: 4, offset: 4 }}>
                        <Button type="success" icon="farword" htmlType="submit">同意</Button>
                        <Button type="error" icon="back" htmlType="submit">退回</Button>
                    </Form.Item>
                </Form>
            </div>
        )
    }
}
export default Form.create()(SubmitForm)
