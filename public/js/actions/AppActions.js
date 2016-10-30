var AppConstants = require('../constants/AppConstants');
var json_rpc = require('caf_transport').json_rpc;
var MAP_UPDATE = 'mapUpdate';

var updateF = function(store, state, map) {
    var d = {
        type: AppConstants.APP_UPDATE,
        state: state,
        map: map
    };
    store.dispatch(d);
};

var errorF =  function(store, err) {
    var d = {
        type: AppConstants.APP_ERROR,
        error: err
    };
    store.dispatch(d);
};

var getNotifData = function(msg) {
    return json_rpc.getMethodArgs(msg)[0];
};

var notifyF = function(store, message) {
    var d = {
        type: AppConstants.APP_NOTIFICATION,
        state: getNotifData(message)
    };
    store.dispatch(d);
};

var wsStatusF =  function(store, isClosed) {
    var d = {
        type: AppConstants.WS_STATUS,
        isClosed: isClosed
    };
    store.dispatch(d);
};

var AppActions = {
    init: function(ctx, cb) {
        ctx.session.hello(ctx.session.getCacheKey(), function(err, data) {
            if (err) {
                errorF(ctx.store, err);
            } else {
                AppActions.getMap(ctx);
                updateF(ctx.store, data);
            }
            cb(err, data);
        });
    },
    getStats: function(ctx, name) {
        ctx.session.getStats(name, function(err, data) {
            if (err) {
                errorF(ctx.store, err);
            } else {
                updateF(ctx.store, {localStats: {
                    data: data,
                    name: name
                }});
            }
        });
    },
    getMap: function(ctx) {
        ctx.session.getMap(ctx.map.getVersion(), function(err, delta) {
            if (err) {
                errorF(ctx.store, err);
            } else {
                try {
                    ctx.map.applyChanges(delta);
                    updateF(ctx.store, {}, ctx.map);
                } catch (ex) {
                    errorF(ctx.store, ex);
                }
            }
        });
    },
    message:  function(ctx, msg) {
        var data = getNotifData(msg);
        console.log('message:' + JSON.stringify(data));
        if (data.type === MAP_UPDATE) {
            AppActions.getMap(ctx);
        } else {
            AppActions.getState(ctx);
        }
    },
    closing:  function(ctx, err) {
        console.log('Closing:' + JSON.stringify(err));
        wsStatusF(ctx.store, true);
    },
    setLocalState: function(ctx, data) {
        updateF(ctx.store, data);
    },
    resetError: function(ctx) {
        errorF(ctx.store, null);
    },
    setError: function(ctx, err) {
        errorF(ctx.store, err);
    }
};

['changeSMS', 'changeURL', 'changeIsRecording', 'changeIsLive', 'resetStats',
 'changePage', 'getState', 'alarmActive'].forEach(function(x) {
     AppActions[x] = function() {
         var args = Array.prototype.slice.call(arguments);
         var ctx = args.shift();
         args.push(function(err, data) {
             if (err) {
                 errorF(ctx.store, err);
             } else {
                 updateF(ctx.store, data);
             }
         });
         ctx.session[x].apply(ctx.session, args);
     };
});


module.exports = AppActions;
