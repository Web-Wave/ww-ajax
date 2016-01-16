(function ($) {

    // the transition event is not the same for each browser, so we must find which one we should try to listen to
    // this function is out of the Drupal.behaviors because we do not need to activate this function more than one time

    function  getTransitionEvent(){

        var transitionEvent;
        var t, el = document.createElement("fakeelement");
        var transitions = {
            "transition"      : "transitionend",
            "OTransition"     : "oTransitionEnd",
            "MozTransition"   : "transitionend",
            "WebkitTransition": "webkitTransitionEnd"
        };
        for (t in transitions){
            if (el.style[t] !== undefined){
                transitionEvent= transitions[t];
            }
        }
        return transitionEvent;
    }

    var currentTransitionEvent = getTransitionEvent();

    Drupal.behaviors.ww_node_ajax = {
        attach:
            function (context) {
            jQuery('.ajaxrequest').once().click(function (e) {
                e.preventDefault();
                var urlrequest = jQuery(this).attr('href');
                var id = jQuery(this).attr('data-tid');
                var ajax_url = '/ajax/brand/' + id;
                jQuery.ajax({
                    url: ajax_url,
                    success: function (data) {
                        var html = data.data;
                        jQuery('section#main_wrapper #layout-main-container #layout-main').fadeOut(242);
                        jQuery('section#main_wrapper #layout-main-container #AjaxSlideContent').html(html);
                        if (jQuery('.slideout').length == 0) {
                            jQuery('section#main_wrapper #layout-main-container #AjaxSlideContent').addClass('slideout');
                        }
                    },
                    complete: function (data) {
                        if(typeof window.history.pushState === 'function'){
                            window.history.pushState({}, '', urlrequest);
                        }
                        Drupal.attachBehaviors();
                    }
                });
            });

            if(jQuery('body').hasClass('page-brand')){
                jQuery('.close_block').once().click(function (e){
                    e.preventDefault();
                    var url = jQuery(this).attr('href');
                    if(jQuery('.slideout').length > 0){
                        // if we have animation
                        jQuery('section#main_wrapper #layout-main-container #AjaxSlideContent').one(currentTransitionEvent,function(event) {
                            jQuery('section#main_wrapper #layout-main-container #layout-main').fadeIn(242);
                            jQuery('section#main_wrapper #layout-main-container #AjaxSlideContent').html('');
                        });
                        jQuery('section#main_wrapper #layout-main-container #AjaxSlideContent').removeClass('slideout');
                    }else{
                        // if we don't have animation
                        jQuery('section#main_wrapper #layout-main-container #AjaxSlideContent').html('');
                        jQuery('section#main_wrapper #layout-main-container #layout-main').fadeIn(242);
                    }
                    if(typeof window.history.pushState === 'function'){
                        window.history.pushState({}, '', url);
                    }
                });
            }
        },
    }
})(jQuery);
