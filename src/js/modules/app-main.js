(function () {

    'use strict';

    if (!window.console) {
        window.console = function () {
        };
    }

    requirejs.config({
        baseUrl: '/src/js/modules',
        paths: {
            'app'                   : 'App',
            'controller'            : 'Controller',
            'router'                : 'Router',
            'backbone'              : '../components/backbone/backbone-min',
            'backbone.babysitter'   : '../components/backbone.babysitter/lib/backbone.babysitter.min',
            'backbone.eventbinder'  : '../components/backbone.eventbinder/lib/backbone.eventbinder.min',
            'backbone.marionette'   : '../components/backbone.marionette/lib/backbone.marionette.min',
            'backbone.wreqr'        : '../components/backbone.wreqr/lib/backbone.wreqr.min',
            'bootstrap'             : '../lib/bootstrap/js/bootstrap.min',
            'font-awesome'          : '../components/font-awesome',
            'jquery'                : '../components/jquery/jquery.min',
            'modernizr'             : '../components/modernizr/modernizr',
            'tpl'                   : '../components/requirejs-tpl/tpl',
            'underscore'            : '../components/underscore/underscore-min'
        },
        shim: {
            underscore: {
                exports: '_'
            },
            jquery: {
                exports: '$'
            },
            backbone: {
                deps: [
                    'underscore',
                    'jquery'
                ],
                exports: 'Backbone'
            },
            'backbone.marionette': {
                deps: [
                    'backbone'
                ],
                exports: 'Backbone.Marionette'
            },
            bootstrap: [
                'jquery'
            ],
            'backbone.wreqr': [
                'backbone'
            ],
            'backbone.babysitter': [
                'backbone'
            ]
        }
    });

    require(['app', 'underscore'], function (App, _) {
        App.start();
    });

}).call(this);
