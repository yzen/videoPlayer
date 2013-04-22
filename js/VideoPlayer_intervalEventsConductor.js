/*
Copyright 2012 OCAD University

Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.

You may obtain a copy of the ECL 2.0 License and BSD License at
https://source.fluidproject.org/svn/LICENSE.txt
*/

/*global jQuery, fluid_1_5*/

// JSLint options 
/*jslint white: true, funcinvoke: true, undef: true, newcap: true, nomen: true, regexp: true, bitwise: true, browser: true, forin: true, maxerr: 100, indent: 4 */

var fluid_1_5 = fluid_1_5 || {};

(function ($, fluid) {

    /*********************************************************************************
     * fluid.videoPlayer.intervalEventsConductor                                     *
     *                                                                               *
     * The re-wiring of video timeupdate event that is tranlated into video player   *
     * needed time events                                                            *
     *********************************************************************************/
    
    fluid.defaults("fluid.videoPlayer.intervalEventsConductor", {
        gradeNames: ["fluid.eventedComponent", "fluid.modelComponent", "autoInit"],
        events: {
            onTimeUpdate: null,
            onIntervalChange: null,
            onReady: {
                events: {
                    onCreate: "onCreate"
                },
                args: ["{that}"]
            }
        },
        listeners: {
            onTimeUpdate: "{that}.handleTimeUpdate"
        },
        invokers: {
            handleTimeUpdate: {
                funcName: "fluid.videoPlayer.intervalEventsConductor.handleTimeUpdate",
                args: ["{that}", "{arguments}.0", "{arguments}.1"]
            },
            setIntervalList: {
                funcName: "fluid.videoPlayer.intervalEventsConductor.setIntervalList",
                args: ["{that}", "{arguments}.0"]
            }  
        },
        // An array of the time intervals with all the begin and end time in millisecond
        // Example: Array[intervalID] = {begin: beginTimeInMilli, end: endTimeInMilli}
        members: {
            intervalList: []
        },
        model: {
            // The saved interval that was fired at the previous intervalChange event
            previousIntervalId: null
        }
    });
    
    fluid.videoPlayer.intervalEventsConductor.setIntervalList = function (that, intervalList) {
        that.intervalList = intervalList;
    };
    
    fluid.videoPlayer.intervalEventsConductor.inInterval = function (currentTimeInMillis, interval) {
        return interval.begin <= currentTimeInMillis && interval.end >= currentTimeInMillis;
    };

    /**
     * Find the interval that the current time falls in. Return null if none of the intervals matches.
     * 
     * @param currentTime - The currentTime that is passed in from the timer onTick event firing
     * @param intervalList - The array of the intervals to check the current time against
     * Example: Array[intervalID] = {begin: beginTimeInMilli, end: endTimeInMilli}
     * All the begin and end times are in millisecond
     * @param previousInterval - The interval that was fired last time
     * 
     * @returns The interval that the current time falls in. Return null if none of the intervals matches.
     */
    fluid.videoPlayer.intervalEventsConductor.findCurrentInterval = function (currentTime, intervalList, previousInterval) {
        var currentTimeInMillis = Math.round(currentTime * 1000);

        // Find out if the current time is still within the range of the previousInterval 
        // to avoid the immediate looping-thru of the entire interval list
        if (previousInterval && fluid.videoPlayer.intervalEventsConductor.inInterval(currentTimeInMillis, intervalList[previousInterval])) {
            return previousInterval;
        }
        
        // Find out the interval that the current time fits in. If none was found, return null
        return fluid.find(intervalList, function (interval, intervalId) {
            return fluid.videoPlayer.intervalEventsConductor.inInterval(currentTimeInMillis, interval) ? intervalId : undefined;
        }, null);
    };

    /**
     * The main process to re-wire the events
     */
    fluid.videoPlayer.intervalEventsConductor.handleTimeUpdate = function (that, currentTime, buffered) {
        var previousInterval = that.model.previousIntervalId;
        var currentInterval = fluid.videoPlayer.intervalEventsConductor.findCurrentInterval(currentTime, that.intervalList, previousInterval);

        if (currentInterval !== previousInterval) {
            that.applier.requestChange("previousIntervalId", currentInterval);
            that.events.onIntervalChange.fire(currentInterval, previousInterval);
        }
    };

})(jQuery, fluid_1_5);
