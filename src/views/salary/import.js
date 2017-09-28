import React, { Component } from 'react';
import { Input, AutoComplete, Upload, Button, Icon, message } from 'antd'
import Form from '../shared/_form'
import api from '../../models/api'
import utils from '../../utils'
class ImportSalary extends Component {

    state = { files: [] }

    handleSubmit = (data) => {
        this.refs.form.validateFields((err, values) => {
            if (err) {
                console.log(err);
                return false;
            }
            let data = values;
            data.files = this.state.files.map(file => file.AbsolutelyPath)
            api.Salary.Import(data, json => {
                message.success("导入完毕");
                utils.ReloadPage()
            })
        })
    }

    handleUpload = info => {
        let files = info.fileList.map(file => file.response)
        console.log(files)
        this.setState({ files })
    }

    render() {
        return (
            <div>
                <div className="toolbar">
                    <h3>导入工资单</h3>
                    <a href="/templates/salary_templates.zip" target="_blank">下载导入模板</a>
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
                            title: '月份', name: 'Month', defaultValue: new Date().getMonth().toString(),
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
                            >
                                <Button>
                                    <Icon type="upload" /> 点击上传Excel
                                </Button>
                            </Upload>
                        }
                    ]}
                    buttons={[
                        <Button icon="import" type="primary" onClick={this.handleSubmit}>导入</Button>
                    ]}
                />
            </div>
        );
    }
}

export default ImportSalary;