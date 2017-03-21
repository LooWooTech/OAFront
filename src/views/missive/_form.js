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
        if (modelId > 0) {
            api.FormInfo.Model(this, modelId, data => {
                this.setState({ model: data });
            });
        }
    };
    handleSubmit = e => {
        e.preventDefault();
        var formData = this.props.form.getFieldsValue();
        formData.FW_RQ = formData.FW_RQ ? formData.FW_RQ.format() : '';
        formData.QX_RQ = formData.QX_RQ ? formData.QX_RQ.format('YYYY-MM-DD') : '';
        api.FormInfo.Save(this, formData, json => {
            console.log(json);
        });
    };
    handleUploadWord = info => {

    };
    handleUploadExcel = info => {

    };

    render() {
        const model = this.state.model || {};
        model.Word = model.Word || {};
        const { getFieldDecorator } = this.props.form;

        return <Form onSubmit={this.handleSubmit}>
            {getFieldDecorator("ID", { initialValue: model.ID })(<Input type="hidden" />)}
            {getFieldDecorator("FormId", { initialValue: 1 })(<Input type="hidden" />)}
            {getFieldDecorator("CategoryId", { initialValue: model.CategoryId })(<Input type="hidden" />)}
            {getFieldDecorator("FlowDataId", { initialValue: model.FlowDataId })(<Input type="hidden" />)}
            <Form.Item label="公文文号" {...shortCol} >
                {getFieldDecorator("GW_WH", { initialValue: model.GW_WH })(
                    <Input />
                )}
            </Form.Item>
            <Form.Item label="发文日期" {...defaultItemConfig} >
                {getFieldDecorator("FW_RQ", { initialValue: model.FW_RQ })(
                    <DatePicker placeholder="选择日期" format="YYYY-MM-DD" />
                )}
            </Form.Item>
            <Form.Item label="文件标题" {...defaultItemConfig} >
                {getFieldDecorator("WJ_BT", { initialValue: model.WJ_BT })(
                    <Input />
                )}
            </Form.Item>
            <Form.Item label="主题词" {...defaultItemConfig} >
                {getFieldDecorator("GW_ZTC", { initialValue: model.GW_ZTC })(
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
                {getFieldDecorator("ZS_JG", { initialValue: model.ZS_JG })(
                    <Input />
                )}
            </Form.Item>
            <Form.Item label="抄送机关" {...defaultItemConfig}>
                {getFieldDecorator("CS_JG", { initialValue: model.CS_JG })(
                    <Input />
                )}
            </Form.Item>
            <Form.Item label="是否上互联网发布"  {...defaultItemConfig}  >
                {getFieldDecorator("SF_FB_WWW", { initialValue: model.SF_FB_WWW })(
                    <Checkbox>是</Checkbox>
                )}
            </Form.Item>
            <Form.Item label="密级"  {...defaultItemConfig}  >
                {getFieldDecorator("GW_MJ", { initialValue: model.GW_MJ || 2 })(
                    <Radio.Group>
                        <Radio value={1} >密级1</Radio>
                        <Radio value={2}>密级2</Radio>
                        <Radio value={3}>密级3</Radio>
                    </Radio.Group>
                )}
            </Form.Item>
            <Row>
                <Col span={12}>
                    <Form.Item label="责任人" labelCol={{ span: 8 }} wrapperCol={{ span: 8 }} >
                        {getFieldDecorator("ZRR", { initialValue: model.ZRR })(
                            <Input />
                        )}
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item label="期限" {...defaultItemConfig} >
                        {getFieldDecorator("QX_RQ", { initialValue: model.QX_RQ })(
                            <DatePicker placeholder="选择日期" />
                        )}
                    </Form.Item>
                </Col>
            </Row>
            <Row>
                <Col span={12}>
                    <Form.Item label="Word文档" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} >
                        {model.Word > 0 ? <Link to={`/file/preview?id=${model.Word.ID}`}>
                            <i className="fa fa-attachment" />{model.Word.Name}
                        </Link> : null}
                        {getFieldDecorator("Word.ID", {
                            action: `/file/upload?infoId=${model.ID}&id=${model.Word.ID}`,
                            onChange: this.handleUploadWord,
                            showUploadList: false
                        })(
                            <Upload>
                                <Button><Icon type="upload" />上传Word文档</Button>
                            </Upload>
                            )}
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item label="Excel文件" {...defaultItemConfig} >
                        {getFieldDecorator("Excels", {
                            action: `/file/upload?infoId=${model.ID}`,
                            onChange: this.handleUploadExcel,
                        })(
                            <Upload>
                                <Button><Icon type="upload" />上传Excel文档</Button>
                            </Upload>
                            )}
                    </Form.Item>
                </Col>
            </Row>
            <Form.Item wrapperCol={{ span: 4, offset: 4 }}>
                <Button type="primary" icon="save" htmlType="submit">保存</Button>
            </Form.Item>
        </Form >;
    }
}

export default Form.create()(MissiveEditForm)