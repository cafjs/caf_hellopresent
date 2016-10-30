var React = require('react');
var rB = require('react-bootstrap');
var AppActions = require('../actions/AppActions');
var ListNotif = require('./ListNotif');
var AppStatus = require('./AppStatus');
var DisplayError = require('./DisplayError');
var DisplayStats = require('./DisplayStats');
var SMSConfig = require('./SMSConfig');
var AlertInfo = require('./AlertInfo');
var Run = require('./Run');
var Presentations =  require('./Presentations');

var cE = React.createElement;

var MyApp = {
    getInitialState: function() {
        return this.props.ctx.store.getState();
    },
    componentDidMount: function() {
        if (!this.unsubscribe) {
            this.unsubscribe = this.props.ctx.store
                .subscribe(this._onChange.bind(this));
            this._onChange();
        }
    },
    componentWillUnmount: function() {
        if (this.unsubscribe) {
            this.unsubscribe();
            this.unsubscribe = null;
        }
    },
    _onChange : function() {
        if (this.unsubscribe) {
            this.setState(this.props.ctx.store.getState());
        }
    },
    render: function() {
        return cE('div', {className: 'container-fluid'},
                  cE(DisplayError, {
                      ctx: this.props.ctx,
                      error: this.state.error
                  }),
                  cE(SMSConfig, {
                      ctx: this.props.ctx,
                      localSMS: this.state.localSMS
                  }),
                   cE(DisplayStats, {
                      ctx: this.props.ctx,
                      localStats: this.state.localStats
                  }),
                  cE(rB.Panel, {
                      header: cE(rB.Grid, {fluid: true},
                                 cE(rB.Row, null,
                                    cE(rB.Col, {sm:1, xs:1},
                                       cE(AppStatus, {
                                           isClosed: this.state.isClosed
                                       })),
                                    cE(rB.Col, {
                                        sm: 5,
                                        xs:10,
                                        className: 'text-right'
                                    }, 'Presentation Manager'),
                                    cE(rB.Col, {
                                        sm: 5,
                                        xs:11,
                                        className: 'text-right'
                                    }, this.state.fullName)
                                   )
                                )
                  },
                     cE(rB.Panel, {header: 'Alert'},
                        cE(AlertInfo, {
                            ctx: this.props.ctx,
                            sms: this.state.sms,
                            alarmActive: this.state.alarmActive,
                            sentSMS: this.state.sentSMS
                        })),
                      cE(rB.Panel, {header: 'Run'},
                         cE(Run, {
                             ctx: this.props.ctx,
                             localRun: this.state.localRun || this.state.live,
                             recording: this.state.recording,
                             live: this.state.live
                         })),
                     cE(rB.Panel, {header: 'Presentations'},
                         cE(Presentations, {
                             ctx: this.props.ctx,
                             localPresentations: this.state.localPresentations,
                             presentations: this.state.presentations
                         }))
                    )
                 );
    }
};

module.exports = React.createClass(MyApp);
