import React from 'react';
import { Link } from 'react-router';
import { Form, Input, DatePicker, Radio, Checkbox, Upload, Button, Icon, Row, Col } from 'antd';
import api from '../../models/api';


const shortCol = { labelCol: { span: 4 }, wrapperCol: { span: 4 } };
const defaultItemConfig = { labelCol: { span: 4 }, wrapperCol: { span: 8 } };
class MissiveEditForm extends React.Component {
    static contextTypes = {
        router: React.PropTypes.object,
    };
    state = { model: {} };
    componentDidMount() {
        //请求表单的数据
        var modelId = parseInt(this.context.router.location.query.id || '0', 10);
        api.Missive.Model(this, modelId, data => {
            this.setState({ model: data });
        });
    };
    handleSubmit = e => {
        e.preventDefault();
        var formData = this.props.form.getFieldsValue();
        console.log(formData);
    };
    handleUploadWord = info => {

    };
    handleUploadExcel = info => {

    };

    render() {
        const {model} = this.state;
        const { getFieldDecorator } = this.props.form;

        return <Form onSubmit={this.handleSubmit}>
            <Form.Item label="发文字号" {...shortCol} >
                {getFieldDecorator("Number", { initialValue: model.Number })(
                    <Input />
                )}
            </Form.Item>
            <Form.Item label="发文日期" {...defaultItemConfig} >
                {getFieldDecorator("CreateTime", { initialValue: model.CreateTime })(
                    <DatePicker placeholder="选择日期" />
                )}
            </Form.Item>
            <Form.Item label="文件标题" {...defaultItemConfig} >
                {getFieldDecorator("Title", { initialValue: model.Title })(
                    <Input />
                )}
            </Form.Item>
            <Form.Item label="主题词" {...defaultItemConfig} >
                {getFieldDecorator("KeyWords", { initialValue: model.KeyWords })(
                    <Input />
                )}
            </Form.Item>
            <Form.Item label="政务公开" {...defaultItemConfig} >
                {getFieldDecorator("ZWGK", { initialValue: model.ZWGK || 1 })(
                    <Radio.Group>
                        <Radio value={1} >主动公开</Radio>
                        <Radio value={2} >依申请公开</Radio>
                        <Radio value={3} >不公开</Radio>
                    </Radio.Group>
                )}
            </Form.Item>
            <Form.Item label="主送机关" {...defaultItemConfig} >
                {getFieldDecorator("ZSJG", { initialValue: model.ZSJG })(
                    <Input />
                )}
            </Form.Item>
            <Form.Item label="抄送机关" {...defaultItemConfig}>
                {getFieldDecorator("CSJG", { initialValue: model.CSJG })(
                    <Input />
                )}
            </Form.Item>
            <Form.Item label="是否上互联网发布"  {...defaultItemConfig}  >
                {getFieldDecorator("SFFB", { initialValue: model.SFFB })(
                    <Checkbox value="1">是</Checkbox>
                )}
            </Form.Item>
            <Form.Item label="责任人" {...shortCol} >
                {getFieldDecorator("ZRR", { initialValue: model.ZRR })(
                    <Input />
                )}
            </Form.Item>
            <Form.Item label="密级"  {...defaultItemConfig}  >
                {getFieldDecorator("ConfidentialLevel", { initialValue: model.ConfidentialLevel || 2 })(
                    <Radio.Group>
                        <Radio value={1} >密级1</Radio>
                        <Radio value={2}>密级2</Radio>
                        <Radio value={3}>密级3</Radio>
                    </Radio.Group>
                )}
            </Form.Item>
            <Form.Item label="期限" {...defaultItemConfig} >
                {getFieldDecorator("QX", { initialValue: model.QX })(
                    <DatePicker placeholder="选择日期" />
                )}
            </Form.Item>
            <Form.Item label="Word文档" {...defaultItemConfig} >
                {model.Word > 0 ? <Link to={`/file/preview?id=${model.Word.ID}`}>
                    <i className="fa fa-attachment" />{model.Word.Name}
                </Link> : null}
                {getFieldDecorator("Word", { action: `/file/upload?infoId=${model.ID}&id=${model.WordID}`, onChange: this.handleUploadWord, showUploadList: false })(
                    <Upload>
                        <Button><Icon type="upload" />上传Word文档</Button>
                    </Upload>
                )}
            </Form.Item>
            <Form.Item label="Excel文件" {...defaultItemConfig} >
                {getFieldDecorator("Excel", { action: `/file/upload?infoId=${model.ID}`, onChange: this.handleUploadExcel })(
                    <Upload>
                        <Button><Icon type="upload" />上传Excel文档</Button>
                    </Upload>
                )}
            </Form.Item>
            <Form.Item wrapperCol={{ span: 4, offset: 4 }}>
                <Button type="primary" icon="save" htmlType="submit">保存</Button>
            </Form.Item>
        </Form>;
    }
}

export default Form.create()(MissiveEditForm)