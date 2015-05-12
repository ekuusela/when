/**
 * when AMD loader plugin
 *
 * Allows modules to resolve asynchronously via promises that have the done/fail callbacks (e.g. jQuery's Deferred).
 *
 * Promise can be a property in the module, or value returned from a function in a module, or the module itself.
 *
 * The syntax is:
 * when!path/to/module[.property]
 *
 * where .property is optional and can be a promise or a function that returns a promise.
 * If the property is not defined then the module itself should return a promise or a function that returns a promise.
 *
 * Once the promises is resolved this plugin loads the module (so not the property).
 *
 * @license MIT
 * @author Eero Kuusela
 */
define(function() {
    'use strict';

    var parse = function(name) {
        var parts = name.split('.');
        return {
            name: parts[0],
            promisePart: parts[1] ? '.' + parts[1] : '',
            promise: parts[1] || parts[0],
        };
    };

    return {
        normalize: function(name, normalize) {
            var parsed = parse(name);
            return normalize(parsed.name) + parsed.promisePart;
        },
        load: function(name, req, onload, config) {
            var parsed = parse(name);
            if (config.isBuild) {
                req([parsed.name]); // when building we want to have a dependency to the targeted module
                onload();
            } else {
                req([parsed.name], function(value) {
                    var promise = parsed.promise === parsed.name ? value : value[parsed.promise];
                    if (typeof promise === 'function') {
                        promise = promise();
                    }
                    promise.done(function() {
                        onload(value);
                    });
                    promise.fail(function() {
                        onload.error();
                    });
                });
            }
        }
    };
});