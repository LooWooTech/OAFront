import React, { Component } from 'react';
import { Row, Col } from 'antd';
import moment from 'moment';

class ResultTab extends Component {
    render() {
        const model = this.props.data;
        const flowData = model.FlowData || {};
        const nodes = (flowData.Nodes || []).sort((a, b) => a.ID > b.ID);
        const GetNodeData = name => {
            var data = nodes.find(e => e.FlowNodeName.startsWith(name)) || {};
            return <div className="flownode">
                <div className="title">{name}：</div>
                <div className="content">
                    {data.Content ? data.Content.replace(/\n/g, '<br />') : ''}
                </div>
                <div className="bottom">
                    <span className="signature">{data.Signature}</span>
                    <span className="datetime">{data.UpdateTime ? moment(data.UpdateTime).format('YYYY年MM月DD日') : '年 月 日'}</span>
                </div>
            </div>
        };
        const getZWGK = name => model.Data.ZW_GK === name ? '√' : '□' + name;
        return (
            <div className="missive_result">
                <h1>舟山市国土资源局定海分局发文拟稿纸
                <span>发文字号：{model.Data.GW_WH}  号</span>
                </h1>
                <div className="table">
                    <Row>
                        {GetNodeData('签发')}
                    </Row>
                    <Row>
                        {GetNodeData('分管领导审核')}
                    </Row>
                    <Row>
                        <Col span={11}>
                            {GetNodeData('办公室审核')}
                        </Col>
                        <Col span={13}>
                            {GetNodeData('科室负责人审核')}
                        </Col>
                    </Row>
                    <Row>
                        {GetNodeData('拟稿人')}
                    </Row>
                    <Row>
                        政务公开： {getZWGK('主动公开')} {getZWGK('依申请公开')} {getZWGK('不公开')}
                    </Row>
                    <Row>
                        是否互联网发布（{model.Data.HLW_FB === true ? "√是、否" : model.Data.HLW_FB === false ? "是、√否" : "是、否"}）
                    </Row>
                    <Row>
                        <Col span={6}>
                            密级：{model.Data.GW_MJ}
                        </Col>
                        <Col span={10}>
                            期限：{model.Data.QX_RQ?moment(model.Data.QX_RQ).format('l'):''}
                        </Col>
                        <Col span={6}>
                            责任人：{model.Data.ZRR}
                        </Col>
                    </Row>
                    <Row>
                        <div>文件标题：</div>
                        <div>{model.Data.WJ_BT}</div>
                    </Row>
                    <Row>
                        主题词：{model.Data.GW_ZTC}
                    </Row>
                    <Row>
                        主送机关：{model.Data.ZS_JG}
                    </Row>
                    <Row>
                        抄送机关：{model.Data.GW_ZTC}
                    </Row>
                    
                </div>
            </div>
        )
    }
}

export default ResultTab