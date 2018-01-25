var React = require('react');
var rB = require('react-bootstrap');
var cE = React.createElement;
var rC = require('recharts');
var AppActions = require('../actions/AppActions');


/*
 * data input type is Array.<{mean: number, ci: number}>
 *
 * output type is:
 *  Array.<{slide:number, base: number, ci: number, mean: number}>
 * where 'base' is  max(mean -ci, 0) and new ci is max(mean +ci -base, 0)
 */
var processData = function(data) {
    return data
        .filter(function(x) { return !!x;})
        .map(function(x, i) {
            var result = {slide: i};
            var mean = (((typeof x.mean === 'number') && !isNaN(x.mean)) ?
                        x.mean : 0.0);
            var ci = (((typeof x.ci === 'number') && !isNaN(x.ci)) ?
                      x.ci : 0.0);
            result.base = Math.max(mean -ci, 0);
            result.mean = mean;
            result.ci = Math.max(mean + ci -result.base, 0);
            return result;
        });
};

var DisplayStats = {

    doDismissStats: function(ev) {
        AppActions.setLocalState(this.props.ctx, {localStats: null});
    },

    render: function() {
        var name = this.props.localStats && this.props.localStats.name;
        var data =  this.props.localStats && this.props.localStats.data || [];
        data = processData(data);
        return cE(rB.Modal,{show: !!this.props.localStats,
                            onHide: this.doDismissStats,
                            animation: false},
                  cE(rB.Modal.Header, {closeButton: true},
                     cE(rB.Modal.Title, null, "Stats for " + name  +
                        ' (Minutes)')
                    ),
                  cE(rB.ModalBody, null,
                     cE(rC.ResponsiveContainer, {height: '60%', width: '100%'},
                        cE(rC.ComposedChart, {data: data},
                           cE(rC.XAxis, {dataKey: 'slide'}),
                           cE(rC.YAxis, {label: 'Minutes'}),
                           cE(rC.Legend, null),
                           cE(rC.Bar, {isAnimationActive: false,
                                    dataKey: 'base',
                                       fill: '#413ea0', stackId: 'a'}),
                           cE(rC.Bar, {isAnimationActive: false,
                                    dataKey: 'ci',
                                       fill: '#ffc658', stackId: 'a'}),
                           cE(rC.Line, {isAnimationActive: false,
                                     dataKey: 'mean', type: 'monotone',
                                        stroke: '#ff0000'})

/*                             cE('p', null, JSON.stringify(data))*/
                          )
                       )
                    ),
                  cE(rB.Modal.Footer, null,
                     cE(rB.Button, {onClick: this.doDismissStats}, "Continue")
                    )
                 );
    }
};

module.exports = React.createClass(DisplayStats);
