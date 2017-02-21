import React from 'react';
import { Link } from 'react-router';
import { Menu, Input, Table, Icon } from 'semantic-ui-react';

export default class DocumentIndex extends React.Component {
    render() {
        return (
            <div>
                <div className="toolbar">
                    <Menu secondary>
                        <Menu.Item>
                            <Link to="/document/edit" className="btn btn-sm btn-primary"><i className="fa fa-file-o"></i> 新建公文</Link>
                        </Menu.Item>
                        <Menu.Item>
                            <Link to="/document/export" className="btn btn-sm btn-danger"><i className="fa fa-share-square-o"></i> 导出公文</Link>
                        </Menu.Item>
                        <Menu.Menu position="right">
                            <Menu.Item>
                                <Input icon='search' placeholder='标题' />
                            </Menu.Item>
                        </Menu.Menu>
                    </Menu>
                </div >
                <div className="list">
                    <Table celled>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell width='2'>标题</Table.HeaderCell>
                                <Table.HeaderCell width='2'></Table.HeaderCell>
                                <Table.HeaderCell>Notes</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>

                        <Table.Body>
                            <Table.Row disabled>
                                <Table.Cell>Jamie</Table.Cell>
                                <Table.Cell>Approved</Table.Cell>
                                <Table.Cell>Requires call</Table.Cell>
                            </Table.Row>
                            <Table.Row>
                                <Table.Cell>John</Table.Cell>
                                <Table.Cell>Selected</Table.Cell>
                                <Table.Cell>None</Table.Cell>
                            </Table.Row>
                            <Table.Row>
                                <Table.Cell>Jamie</Table.Cell>
                                <Table.Cell>Approved</Table.Cell>
                                <Table.Cell>Requires call</Table.Cell>
                            </Table.Row>
                            <Table.Row>
                                <Table.Cell disabled>Jill</Table.Cell>
                                <Table.Cell>Approved</Table.Cell>
                                <Table.Cell>None</Table.Cell>
                            </Table.Row>
                        </Table.Body>
                        <Table.Footer>
                            <Table.Row>
                                <Table.HeaderCell colSpan='3'>
                                    <Menu floated='right' pagination>
                                        <Menu.Item as='a' icon>
                                            <Icon name='left chevron' />
                                        </Menu.Item>
                                        <Menu.Item as='a'>1</Menu.Item>
                                        <Menu.Item as='a'>2</Menu.Item>
                                        <Menu.Item as='a'>3</Menu.Item>
                                        <Menu.Item as='a'>4</Menu.Item>
                                        <Menu.Item as='a' icon>
                                            <Icon name='right chevron' />
                                        </Menu.Item>
                                    </Menu>
                                </Table.HeaderCell>
                            </Table.Row>
                        </Table.Footer>
                    </Table>
                </div>
            </div >
        )
    }
}
