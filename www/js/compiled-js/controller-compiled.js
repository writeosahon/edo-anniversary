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

        try {
            // lock the orientation of the device to 'PORTRAIT'
            screen.lockOrientation('portrait');
        } catch (err) {}

        // set status bar color
        StatusBar.backgroundColorByHexString("#000000");

        // prepare the inapp browser plugin
        window.open = cordova.InAppBrowser.open;

        // use Promises to load the other cordova plugins
        new Promise(function (resolve, reject) {
            // this promise  just sets the promise chain in motion
            window.setTimeout(function () {
                resolve(); // resolve the promise
            }, 0);
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

            if (label == "transfer cash") {
                // 'transfer cash' button was clicked

                // close the side menu
                $('ons-splitter').get(0).left.close().then(function () {
                    // ask user for secure PIN before proceeding. secure pin MUST match
                    return ons.notification.prompt({ title: "Security Check", id: "pin-security-check", class: "utopiasoftware-no-style",
                        messageHTML: '<div><ons-icon icon="ion-lock-combination" size="24px" ' + 'style="color: #b388ff; float: left; width: 26px;"></ons-icon> <span style="float: right; width: calc(100% - 26px);">' + 'Please enter your PostCash Secure PIN to proceed</span></div>',
                        cancelable: true, placeholder: "Secure PIN", inputType: "number", defaultValue: "", autofocus: true,
                        submitOnEnter: true
                    });
                }).then(function (userInput) {
                    // user has provided a secured PIN , now authenticate it
                    if (userInput === utopiasoftware.saveup.model.appUserDetails.securePin) {
                        // authentication successful
                        $('#transfer-cash-page').remove(); // remove previous transfer cash pages
                        $('#app-main-navigator').get(0).pushPage("transfer-cash-page.html", {}); // navigate to the specified page
                    } else {
                        // inform user that security check failed/user authentication failed
                        ons.notification.alert({ title: "Security Check",
                            messageHTML: '<ons-icon icon="md-close-circle-o" size="30px" ' + 'style="color: red;"></ons-icon> <span>' + 'Security check failed. Invalid credentials' + '</span>',
                            cancelable: true
                        });
                    }
                }).catch(function () {});

                return;
            }

            if (label == "verify account") {
                // 'verify account' button was clicked

                // close the side menu
                $('ons-splitter').get(0).left.close().then(function () {
                    $('#app-main-navigator').get(0).bringPageTop("verify-account-page.html", {}); // navigate to the verify account page
                }).catch(function () {});

                return;
            }

            if (label == "my cards") {
                // 'my cards' button was clicked

                // close the side menu
                $('ons-splitter').get(0).left.close().then(function () {
                    // ask user for secure PIN before proceeding. secure pin MUST match
                    return ons.notification.prompt({ title: "Security Check", id: "pin-security-check", class: "utopiasoftware-no-style",
                        messageHTML: '<div><ons-icon icon="ion-lock-combination" size="24px" ' + 'style="color: #b388ff; float: left; width: 26px;"></ons-icon> <span style="float: right; width: calc(100% - 26px);">' + 'Please enter your PostCash Secure PIN to proceed</span></div>',
                        cancelable: true, placeholder: "Secure PIN", inputType: "number", defaultValue: "", autofocus: true,
                        submitOnEnter: true
                    });
                }).then(function (userInput) {
                    // user has provided a secured PIN , now authenticate it
                    if (userInput === utopiasoftware.saveup.model.appUserDetails.securePin) {
                        // authentication successful
                        $('#app-main-navigator').get(0).bringPageTop("my-cards-page.html", {}); // navigate to the specified page
                    } else {
                        // inform user that security check failed/user authentication failed
                        ons.notification.alert({ title: "Security Check",
                            messageHTML: '<ons-icon icon="md-close-circle-o" size="30px" ' + 'style="color: red;"></ons-icon> <span>' + 'Security check failed. Invalid credentials' + '</span>',
                            cancelable: true
                        });
                    }
                }).catch(function () {});

                return;
            }

            if (label == "my accounts") {
                // 'my accounts' button was clicked

                // close the side menu
                $('ons-splitter').get(0).left.close().then(function () {
                    // ask user for secure PIN before proceeding. secure pin MUST match
                    return ons.notification.prompt({ title: "Security Check", id: "pin-security-check", class: "utopiasoftware-no-style",
                        messageHTML: '<div><ons-icon icon="ion-lock-combination" size="24px" ' + 'style="color: #b388ff; float: left; width: 26px;"></ons-icon> <span style="float: right; width: calc(100% - 26px);">' + 'Please enter your PostCash Secure PIN to proceed</span></div>',
                        cancelable: true, placeholder: "Secure PIN", inputType: "number", defaultValue: "", autofocus: true,
                        submitOnEnter: true
                    });
                }).then(function (userInput) {
                    // user has provided a secured PIN , now authenticate it
                    if (userInput === utopiasoftware.saveup.model.appUserDetails.securePin) {
                        // authentication successful
                        $('#app-main-navigator').get(0).bringPageTop("my-accounts-page.html", {}); // navigate to the specified page
                    } else {
                        // inform user that security check failed/user authentication failed
                        ons.notification.alert({ title: "Security Check",
                            messageHTML: '<ons-icon icon="md-close-circle-o" size="30px" ' + 'style="color: red;"></ons-icon> <span>' + 'Security check failed. Invalid credentials' + '</span>',
                            cancelable: true
                        });
                    }
                }).catch(function () {});

                return;
            }

            if (label == "saved recipients") {
                // 'saved recipients' button was clicked

                // close the side menu
                $('ons-splitter').get(0).left.close().then(function () {
                    // ask user for secure PIN before proceeding. secure pin MUST match
                    return ons.notification.prompt({ title: "Security Check", id: "pin-security-check", class: "utopiasoftware-no-style",
                        messageHTML: '<div><ons-icon icon="ion-lock-combination" size="24px" ' + 'style="color: #b388ff; float: left; width: 26px;"></ons-icon> <span style="float: right; width: calc(100% - 26px);">' + 'Please enter your PostCash Secure PIN to proceed</span></div>',
                        cancelable: true, placeholder: "Secure PIN", inputType: "number", defaultValue: "", autofocus: true,
                        submitOnEnter: true
                    });
                }).then(function (userInput) {
                    // user has provided a secured PIN , now authenticate it
                    if (userInput === utopiasoftware.saveup.model.appUserDetails.securePin) {
                        // authentication successful
                        $('#app-main-navigator').get(0).bringPageTop("saved-recipients-page.html", {}); // navigate to the specified page
                    } else {
                        // inform user that security check failed/user authentication failed
                        ons.notification.alert({ title: "Security Check",
                            messageHTML: '<ons-icon icon="md-close-circle-o" size="30px" ' + 'style="color: red;"></ons-icon> <span>' + 'Security check failed. Invalid credentials' + '</span>',
                            cancelable: true
                        });
                    }
                }).catch(function () {});

                return;
            }

            if (label == "intro") {
                // 'intro' button was clicked

                // close the side menu
                $('ons-splitter').get(0).left.close().then(function () {
                    $('#app-main-navigator').get(0).bringPageTop("onboarding-page.html", {}); // navigate to the onboarding page
                }).catch(function () {});

                return;
            }

            if (label == "transaction history") {
                // 'transaction history' button was clicked

                // close the side menu
                $('ons-splitter').get(0).left.close().then(function () {
                    // ask user for secure PIN before proceeding. secure pin MUST match
                    return ons.notification.prompt({ title: "Security Check", id: "pin-security-check", class: "utopiasoftware-no-style",
                        messageHTML: '<div><ons-icon icon="ion-lock-combination" size="24px" ' + 'style="color: #b388ff; float: left; width: 26px;"></ons-icon> <span style="float: right; width: calc(100% - 26px);">' + 'Please enter your PostCash Secure PIN to proceed</span></div>',
                        cancelable: true, placeholder: "Secure PIN", inputType: "number", defaultValue: "", autofocus: true,
                        submitOnEnter: true
                    });
                }).then(function (userInput) {
                    // user has provided a secured PIN , now authenticate it
                    if (userInput === utopiasoftware.saveup.model.appUserDetails.securePin) {
                        // authentication successful
                        $('#app-main-navigator').get(0).bringPageTop("transaction-history-page.html", {}); // navigate to the specified page
                    } else {
                        // inform user that security check failed/user authentication failed
                        ons.notification.alert({ title: "Security Check",
                            messageHTML: '<ons-icon icon="md-close-circle-o" size="30px" ' + 'style="color: red;"></ons-icon> <span>' + 'Security check failed. Invalid credentials' + '</span>',
                            cancelable: true
                        });
                    }
                }).catch(function () {});

                return;
            }

            if (label == "settings") {
                // settings button was clicked

                // close the side menu
                $('ons-splitter').get(0).left.close().then(function () {
                    $('#app-main-navigator').get(0).bringPageTop("settings-page.html", {}); // navigate to the settings page
                }).catch();

                return;
            }

            if (label == "contact us") {
                // contact us button was clicked

                // close the side menu
                $('ons-splitter').get(0).left.close().then(function () {
                    $('#app-main-navigator').get(0).bringPageTop("contact-us-page.html", {}); // navigate to the contact us page
                }).catch();

                return;
            }

            if (label == "app info") {
                // app info button was clicked

                // close the side menu
                $('ons-splitter').get(0).left.close().then(function () {
                    $('#app-main-navigator').get(0).bringPageTop("app-info-page.html", {}); // navigate to the app info page
                }).catch();

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
                if (!ons.isReady() || utopiasoftware.saveup.model.isAppReady === false) {
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
        },

        /**
         * method is used to listen for click events of the main menu items
         *
         * @param label
         */
        mainMenuButtonsClicked: function mainMenuButtonsClicked(label) {
            if (label == "transfer cash") {
                // 'transfer cash' button was clicked

                // ask user for secure PIN before proceeding. secure pin MUST match
                ons.notification.prompt({ title: "Security Check", id: "pin-security-check", class: "utopiasoftware-no-style",
                    messageHTML: '<div><ons-icon icon="ion-lock-combination" size="24px" ' + 'style="color: #b388ff; float: left; width: 26px;"></ons-icon> <span style="float: right; width: calc(100% - 26px);">' + 'Please enter your PostCash Secure PIN to proceed</span></div>',
                    cancelable: true, placeholder: "Secure PIN", inputType: "number", defaultValue: "", autofocus: true,
                    submitOnEnter: true
                }).then(function (userInput) {
                    // user has provided a secured PIN , now authenticate it
                    if (userInput === utopiasoftware.saveup.model.appUserDetails.securePin) {
                        // authentication successful
                        $('#app-main-navigator').get(0).pushPage("transfer-cash-page.html", {}); // navigate to the specified pages
                    } else {
                        // inform user that security check failed/user authentication failed
                        ons.notification.alert({ title: "Security Check",
                            messageHTML: '<ons-icon icon="md-close-circle-o" size="30px" ' + 'style="color: red;"></ons-icon> <span>' + 'Security check failed. Invalid credentials' + '</span>',
                            cancelable: true
                        });
                    }
                }).catch(function () {});

                return;
            }

            if (label == "verify account") {
                // 'verify account' button was clicked

                $('#app-main-navigator').get(0).pushPage("verify-account-page.html", {}); // navigate to the verify account page

                return;
            }

            if (label == "my cards") {
                // 'my cards' button was clicked

                // ask user for secure PIN before proceeding. secure pin MUST match
                ons.notification.prompt({ title: "Security Check", id: "pin-security-check", class: "utopiasoftware-no-style",
                    messageHTML: '<div><ons-icon icon="ion-lock-combination" size="24px" ' + 'style="color: #b388ff; float: left; width: 26px;"></ons-icon> <span style="float: right; width: calc(100% - 26px);">' + 'Please enter your PostCash Secure PIN to proceed</span></div>',
                    cancelable: true, placeholder: "Secure PIN", inputType: "number", defaultValue: "", autofocus: true,
                    submitOnEnter: true
                }).then(function (userInput) {
                    // user has provided a secured PIN , now authenticate it
                    if (userInput === utopiasoftware.saveup.model.appUserDetails.securePin) {
                        // authentication successful
                        $('#app-main-navigator').get(0).pushPage("my-cards-page.html", {}); // navigate to the my cards pages
                    } else {
                        // inform user that security check failed/user authentication failed
                        ons.notification.alert({ title: "Security Check",
                            messageHTML: '<ons-icon icon="md-close-circle-o" size="30px" ' + 'style="color: red;"></ons-icon> <span>' + 'Security check failed. Invalid credentials' + '</span>',
                            cancelable: true
                        });
                    }
                }).catch(function () {});

                return;
            }

            if (label == "my accounts") {
                // 'my accounts' button was clicked

                // ask user for secure PIN before proceeding. secure pin MUST match
                ons.notification.prompt({ title: "Security Check", id: "pin-security-check", class: "utopiasoftware-no-style",
                    messageHTML: '<div><ons-icon icon="ion-lock-combination" size="24px" ' + 'style="color: #b388ff; float: left; width: 26px;"></ons-icon> <span style="float: right; width: calc(100% - 26px);">' + 'Please enter your PostCash Secure PIN to proceed</span></div>',
                    cancelable: true, placeholder: "Secure PIN", inputType: "number", defaultValue: "", autofocus: true,
                    submitOnEnter: true
                }).then(function (userInput) {
                    // user has provided a secured PIN , now authenticate it
                    if (userInput === utopiasoftware.saveup.model.appUserDetails.securePin) {
                        // authentication successful
                        $('#app-main-navigator').get(0).pushPage("my-accounts-page.html", {}); // navigate to the my accounts pages
                    } else {
                        // inform user that security check failed/user authentication failed
                        ons.notification.alert({ title: "Security Check",
                            messageHTML: '<ons-icon icon="md-close-circle-o" size="30px" ' + 'style="color: red;"></ons-icon> <span>' + 'Security check failed. Invalid credentials' + '</span>',
                            cancelable: true
                        });
                    }
                }).catch(function () {});

                return;
            }

            if (label == "saved recipients") {
                // 'saved recipients' button was clicked

                // ask user for secure PIN before proceeding. secure pin MUST match
                ons.notification.prompt({ title: "Security Check", id: "pin-security-check", class: "utopiasoftware-no-style",
                    messageHTML: '<div><ons-icon icon="ion-lock-combination" size="24px" ' + 'style="color: #b388ff; float: left; width: 26px;"></ons-icon> <span style="float: right; width: calc(100% - 26px);">' + 'Please enter your PostCash Secure PIN to proceed</span></div>',
                    cancelable: true, placeholder: "Secure PIN", inputType: "number", defaultValue: "", autofocus: true,
                    submitOnEnter: true
                }).then(function (userInput) {
                    // user has provided a secured PIN , now authenticate it
                    if (userInput === utopiasoftware.saveup.model.appUserDetails.securePin) {
                        // authentication successful
                        $('#app-main-navigator').get(0).pushPage("saved-recipients-page.html", {}); // navigate to the saved recipients pages
                    } else {
                        // inform user that security check failed/user authentication failed
                        ons.notification.alert({ title: "Security Check",
                            messageHTML: '<ons-icon icon="md-close-circle-o" size="30px" ' + 'style="color: red;"></ons-icon> <span>' + 'Security check failed. Invalid credentials' + '</span>',
                            cancelable: true
                        });
                    }
                }).catch(function () {});

                return;
            }

            if (label == "intro") {
                // intro button was clicked

                $('#app-main-navigator').get(0).pushPage("onboarding-page.html", {}); // navigate ot the onboarding page

                return;
            }

            if (label == "transaction history") {
                // 'transaction history' button was clicked

                // ask user for secure PIN before proceeding. secure pin MUST match
                ons.notification.prompt({ title: "Security Check", id: "pin-security-check", class: "utopiasoftware-no-style",
                    messageHTML: '<div><ons-icon icon="ion-lock-combination" size="24px" ' + 'style="color: #b388ff; float: left; width: 26px;"></ons-icon> <span style="float: right; width: calc(100% - 26px);">' + 'Please enter your PostCash Secure PIN to proceed</span></div>',
                    cancelable: true, placeholder: "Secure PIN", inputType: "number", defaultValue: "", autofocus: true,
                    submitOnEnter: true
                }).then(function (userInput) {
                    // user has provided a secured PIN , now authenticate it
                    if (userInput === utopiasoftware.saveup.model.appUserDetails.securePin) {
                        // authentication successful
                        $('#app-main-navigator').get(0).pushPage("transaction-history-page.html", {}); // navigate to the transaction history pages
                    } else {
                        // inform user that security check failed/user authentication failed
                        ons.notification.alert({ title: "Security Check",
                            messageHTML: '<ons-icon icon="md-close-circle-o" size="30px" ' + 'style="color: red;"></ons-icon> <span>' + 'Security check failed. Invalid credentials' + '</span>',
                            cancelable: true
                        });
                    }
                }).catch(function () {});

                return;
            }

            if (label == "settings") {
                // settings button was clicked

                $('#app-main-navigator').get(0).pushPage("settings-page.html", {}); // settings page

                return;
            }

            if (label == "contact us") {
                // contact us button was clicked

                $('#app-main-navigator').get(0).pushPage("contact-us-page.html", {}); // navigate to contact us page

                return;
            }

            if (label == "app info") {
                // app info button was clicked

                $('#app-main-navigator').get(0).pushPage("app-info-page.html", {}); // navigate to contact us page

                return;
            }
        }

    }
};

//# sourceMappingURL=controller-compiled.js.map