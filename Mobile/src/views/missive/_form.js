import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Input, Label } from 'native-base'
import Form from '../shared/Form'
import { FORMS } from '../../common/config'
import moment from 'moment'

class MissiveForm extends Component {

    getItems = () => {
        const model = this.props.model
        const content = model.Content || {}
        let items = [
            { name: 'ID', defaultValue: model.ID || 0, type: 'hidden' },
            { name: 'FormId', defaultValue: this.props.formId || 0, type: 'hidden' },
            { name: 'ContentId', defaultValue: content.ID || 0, type: 'hidden' },
        ];
        const uploadControl = { name: 'Content', title: '文档正文', defaultValue: content, type: 'file', }
        const numberControl = { name: 'WJ_ZH', title: '文件字号', defaultValue: model.WJ_ZH, }
        const titleControl = { name: 'WJ_BT', title: '文件标题', defaultValue: model.WJ_BT, }
        const mjControl = { name: 'WJ_MJ', title: '是否保密', defaultValue: model.WJ_MJ > 0, type: 'switch', }
        const qxControl = { name: 'QX_RQ', title: '办理期限', placeholder: "选择日期", defaultValue: model.QX_RQ ? moment(model.QX_RQ).format('ll') : null, type: 'date' }

        //如果是收文
        if (this.props.formId === FORMS.ReceiveMissive.ID) {
            items = items.concat([
                numberControl,
                { name: 'WJ_LY', title: '来文单位', defaultValue: model.WJ_LY, },
                titleControl,
                { name: 'JB_RQ', title: '交办日期', defaultValue: model.JB_RQ ? moment(model.JB_RQ).format('ll') : null, type: 'date' },
                qxControl,
                { name: 'DJR', title: '登记人', defaultValue: model.DJR, },
                uploadControl,
                { name: 'JJ_DJ', title: '是否紧急', defaultValue: model.JJ_DJ > 1, type: 'switch' },
            ])
        } else {
            items = items.concat([
                uploadControl,
                numberControl,
                titleControl,
                mjControl,
                { name: 'FW_RQ', title: '发文日期', defaultValue: model.FW_RQ ? moment(model.FW_RQ).format('ll') : null, type: 'date' },
                {
                    name: 'ZW_GK', title: '政务公开', defaultValue: model.ZW_GK || 1, type: 'select',
                    options: [
                        { text: '主动公开', value: 1 },
                        { text: '依申请公开', value: 2 },
                        { text: '不公开', value: 3 }
                    ]
                },
                { name: 'GK_FB', title: '公开发布', defaultValue: model.GK_FB > 0, type: 'switch' },
                qxControl,
                { name: 'ZS_JG', title: '主送机关', defaultValue: model.ZS_JG, },
                { name: 'CS_JG', title: '抄送机关', defaultValue: model.CS_JG, },
                { title: '是否上报', defaultValue: !model.NotReport, type: 'switch' }
            ])
        }
        console.log(items)
        return items;
    }

    render() {
        const model = this.props.model
        if (!model) return null
        return (
            <Form formId={this.props.formId} items={this.getItems()} disabled={true} />
        );
    }
}

MissiveForm.propTypes = {
    formId: PropTypes.number.isRequired,
    model: PropTypes.object.isRequired,
};

export default MissiveForm;