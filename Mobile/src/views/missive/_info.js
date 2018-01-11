import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Input, Label } from 'native-base'
import Detail from '../shared/Detail'
import { FORMS } from '../../common/config'
import moment from 'moment'

class MissiveDetail extends Component {

    getItems = () => {
        const data = this.props.data
        const content = data.Content || {}
        let items = [
            { name: 'ID', defaultValue: data.ID || 0, type: 'hidden' },
            { name: 'FormId', defaultValue: this.props.formId || 0, type: 'hidden' },
            { name: 'ContentId', defaultValue: content.ID || 0, type: 'hidden' },
        ];
        const uploadControl = { name: 'Content', title: '文档正文', defaultValue: content, type: 'file', }
        const numberControl = { name: 'WJ_ZH', title: '文件字号', defaultValue: data.WJ_ZH, }
        const titleControl = { name: 'WJ_BT', title: '文件标题', defaultValue: data.WJ_BT, }
        const mjControl = { name: 'WJ_MJ', title: '是否保密', defaultValue: data.WJ_MJ > 0, type: 'switch', }
        const qxControl = { name: 'QX_RQ', title: '办理期限', placeholder: "选择日期", defaultValue: data.QX_RQ, type: 'date' }

        //如果是收文
        if (this.props.formId === FORMS.ReceiveMissive.ID) {
            items = items.concat([
                numberControl,
                { name: 'WJ_LY', title: '来文单位', defaultValue: data.WJ_LY, },
                titleControl,
                { name: 'JB_RQ', title: '交办日期', defaultValue: data.JB_RQ, type: 'date' },
                qxControl,
                { name: 'DJR', title: '登记人', defaultValue: data.DJR, },
                uploadControl,
                { name: 'JJ_DJ', title: '是否紧急', defaultValue: data.JJ_DJ > 1, type: 'switch' },
            ])
        } else {
            items = items.concat([
                uploadControl,
                numberControl,
                titleControl,
                mjControl,
                { name: 'FW_RQ', title: '发文日期', defaultValue: data.FW_RQ, type: 'date' },
                {
                    name: 'ZW_GK', title: '政务公开', defaultValue: data.ZW_GK || 1, type: 'select',
                    options: [
                        { text: '主动公开', value: 1 },
                        { text: '依申请公开', value: 2 },
                        { text: '不公开', value: 3 }
                    ]
                },
                { name: 'GK_FB', title: '公开发布', defaultValue: data.GK_FB > 0, type: 'switch' },
                qxControl,
                { name: 'ZS_JG', title: '主送机关', defaultValue: data.ZS_JG, },
                { name: 'CS_JG', title: '抄送机关', defaultValue: data.CS_JG, },
                { title: '是否上报', defaultValue: !data.NotReport, type: 'switch' }
            ])
        }
        return items;
    }

    render() {
        const data = this.props.data
        if (!data) return null
        return (
            <Detail formId={this.props.formId} items={this.getItems()} disabled={true} />
        );
    }
}
MissiveDetail.propTypes = {
    formId: PropTypes.number.isRequired,
    data: PropTypes.object.isRequired,
};

export default MissiveDetail;