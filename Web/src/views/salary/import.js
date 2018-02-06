import React, { Component } from 'react';
import { Input, Upload, Button, Icon, message, Alert, Tag } from 'antd'
import Form from '../shared/_form'
import api from '../../models/api'
class ImportSalary extends Component {

    state = { file: null, failRows: [] }

    handleSubmit = (data) => {
        this.refs.form.validateFields((err, values) => {
            if (err) {
                return false;
            }
            let data = values;
            data.file = this.state.file.response.PhysicalPath
            api.Salary.Import(data, json => {
                message.success("导入完毕");
                this.setState({ failRows: json, file: null })
                this.refs.uploader.setState({ file: null })
            })
        })
    }

    handleUpload = ({ file, fileList }) => {
        if (file.status === 'done') {
            this.setState({ file })
        }
    }

    handleDeleteFile = () => {
        this.setState({ file: null })
    }

    getItems = () => {
        const items = [{
            title: '年份', name: 'Year', defaultValue: new Date().getFullYear(),
            rules: [{ required: true, message: '请填年份' }],
            render: <Input />
        }];
        if (this.state.file) {
            items.push({
                title: '工资单',
                render: <Tag onClose={this.handleDeleteFile} closable={true}>{this.state.file.response.FileName}</Tag>
            })
        } else {
            items.push({
                title: '工资单',
                tips: '选择Excel文件',
                render: <Upload
                    action={api.Salary.ImportUrl()}
                    withCredentials={true}
                    accept=".xls,.xlsx"
                    onChange={this.handleUpload}
                    ref="uploader"
                    multiple={false}
                    showUploadList={false}
                >
                    <Button>
                        <Icon type="upload" /> 点击上传Excel
                    </Button>
                </Upload>,
            })
        }
        items.push({
            title: '工资单名称',
            tips: '建议名称包含年份和月份',
            name: 'Title',
            defaultValue: this.state.file ? this.state.file.response.FileName : '',
            render: <Input type="text" />
        });

        if (this.state.failRows.length > 0) {
            items.push({
                title: '导入结果',
                render: <Alert style={{ margin: '10px', width: '400px' }}
                    type="error"
                    message="导入失败"
                    description={this.state.failRows.map((row) => <p key={row}>
                        第{row}行 导入失败
                    </p>)}
                />
            })
        }

        return items;
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
                    children={this.getItems()}
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