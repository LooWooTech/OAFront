import React from 'react';
import { Input, DatePicker } from 'antd';
import FormModal from '../shared/_formmodal';
import moment from 'moment';
import api from '../../models/api';

export default class HolidayFormModal extends React.Component {
    state = {}

    handleSubmit = (data) => {
        //如果不format，则用的是0区时间
        data.BeginDate = data.BeginDate.format();
        data.EndDate = data.EndDate.format();
        api.Holiday.Save(data, json => {
            this.props.onSubmit()
        });
    }

    render() {
        const record = this.props.record || {};
        const dateFormat = 'YYYY-MM-DD';
        const beginDate = record.BeginDate ? moment(record.BeginDate, dateFormat) : moment();
        const endDate = record.EndDate ? moment(record.EndDate, dateFormat) : moment();
        return (
            <FormModal
                title={record.ID > 0 ? '修改节假日' : '添加节假日'}
                trigger={this.props.trigger}
                onSubmit={this.handleSubmit}
                children={[
                    { name: 'ID', defaultValue: record.ID || 0, render: <Input type="hidden" /> },
                    { title: '节假日名称', name: 'Name', defaultValue: record.Name, render: <Input /> },
                    { title: '开始日期', name: 'BeginDate', defaultValue: beginDate, render: <DatePicker  placeholder="选择日期" /> },
                    { title: '结束日期', name: 'EndDate', defaultValue: endDate, render: <DatePicker placeholder="选择日期" /> },
                    //{ title: '备注', name: 'Note', defaultValue: record.Note, render: <Input type="textarea" autosize={{ minRows: 2, maxRows: 6 }} /> }
                ]}
            />
        );
    }
}
