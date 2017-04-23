import React from 'react';
import { Form, Input, DatePicker, Radio, Checkbox, Upload, Button, Icon, Row, Col, Spin, message } from 'antd';
import moment from 'moment';
import api from '../../models/api';

class MissiveEditForm extends React.Component {
    state = {
        uploading: false,
    }

    componentWillMount() {
        const model = this.props.data;
        if (model && model.Data) {
            this.setState({ word: model.Data.Word });
        }
    }


    handleUploadWord = ({ file, fileList }) => {
        if (!file || !file.response) return;
        this.toggleSpin(true);
        var response = file.response;
        if (response.Message) {
            alert(response.Message)
            this.toggleSpin(false);
            return;
        }

        api.File.ConvertToPdf(response.ID, pdf => {
            this.setState({ word: response, pdf });
            this.toggleSpin(false);
        });
    };
    handleUploadExcel = ({ file, fileList }) => {
    };

    toggleSpin = (value) => {
        this.setState({ uploading: value });
    }

    handleDeleteFile = (file) => {
        var canDelete = this.props.canEdit;
        if (!canDelete) {
            message.error('不能删除');
            return;
        }
        var dbFile = file.response || { ID: file.uid };
        api.File.Delete(dbFile.ID);
        return true;
    };

    render() {
        const model = this.props.data;
        if (!model) return null;

        const data = model.Data || {};
        const word = this.state.word ? this.state.word : data.Word || {};
        const pdf = this.state.pdf ? this.state.pdf : data.Pdf;
        
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
                {getFieldDecorator("Data.HLW_FB", { initialValue: data.HLW_FB })(
                    <Checkbox defaultChecked={data.HLW_FB} disabled={disabled} >是</Checkbox>
                )}
            </Form.Item>
            <Form.Item label="密级"  {...defaultItemConfig}  >
                {getFieldDecorator("Data.GW_MJ", { initialValue: data.GW_MJ || 2 })(
                    <Radio.Group disabled={disabled} >
                        <Radio value={1}>密级1</Radio>
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
                            <DatePicker placeholder="选择日期" disabled={disabled} />
                        )}
                    </Form.Item>
                </Col>
            </Row>
            <Row>
                <Col span={12}>
                    <Spin tip="上传中" spinning={this.state.uploading}>
                        {getFieldDecorator("Pdf", { initialValue: pdf })(<Input type="hidden" />)}
                        <Form.Item label="Word文档" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} >
                            {getFieldDecorator("Word", { initialValue: data.Word })(
                                <Upload action={api.File.UploadUrl(word.ID, model.ID, 'word')}
                                    onChange={this.handleUploadWord}
                                    name="word"
                                    onRemove={this.handleDeleteFile}
                                    withCredentials={true}
                                    showUploadList={false}
                                    accept=".doc,.docx"
                                >
                                    <Button disabled={disabled}><Icon type="upload" />上传Word文档</Button>
                                </Upload>
                            )}
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
                 </Spin>
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
                                accept=".xls,.xlsx"
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