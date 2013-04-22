/*
Copyright 2013 OCAD University

Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.

You may obtain a copy of the ECL 2.0 License and BSD License at
https://github.com/fluid-project/infusion/raw/master/Infusion-LICENSE.txt
*/

/*global jQuery, window, fluid_1_5*/

// JSLint options 
/*jslint white: true, funcinvoke: true, undef: true, newcap: true, nomen: true, regexp: true, bitwise: true, browser: true, forin: true, maxerr: 100, indent: 4 */

var fluid_1_5 = fluid_1_5 || {};

(function ($, fluid) {

    fluid.defaults("fluid.videoPlayer.showHide", {
        gradeNames: ["fluid.modelComponent", "fluid.eventedComponent", "autoInit"],
        modelPrefix: "isShown",
        model: {
            isShown: {
                // A list of flags (true or false) to define the showing/hiding of any selectors
                // in a component. Example:
                // "scrubber.handle": false
                // "scrubber" is the identifier defined in the option "showHidePath", normally the 
                // unique component name. "handle" is the selector defined in the "scrubber" component.
            }
        },
        listeners: {
            onCreate: "{that}.handleSelectors"
        },
        invokers: {
            handleSelectors: {
                funcName: "fluid.videoPlayer.showHide.handleSelectors",
                args: ["{that}.options", "{that}.applier", "{that}.dom"]
            }
        },
        // The identifier of the component for showing/hiding in the model "isShown" collection,
        // normally the unique component name, or any name as long as it maintains the uniqueness
        // of each component that has the "showHide" grade attached on.
        showHidePath: ""
    });

    fluid.videoPlayer.showHide.handleSelectors = function (options, applier, dom) {
        fluid.each(options.selectors, function (selectorValue, selectorKey) {
            var modelPath = fluid.pathUtil.composePath(
                fluid.pathUtil.composePath(options.modelPrefix, options.showHidePath),
                selectorKey
            );
            applier.modelChanged.addListener(modelPath, function () {
                var container = dom.locate(selectorKey);
                if (!container) {
                    return;
                }
                var showFlag = fluid.get(options.model, modelPath);
                container[showFlag ? "show" : "hide"]();
            });
        });
    };

})(jQuery, fluid_1_5);
