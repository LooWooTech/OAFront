import React from 'react'
import { Input, DatePicker, Radio, Checkbox, Upload, Icon, Spin, message } from 'antd'
import Form from '../shared/_form'
import moment from 'moment'
import api from '../../models/api'
import utils from '../../utils'

class MissiveEditForm extends React.Component {
    state = { uploading: false }

    handleSubmit = () => {
        this.refs.form.validateFields((err, values) => {
            if (err) {
                return false
            }
            let formData = values
            //如果上传了word文档
            if (!formData.WordId) {
                message.error("请上传公文内容文件")
                return false
            }

            formData.FW_RQ = formData.FW_RQ ? formData.FW_RQ.format() : ''
            formData.QX_RQ = formData.QX_RQ ? formData.QX_RQ.format('YYYY-MM-DD') : ''
            if (!formData.FormId) {
                message.error("缺少参数FormId")
                return false
            }
            api.Missive.Save(formData, json => {
                message.success('保存成功')
                utils.Redirect(`/missive/${this.props.formId}/?status=1`)
            });
        })
    }

    handleUploadWord = ({ file, fileList }) => {
        this.setState({ uploading: false })
        if (!file || !file.response) return
        var response = file.response
        if (response.Message) {
            alert(response.Message)
            return;
        }
        this.setState({ upload: response })
    }

    handleDeleteWord = (wordId) => {
        if (this.props.disabled) {
            message.error('不能删除');
            return;
        }
        if (!confirm("你确定要删除吗？")) return false;
        let model = this.props.model || {}
        api.File.Delete(wordId, json => {
            model.Word = null;
            if (model.WordId === wordId) {
                model.WordId = 0
                api.Missive.DeleteWord(model.ID, () => {
                    this.setState({ upload: null, model })
                })
            } else {
                this.setState({ upload: null })
            }
        });
        //this.setState({})
        //需要更新missive，因为删除了word文件

    };

