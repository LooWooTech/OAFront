import React, { Component } from 'react';
import { Row, Col } from 'antd';
import moment from 'moment';
import { SiteName } from '../../models/config';

class ResultTab extends Component {

    getFreeFlowDataRender = freeFlowData => {
        if (!freeFlowData) {
            return null
        }
        return <div className="freeflow">
            <div className="title">传阅批示：</div>
            {freeFlowData.Nodes.map(data => data.UpdateTime ? <div key={data.ID}>
                <div className="header">
                    <span className="signature">{data.Signature}</span>
                    <span className="datetime">{moment(data.UpdateTime || data.CreateTime).format('lll')}</span>
                </div>
                <div className="content">{data.Content}</div>
            </div> : <span></span>)}
        </div>
    }

    getNodeDataRender = (name, title) => {
        const flowData = this.props.flowData || {};
        const nodes = (flowData.Nodes || []).sort((a, b) => a.ID - b.ID);
        const data = nodes.find(e => e.FlowNodeName.startsWith(name)) || {};
        return <div className="flownode">
            <div className="title">{title || name}：</div>
            <div className="content">
                {data.Content ? data.Content.replace(/\n/g, '<br />') : data.UpdateTime ? '同意' : ''}
            </div>
            <div className="bottom">
                <span className="signature">{data.Signature}</span>
                <span className="datetime">{data.UserId ? moment(data.UpdateTime || data.CreateTime).format('YYYY年MM月DD日') : ''}</span>
            </div>
            {this.getFreeFlowDataRender(data.FreeFlowData)}
        </div>
    };

    getZWGKRender = () => ['主动公开', '依申请公开', '不公开'].map((text, key) => <span key={key}>{(this.props.missive.ZW_GK === (key + 1) ? '√' : '□') + text}&nbsp;&nbsp;&nbsp;&nbsp;</span>);


    render() {
        const model = this.props.missive
        const flowData = this.props.flowData || {};
        return (
            <div className="missive_result">
                <h1>{SiteName}发文拟稿纸
                <span>发文字号：{model.WH}  号</span>
                </h1>
                <div className="table">
                    <Row>
                        {this.getNodeDataRender(flowData.Nodes.find(e => e.FlowNodeName === '局长签发') ? '局长签发' : '分管领导', '签发')}
                    </Row>
                    <Row>
                        {this.getNodeDataRender('分管领导')}
                    </Row>
                    <Row>
                        <Col span={11}>
                            {this.getNodeDataRender('办公室')}
                        </Col>
                        <Col span={13}>
                            {this.getNodeDataRender('科室负责人')}
                        </Col>
                    </Row>
                    <Row>
                        {this.getNodeDataRender('拟稿人')}
                    </Row>
                    <Row style={{ padding: '10px' }}>
                        政务公开： {this.getZWGKRender()}
                    </Row>
                    <Row style={{ padding: '10px' }}>
                        是否公开发布（{model.GKFB === true ? "√是、否" : model.GKFB === false ? "是、√否" : "是、否"}）
                    </Row>
                    <Row style={{ padding: '10px' }}>
                        <Col span={6}>
                            密级：{model.MJ === 0 ? '无' : '保密'}
                        </Col>
                        <Col span={10}>
                            期限：{model.QX_RQ ? moment(model.QX_RQ).format('l') : ''}
                        </Col>
                        <Col span={6}>
                            责任人：{model.ZRR}
                        </Col>
                    </Row>
                    <Row style={{ padding: '10px' }}>
                        文件标题：{model.WJ_BT}
                    </Row>
                    <Row style={{ padding: '10px' }}>
                        主题词：{model.ZTC}
                    </Row>
                    <Row style={{ padding: '10px' }}>
                        主送机关：{model.ZS_JG}
                    </Row>
                    <Row style={{ padding: '10px' }}>
                        抄送机关：{model.CS_JG}
                    </Row>

                </div>
            </div>
        )
    }
}

export default ResultTab