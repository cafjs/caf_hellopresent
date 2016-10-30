var React = require('react');
var rB = require('react-bootstrap');
var cE = React.createElement;
var AppActions = require('../actions/AppActions');
var objectAssign = require('object-assign');
var PresentationsTable = require('./PresentationsTable');

var Presentations = {

    handleName : function() {
        var pres = objectAssign({}, this.props.localPresentations, {
            name: this.refs.namePres.getValue()
        });
        AppActions.setLocalState(this.props.ctx, {localPresentations: pres});
    },

    handleURL : function() {
        var pres = objectAssign({}, this.props.localPresentations, {
            url: this.refs.url.getValue()
        });
        AppActions.setLocalState(this.props.ctx, {localPresentations: pres});
    },

    doAdd: function(ev) {
        if (this.props.localPresentations &&
            this.props.localPresentations.name &&
            this.props.localPresentations.url) {
            AppActions.changeURL(this.props.ctx,
                                 this.props.localPresentations.name,
                                 this.props.localPresentations.url);
        } else {
            var err = new Error('Missing arguments');
            AppActions.setError(this.props.ctx, err);
        }
    },

    doDelete: function(ev) {
        if (this.props.localPresentations &&
            this.props.localPresentations.name) {
            AppActions.changeURL(this.props.ctx,
                                 this.props.localPresentations.name,
                                 null);
        } else {
            var err = new Error('Missing arguments');
            AppActions.setError(this.props.ctx, err);
        }
    },

    doStats: function(ev) {
        if (this.props.localPresentations &&
            this.props.localPresentations.name) {
            AppActions.getStats(this.props.ctx,
                                this.props.localPresentations.name);
        } else {
            var err = new Error('Missing arguments');
            AppActions.setError(this.props.ctx, err);
        }
    },

    doReset: function(ev) {
        if (this.props.localPresentations &&
            this.props.localPresentations.name) {
            AppActions.resetStats(this.props.ctx,
                                  this.props.localPresentations.name);
        } else {
            var err = new Error('Missing arguments');
            AppActions.setError(this.props.ctx, err);
        }
    },

    render: function() {
        return cE(rB.Grid, {fluid: true},
                  cE(rB.Row, null,
                     cE(rB.Col, {xs:12, sm:6},
                        cE(rB.Input, {
                            label: 'Name',
                            type: 'text',
                            ref: 'namePres',
                            value: this.props.localPresentations.name,
                            onChange: this.handleName
                        })
                       ),
                     cE(rB.Col, {xs:12, sm:6},
                        cE(rB.Input, {
                            label: 'URL',
                            type: 'text',
                            ref: 'url',
                            value: this.props.localPresentations.url,
                            onChange: this.handleURL
                        })
                       )
                    ),
                  cE(rB.Row, null,
                     cE(rB.Col, {xs:3, sm:3},
                        cE(rB.Button, {
                            onClick: this.doAdd
                        }, "Add")
                       ),
                     cE(rB.Col, {xs:3, sm:3},
                        cE(rB.Button, {
                            bsStyle: 'danger',
                            onClick: this.doDelete
                        }, "Delete")
                       ),
                     cE(rB.Col, {xs:3, sm:3},
                        cE(rB.Button, {
                            onClick: this.doStats
                        }, "Stats")
                       ),
                     cE(rB.Col, {xs:3, sm:3},
                        cE(rB.Button, {
                            bsStyle: 'danger',
                            onClick: this.doReset
                        }, "Reset")
                       )
                    ),
                  cE(rB.Row, null,
                     cE(rB.Col, {xs:12, sm:12},
                        cE('hr', null)
                       )
                    ),
                  cE(rB.Row, null,
                     cE(rB.Col, {xs:12, sm:12},
                        cE(PresentationsTable, {
                            presentations: this.props.presentations
                        })
                       )
                    )
                 );
    }
};

module.exports = React.createClass(Presentations);
