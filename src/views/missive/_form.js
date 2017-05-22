import React from 'react'
import { Input, DatePicker, Radio, Checkbox, Upload, Icon, message } from 'antd'
import Form from '../shared/_form'
import moment from 'moment'
import api from '../../models/api'
import utils from '../../utils'

class MissiveEditForm extends React.Component {
    state = {
        model: this.props.model,
    }

    handleSubmit = () => {
        this.refs.form.validateFields((err, values) => {
            if (err) {
                console.log(err)
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
                console.log(formData)
                return false
            }
            api.Missive.Save(formData, json => {
                message.success('保存成功')
                utils.Redirect(`/missive/${this.props.formId}/?status=1`)
            });
        })
    }

    handleUploadWord = ({ file, fileList }) => {
        if (!file || !file.response) return
        var response = file.response

        if (response.Message) {
            alert(response.Message)
            return;
        }
        this.setState({ upload: response })
        // api.File.ConvertToPdf(response.ID, pdf => {
        //     this.setState({ word: response, pdf });
        //     this.toggleSpin(false);
        // }, () => { this.toggleSpin(false) });
    }

    handleDeleteWord = () => {
        if (this.props.disabled) {
            message.error('不能删除');
            return;
        }
        let model = this.state.model || {}
        let wordId = this.refs.form.getFieldValue('WordId')
        api.File.Delete(wordId, json => {
            model.Word = null;
            if (model.WordId == wordId) {
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
        const formName = formId === api.Forms.Missive.ID ? '发文' : '收文'
        const model = this.state.model
        if (!model) return []
        const word = this.state.upload || model.Word || {}
        const disabled = this.props.disabled
        var items = [
            { name: 'ID', defaultValue: model.ID || 0, render: <Input type="hidden" /> },
            { name: 'FormId', defaultValue: formId || 0, render: <Input type="hidden" /> },
            { name: 'WordId', defaultValue: word.ID || 0, render: <Input type="hidden" /> },
            {
                name: 'Word',
                title: formName + '文档',
                defaultValue: word,
                getField: !word.ID,
                rules: [{ required: true }],
                render: !word.ID ? <Upload.Dragger
                    action={api.File.UploadUrl(0, model.ID, 'word', true)}
                    onChange={this.handleUploadWord}
                    name="word"
                    onRemove={this.handleDeleteFile}
                    withCredentials={true}
                    showUploadList={false}
                    accept=".doc,.docx,.pdf,.tiff,tif"
                    disabled={disabled}
                ><div style={{ textAlign: 'left', padding: '10px' }}>
                        <p className="ant-upload-text">
                            <i className="fa fa-file-o fa-2x"></i>
                            &nbsp;&nbsp; 仅限Word、Pdf、Tiff文件格式
                        </p>
                    </div>
                </Upload.Dragger> :
                    <div>
                        {word.FileName}
                        &nbsp;&nbsp;&nbsp;&nbsp;{disabled ? null : <a onClick={this.handleDeleteWord}><Icon type="delete" />&nbsp;删除</a>}
                    </div>
            },
            {
                name: 'FW_RQ', title: formName + '日期', defaultValue: model.FW_RQ ? moment(model.FW_RQ) : null,
                render: <DatePicker placeholder="选择日期" format="YYYY-MM-DD" disabled={disabled} />
            },
            {
                name: 'WH', title: formName + '文号', defaultValue: model.WH,
                layout: { labelCol: { span: 4 }, wrapperCol: { span: 4 } },
                render: <Input disabled={disabled} />
            },
            {
                name: 'WJ_BT', title: '文件标题', defaultValue: model.WJ_BT, rules: [{ required: true, message: '请填写文件标题' }],
                render: <Input disabled={disabled} />
            }, {
                name: 'ZTC', title: '主题词', defaultValue: model.ZTC,
                render: <Input disabled={disabled} />
            },
            {
                name: 'ZWGK', title: '政务公开', defaultValue: model.ZWGK || 1,
                render: <Radio.Group disabled={disabled} >
                    <Radio value={1} >主动公开</Radio>
                    <Radio value={2} >依申请公开</Radio>
                    <Radio value={3} >不公开</Radio>
                </Radio.Group>
            },
            {
                name: 'GKFB', title: '是否公开发布', defaultValue: model.GKFB,
                render: <Checkbox defaultChecked={model.GKFB} disabled={disabled} >是</Checkbox>
            },
            {
                name: 'MJ', title: '公文密级', defaultValue: model.MJ || 0,
                render: <Radio.Group disabled={disabled} >
                    <Radio.Button value={0}>无</Radio.Button>
                    <Radio.Button value={1}>保密</Radio.Button>
                </Radio.Group>
            },
            // {
            //     name: 'ZRR', title: '责任人', defaultValue: model.ZRR,
            //     layout: { labelCol: { span: 4 }, wrapperCol: { span: 3 } },
            //     render: <Input disabled={disabled} />
            // },
            {
                name: 'QX_RQ', title: '期限', defaultValue: model.QX_RQ ? moment(model.QX_RQ) : null,
                render: <DatePicker placeholder="选择日期" disabled={disabled} />
            }
        ];
        if (formId === api.Forms.ReceiveMissive.ID) {
            items.push({
                name: 'LY', title: '公文来源', defaultValue: model.LY, rules: [{ required: true, message: '请填写公文来源' }],
                render: <Input />
            })
        }

        return items;
    }

    render() {
        const formId = this.props.formId
        if (!formId) return null
        return <Form
            ref="form"
            onSubmit={this.handleSubmit}
            children={this.getItems()}
            layout={{ labelCol: { span: 4 }, wrapperCol: { span: 8 } }}
        />
    }
}

export default MissiveEditForm