    getItems = () => {
        const formId = parseInt(this.props.formId, 10)
        //const formName = formId === api.Forms.Missive.ID ? '发文' : '收文'
        const model = this.props.model || {}
        const word = this.state.upload || model.Word || {}
        const disabled = this.props.disabled

        let uploadControl = {
            name: 'Word',
            title: '文档正文',
            defaultValue: word,
            getField: !word.ID,
            rules: [{ required: true }],
            render: !word.ID ? <Upload.Dragger
                action={api.File.UploadUrl(0, model.ID, 'word', true)}
                beforeUpload={() => { this.setState({ uploading: true }) }}
                onChange={this.handleUploadWord}
                name="word"
                onRemove={this.handleDeleteFile}
                withCredentials={true}
                showUploadList={false}
                accept=".doc,.docx,.pdf,.tiff,.tif"
                disabled={disabled}
            >
                <div style={{ textAlign: 'left', padding: '10px' }}>
                    <Spin spinning={this.state.uploading}>
                        <p className="ant-upload-text">
                            <i className="fa fa-file-o fa-2x"></i>
                            &nbsp;&nbsp; 仅限Word、Pdf、Tiff文件格式
                        </p>
                    </Spin>
                </div>
            </Upload.Dragger> :
                <div>
                    {word.FileName}
                    &nbsp;&nbsp;&nbsp;&nbsp;
                        <a href={api.File.FileUrl(word.ID)} target="_blank"><Icon type="download" />&nbsp;下载</a>
                    {disabled ? null :

                        <span>
                            &nbsp;&nbsp;&nbsp;&nbsp;
                                <a onClick={e => this.handleDeleteWord(word.ID)}><Icon type="delete" />&nbsp;删除</a>
                        </span>
                    }
                </div>
        }
        let numberControl = {
            name: 'WJ_ZH', title: '文件字号', defaultValue: model.WJ_ZH,
            layout: { labelCol: { span: 4 }, wrapperCol: { span: 4 } },
            render: <Input disabled={disabled} style={{ maxWidth: '200px' }} />,
            after: disabled ? null : <a onClick={() => {
                var wjzh = document.getElementById("WJ_ZH");
                wjzh.value = wjzh.value + '〔' + new Date().getFullYear() + '〕'
            }}>〔{new Date().getFullYear()}〕</a>
        }
        let titleControl = {
            name: 'WJ_BT', title: '文件标题', defaultValue: model.WJ_BT, rules: [{ required: true, message: '请填写文件标题' }],
            render: <Input disabled={disabled} />
        }
        let mjControl = {
            name: 'WJ_MJ', title: '文件密级', defaultValue: model.WJ_MJ || 0,
            render: <Radio.Group disabled={disabled} >
                <Radio.Button value={0}>普通</Radio.Button>
                <Radio.Button value={1}>保密</Radio.Button>
            </Radio.Group>
        }
        let qxControl = {
            name: 'QX_RQ', title: '办理期限', defaultValue: model.QX_RQ ? moment(model.QX_RQ) : null,
            render: <DatePicker placeholder="选择日期" disabled={disabled} />
        }

        let items = [
            { name: 'ID', defaultValue: model.ID || 0, render: <Input type="hidden" /> },
            { name: 'FormId', defaultValue: formId || 0, render: <Input type="hidden" /> },
            { name: 'WordId', defaultValue: word.ID || 0, render: <Input type="hidden" /> },
            //{
            //     name: 'ZTC', title: '主题词', defaultValue: model.ZTC,
            //     render: <Input disabled={disabled} />
            // },
            // {
            //     name: 'ZRR', title: '责任人', defaultValue: model.ZRR,
            //     layout: { labelCol: { span: 4 }, wrapperCol: { span: 3 } },
            //     render: <Input disabled={disabled} />
            // },
        ];
        if (formId === api.Forms.ReceiveMissive.ID) {
            items = items.concat([
                numberControl,
                {
                    name: 'WJ_LY', title: '来文单位', defaultValue: model.WJ_LY,
                    rules: [{ required: true, message: '请填写来文单位' }],
                    render: <Input disabled={disabled} />
                },
                titleControl,
                {
                    name: 'JB_RQ', title: '交办日期', defaultValue: model.JB_RQ ? moment(model.JB_RQ) : null,
                    rules: [{ required: true, message: '请选择交办日期' }],
                    render: <DatePicker placeholder="选择日期" disabled={disabled} />
                },
                qxControl,
                {
                    name: 'DJR', title: '登记人', defaultValue: model.DJR,
                    layout: { labelCol: { span: 4 }, wrapperCol: { span: 3 } },
                    render: <Input disabled={disabled} />
                },
                uploadControl,
                {
                    name: 'JJ_DJ', title: '紧急程度', defaultValue: model.JJ_DJ || 0,
                    render: <Radio.Group disabled={disabled} >
                        <Radio.Button value={0}>普通</Radio.Button>
                        <Radio.Button value={1}>紧急</Radio.Button>
                    </Radio.Group>
                }
            ]);
        }
        else {

            items = items.concat([
                uploadControl,
                numberControl,
                titleControl,
                mjControl,
                {
                    name: 'FW_RQ', title: '发文日期', defaultValue: model.FW_RQ ? moment(model.FW_RQ) : null,
                    render: <DatePicker placeholder="选择日期" format="YYYY-MM-DD" disabled={disabled} />
                },
                {
                    name: 'ZW_GK', title: '政务公开', defaultValue: model.ZW_GK || 1,
                    render: <Radio.Group disabled={disabled} >
                        <Radio value={1} >主动公开</Radio>
                        <Radio value={2} >依申请公开</Radio>
                        <Radio value={3} >不公开</Radio>
                    </Radio.Group>
                },
                {
                    name: 'GK_FB', title: '是否公开发布', defaultValue: model.GK_FB,
                    render: <Checkbox defaultChecked={model.GKFB} disabled={disabled} >是</Checkbox>
                },
                qxControl,
                {
                    name: 'ZS_JG', title: '主送机关', defaultValue: model.ZS_JG,
                    render: <Input />
                },
                {
                    name: 'CS_JG', title: '抄送机关', defaultValue: model.CS_JG,
                    render: <Input />
                },
            ]);
        }
        return items;
    }

    render() {
        const formId = this.props.formId
        if (!formId) return "参数异常：缺少FormId"
        return <Form
            ref="form"
            onSubmit={this.handleSubmit}
            children={this.getItems()}
            itemLayout={{ labelCol: { span: 4 }, wrapperCol: { span: 8 } }}
        />
    }
}

export default MissiveEditForm