import React, { Component } from 'react';
import { Link } from 'react-router';
import { Menu, Input, Table, Icon } from 'semantic-ui-react';
import Pagination from '../shared/_pagination';
import api from '../../models/api';


export default class MissiveIndex extends Component {
    state = {
        page: parseInt(this.props.location.query.page || '1', 10),
        searchKey: '',
        status: null,
        data: []
    };
    loadData = page => {
        api.Missive.SendList(this, {
            page: page || parseInt(this.props.location.query.page || '1', 10),
            searchKey: this.state.searchKey,
            status: this.state.status,
        }, data => {
            this.setState(data, data);
        }, err => {
            console.log(err)
        })
    };

    componentDidMount() {
        this.loadData();
    }

    handleSearchClick = () => {
        this.loadData();
    };

    handleSearchKeyChange = (e, { value }) => {
        this.setState({ searchKey: value })
    };

    handlePageChange = page => {
        this.loadData(page);
    };

    render() {
        return (
            <div>
                <div className="toolbar">
                    <Menu secondary>
                        <Menu.Item>
                            <Link to="/document/edit" className="ui primary button"><i className="fa fa-file-o"></i> 新建公文</Link>
                        </Menu.Item>
                        <Menu.Item>
                            <Link to="/document/export" className="ui danger button"><i className="fa fa-share-square-o"></i> 导出公文</Link>
                        </Menu.Item>
                        <Menu.Menu position="right">
                            <Menu.Item>
                                <Input placeholder='文号、标题..' value={this.state.searchKey}
                                    onChange={this.handleSearchKeyChange}
                                    icon={<Icon name='search' inverted circular link onClick={this.handleSearchClick} />} />
                            </Menu.Item>
                        </Menu.Menu>
                    </Menu>
                </div >
                <div className="list">
                    <Table celled>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell width='2'>文号</Table.HeaderCell>
                                <Table.HeaderCell width='3'>标题</Table.HeaderCell>
                                <Table.HeaderCell width='1'>密级</Table.HeaderCell>
                                <Table.HeaderCell width='2'>种类</Table.HeaderCell>
                                <Table.HeaderCell width='2'>机关部门</Table.HeaderCell>
                                <Table.HeaderCell width='2'>发往单位</Table.HeaderCell>
                                <Table.HeaderCell width='2'>审批流程</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>

                        <Table.Body>
                            {this.state.data.map((item, key) =>
                                <Table.Row>
                                    <Table.Cell>{item.Number}</Table.Cell>
                                    <Table.Cell><Link to={`/messive/edit?id=${item.Title}`}>{item.Title}</Link></Table.Cell>
                                    <Table.Cell>{item.ConfidentialLevel}</Table.Cell>
                                    <Table.Cell>{item.Category.Name}</Table.Cell>
                                    <Table.Cell>{item.BornOrgan.Name}</Table.Cell>
                                    <Table.Cell>{item.ToOrgan.Name}</Table.Cell>
                                    <Table.Cell>{item.FlowNode.Name}</Table.Cell>
                                </Table.Row>
                            )}
                        </Table.Body>
                    </Table>
                    <Pagination pageCount='30' onClick={this.handlePageChange} />
                </div>
            </div >
        )
    }
}
