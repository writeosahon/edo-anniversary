/**
 * Created by UTOPIA SOFTWARE on 27/10/2017.
 */

/**
 * file contains the model data of the app.
 *
 * The 'utopiasoftware.edoae' namespace has being defined in the base js file.
 *
 * The author uses the terms 'method' and function interchangeably; likewise the terms 'attribute' and 'property' are
 * also used interchangeably
 */

// define the model namespace
utopiasoftware.edoae.model = {

    /**
     * property acts as a flag that indicates that all hybrid plugins and DOM content
     * have been successfully loaded. It relies on the special device ready event triggered by the
     * intel xdk (i.e. app.Ready) to set the flag.
     *
     * @type {boolean} flag for if the hybrid plugins and DOM content are ready for execution
     */
    isAppReady: false
};


// register the event listener for when all Hybrid plugins and document DOM are ready
document.addEventListener("app.Ready", utopiasoftware.edoae.controller.appReady, false) ;

// listen for the initialisation of the Main-Menu page
$(document).on("init", "#main-menu-page", utopiasoftware.edoae.controller.mainMenuPageViewModel.pageInit);

// listen for when the Main-Menu page is shown
$(document).on("show", "#main-menu-page", utopiasoftware.edoae.controller.mainMenuPageViewModel.pageShow);

// listen for when the Main-Menu page is hidden
$(document).on("hide", "#main-menu-page", utopiasoftware.edoae.controller.mainMenuPageViewModel.pageHide);

// listen for the initialisation of the Events Schedule page
$(document).on("init", "#events-schedule-page", utopiasoftware.edoae.controller.eventsSchedulePageViewModel.pageInit);

// listen for when the Events Schedule page is shown
$(document).on("show", "#events-schedule-page", utopiasoftware.edoae.controller.eventsSchedulePageViewModel.pageShow);

// listen for the initialisation of the Hotels page
$(document).on("init", "#hotels-page", utopiasoftware.edoae.controller.hotelsPageViewModel.pageInit);

// listen for when the Hotel page is shown
$(document).on("show", "#hotels-page", utopiasoftware.edoae.controller.hotelsPageViewModel.pageShow);