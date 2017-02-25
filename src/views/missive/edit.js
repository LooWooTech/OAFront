import React, { Component } from 'react';
import { Link } from 'react-router';
import { Menu, Form, Segment, Input, Table, Icon } from 'semantic-ui-react';
import api from '../../models/api';
import utils from '../../utils'

export default class MissiveEdit extends Component {
    state = { activeItem: 'info', model: {} }

    handleItemClick = (e, { name }) => this.setState({ activeItem: name })

    render() {
        const { activeItem, model } = this.state
        return <Form>
            <div className="toolbar">
                <Menu secondary>
                    <Menu.Item>
                        <Link to="/missive/save" className="ui primary button"><i className="fa fa-save"></i> 保存</Link>
                       &nbsp; <Link to={`/flow/submit?infoId=${model.ID}`} className="ui green button"><i className="fa fa-check"></i> 提交</Link>
                       &nbsp; <a href="javascript:history.back()" className="ui button"><i className="fa fa-undo"></i> 取消</a>
                    </Menu.Item>
                </Menu>
            </div >
            <div>
                <Menu attached='top' tabular>
                    <Menu.Item name='info' active={activeItem === 'info'} onClick={this.handleItemClick}>基本信息</Menu.Item>
                    <Menu.Item name='docs' active={activeItem === 'docs'} onClick={this.handleItemClick}>拟稿文档</Menu.Item>
                    <Menu.Item name='flow' active={activeItem === 'flow'} onClick={this.handleItemClick}>审批流程</Menu.Item>
                    <Menu.Item name='result' active={activeItem === 'result'} onClick={this.handleItemClick} >成果预览</Menu.Item>
                </Menu>
                <Segment attached='bottom'  >
                    info
                </Segment>
            </div>
        </Form>;
    }
}