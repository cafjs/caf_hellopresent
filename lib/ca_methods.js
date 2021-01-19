// Modifications copyright 2020 Caf.js Labs and contributors
/*!
Copyright 2013 Hewlett-Packard Development Company, L.P.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

'use strict';
var caf = require('caf_core');
var json_rpc = caf.caf_transport.json_rpc;
var presUtils = require('./ca_methods_utils');

var PAGE_CHANGE_SUFFIX = '-pageChange';
var APP_SESSION = 'default';

exports.methods = {

    '__ca_init__': function(cb) {
        // presentationName -> Array.<Array.<number>>
        // e.g., my_presentation -> [page#][duration_samples_in_minutes]
        this.state.stats = {};
        this.state.recording = false;
        // {name: string, warnDone: boolean, durationMin: number, start: number,
        //  lastTimeToFinishMin: number, lastInfo: {oldPage: number,
        //                               newPage: number, durationMin: number}}}
        this.state.live = null;
        this.state.sms = {};
        this.state.alarmActive = false;
        this.state.sentSMS = false;
        // currentPage type is {num: number, time: number}
        this.state.currentPage = null;

        this.state.print = this.$.props.print;

        this.state.fullName = this.__ca_getAppName__() + '#' +
            this.__ca_getName__();
        this.state.isAdmin = presUtils.isAdmin(this);
        this.$.session.limitQueue(2, APP_SESSION);
        if (this.state.isAdmin) {
            this.$.sharing.addWritableMap('forwarding', 'forwarding');
            var fullMapName = json_rpc.joinName(this.__ca_getName__(),
                                                'forwarding');
            this.$.sharing.addReadOnlyMap('presentations', fullMapName);
            this.state.lastMapVersion = -1;
            this.state.pubsubTopic = this.$.pubsub.FORUM_PREFIX +
                this.__ca_getName__() + PAGE_CHANGE_SUFFIX;
            this.$.pubsub.subscribe(this.state.pubsubTopic, 'handlePageChange');
            var rule = this.$.security.newSimpleRule('handlePageChange',
                                                     presUtils.owner(this));
            this.$.security.addRule(rule);
        } else {
            this.state.markdownURL = this.__ca_getName__() + '/' +
                this.$.props.slidesFileName;
            this.state.pubsubTopic = this.$.pubsub.FORUM_PREFIX +
                presUtils.adminName(this) + PAGE_CHANGE_SUFFIX;
        }
        cb(null);
    },

    '__ca_pulse__': function(cb) {
        this.$.log && this.$.log.debug('calling PULSE!!! ');
        var live = this.state.live;
        if (this.state.isAdmin) {
            // Check for updated maps
            var $$ = this.$.sharing.$;
            if ($$.presentations) {
                var version = $$.presentations.getVersion();
                if (version > this.state.lastMapVersion) {
                    this.$.session.notify([{type: 'mapUpdate', value: version}],
                                          APP_SESSION);
                    this.state.lastMapVersion = version;
                }
            }
            // Check for alarm in the middle of the presentation
            if (live) {
                var t = presUtils.timeToFinishMin(this, live.name);
                this.state.live.lastTimeToFinishMin = Math.floor(t*100)/100.0;
                this.$.session.notify([{type: 'timeToFinish', value: t}],
                                       APP_SESSION);
                if (this.state.alarmActive && !live.warnDone) {
                    var now = (new Date()).getTime();
                    var middle = live.start + 60*1000*(live.durationMin/2);
                    if (now > middle) {
                        live.warnDone = true;
                        this.$.log &&
                            this.$.log.debug('Processing Warn in PULSE!');
                        if (t > live.durationMin/2) {
                            var diff = Math.floor(60*(t - live.durationMin/2));
                            var msg = 'Too slow, late by ' + diff + ' seconds.';
                            this.$.log && this.$.log.debug(msg);
                            if (this.state.sms && this.state.sms.to) {
                                this.state.sentSMS = true;
                                this.$.sms.send(this.state.sms.to, msg);
                            }
                            this.$.session.notify([{type: 'alarm', value: msg}],
                                                  APP_SESSION);
                        } else {
                            var diff2 = Math.floor(60*(live.durationMin/2 -t));
                            var msg2 = 'Doing fine, extra ' + diff2 +
                                    ' seconds.';
                            this.$.log && this.$.log.debug(msg2);
                        }
                    }
                }
            }
        }
        cb(null, null);
    },

    'hello': function(key, cb) {
        this.getState(cb);
    },

    'alarmActive': function(active, cb) {
        this.state.alarmActive = active;
        this.getState(cb);
    },

    // sms type is {api_key:string, api_secret:string, from:number, to:number},
    // see caf_sms lib for details.
    'changeSMS': function(sms, cb) {
        this.state.sms = sms;
        if (sms) {
            this.$.sms.setConfig(sms);
        }
        this.getState(cb);
    },

    'changeURL': function(key, newURL, cb) {
        if (this.state.isAdmin) {
            key = presUtils.wrapOwner(this, key);
            var $$ = this.$.sharing.$;
            if (newURL === null) {
                $$.forwarding.delete(key);
            } else {
                $$.forwarding.set(key, newURL);
            }
            this.getState(cb);
        } else {
            cb(new Error('Not an admin'));
        }
    },

    /*
     * isRecording: boolean
     */
    'changeIsRecording': function(isRecording, cb) {
        this.state.recording = isRecording;
        this.getState(cb);
    },

    /*
     * live: {name: string, durationMin: number, start: number,
     * warnDone: boolean, lastInfo: {oldPage: number, newPage: number,
     *                               durationMin: number}}
     */
    'changeIsLive': function(live, cb) {
        this.state.sentSMS = false;
        this.state.recording = (live ? true : false);
        if (live && !this.state.live) {
            live.start = live.start || (new Date()).getTime();
        }
        if (live && live.name) {
            live.name = presUtils.wrapOwner(this, live.name);
        }
        this.state.live = live;
        this.getState(cb);
    },

    'resetStats': function(name, cb) {
        if (name) {
            name = presUtils.wrapOwner(this, name);
            delete this.state.stats[name];
        } else {
            this.state.stats = {};
        }
        this.getState(cb);
    },

    'getStats': function(name, cb) {
        var stats = null;
        if (name) {
            name = presUtils.wrapOwner(this, name);
            stats = (this.state.stats[name] ?
                     presUtils.computeStats(this, name) : null);
        }
        cb(null, stats);
    },

    // called by Reveal.js hook in non-admin CA
    'changePage': function(oldPage, newPage, cb) {
        var now = (new Date()).getTime();
        if (this.state.currentPage &&
            (this.state.currentPage.num === oldPage) &&
            (oldPage !== newPage)) {
            this.$.pubsub.publish(this.state.pubsubTopic, JSON.stringify({
                durationMin: (now - this.state.currentPage.time) / 60000,
                oldPage: oldPage,
                newPage: newPage
            }));
        }

        this.$.log && this.$.log.debug('<<< Changing page time: ' + now +
                                       ' old page: ' + oldPage +
                                       ' new page: ' + newPage);
        this.state.currentPage = {num: newPage, time: now};
        this.getState(cb);
    },

    'getMap': function(version, cb) {
        var $$ = this.$.sharing.$;
        if ($$.presentations) {
            cb(null, this.$.sharing.pullUpdate('presentations', version));
        } else {
            cb(new Error('Missing presentations map'));
        }
    },

    'getState': function(cb) {
        cb(null, this.state);
    },

    //Called by the pubsub plugin in admin CA

    // topic is this.$.pubsub.FORUM_PREFIX + me + PAGE_CHANGE_SUFFIX
    // info is of type {oldPage: number, newPage: number, durationMin: number}
    //     after JSON parsing
    'handlePageChange': function(topic, info, caller, cb) {
        var callerOwner = json_rpc.splitName(caller)[0];
        if (!this.state.isAdmin || (presUtils.owner(this) !== callerOwner) ||
            (topic !== this.state.pubsubTopic)) {
            var error = new Error('Cannot handle page change');
            error.topic = topic;
            error.info = info;
            error.caName = this.__ca_getName__();
            cb(error);
        } else {
            if (this.state.recording) {
                this.$.log && this.$.log.debug('Recording page change ' + info);
                info = JSON.parse(info);
                var durationMsec = info.durationMin*60*1000;
                // No browsing or coffee break...
                if ((durationMsec > this.$.props.minPageTime) &&
                    (durationMsec < this.$.props.maxPageTime)) {
                    var statCaller = this.state.stats[caller] || [];
                    var all = statCaller[info.oldPage] || [];
                    all.push(info.durationMin);
                    statCaller[info.oldPage] = all;
                    this.state.stats[caller] = statCaller;
                }
                if (this.state.live) {
                    this.state.live.lastInfo = info;
                }
            }
            cb(null);
        }
    }
};

caf.init(module);
