import React, { Component } from 'react';
import { Input, AutoComplete, Upload, Button, Icon, message, Alert, Tag } from 'antd'
import Form from '../shared/_form'
import api from '../../models/api'
class ImportSalary extends Component {

    state = { fails: [], files: [] }

    handleSubmit = (data) => {
        this.refs.form.validateFields((err, values) => {
            if (err) {
                return false;
            }
            let data = values;
            data.files = this.state.files.map(file => file.response.AbsolutelyPath)
            api.Salary.Import(data, json => {
                message.success("导入完毕");
                const fails = json.map(err => {
                    const file = this.state.files.find(f => f.response.SaveName === err.fileName);
                    return { "file": file.response.FileName, rows: err.failRows }
                })
                this.setState({ fails, files: [] })
                this.refs.uploader.setState({ fileList: [] })
            })
        })
    }

    handleUpload = ({ file, fileList }) => {
        if (file.status === 'done') {
            this.setState({ files: fileList })
        }
    }

    render() {
        return (
            <div>
                <div className="toolbar">
                    <h3>导入工资单</h3>
                </div>
                <Form
                    ref="form"
                    onSubmit={this.handleSubmit}
                    itemLayout={{ labelCol: { span: 6 }, wrapperCol: { span: 6 } }}
                    children={[
                        {
                            title: '年份', name: 'Year', defaultValue: new Date().getFullYear(),
                            rules: [{ required: true, message: '请填年份' }],
                            render: <Input />
                        },
                        {
                            title: '月份', name: 'Month', defaultValue: (new Date().getMonth() + 1).toString(),
                            rules: [{ required: true, message: '请填写月份' }],
                            render: <AutoComplete dataSource={['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']} />
                        },
                        {
                            title: '工资单',
                            tips: '每种类型选择一份Excel文件',
                            render: <Upload
                                action={api.Salary.ImportUrl()}
                                withCredentials={true}
                                accept=".xls,.xlsx"
                                onChange={this.handleUpload}
                                ref="uploader"
                            >
                                <Button>
                                    <Icon type="upload" /> 点击上传Excel
                                </Button>
                            </Upload>,
                        },
                        {
                            title: this.state.fails.length > 0 ? '导入结果' : null,
                            render: this.state.fails.length > 0 ? (

                                <Alert style={{ margin: '10px', width: '400px' }}
                                    type="error"
                                    message="导入失败"
                                    description={this.state.fails.map((e, i) => <p key={i}>
                                        {e.file} <br />
                                        第{e.rows.join('，')}行 导入失败
                                </p>)}
                                />
                            ) : ''
                        }
                    ]}
                    buttons={[
                        <Button icon="import" type="primary" onClick={this.handleSubmit}>导入</Button>,
                        <a className="btn" href="/templates/salary_templates.zip" target="_blank">下载导入模板</a>
                    ]}
                />

            </div>
        );
    }
}

export default ImportSalary;