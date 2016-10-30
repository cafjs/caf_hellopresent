var React = require('react');
var rB = require('react-bootstrap');
var cE = React.createElement;
var AppActions = require('../actions/AppActions');
var objectAssign = require('object-assign');

var SMSConfig = {

    doSubmit: function(ev) {
        AppActions.changeSMS(this.props.ctx, this.props.localSMS);
        AppActions.setLocalState(this.props.ctx, {localSMS: null});
    },

    doDismiss: function(ev) {
        AppActions.setLocalState(this.props.ctx, {localSMS: null});
    },

    handleApiKey: function() {
        var sms = objectAssign({}, this.props.localSMS, {
            api_key: this.refs.api_key.getValue()
        });
        AppActions.setLocalState(this.props.ctx, {localSMS: sms});
    },

    handleApiSecret: function() {
        var sms = objectAssign({}, this.props.localSMS, {
            api_secret: this.refs.api_secret.getValue()
        });
        AppActions.setLocalState(this.props.ctx, {localSMS: sms});
    },

    handleFrom: function() {
        var sms = objectAssign({}, this.props.localSMS, {
            from: this.refs.from.getValue()
        });
        AppActions.setLocalState(this.props.ctx, {localSMS: sms});
    },

    handleTo: function() {
        var sms = objectAssign({}, this.props.localSMS, {
            to: this.refs.to.getValue()
        });
        AppActions.setLocalState(this.props.ctx, {localSMS: sms});
    },

    render: function() {
        return cE(rB.Modal,{show: !!this.props.localSMS,
                            onHide: this.doDismiss,
                            animation: false},
                  cE(rB.Modal.Header, {closeButton: true},
                     cE(rB.Modal.Title, null, "SMS config for Nexmo service")
                    ),
                  cE(rB.ModalBody, null,
                     cE(rB.Grid, {fluid: true},
                        cE(rB.Row, null,
                           cE(rB.Col, {xs:12, sm:6},
                              cE(rB.Input, {
                                  label: 'API Key',
                                  type: 'text',
                                  ref: 'api_key',
                                  value: this.props.localSMS &&
                                      this.props.localSMS.api_key,
                                  onChange: this.handleApiKey
                              })),
                           cE(rB.Col, {xs:12, sm:6},
                              cE(rB.Input, {
                                  label: 'API Secret',
                                  type: 'password',
                                  ref: 'api_secret',
                                  value: this.props.localSMS &&
                                      this.props.localSMS.api_secret,
                                  onChange: this.handleApiSecret
                              }))
                          ),
                        cE(rB.Row, null,
                           cE(rB.Col, {xs:12, sm:6},
                              cE(rB.Input, {
                                  label: 'Caller#',
                                  type: 'password',
                                  ref: 'from',
                                  value: this.props.localSMS &&
                                      this.props.localSMS.from,
                                  onChange: this.handleFrom
                              })),
                           cE(rB.Col, {xs:12, sm:6},
                              cE(rB.Input, {
                                  label: 'Receiver#',
                                  type: 'password',
                                  ref: 'to',
                                  value: this.props.localSMS &&
                                      this.props.localSMS.to,
                                  onChange: this.handleTo
                              }))
                          )
                       )
                    ),
                  cE(rB.Modal.Footer, null,
                     cE(rB.Button, {onClick: this.doSubmit}, "Submit"),
                     cE(rB.Button, {onClick: this.doDismiss}, "Ignore")
                    )
                 );
    }
};

module.exports = React.createClass(SMSConfig);
