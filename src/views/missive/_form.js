import React from 'react';
import { Form, Input, DatePicker, Radio, Checkbox, Upload, Button, Icon, Row, Col, message } from 'antd';
import moment from 'moment';
import api from '../../models/api';

class MissiveEditForm extends React.Component {
    state = { word: {}, excels: [] };
    handleUploadWord = ({ file }) => {
        if (!file || !file.response) return;
        var response = file.response;
        if (response.Message) {
            alert(response.Message)
            //message.error(word.Message);
            return;
        }
        this.setState({ word: response });
    };
    handleUploadExcel = ({ file, fileList }) => {
    };

    handleDeleteFile = (file) => {
        var canDelete = this.props.canEdit;
        if (!canDelete) {
            message.error('不能删除');
            return;
        }
        var dbFile = file.response || { ID: file.uid };
        api.File.Delete(this, dbFile.ID);
        return true;
    };

    render() {
        const model = this.props.data;
        if (!model) return null;

        const data = model.Data || {};
        const word = this.state.word.ID > 0 ? this.state.word : data.Word || {};
        const defaultWords = word.ID > 0 ? [{
            uid: word.ID,
            name: word.FileName,
            status: 'done',
            response: word,
            url: api.File.FileUrl(word.ID)
        }] : [];
        const defaultExcels = (data.Excels || []).map(v => {
            return {
                uid: v.ID,
                name: v.FileName,
                status: 'done',
                response: v,
                url: api.File.FileUrl(v.ID)
            };
        });
        const disabled = !this.props.canEdit;
        const { getFieldDecorator } = this.props.form;
        const shortCol = { labelCol: { span: 4 }, wrapperCol: { span: 4 } };
        const defaultItemConfig = { labelCol: { span: 4 }, wrapperCol: { span: 8 } };

        return <Form>
            {getFieldDecorator("ID", { initialValue: model.ID })(<Input type="hidden" />)}
            {getFieldDecorator("FormId", { initialValue: 1 })(<Input type="hidden" />)}
            {getFieldDecorator("CategoryId", { initialValue: model.CategoryId })(<Input type="hidden" />)}
            {getFieldDecorator("FlowDataId", { initialValue: model.FlowDataId })(<Input type="hidden" />)}
            <Form.Item label="公文文号" {...shortCol} >
                {getFieldDecorator("Data.GW_WH", { initialValue: data.GW_WH })(
                    <Input disabled={disabled} />
                )}
            </Form.Item>
            <Form.Item label="发文日期" {...defaultItemConfig} >
                {getFieldDecorator("Data.FW_RQ", { initialValue: moment(data.FW_RQ) })(
                    <DatePicker placeholder="选择日期" format="YYYY-MM-DD" disabled={disabled} />
                )}
            </Form.Item>
            <Form.Item label="文件标题" {...defaultItemConfig} >
                {getFieldDecorator("Data.WJ_BT", { initialValue: data.WJ_BT })(
                    <Input disabled={disabled} />
                )}
            </Form.Item>
            <Form.Item label="主题词" {...defaultItemConfig} >
                {getFieldDecorator("Data.GW_ZTC", { initialValue: data.GW_ZTC })(
                    <Input disabled={disabled} />
                )}
            </Form.Item>
            <Form.Item label="政务公开" {...defaultItemConfig} >
                {getFieldDecorator("Data.ZWGK", { initialValue: data.ZWGK || 1 })(
                    <Radio.Group disabled={disabled} >
                        <Radio value={1} >主动公开</Radio>
                        <Radio value={2} >依申请公开</Radio>
                        <Radio value={3} >不公开</Radio>
                    </Radio.Group>
                )}
            </Form.Item>
            <Form.Item label="主送机关" {...defaultItemConfig} >
                {getFieldDecorator("Data.ZS_JG", { initialValue: data.ZS_JG })(
                    <Input disabled={disabled} />
                )}
            </Form.Item>
            <Form.Item label="抄送机关" {...defaultItemConfig}>
                {getFieldDecorator("Data.CS_JG", { initialValue: data.CS_JG })(
                    <Input disabled={disabled} />
                )}
            </Form.Item>
            <Form.Item label="是否上互联网发布"  {...defaultItemConfig}  >
                {getFieldDecorator("Data.SF_FB_WWW", { initialValue: data.SF_FB_WWW })(
                    <Checkbox defaultChecked={data.SF_FB_WWW} disabled={disabled} >是</Checkbox>
                )}
            </Form.Item>
            <Form.Item label="密级"  {...defaultItemConfig}  >
                {getFieldDecorator("Data.GW_MJ", { initialValue: data.GW_MJ || 2 })(
                    <Radio.Group disabled={disabled} >
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
                            <Input disabled={disabled} />
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
                        {getFieldDecorator("Word", { initialValue: data.Word })(
                            <Upload action={api.File.UploadUrl(word.ID, model.ID, 'word')}
                                onChange={this.handleUploadWord}
                                name="word"
                                onRemove={this.handleDeleteFile}
                                withCredentials={true}
                                defaultFileList={defaultWords}
                            >
                                <Button disabled={disabled}><Icon type="upload" />上传Word文档</Button>
                            </Upload>
                        )}
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item label="Excel文件" {...defaultItemConfig} >
                        {getFieldDecorator("Excels", { initialValue: data.Excels })(
                            <Upload action={api.File.UploadUrl(0, model.ID, 'excels')}
                                onChange={this.handleUploadExcel}
                                name="excels"
                                withCredentials={true}
                                onRemove={this.handleDeleteFile}
                                defaultFileList={defaultExcels}
                            >
                                <Button disabled={disabled}><Icon type="upload" />上传Excel文档</Button>
                            </Upload>
                        )}
                    </Form.Item>
                </Col>
            </Row>
        </Form>;
    }
}

export default Form.create()(MissiveEditForm)