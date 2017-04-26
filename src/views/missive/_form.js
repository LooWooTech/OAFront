import React from 'react';
import { Form, Input, DatePicker, Radio, Checkbox, Upload, Icon, Row, Col, Spin, message } from 'antd';
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

        const disabled = !this.props.canEdit;
        const { getFieldDecorator } = this.props.form;

        return <Form>
            {getFieldDecorator("ID", { initialValue: model.ID })(<Input type="hidden" />)}
            {getFieldDecorator("FormId", { initialValue: 1 })(<Input type="hidden" />)}
            {getFieldDecorator("CategoryId", { initialValue: model.CategoryId })(<Input type="hidden" />)}
            {getFieldDecorator("FlowDataId", { initialValue: model.FlowDataId })(<Input type="hidden" />)}


            {getFieldDecorator("Pdf", { initialValue: pdf })(<Input type="hidden" />)}
            <Form.Item label="公文文档" labelCol={{ span: 4 }} wrapperCol={{ span: 9 }} >
                {getFieldDecorator("Word", { initialValue: data.Word })(
                    <Upload.Dragger
                        action={api.File.UploadUrl(word.ID, model.ID, 'word')}
                        onChange={this.handleUploadWord}
                        name="word"
                        onRemove={this.handleDeleteFile}
                        withCredentials={true}
                        showUploadList={false}
                        accept=".doc,.docx"
                    ><Spin tip="上传中" spinning={this.state.uploading}>
                            {word.ID > 0 ?
                                word.FileName :
                                <div style={{ textAlign: 'left', padding: '10px' }}>
                                    <p className="ant-upload-text">
                                        <i className="fa fa-file-word-o fa-2x"></i>
                                        &nbsp;&nbsp;
                                        请选择公文内容文档</p>
                                </div>
                            }
                        </Spin>
                    </Upload.Dragger>
                )}
                {word.ID > 0 ?
                    <span>
                        <a href={api.File.FileUrl(word.ID)} target="_blank">
                            <Icon type="download" /> 下载
                        </a>
                        &nbsp;&nbsp;&nbsp;&nbsp;
                        <a onClick={() => confirm('你确定要删除吗？') ? this.setState({ word: {} }) : false}>
                            <Icon type="delete" /> 删除
                        </a>
                    </span> : null
                }
            </Form.Item>
            <Row>
                <Col span={8}>
                    <Form.Item label="发文日期" labelCol={{ span: 12 }} >
                        {getFieldDecorator("Data.FW_RQ", { initialValue: moment(data.FW_RQ) })(
                            <DatePicker placeholder="选择日期" format="YYYY-MM-DD" disabled={disabled} />
                        )}
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item label="公文文号" labelCol={{ span: 6 }} wrapperCol={{ span: 9 }} >
                        {getFieldDecorator("Data.GW_WH", { initialValue: data.GW_WH })(
                            <Input disabled={disabled} />
                        )}
                    </Form.Item>
                </Col>
            </Row>
            <Form.Item label="文件标题" labelCol={{ span: 4 }} wrapperCol={{ span: 9 }} >
                {getFieldDecorator("Data.WJ_BT", { initialValue: data.WJ_BT })(
                    <Input disabled={disabled} />
                )}
            </Form.Item>
            <Form.Item label="主题词" labelCol={{ span: 4 }} wrapperCol={{ span: 9 }} >
                {getFieldDecorator("Data.GW_ZTC", { initialValue: data.GW_ZTC })(
                    <Input disabled={disabled} />
                )}
            </Form.Item>
            <Form.Item label="政务公开" labelCol={{ span: 4 }}  >
                {getFieldDecorator("Data.ZWGK", { initialValue: data.ZWGK || 1 })(
                    <Radio.Group disabled={disabled} >
                        <Radio value={1} >主动公开</Radio>
                        <Radio value={2} >依申请公开</Radio>
                        <Radio value={3} >不公开</Radio>
                    </Radio.Group>
                )}
            </Form.Item>
            <Row>
                <Col span={8}>
                    <Form.Item label="是否上互联网发布" labelCol={{ span: 12 }} wrapperCol={{ span: 8 }} >
                        {getFieldDecorator("Data.HLW_FB", { initialValue: data.HLW_FB })(
                            <Checkbox defaultChecked={data.HLW_FB} disabled={disabled} >是</Checkbox>
                        )}
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item label="密级" labelCol={{ span: 4 }}  >
                        {getFieldDecorator("Data.GW_MJ", { initialValue: data.GW_MJ || 2 })(
                            <Radio.Group disabled={disabled} >
                                <Radio value={1}>密级1</Radio>
                                <Radio value={2}>密级2</Radio>
                                <Radio value={3}>密级3</Radio>
                            </Radio.Group>
                        )}
                    </Form.Item>
                </Col>
            </Row>
            <Row>
                <Col span={8}>
                    <Form.Item label="责任人" labelCol={{ span: 12 }} wrapperCol={{ span: 8 }} >
                        {getFieldDecorator("Data.ZRR", { initialValue: data.ZRR })(
                            <Input disabled={disabled} />
                        )}
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item label="期限" labelCol={{ span: 5 }} wrapperCol={{ span: 12 }}  >
                        {getFieldDecorator("Data.QX_RQ", { initialValue: data.QX_RQ ? moment(data.QX_RQ) : null })(
                            <DatePicker placeholder="选择日期" disabled={disabled} />
                        )}
                    </Form.Item>
                </Col>
            </Row>
        </Form>;
    }
}

export default Form.create()(MissiveEditForm)