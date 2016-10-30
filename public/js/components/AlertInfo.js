var React = require('react');
var rB = require('react-bootstrap');
var cE = React.createElement;
var AppActions = require('../actions/AppActions');
var objectAssign = require('object-assign');

var AlertInfo = {

    handleConfigSMS : function() {
        var sms = objectAssign({}, this.props.sms);
        AppActions.setLocalState(this.props.ctx, {localSMS: sms});
    },

    handleAlarm: function() {
        AppActions.alarmActive(this.props.ctx, this.refs.alarm.getChecked());
    },

    render: function() {
        return cE(rB.Grid, {fluid: true},
                  cE(rB.Row, null,
                     cE(rB.Col, {xs:4, sm:4},
                        cE(rB.Input, {
                            type: 'checkbox',
                            ref: 'alarm',
                            checked: this.props.alarmActive,
                            onClick: this.handleAlarm
                        }, 'Alarm ON')
                       ),
                     cE(rB.Col, {xs:4, sm:4},
                        cE(rB.Button, {disabled: true},
                           (this.props.sentSMS ? cE(rB.Glyphicon, {
                               glyph: 'send',
                               className: 'text-danger'
                           }) : 'No SMS sent')
                          )
                       ),
                     cE(rB.Col, {xs:4, sm:4},
                        cE(rB.Button, {
                            onClick: this.handleConfigSMS
                        }, "Config SMS")
                       )
                    )
                 );
    }
};

module.exports = React.createClass(AlertInfo);
