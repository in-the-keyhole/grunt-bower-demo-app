define(['backbone.marionette', 'bootstrap', 'controller', 'router', 'View.Main'], function (Marionette, Bootstrap, Controller, Router, MainView) {

    'use strict';

    var AppPrototype = Marionette.Application.extend({
    });

    var app = new AppPrototype();

    app.addRegions({
        'main': '#main'
    });

    // Initialize Router
    app.addInitializer(function (options) {
        console.log("Initializing Router(s)...");
        var router = new Router({controller: new Controller()});
    });

    app.addInitializer(function (options) {
        // app specific initializiation goes here
    });

    // After all initializers have run
    app.on('initialize:after', function (options) {
        Backbone.history.on('route', function (router, event) {
            console.log('Routed', this.fragment, 'to:', event);
        });

        console.log('Starting Backbone History...');
        Backbone.history.start({pushState: true});

        this.main.show(new MainView());
    });

    return app;
});