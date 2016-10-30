var React = require('react');
var rB = require('react-bootstrap');
var cE = React.createElement;

var PresentationsTable = {
    oldMap: null,

    shouldComponentUpdate: function(nextProps, nextState) {
        var newMap = nextProps.presentations;
        return (this.oldMap !== newMap);
    },

    render: function() {
        this.oldMap = this.props.presentations;
        var presentations = (this.oldMap && this.oldMap.toObject()) || {};

        var keys = Object.keys(presentations).sort().filter(function(x) {
            return (x.indexOf('__ca_') !== 0);
        });
        return cE(rB.Table, {striped: true, responsive: true, bordered: true,
                             condensed: true, hover: true},
                  cE('thead', {key:0},
                     cE('tr', {key:1},
                        cE('th', {key:2}, 'Name'),
                        cE('th', {key:3}, 'URL')
                       )
                    ),
                  cE('tbody', {key:8}, keys.map(function(x, i) {
                      return cE('tr', {key:10*i +1000},
                                cE('td', {key:10*i+1001}, x),
                                cE('td', {key:10*i+1002}, presentations[x])
                               );
                  }))
                 );
    }
};


module.exports = React.createClass(PresentationsTable);
