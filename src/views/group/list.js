import React from 'react';
import { Affix, Table, Button } from 'antd';
import EditModal from './edit';
import api from '../../models/api';


export default class Groups extends React.Component {
    state = { list: [] };

    componentDidMount() {
        api.Group.List(this, data => {
            this.setState({ list: data })
        });
    };

    onEditSave = () => {
        api.Group.List(this, data => {
            this.setState({ list: data })
        });
    };

    render() {
        return <div>
            <Affix offsetTop={0} className="toolbar">
                <Button.Group>
                    <EditModal children={<Button type="primary" icon="file">新建分组</Button>} onOk={this.onEditSave} />
                </Button.Group>
            </Affix>
            <Table
                rowKey="ID"
                loading={this.state.loading}
                columns={[
                    { title: '分组名称', dataIndex: 'Name' },
                    {
                        title: '操作', dataIndex: 'ID',
                        render: (text, item) => <EditModal onOk={this.onEditSave} record={item} children={<Button icon="edit">编辑</Button>} />
                    }
                ]}
                dataSource={this.state.list}
            >
            </Table>
        </div>;
    }
}