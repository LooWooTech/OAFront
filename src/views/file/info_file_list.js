import React, { Component } from 'react'
import { Upload, Button, Table, Icon, message } from 'antd'
import moment from 'moment'
import api from '../../models/api'

class FileList extends Component {

    state = { loading: true, list: [] }

    componentWillMount() {
        this.loadData();
    }

    loadData = () => {
        const infoId = this.props.infoId || 0;
        const inline = this.props.inline;
        api.File.List(infoId, inline, json => this.setState({ list: json.List }))
    }
    handleUpload = ({ file }) => {
        if (file.status === 'done') {
            message.success('上传成功');
            this.loadData();
        }
    }

    handleDelete = item => {
        if (!confirm('确定要删除该文件吗？')) return false;
        api.File.Delete(item.ID, this.loadData);
    }

    render() {
        const infoId = this.props.infoId || 0;
        const canEdit = this.props.canEdit || false;
        return (
            <div style={{ margin: '10px' }}>
                {canEdit ?
                    <Upload
                        showUploadList={false}
                        onChange={this.handleUpload}
                        action={api.File.UploadUrl(0, infoId, 0, 'file1')}
                        name="file1"
                        withCredentials={true}
                    >
                        <Button type="submit" icon="upload">上传</Button>
                    </Upload>
                    : null}
                <Table
                    rowKey="ID"
                    dataSource={this.state.list}
                    columns={[
                        { title: '文件名', dataIndex: 'FileName' },
                        { title: '文件大小', dataIndex: 'DisplaySize', width: 100 },
                        { title: '上传时间', width: 200, render: (text, item) => moment(item.CreateTime).format('l') },
                        {
                            title: '操作', width: 240,
                            render: (text, item) => {

                                let showPreviewButton = ".pdf,.jpg,.jpge,.tiff,.tif,.doc,.docx,.mp4,.epub".indexOf(item.FileExt.toLowerCase()) > -1;

                                return <span>
                                    {showPreviewButton ?
                                        <span>
                                            <a href={api.File.PreviewUrl(item.ID)} target={item.IsWordFile ? '' : '_blank'}><Icon type="eye" />预览</a>
                                            &nbsp;&nbsp;
                                        </span>
                                        : null}
                                    <a href={api.File.DownloadUrl(item.ID)}><Icon type="download" />下载</a>
                                    &nbsp;
                                {canEdit ?
                                        <Button type="danger" onClick={() => this.handleDelete(item)}>
                                            <Icon type="delete" />
                                        </Button>
                                        : null}

                                </span>
                            }
                        }
                    ]}
                    pagination={false}
                />
            </div>
        )
    }
}

export default FileList