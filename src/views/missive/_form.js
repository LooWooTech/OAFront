import React from 'react';
import { Form, Input, DatePicker, Radio, Checkbox, Upload, Button, Icon, Row, Col, message } from 'antd';
import moment from 'moment';
import api from '../../models/api';
import utils from '../../utils';

const shortCol = { labelCol: { span: 4 }, wrapperCol: { span: 4 } };
const defaultItemConfig = { labelCol: { span: 4 }, wrapperCol: { span: 8 } };
class MissiveEditForm extends React.Component {
    static contextTypes = {
        router: React.PropTypes.object,
    };
    state = { model: {}, data: {}, word: {}, excels: [] };
    componentDidMount() {
        //请求表单的数据
        var modelId = parseInt(this.context.router.location.query.id || '0', 10);
        if (modelId > 0) {
            api.FormInfo.Model(this, modelId, data => {
                this.setState({ model: data || {} });
                this.setState({ data: data.Data || {} });
                this.setState({ word: this.state.data.Word || {} });
                this.setState({ excels: this.state.data.Excels || [] });
            });
        }
    };
    handleSubmit = e => {
        e.preventDefault();
        var formData = this.props.form.getFieldsValue();
        formData.Title = formData.Data.WJ_BT;
        formData.Keywords = formData.Data.GW_WH + "," + formData.Data.GW_ZTC;
        formData.Data.FW_RQ = formData.Data.FW_RQ ? formData.Data.FW_RQ.format() : '';
        formData.Data.QX_RQ = formData.Data.QX_RQ ? formData.Data.QX_RQ.format('YYYY-MM-DD') : '';

        formData.Data.Word = this.state.word;
        formData.Data.Excels = this.state.excels;

        var isAdd = formData.ID === 0;
        api.FormInfo.Save(this, formData, json => {
            message.success('保存成功');
            //如果id=0，则需要更新附件的infoId
            if (isAdd) {
                var fileIds = [];
                if (this.state.word.ID > 0) fileIds.push(this.state.word.ID);
                this.state.excels.map(v => fileIds.push(v.ID));
                api.File.UpdateRelation(this, fileIds, json.ID);
            }
            utils.Redirect('/missive/sendlist');
        });
    };
    handleUploadWord = ({ file }) => {
        if (!file || !file.response) return;
        var response = file.response;
        if (response.Message) {
            alert(response.Message)
            //message.error(word.Message);
            return;
        }
        this.setState({ response });
    };
    handleUploadExcel = ({ file, fileList }) => {
        if (!file || !file.response) return;
        var response = file.response;
        if (response.Message) {
            message.error(response.Message);
            return;
        }
        var list = fileList.map(v => v.response);
        this.setState({ 'excels': list });
    };
    handleDeleteFile = (file) => {
        var dbFile = file.response || { ID: file.uid };
        api.File.Delete(this, dbFile.ID);
        return true;
    };
    render() {
        const { model, data, word, excels } = this.state;
        const { getFieldDecorator } = this.props.form;
        
        return <Form onSubmit={this.handleSubmit}>
            {getFieldDecorator("ID", { initialValue: model.ID })(<Input type="hidden" />)}
            {getFieldDecorator("FormId", { initialValue: 1 })(<Input type="hidden" />)}
            {getFieldDecorator("CategoryId", { initialValue: model.CategoryId })(<Input type="hidden" />)}
            {getFieldDecorator("FlowDataId", { initialValue: model.FlowDataId })(<Input type="hidden" />)}
            <Form.Item label="公文文号" {...shortCol} >
                {getFieldDecorator("Data.GW_WH", { initialValue: data.GW_WH })(
                    <Input />
                )}
            </Form.Item>
            <Form.Item label="发文日期" {...defaultItemConfig} >
                {getFieldDecorator("Data.FW_RQ", { initialValue: moment(data.FW_RQ) })(
                    <DatePicker placeholder="选择日期" format="YYYY-MM-DD" />
                )}
            </Form.Item>
            <Form.Item label="文件标题" {...defaultItemConfig} >
                {getFieldDecorator("Data.WJ_BT", { initialValue: data.WJ_BT })(
                    <Input />
                )}
            </Form.Item>
            <Form.Item label="主题词" {...defaultItemConfig} >
                {getFieldDecorator("Data.GW_ZTC", { initialValue: data.GW_ZTC })(
                    <Input />
                )}
            </Form.Item>
            <Form.Item label="政务公开" {...defaultItemConfig} >
                {getFieldDecorator("Data.ZWGK", { initialValue: data.ZWGK || 1 })(
                    <Radio.Group>
                        <Radio value={1} >主动公开</Radio>
                        <Radio value={2} >依申请公开</Radio>
                        <Radio value={3} >不公开</Radio>
                    </Radio.Group>
                )}
            </Form.Item>
            <Form.Item label="主送机关" {...defaultItemConfig} >
                {getFieldDecorator("Data.ZS_JG", { initialValue: data.ZS_JG })(
                    <Input />
                )}
            </Form.Item>
            <Form.Item label="抄送机关" {...defaultItemConfig}>
                {getFieldDecorator("Data.CS_JG", { initialValue: data.CS_JG })(
                    <Input />
                )}
            </Form.Item>
            <Form.Item label="是否上互联网发布"  {...defaultItemConfig}  >
                {getFieldDecorator("Data.SF_FB_WWW", { initialValue: data.SF_FB_WWW })(
                    <Checkbox defaultChecked={data.SF_FB_WWW}>是</Checkbox>
                )}
            </Form.Item>
            <Form.Item label="密级"  {...defaultItemConfig}  >
                {getFieldDecorator("Data.GW_MJ", { initialValue: data.GW_MJ || 2 })(
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
                        {getFieldDecorator("Data.ZRR", { initialValue: data.ZRR })(
                            <Input />
                        )}
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item label="期限" {...defaultItemConfig} >
                        {getFieldDecorator("Data.QX_RQ", { initialValue: data.QX_RQ ? moment(data.QX_RQ) : null })(
                            <DatePicker placeholder="选择日期" />
                        )}
                    </Form.Item>
                </Col>
            </Row>
            <Row>
                <Col span={12}>
                    <Form.Item label="Word文档" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} >
                        <Upload action={api.File.UploadUrl(word.ID, model.ID, 'word')}
                            onChange={this.handleUploadWord}
                            name="word"
                            withCredentials={true}
                            showUploadList={false}
                        >
                            <Button><Icon type="upload" />上传Word文档</Button>
                        </Upload>
                        <br />
                        {word.ID > 0 ?
                            <div>
                                <a href={api.File.FileUrl(word.ID)} target="_blank">
                                    {word.FileName}
                                </a>&nbsp;&nbsp;&nbsp;&nbsp;
                                <a onClick={() => {
                                    if (confirm('你确定要删除吗？')) {
                                        this.setState({ word: {} });
                                    }
                                }}><i className="fa fa-remove" /></a>
                            </div> : <span></span>
                        }
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item label="Excel文件" {...defaultItemConfig} >
                        <Upload action={api.File.UploadUrl(0, model.ID, 'excels')}
                            onChange={this.handleUploadExcel}
                            name="excels"
                            withCredentials={true}
                            onRemove={this.handleDeleteFile}
                            showUploadList={true}
                            defaultFileList={excels.map(v => {
                                return {
                                    uid: v.ID,
                                    name: v.FileName,
                                    status: 'done',
                                    response: v,
                                    url: api.File.FileUrl(v.ID)
                                };
                            })}
                        >
                            <Button><Icon type="upload" />上传Excel文档</Button>
                        </Upload>
                    </Form.Item>
                </Col>
            </Row>
            <Form.Item wrapperCol={{ span: 4, offset: 4 }}>
                <Button type="primary" icon="save" htmlType="submit">保存</Button>
            </Form.Item>
        </Form>;
    }
}

export default Form.create()(MissiveEditForm)