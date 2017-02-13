import React from 'react'
export default React.createClass({
    render() {
        return (
        <div>
            <div id="sider"></div>
            <div id="main">
                {this.props.children}
            </div>
        </div>
        )
    }
});
