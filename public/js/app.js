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

const revealUtil = require('./revealUtil');

const React = require('react');
const ReactDOM = require('react-dom');
const AppSession = require('./session/AppSession');
const MyApp = require('./components/MyApp');
const redux = require('redux');
const AppReducer = require('./reducers/AppReducer');
const cE = React.createElement;
const SharedMap = require('caf_sharing').SharedMap;
const REVEAL_TOP_ID= 'revealTopId';

const main = exports.main = function(data) {
    const ctx =  {
        store: redux.createStore(AppReducer),
        map : new SharedMap({debug: function(x) {
            console.log(x);
        }})
    };

    if (typeof window !== 'undefined') {
        return (async function() {
            try {
                const data = await AppSession.connect(ctx);
                if (data.isAdmin) {
                    const reactElem = document &&
                          document.getElementById(REVEAL_TOP_ID);
                    if (reactElem) {
                        reactElem.setAttribute('style', 'display:none;');
                    }
                    ReactDOM.render(cE(MyApp, {ctx: ctx}),
                                    document.getElementById('content'));
                } else {
                    await revealUtil.init(ctx, data);
                }
            } catch (err) {
                const reactElem = document &&
                      document.getElementById(REVEAL_TOP_ID);
                if (reactElem) {
                    reactElem.setAttribute('style', 'display:none;');
                }
                document.getElementById('content').innerHTML =
                    '<H1>Cannot connect: ' + err + '<H1/>';
                console.log('Cannot connect:' + err);
            }
        })();
    } else {
        throw new Error('SSR not supported');
    }
};
