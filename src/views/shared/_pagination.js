import React from 'react'
import { Link } from 'react-router'

const pageIndexRegex = /page=\d+/ig;
const getPageUrl = (pageIndex, url) => {
    //把当前url的page参数去掉，换成pageIndex
    var toUrl = (url || '').toString().replace(pageIndexRegex, '');
    if (toUrl.indexOf('?') === -1) {
        toUrl = toUrl + '?';
    }
    return toUrl + "&page=" + pageIndex;
}

export default class Pagination extends React.Component {

    static contextTypes = {
        router: React.PropTypes.object
    }

    render() {
        let currentPage = parseInt(this.context.router.location.query.page || '1');
        let pathname = this.context.router.location.pathname;

        const getLink = (pageIndex, text) =>
            <Link
                key={Math.random()}
                to={getPageUrl(pageIndex, pathname)}
                className="item"
                activeClassName="active"
                onClick={() => this.props.onClick ? this.props.onClick(pageIndex) : false}
            >{text || pageIndex}</Link>;

        let pageCount = parseInt(this.props.pageCount || '1');
        let pageSize = parseInt(this.props.rows || '20');
        let listSize = parseInt(this.props.pageSize || '5');

        let startIndex = currentPage - currentPage % listSize + 1;
        if (currentPage % listSize === 0) {
            startIndex -= listSize;
        }
        let endIndex = startIndex + listSize - 1;
        endIndex = endIndex >= pageCount ? pageCount : endIndex;
        var pageList = [];
        for (var i = startIndex; i <= endIndex; i++) {
            if (i === currentPage) {
                pageList.push(<a key='currentpage' className="active item">{i}</a>);
            }
            else {
                pageList.push(getLink(i));
            }
        }

        const firstPage = (pageCount <= 1 || currentPage <= listSize) ? '' : getLink(1, '首页');
        const lastPage = pageCount < currentPage + listSize ? '' : getLink(pageCount, '尾页');
        const prevPage = currentPage <= listSize ? '' : getLink(currentPage - 1, '上一页');
        const nextPage = currentPage > pageCount - 1 ? '' : getLink(currentPage + 1, '下一页');
        const prevList = startIndex / listSize > 1 ? getLink(startIndex - listSize, '...') : '';
        const nextList = endIndex + 1 < pageCount ? getLink(endIndex + 1, '...') : '';

        if (pageCount > 1) {
            return <div className="ui pagination menu">
                {firstPage}
                {prevPage}
                {prevList}
                {pageList}
                {nextList}
                {nextPage}
                {lastPage}
            </div>;
        } else {
            return <span></span>;
        }
    }
}