import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer, inject } from 'mobx-react'
import { List, ListItem, View, Text, Icon } from 'native-base'
import ListRow from '../shared/ListRow'
import ListEmptyComponent from '../shared/ListEmptyComponent'

@inject('stores')
@observer
class FileList extends Component {

    componentWillMount() {
        this.loadData()
    }

    loadData = () => {
        const infoId = this.props.infoId
        this.props.stores.fileStore.getList(infoId)
    }

    render() {
        const list = this.props.stores.fileStore.list
        return (
            <List>
                {list.length > 0 ? list.map(item => {
                    let iconName = 'file-archive-o'
                    if (item.FileName.indexOf('.doc') > 0) {
                        iconName = 'file-word-o'
                    } else if (item.FileName.indexOf('.xsl') > 0) {
                        iconName = 'file-excel-o'
                    } else if (item.FileName.indexOf('.pdf') > 0) {
                        iconName = 'file-pdf-o'
                    }
                    return (
                        <ListRow
                            key={item.ID}
                            left={<Icon name={iconName} />}
                            title={item.FileName}
                            subTitle={item.DisplaySize}
                        />
                    )
                }) : <ListItem style={{ alignItems: 'center', justifyContent: 'center' }}>
                        <ListEmptyComponent icon="files-o" text="没有相关附件" />
                    </ListItem>}
            </List>
        );
    }
}
FileList.propTypes = {
    infoId: PropTypes.number.isRequired
}
export default FileList;