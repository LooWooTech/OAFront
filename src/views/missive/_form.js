import React from 'react'
import { Input, DatePicker, Radio, Checkbox, Upload, Icon, message } from 'antd'
import Form from '../shared/_form'
import moment from 'moment'
import api from '../../models/api'
import utils from '../../utils'

class MissiveEditForm extends React.Component {
    state = { model: {} }

    componentWillMount() {
        if (this.props.info.ID > 0) {
            api.Missive.Get(this.props.info.ID || 0, data => {
                this.setState({ model: data })
            })
        }
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
                utils.Redirect(`/missive/${this.props.info.FormId}/?status=1`)
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
        const model = this.state.model
        const word = this.state.upload || model.Word || {}
        const disabled = this.props.disabled
        const info = this.props.info
        var items = [
            { name: 'ID', defaultValue: model.ID || 0, render: <Input type="hidden" /> },
            { name: 'FormId', defaultValue: info.FormId || 0, render: <Input type="hidden" /> },
            { name: 'WordId', defaultValue: word.ID || 0, render: <Input type="hidden" /> },
            {
                name: 'Word',
                title: '公文文档',
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
                    accept=".doc,.docx"
                    disabled={disabled}
                ><div style={{ textAlign: 'left', padding: '10px' }}>
                        <p className="ant-upload-text">
                            <i className="fa fa-file-word-o fa-2x"></i>
                            &nbsp;&nbsp; 请选择公文内容文档
                        </p>
                    </div>
                </Upload.Dragger> :
                    <div>
                        {word.FileName}
                        &nbsp;&nbsp;&nbsp;&nbsp;{disabled ? null : <a onClick={this.handleDeleteWord}><Icon type="delete" />&nbsp;删除</a>}
                    </div>
            },
            {
                name: 'FW_RQ', title: '发文日期', defaultValue: model.FW_RQ ? moment(model.FW_RQ) : null,
                render: <DatePicker placeholder="选择日期" format="YYYY-MM-DD" disabled={disabled} />
            },
            {
                name: 'WH', title: '公文文号', defaultValue: model.WH,
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
                name: 'ZWGK', title: '政务公开', defaultValue: model.ZWGK,
                render: <Radio.Group disabled={disabled} >
                    <Radio value={1} >主动公开</Radio>
                    <Radio value={2} >依申请公开</Radio>
                    <Radio value={3} >不公开</Radio>
                </Radio.Group>
            },
            {
                name: 'HLW_FB', title: '是否上互联网发布', defaultValue: model.HLW_FB,
                render: <Checkbox defaultChecked={model.HLW_FB} disabled={disabled} >是</Checkbox>
            },
            {
                name: 'MJ', title: '公文密级', defaultValue: model.MJ,
                render: <Radio.Group disabled={disabled} >
                    <Radio value={1}>密级1</Radio>
                    <Radio value={2}>密级2</Radio>
                    <Radio value={3}>密级3</Radio>
                </Radio.Group>
            },
            {
                name: 'ZRR', title: '责任人', defaultValue: model.ZRR,
                layout: { labelCol: { span: 4 }, wrapperCol: { span: 3 } },
                render: <Input disabled={disabled} />
            },
            {
                name: 'QX_RQ', title: '期限', defaultValue: model.QX_RQ ? moment(model.QX_RQ) : null,
                render: <DatePicker placeholder="选择日期" disabled={disabled} />
            }
        ];
        if (info.FormId === api.FormId.ReceiveMissive.toString()) {
            items.push({
                name: 'LY', title: '公文来源', defaultValue: model.LY, rules: [{ required: true, message: '请填写公文来源' }],
                render: <Input />
            })
        }

        return items;
    }

    render() {
        return <Form
            ref="form"
            onSubmit={this.handleSubmit}
            children={this.getItems()}
            layout={{ labelCol: { span: 4 }, wrapperCol: { span: 8 } }}
        />
    }
}

export default MissiveEditForm