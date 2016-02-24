import React from 'react';

let Layout = React.createClass({
  render() {

    return (
      <div>
        <div id="content">
            {this.props.children}
        </div>
      </div>
    );
  }
});

module.exports = Layout;