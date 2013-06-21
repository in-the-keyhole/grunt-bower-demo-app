define(['backbone.marionette', 'tpl!main.tmpl'], function (Marionette, Template) {
    'use strict';

    return Marionette.ItemView.extend({
        template: Template,
        className: 'hero-unit'
    });
});