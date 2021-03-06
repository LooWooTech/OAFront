import React from 'react'
import { Input, DatePicker, AutoComplete, Radio, Checkbox, Upload, Icon, Spin, message } from 'antd'
import Form from '../shared/_form'
import moment from 'moment'
import api from '../../models/api'
import utils from '../../utils'

class MissiveEditForm extends React.Component {
    state = { uploading: false, hasReport: false }

    componentWillMount() {
        // api.Missive.RedTitleList(data => {
        //     this.setState({ redTitles: data })
        // })
    }


    handleSubmit = () => {
        this.refs.form.validateFields((err, values) => {
            if (err) {
                return false
            }
            let formData = values
            formData.RedTitleId = this.state.redTitleId || 0;
            const content = this.state.upload || formData.Content || {}
            if (!content.ID) {
                message.error("请上传公文内容文件")
                return false
            }
            formData.Content = content;
            formData.FW_RQ = formData.FW_RQ ? formData.FW_RQ.format() : ''
            formData.QX_RQ = formData.QX_RQ ? formData.QX_RQ.format('YYYY-MM-DD') : ''
            formData.NotReport = !this.state.hasReport;
            if (!formData.FormId) {
                message.error("缺少参数FormId")
                return false
            }
            api.Missive.Save(formData, json => {
                message.success('保存成功')
                utils.Redirect(`/missive/list/${this.props.formId}/?status=1`)
            });
        })
    }

    handleBeforeUpload = () => {
        this.setState({ uploading: true });
        return true;
    }

    handleUploadContent = ({ file, fileList }) => {
        switch (file.status) {
            case 'uploading':
                this.setState({ uploading: true })
                return;
            case 'done':
                this.setState({ uploading: false })
                if (!file || !file.response) return
                var response = file.response
                if (response.Message) {
                    message.error(response.Message)
                    return;
                }
                this.setState({ upload: response })
                break;
            default:
                this.setState({ uploading: false })
                break;
        }
    }

    handleDeleteContent = (contentId) => {
        if (this.props.disabled) {
            message.error('不能删除');
            return;
        }
        if (!confirm("你确定要删除吗？")) return false;
        let model = this.props.model || {}
        api.File.Delete(contentId, json => {
            model.Content = null;
            if (model.ContentId === contentId) {
                model.ContentId = 0
                api.Missive.DeleteContent(model.ID, () => {
                    this.setState({ upload: null, model })
                })
            } else {
                this.setState({ upload: null })
            }
        });
        //this.setState({})
        //需要更新missive，因为删除了content文件

    };

    handleSelectRedTitle = (value) => {
        var item = (this.state.redTitles || []).find(t => t.ID.toString() === value)
        this.setState({ wjzh: item.Name + ` 〔${new Date().getFullYear()}〕` })
    }

