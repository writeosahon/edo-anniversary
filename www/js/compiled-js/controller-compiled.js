'use strict';

/**
 * Created by UTOPIA SOFTWARE on 27/10/2017.
 */

/**
 * file defines all View-Models, Controllers and Event Listeners used by the app
 *
 * The 'utopiasoftware.edoae' namespace has being defined in the base js file.
 * The author uses the terms 'method' and function interchangeably; likewise the terms 'attribute' and 'property' are
 * also used interchangeably
 */

// define the controller namespace
utopiasoftware.edoae.controller = {

    /**
     * method is used to handle the special event created by the intel xdk developer library. The special event (app.Ready)
     * is triggered when ALL the hybrid app plugins have been loaded/readied and also the document DOM content is ready
     */
    appReady: function appReady() {

        // initialise the onsen library
        ons.ready(function () {
            // set the default handler for the app
            ons.setDefaultDeviceBackButtonListener(function () {
                // does nothing for now!!
            });

            if (utopiasoftware.edoae.model.isAppReady === false) {
                // if app has not completed loading
                // displaying prepping message
                $('#loader-modal-message').html("Loading App...");
                $('#loader-modal').get(0).show(); // show loader
            }

            // set the content page for the app
            $('ons-splitter').get(0).content.load("app-main-template");

            // initialise events-schedule-details-fixed-modal plugin
            $('#events-schedule-details-fixed-modal').modal({
                ready: function ready() {
                    // callback for when fixed-modal is opened
                    // flag a state that indicates the modal is currently open
                    $('#events-schedule-details-fixed-modal').data("fixedModalState", "open");
                },
                complete: function complete() {
                    // callback for when fixed-modal is closed
                    // flag a state that indicates the fixed-modal is currently closed
                    $('#events-schedule-details-fixed-modal').data("fixedModalState", "closed");
                }
            });
        });

        // add listener for when the Internet network connection is offline
        document.addEventListener("offline", function () {

            // display a toast message to let user no there is no Internet connection
            window.plugins.toast.showWithOptions({
                message: "No Internet Connection. App functionality may be limited",
                duration: 4000, // 4000 ms
                position: "bottom",
                styling: {
                    opacity: 1,
                    backgroundColor: '#000000',
                    textColor: '#FFFFFF',
                    textSize: 14
                }
            });
        }, false);

        // add listener for when the Internet network connection is online
        document.addEventListener("online", function () {

            // run the Microsoft Code-Push plugin
            codePush.sync(null, { updateDialog: { updateTitle: "Updated Content",
                    mandatoryUpdateMessage: "The app has updated content. Press 'Continue' to retrieve content and restart app" },
                installMode: InstallMode.IMMEDIATE, mandatoryInstallMode: InstallMode.IMMEDIATE });
        }, false);

        // add a listener for when the user pauses the device i.e when the app is taken from the foreground to background
        document.addEventListener("pause", function () {
            $('.rotating-infinite-ease-in-1').addClass('rotating-infinite-ease-in-1-paused');
        }, false);

        // add a listener for when the user resumes the device i.e when the app is taken from the background to foreground
        document.addEventListener("resume", function () {
            $('.rotating-infinite-ease-in-1').removeClass('rotating-infinite-ease-in-1-paused');
        }, false);

        try {
            // lock the orientation of the device to 'PORTRAIT'
            screen.lockOrientation('portrait');
        } catch (err) {}

        // set status bar color
        StatusBar.backgroundColorByHexString("#2e7d32");

        // prepare the inapp browser plugin
        window.open = cordova.InAppBrowser.open;

        // use Promises to load the other cordova plugins
        new Promise(function (resolve, reject) {
            // this promise  just sets the promise chain in motion
            window.setTimeout(function () {
                resolve(); // resolve the promise
            }, 0);
        }).then(function () {

            // run the Microsoft Code-Push plugin
            codePush.sync(null, { updateDialog: { updateTitle: "Updated Content",
                    mandatoryUpdateMessage: "The app has updated content. Press 'Continue' to retrieve content and restart app" },
                installMode: InstallMode.IMMEDIATE, mandatoryInstallMode: InstallMode.IMMEDIATE });

            return;
        }).then(function () {
            // notify the app that the app has been successfully initialised and is ready for further execution (set app ready flag to true)
            utopiasoftware.edoae.model.isAppReady = true;
            // hide the splash screen
            navigator.splashscreen.hide();
        }).catch(function (err) {

            // notify the app that the app has been successfully initialised and is ready for further execution (set app ready flag to true)
            utopiasoftware.edoae.model.isAppReady = true;
            // hide the splash screen
            navigator.splashscreen.hide();

            // display a toast message to let user no there is no Internet connection
            window.plugins.toast.showWithOptions({
                message: "Startup Error. App functionality may be limited. Always update the app to " + "get the best secure experience. Please contact us if problem continues",
                duration: 5000, // 5000 ms
                position: "bottom",
                styling: {
                    opacity: 1,
                    backgroundColor: '#000000',
                    textColor: '#FFFFFF',
                    textSize: 14
                }
            });
        });
    },

    /**
     * object is the view-model for the app side menu
     */
    sideMenuViewModel: {

        /**
         * method is used to listen for when the list
         * items in the side menu is clicked
         *
         * @param label {String} label represents clicked list item in the side-menu
         */
        sideMenuListClicked: function sideMenuListClicked(label) {

            if (label == "events schedule") {
                // 'events schedule' button was clicked

                // close the side menu
                $('ons-splitter').get(0).left.close().then(function () {
                    $('#app-main-navigator').get(0).bringPageTop("events-schedule-page.html", {}); // navigate to the specified page
                }).catch(function () {});

                return;
            }

            if (label == "hotels") {
                // 'hotels' button was clicked

                // close the side menu
                $('ons-splitter').get(0).left.close().then(function () {
                    $('#app-main-navigator').get(0).bringPageTop("hotels-page.html", {}); // navigate to the specified page
                }).catch(function () {});

                return;
            }
        }
    },

    /**
     * object is view-model for main-menu page
     */
    mainMenuPageViewModel: {

        /**
         * event is triggered when page is initialised
         */
        pageInit: function pageInit(event) {

            var $thisPage = $(event.target); // get the current page shown
            // disable the swipeable feature for the app splitter
            $('ons-splitter-side').removeAttr("swipeable");

            // call the function used to initialise the app page if the app is fully loaded
            loadPageOnAppReady();

            //function is used to initialise the page if the app is fully ready for execution
            function loadPageOnAppReady() {
                // check to see if onsen is ready and if all app loading has been completed
                if (!ons.isReady() || utopiasoftware.edoae.model.isAppReady === false) {
                    setTimeout(loadPageOnAppReady, 500); // call this function again after half a second
                    return;
                }

                // listen for the back button event
                $('#app-main-navigator').get(0).topPage.onDeviceBackButton = function () {
                    ons.notification.confirm('Do you want to close the app?', { title: 'Exit',
                        buttonLabels: ['No', 'Yes'] }) // Ask for confirmation
                    .then(function (index) {
                        if (index === 1) {
                            // OK button
                            navigator.app.exitApp(); // Close the app
                        }
                    });
                };

                // hide the loader
                $('#loader-modal').get(0).hide();
            }
        },

        /**
         * method is triggered when page is shown
         */
        pageShow: function pageShow() {
            // disable the swipeable feature for the app splitter
            $('ons-splitter-side').removeAttr("swipeable");
            // commence the rotating animation on main menu page
            $('.rotating-infinite-ease-in-1').removeClass('rotating-infinite-ease-in-1-paused');
        },

        /**
         * method is triggered when page is hidden
         */
        pageHide: function pageHide() {
            // stop the rotating animation on main menu page
            $('.rotating-infinite-ease-in-1').addClass('rotating-infinite-ease-in-1-paused');
        },

        /**
         * method is used to listen for click events of the main menu items
         *
         * @param label
         */
        mainMenuButtonsClicked: function mainMenuButtonsClicked(label) {

            if (label == "events schedule") {
                // 'events schedule' button was clicked

                $('#app-main-navigator').get(0).pushPage("events-schedule-page.html", {}); // navigate to the events schedule page

                return;
            }

            if (label == "hotels") {
                // intro button was clicked

                $('#app-main-navigator').get(0).pushPage("hotels-page.html", {}); // navigate to the page

                return;
            }
        }

    },

    /**
     * object is the view-model for events schedule page
     */
    eventsSchedulePageViewModel: {

        /**
         * event is triggered when page is initialised
         */
        pageInit: function pageInit(event) {

            var $thisPage = $(event.target); // get the current page shown
            // enable the swipeable feature for the app splitter
            $('ons-splitter-side').attr("swipeable", true);

            // call the function used to initialise the app page if the app is fully loaded
            loadPageOnAppReady();

            //function is used to initialise the page if the app is fully ready for execution
            function loadPageOnAppReady() {
                // check to see if onsen is ready and if all app loading has been completed
                if (!ons.isReady() || utopiasoftware.edoae.model.isAppReady === false) {
                    setTimeout(loadPageOnAppReady, 500); // call this function again after half a second
                    return;
                }

                // listen for the back button event
                $('#app-main-navigator').get(0).topPage.onDeviceBackButton = function () {

                    // check if the side menu is open
                    if ($('ons-splitter').get(0).left.isOpen) {
                        // side menu open, so close it
                        $('ons-splitter').get(0).left.close();
                        return; // exit the method
                    }

                    // check if events-schedule-details-fixed-modal is open
                    if ($('#events-schedule-details-fixed-modal').data("fixedModalState") == "open") {
                        // scroll to the top of the modal, then close it
                        $('#events-schedule-details-fixed-modal .modal-content').scrollTop(0);
                        $('#events-schedule-details-fixed-modal').modal('close');
                        return;
                    }

                    $('#app-main-navigator').get(0).resetToPage("main-menu-page.html");
                };

                // load the user's transaction history data from the device secure store
                utopiasoftware.edoae.controller.eventsSchedulePageViewModel.loadEventsData().then(function (eventsObject) {
                    // events object has been returned
                    // empty the contents of the events list
                    $('#events-schedule-list .events-schedule-items-container', $thisPage).html("");
                    // create the events schedule content
                    var eventsScheduleContent = '';

                    for (var index = 0; index < eventsObject.event_items.length; index++) {
                        // loop through event items

                        var eventItem = eventsObject.event_items[index];

                        eventsScheduleContent += '<ons-col width="100%" class="events-schedule-item-day-indicator"\n                        style="text-align:center; margin-bottom: 0.8em">\n                        ' + eventItem.day + '\n                        </ons-col>';

                        for (var index2 = 0; index2 < eventItem.events.length; index2++) {
                            //loop through events in each event item
                            eventsScheduleContent += '<ons-col width="27%" class="events-schedule-indicator-container">\n                            <span class="events-schedule-item-success-indicator"></span>\n                            <span class="events-schedule-item-time-indicator">' + eventItem.events[index2].event_time + '</span>\n                            </ons-col>\n                            <ons-col width="68%" class="events-schedule-content-container" style="padding-left: 0.5em">\n                            <div style="font-size: 0.8em; width: 100%">\n                            <span class="events-schedule-content-label">\n                            Title\n                            </span>\n                            <span>\n                            ' + eventItem.events[index2].event_description + '\n                            </span>\n                            </div>';
                            // check if the event has any moderators
                            if (eventItem.events[index2].moderators.length > 0) {
                                // there are moderators
                                eventsScheduleContent += '<div style="font-size: 0.8em; width: 100%">\n                                    <span class="events-schedule-content-label">\n                                    Moderators\n                                    </span>\n                                    <span style="text-transform: capitalize">\n                                    ' + eventItem.events[index2].moderators.join(", ") + '\n                                    </span>\n                                </div>';
                            }

                            // check if the event has any panelists
                            if (eventItem.events[index2].panelists.length > 0) {
                                // there are panelists
                                eventsScheduleContent += '<div style="font-size: 0.8em; width: 100%">\n                                    <span class="events-schedule-content-label">\n                                    Panelists\n                                    </span>\n                                    <span style="text-transform: capitalize">\n                                    ' + eventItem.events[index2].panelists.join(", ") + '\n                                    </span>\n                                </div>';
                            }

                            // check if the event has any special guests
                            if (eventItem.events[index2].special_guests && Array.isArray(eventItem.events[index2].special_guests)) {
                                // there are special guests
                                eventsScheduleContent += '<div style="font-size: 0.8em; width: 100%">\n                                    <span class="events-schedule-content-label">\n                                    Special Guests\n                                    </span>\n                                    <span style="text-transform: capitalize">\n                                    ' + eventItem.events[index2].special_guests.join(", ") + '\n                                    </span>\n                                </div>';
                            }

                            // check if the event has a venue
                            if (eventItem.events[index2].venue) {
                                // there is a venue
                                eventsScheduleContent += '<div style="font-size: 0.8em; width: 100%">\n                                    <span class="events-schedule-content-label">\n                                    Venue\n                                    </span>\n                                    <span style="text-transform: capitalize">\n                                    ' + eventItem.events[index2].venue + '\n                                    </span>\n                                </div>';
                            }

                            // attach the buttons for each event
                            eventsScheduleContent += '<div style="font-size: 0.8em; width: 100%; padding-top: 0.5em;">\n                            <ons-button class="events-schedule-content-button"\n                            onclick="utopiasoftware.edoae.controller.eventsSchedulePageViewModel.viewDetails(this)"\n                            style="visibility: ' + (eventItem.events[index2].full_details ? 'visible' : 'hidden') + '"\n                            data-details=\'' + JSON.stringify({ title: eventItem.events[index2].event_description, full_details: eventItem.events[index2].full_details }) + '\'>\n                            Full Details\n                            </ons-button>\n                            <ons-button class="events-schedule-content-button"\n                            data-details=\'' + JSON.stringify(eventItem.events[index2].location) + '\'\n                            onclick="utopiasoftware.edoae.controller.eventsSchedulePageViewModel.viewLocation(this)">\n                            Location\n                            </ons-button>\n                            </div>\n                            </ons-col>';
                        }

                        // append the event schedule content to the "Event Schedule" list
                        $('#events-schedule-list .events-schedule-items-container', $thisPage).append(eventsScheduleContent);
                        eventsScheduleContent = ''; // reset the content in preparation for another loop
                    }

                    // hide the page preloader progress bar
                    $('.progress', $thisPage).css("display", "none");
                    // display the events schedule list from display
                    $('#events-schedule-list', $thisPage).css("display", "block");
                }).catch(function (err) {
                    // an error occurred, so display the error message to the user
                    console.log(err);
                    // hide the page preloader progress bar
                    $('.progress', $thisPage).css("display", "none");
                    // hide the events schedule list from display
                    $('#events-schedule-list', $thisPage).css("display", "none");
                });

                // hide the loader
                $('#loader-modal').get(0).hide();
            }
        },

        /**
         * method is triggered when page is shown
         *
         * @param event
         */
        pageShow: function pageShow(event) {
            var $thisPage = $(event.target); // get the current page shown
            // enable the swipeable feature for the app splitter
            $('ons-splitter-side').attr("swipeable", true);
        },

        /**
         * method is used to display more details about details about an event
         *
         * @param buttonElem
         */
        viewDetails: function viewDetails(buttonElem) {

            // get the schedule of the event which has been attached to the clicked buttom
            var eventDetails = JSON.parse($(buttonElem).attr('data-details'));
            // update the content of the events-schedule-details-fixed-modal
            $('#events-schedule-details-fixed-modal #events-schedule-details-heading').html(eventDetails.title);
            // updater the full details content of the events-schedule-details-fixed-modal
            $('#events-schedule-details-fixed-modal #events-schedule-details-content').html(eventDetails.full_details);
            // open the events-schedule-details-fixed-modal
            $('#events-schedule-details-fixed-modal').modal('open');
        },

        /**
         * method is used to view the location of an event schedule relative to the user's location
         *
         * @param buttonElem
         */
        viewLocation: function viewLocation(buttonElem) {

            var eventLocationArray = JSON.parse($(buttonElem).attr('data-details'));
            // want user of lop gps collection
            ons.notification.confirm({ title: '<ons-icon icon="md-info" size="32px" ' + 'style="color: #1b5e20;"></ons-icon> ' + "User's Location",
                messageHTML: '<span>This app needs access to your current location. ' + 'We use your current location to provide a route map to the scheduled event <br>' + 'Do you want to continue?</span>',
                cancelable: false,
                buttonLabels: ["No", "Yes"]
            }).then(function (buttonIndex) {
                if (buttonIndex === 1) {
                    // user wants to continue
                    // display message to user
                    $('#loader-modal-message').html("Finding Your Location.<br>Please Wait...");
                    return $('#loader-modal').get(0).show(); // show loader
                } else {
                    // user terminated action
                    throw null;
                }
            }).then(function () {
                // keep the app awake for the duration of the location process
                window.plugins.insomnia.keepAwake();
                // get the user's current location
                return new Promise(function (resolve, reject) {
                    navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 2 * 60 * 1000, enableHighAccuracy: true });
                });
            }).then(function (gpsPosition) {
                // retrieve the returned gps values
                return new Promise(function (resolve, reject) {
                    // display the route to the event
                    var locationUri = "http://maps.google.com/maps?saddr=" + gpsPosition.coords.latitude + "," + gpsPosition.coords.longitude + "&daddr=" + eventLocationArray[0] + "," + eventLocationArray[1];

                    // start the map app
                    startApp.set({ /* params */
                        "action": "ACTION_VIEW",
                        "uri": locationUri,
                        "component": ["com.google.android.apps.maps", "com.google.android.maps.MapsActivity"]
                    }).start(resolve, reject);
                });
            }).then(function () {

                window.plugins.insomnia.allowSleepAgain();
                $('#loader-modal').get(0).hide(); // hide loader
            }).catch(function (err) {

                $('#loader-modal').get(0).hide(); // hide loader

                if (!err) {
                    // if error is null, user terminated action
                    return;
                }

                ons.notification.alert({ title: "Location Failed",
                    messageHTML: '<ons-icon icon="md-close-circle-o" size="30px" ' + 'style="color: red;"></ons-icon> <span>Sorry, we could not retrieve your current location. Check that the location setting on the device is active, ' + 'then try again </span>',
                    cancelable: true
                });
            });
        },

        /**
         * method is used to load the events schedule data
         *
         * @returns {Promise} the promise resolve to an object containing the array of events schedule
         */
        loadEventsData: function loadEventsData() {
            // retrieve the list of events
            return Promise.resolve($.ajax({
                url: "events.json",
                type: "get",
                dataType: "json",
                timeout: 240000 // wait for 4 minutes before timeout of request

            }));
        }

    },

    /**
     * object is the view-model for hotels page
     */
    hotelsPageViewModel: {

        /**
         * event is triggered when page is initialised
         */
        pageInit: function pageInit(event) {

            var $thisPage = $(event.target); // get the current page shown
            // enable the swipeable feature for the app splitter
            $('ons-splitter-side').attr("swipeable", true);

            // call the function used to initialise the app page if the app is fully loaded
            loadPageOnAppReady();

            //function is used to initialise the page if the app is fully ready for execution
            function loadPageOnAppReady() {
                // check to see if onsen is ready and if all app loading has been completed
                if (!ons.isReady() || utopiasoftware.edoae.model.isAppReady === false) {
                    setTimeout(loadPageOnAppReady, 500); // call this function again after half a second
                    return;
                }

                // listen for the back button event
                $('#app-main-navigator').get(0).topPage.onDeviceBackButton = function () {

                    // check if the side menu is open
                    if ($('ons-splitter').get(0).left.isOpen) {
                        // side menu open, so close it
                        $('ons-splitter').get(0).left.close();
                        return; // exit the method
                    }

                    $('#app-main-navigator').get(0).resetToPage("main-menu-page.html");
                };

                // load the hotel data from the device secure store
                utopiasoftware.edoae.controller.hotelsPageViewModel.loadHotelsData().then(function (hotelsArray) {
                    // events object has been returned
                    // empty the contents of the hotels list
                    $('#hotels-page-list', $thisPage).html("");
                    // create the hotels content
                    var hotelsListContent = '';

                    for (var index = 0; index < hotelsArray.length; index++) {
                        // loop through hotel objects

                        hotelsListContent += '<ons-list-item modifier="nodivider" style="border-bottom: solid 1px lightgray">\n                            <div class="left">\n                            <ons-icon icon="md-city-alt" class="list-item__icon" size="42px" fixed-width="true"\n                            style="color: #1b5e20"></ons-icon>\n                            </div>\n                            <div class="center" style="margin-left: 1em;">\n                            <span class="list-item__title" style="color: darkgoldenrod; font-weight: bolder;\n                            text-align: left; text-transform: capitalize">\n                            ' + hotelsArray[index].hotel_name + '\n                            </span>\n                            <div class="list-item__title" style="text-align: left; margin-top: 0.8em;">\n                            <span style="font-weight: bold; color: darkgoldenrod;">Address: </span>\n                            <span style="font-style: italic">\n                            ' + hotelsArray[index].hotel_address + '\n                            </span>\n                            </div>\n                            <div style="width: 100%; float: right;">\n                            <ons-button style="background-color: #1b5e20; color: #eeff41; font-size: 0.75em; margin-top: 0.7em;"\n                            onclick="utopiasoftware.edoae.controller.hotelsPageViewModel.viewLocation(this)"\n                            data-details=\'' + JSON.stringify(hotelsArray[index].hotel_gps) + '\'>\n                            Location\n                            </ons-button>\n                            </div>\n                            </div>\n                            </ons-list-item>';

                        // append the event schedule content to the "hotels" list
                        $('#hotels-page-list', $thisPage).append(hotelsListContent);
                        hotelsListContent = ''; // reset the content in preparation for another loop
                    }

                    // hide the page preloader progress bar
                    $('.progress', $thisPage).css("display", "none");
                    // display the hotels list from display
                    $('#hotels-page-list', $thisPage).css("display", "block");
                }).catch(function (err) {
                    // an error occurred, so display the error message to the user
                    console.log(err);
                    // hide the page preloader progress bar
                    $('.progress', $thisPage).css("display", "none");
                    // hide the events schedule list from display
                    $('#hotels-list', $thisPage).css("display", "none");
                });

                // hide the loader
                $('#loader-modal').get(0).hide();
            }
        },

        /**
         * method is triggered when page is shown
         *
         * @param event
         */
        pageShow: function pageShow(event) {
            var $thisPage = $(event.target); // get the current page shown
            // enable the swipeable feature for the app splitter
            $('ons-splitter-side').attr("swipeable", true);
        },

        /**
         * method is used to view the location of a hotel relative to the user's location
         *
         * @param buttonElem
         */
        viewLocation: function viewLocation(buttonElem) {

            var hotelLocationArray = JSON.parse($(buttonElem).attr('data-details'));
            // want user of lop gps collection
            ons.notification.confirm({ title: '<ons-icon icon="md-info" size="32px" ' + 'style="color: #1b5e20;"></ons-icon> ' + "User's Location",
                messageHTML: '<span>This app needs access to your current location. ' + 'We use your current location to provide a route map to the required hotel. <br>' + 'Do you want to continue?</span>',
                cancelable: false,
                buttonLabels: ["No", "Yes"]
            }).then(function (buttonIndex) {
                if (buttonIndex === 1) {
                    // user wants to continue
                    // display message to user
                    $('#loader-modal-message').html("Finding Your Location.<br>Please Wait...");
                    return $('#loader-modal').get(0).show(); // show loader
                } else {
                    // user terminated action
                    throw null;
                }
            }).then(function () {
                // keep the app awake for the duration of the location process
                window.plugins.insomnia.keepAwake();
                // get the user's current location
                return new Promise(function (resolve, reject) {
                    navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 2 * 60 * 1000, enableHighAccuracy: true });
                });
            }).then(function (gpsPosition) {
                // retrieve the returned gps values
                return new Promise(function (resolve, reject) {
                    // display the route to the event
                    var locationUri = "http://maps.google.com/maps?saddr=" + gpsPosition.coords.latitude + "," + gpsPosition.coords.longitude + "&daddr=" + hotelLocationArray[0] + "," + hotelLocationArray[1];

                    // start the map app
                    startApp.set({ /* params */
                        "action": "ACTION_VIEW",
                        "uri": locationUri,
                        "component": ["com.google.android.apps.maps", "com.google.android.maps.MapsActivity"]
                    }).start(resolve, reject);
                });
            }).then(function () {

                window.plugins.insomnia.allowSleepAgain();
                $('#loader-modal').get(0).hide(); // hide loader
            }).catch(function (err) {

                $('#loader-modal').get(0).hide(); // hide loader

                if (!err) {
                    // if error is null, user terminated action
                    return;
                }

                ons.notification.alert({ title: "Location Failed",
                    messageHTML: '<ons-icon icon="md-close-circle-o" size="30px" ' + 'style="color: red;"></ons-icon> <span>Sorry, we could not retrieve your current location. Check that the location setting on the device is active, ' + 'then try again </span>',
                    cancelable: true
                });
            });
        },

        /**
         * method is used to load the hotels data
         *
         * @returns {Promise} the promise resolve to an object containing the array of hotels
         */
        loadHotelsData: function loadHotelsData() {
            // retrieve the list of events
            return Promise.resolve($.ajax({
                url: "hotels.json",
                type: "get",
                dataType: "json",
                timeout: 240000 // wait for 4 minutes before timeout of request

            }));
        }

    }
};

//# sourceMappingURL=controller-compiled.js.map