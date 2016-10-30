var React = require('react');
var rB = require('react-bootstrap');
var cE = React.createElement;
var AppActions = require('../actions/AppActions');
var objectAssign = require('object-assign');

var Run = {

    handleName : function() {
        var run = objectAssign({}, this.props.localRun || {}, {
            name: this.refs.name.getValue()
        });
        AppActions.setLocalState(this.props.ctx, {localRun: run});
    },

    handleTime : function() {
        var run = objectAssign({}, this.props.localRun || {}, {
            durationMin: this.refs.durationMin.getValue()
        });
        AppActions.setLocalState(this.props.ctx, {localRun: run});
    },

    doStart: function(ev) {
        if (this.props.localRun && this.props.localRun.name &&
            this.props.localRun.durationMin) {
            AppActions.changeIsLive(this.props.ctx, {
                name: this.props.localRun.name,
                durationMin : this.props.localRun.durationMin,
                readOnly: true
            });
            AppActions.setLocalState(this.props.ctx, {localRun: null});
        } else {
            var err = new Error('Missing arguments');
            AppActions.setError(this.props.ctx, err);
        }
    },

    doStop: function(ev) {
        AppActions.changeIsLive(this.props.ctx, null);
        AppActions.setLocalState(this.props.ctx, {localRun: null});
    },

    render: function() {
        var now = (new Date()).getTime();
        var timeLeftMin = this.props.localRun && this.props.live &&
                (this.props.localRun.durationMin -
                 (now - this.props.live.start)/60000) || 0;
        timeLeftMin = Math.floor(timeLeftMin*100)/100.0;
        return cE(rB.Grid, {fluid: true},
                  cE(rB.Row, null,
                     cE(rB.Col, {xs:12, sm:6},
                        cE(rB.Input, {
                            label: 'Name',
                            type: 'text',
                            ref: 'name',
                            readOnly: this.props.localRun &&
                                this.props.localRun.readOnly,
                            value: this.props.localRun &&
                                this.props.localRun.name,
                            onChange: this.handleName
                        })
                       ),
                     cE(rB.Col, {xs:12, sm:6},
                        cE(rB.Input, {
                            label: 'Total Time (Min)',
                            type: 'text',
                            ref: 'durationMin',
                            value: this.props.localRun &&
                                this.props.localRun.durationMin,
                            onChange: this.handleTime
                        })
                       )
                    ),
                  cE(rB.Row, null,
                     (this.props.recording ?
                      [
                          cE(rB.Col, {xs:12, sm:6},
                             cE(rB.Input, {
                                 label: 'Time Left (Min)',
                                 type: 'text',
                                 readOnly: true,
                                 value: timeLeftMin
                             })
                            ),
                          cE(rB.Col, {xs:12, sm:6},
                             cE(rB.Input, {
                                 label: 'Time Needed (Min)',
                                 type: 'text',
                                 readOnly: true,
                                 value: this.props.live &&
                                     this.props.live.lastTimeToFinishMin
                             })
                            )
                      ] : cE("div", null))),
                  cE(rB.Row, null,
                     cE(rB.Col, {xs:3, sm:3},
                        cE(rB.Button, {
                            onClick: this.doStart
                        }, "Start")
                       ),
                     cE(rB.Col, {xs:3, sm:3},
                        cE(rB.Button, {
                            bsStyle: 'danger',
                            onClick: this.doStop
                        }, "Stop")
                       ),
                     cE(rB.Col, {xs:3, sm:3},
                        cE(rB.Button, {disabled: true},
                           (this.props.recording ? cE(rB.Glyphicon, {
                               glyph: 'record',
                               className: 'text-danger'
                           }) : 'Not Recording')
                          )
                       )
                    )
                 );
    }
};

module.exports = React.createClass(Run);