    getItems = () => {
        const formId = parseInt(this.props.formId, 10)

        const model = this.props.model || {}
        const content = this.state.upload || model.Content || {}
        const disabled = this.props.disabled

        let uploadControl = {
            name: 'Content',
            title: '文档正文',
            defaultValue: content,
            //getField: !content.ID,
            rules: [{ required: true }],
            tips: <span>点击预览没有反应？请<a href="/pageoffice/posetup.exe">下载安装PageOffice插件</a>。</span>,
            render: <span>
                <Upload.Dragger
                    action={api.File.UploadUrl(content.ID || 0, 0, 0, 'content', true)}
                    beforeUpload={this.handleBeforeUpload}
                    onChange={this.handleUploadContent}
                    name="content"
                    onRemove={this.handleDeleteFile}
                    withCredentials={true}
                    showUploadList={false}
                    accept=".doc,.docx,.pdf,.tiff,.tif,.jpg,.jpge,.png"
                    disabled={disabled}
                >
                    <div style={{ textAlign: 'left', padding: '0 10px' }}>
                        <Spin spinning={this.state.uploading}>
                            <p className="ant-upload-text">
                                <i className="fa fa-file-o"></i>
                                &nbsp;&nbsp; {content.ID ? content.FileName : '仅限Word、Pdf、Tiff、JPG文件格式'}
                            </p>
                        </Spin>
                    </div>
                </Upload.Dragger>
                {content.ID ?
                    <span style={{ fontSize: '1.2rem', fontWeight: 500 }}>
                        <a href={api.File.PreviewUrl(content.ID, disabled)} target={content.IsWordFile ? '' : '_blank'}>
                            <Icon type="eye" /> 预览</a>
                        &nbsp;&nbsp;&nbsp;&nbsp;
                        <a href={api.File.DownloadUrl(content.ID)} target="_blank">
                            <Icon type="download" />&nbsp;下载
                        </a>
                        {disabled ? null :

                            <span>
                                &nbsp;&nbsp;&nbsp;&nbsp;
                                <a onClick={e => this.handleDeleteContent(content.ID)}><Icon type="delete" />&nbsp;删除</a>
                            </span>
                        }
                    </span>
                    : null
                }
            </span>
        }

        let numberControl = {
            name: 'WJ_ZH', title: '文件字号', defaultValue: model.WJ_ZH,
            layout: { labelCol: { span: 3 }, wrapperCol: { span: 6 } },
            render: <AutoComplete
                dataSource={(this.state.redTitles || []).filter(t => t.FormId === formId).map(t => { return { value: t.ID, text: t.Name + `〔${new Date().getFullYear()}〕` } })}
                disabled={disabled}
                defaultActiveFirstOption={false}
                filterOption={(inputValue, option) => {
                    return this.state.redTitles.find(t => t.Name.indexOf(inputValue.replace(/〔\d+〕/g, '')) > -1)
                }}
                onSelect={value => this.setState({ redTitleId: value })}
                style={{ maxWidth: '200px' }}
            />,
        }
        let titleControl = {
            name: 'WJ_BT', title: '文件标题', defaultValue: model.WJ_BT, rules: [{ required: true, message: '请填写文件标题' }],
            render: <Input disabled={disabled} />
        }
        let mjControl = {
            name: 'WJ_MJ', title: '文件密级', defaultValue: (model.WJ_MJ || 0).toString(),
            render: <Radio.Group disabled={disabled} >
                <Radio.Button value='0'>普通</Radio.Button>
                <Radio.Button value='1'>保密</Radio.Button>
            </Radio.Group>
        }
        let qxControl = {
            name: 'QX_RQ', title: '办理期限', defaultValue: model.QX_RQ ? moment(model.QX_RQ) : null,
            render: <DatePicker placeholder="选择日期" disabled={disabled} />
        }

        let items = [
            { name: 'ID', defaultValue: model.ID || 0, render: <Input type="hidden" /> },
            { name: 'FormId', defaultValue: formId || 0, render: <Input type="hidden" /> },
            { name: 'ContentId', defaultValue: content.ID || 0, render: <Input type="hidden" /> },
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
                    layout: { labelCol: { span: 3 }, wrapperCol: { span: 4 } },
                    render: <Input disabled={disabled} />
                },
                uploadControl,
                {
                    name: 'JJ_DJ', title: '紧急程度', defaultValue: (model.JJ_DJ || 0).toString(),
                    render: <Radio.Group disabled={disabled} >
                        <Radio.Button value='0'>普通</Radio.Button>
                        <Radio.Button value='1'>紧急</Radio.Button>
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
                    render: <Input disabled={disabled} />
                },
                {
                    name: 'CS_JG', title: '抄送机关', defaultValue: model.CS_JG,
                    render: <Input disabled={disabled} />
                },
                {
                    title: '是否上报',
                    tips: "只有在公文流程完全结束之后才会上报，不选择则不上报",
                    render: <Checkbox
                        defaultChecked={model.NotReport === true ? false : true}
                        onChange={e => this.setState({ hasReport: e.target.checked })}
                        disabled={disabled}
                    >
                        上报市局OA系统
                        </Checkbox>
                }
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
            itemLayout={{ labelCol: { span: 3 }, wrapperCol: { span: 18 } }}
        />
    }
}

export default MissiveEditForm