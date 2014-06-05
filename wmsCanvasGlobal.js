$(document).ready(function () {

	/***********************************************
	 ** People: Add Face Book and Learning Mode
	 ***********************************************/
	// Url must match this pattern
	if (window.location.href.match(/\/courses\/\d+\/users/ig)) {
		// Listen for completion of all AJAX calls, then insert the Learning Mode button
		$(document).ajaxComplete(function () {
			if ($("#wms_roster_btn_learning").length == 0) {
				// Insert the Learning Mode button
				$("DIV#content.container-fluid DIV DIV.v-gutter TABLE.roster").before('<div id="wms_roster_controls"><button id="wms_roster_btn_learning" class="btn btn-small" title="(Photos viewable on-campus or via VPN)"><i class="icon-user"></i> Show Face Book</button>&nbsp;&nbsp;<a href="#" id="wms_roster_toggle_names" title=""></a><br /><br /></div>');
			}
			else {
				// Avoid creating duplicate buttons
				return false;
			}

			// Toggle: Learning Mode button
			$("#wms_roster_btn_learning").toggle(function (event) {

				// Turn learning mode: ON
				$("#wms_roster_btn_learning").html("<i class=\"icon-user\"></i> Return to List");

				// Initial state of hyperlink
				$("#wms_roster_toggle_names").text("Turn Learning Mode On").prop("title", "Hide names");

				// Toggle: Names hyperlink
				$("#wms_roster_toggle_names").toggle(function (event) {
					// Hide the name/role
					$("#wms_roster_toggle_names").text("Turn Learning Mode Off").prop("title", "Show names");
					$(".wms_roster_user small").addClass("hide");
					// Display name/role upon image hover
					$("#wms_roster_grid .wms_roster_user").hover(function () {
						$(this).find("small").removeClass("hide");
					}, function () {
						$(this).find("small").addClass("hide");
					});
				}, function () {
					// Show the name/role
					$("#wms_roster_toggle_names").text("Turn Learning Mode On").prop("title", "Hide names");
					$(".wms_roster_user small").removeClass("hide");
					// Display name/role upon image hover
					$("#wms_roster_grid .wms_roster_user").hover(function () {
						$(this).find("small").removeClass("hide");
					}, function () {
						$(this).find("small").removeClass("hide");
					});
				});

				// Create array to copy desired contents
				var createGrid = "";
				var extractHTMLObjects = $("TABLE.roster TBODY TR.rosterUser");
				$.each(extractHTMLObjects, function (index, value) {
					// console.log(index + "/" + $(value).html()); // produces: 5/[object HTMLTableCellElement]
					var img = $(this).find('td:nth-child(1)').html();
					var name = $(this).find('td:nth-child(2)').html();
					var role = $(this).find('td:nth-child(5)').text();

					var user_info = img + "<small class=\"\">" + name + "</small><br /><small class=\"\">" + role + "</small>";
					createGrid += "<div class=\"wms_roster_user\">" + user_info + "</div>";
				});
				createGrid = "<div id=\"wms_roster_grid\">" + createGrid + "</div>";

				// Display grid (add it to DOM)
				$("TABLE.roster.table.table-hover.table-striped.table-condensed.table-vertically-center").before(createGrid);
				// Hide Canvas default student table
				$("TABLE.roster.table.table-hover.table-striped.table-condensed.table-vertically-center").addClass("hide");
			}, function () {
				// Turn learning mode: OFF
				$("#wms_roster_btn_learning").html("<i class=\"icon-user\"></i> Show Face Book").prop("title", "(Photos viewable on-campus or via VPN)");
				// Remove Link: Hide Names
				$("#wms_roster_toggle_names").text("").prop("title", "");
				// Remove grid from DOM
				$("#wms_roster_grid").remove();
				// Restore Canvas default student table
				$("TABLE.roster.table.table-hover.table-striped.table-condensed.table-vertically-center").removeClass("hide");
			});

		}); // END OF: (document).ajaxComplete
	}


	/***********************************************
	 ** Add Presenter View (zoom main div; hide all other columns)
	 ***********************************************/
	/*
	 * START: Scale a page using CSS3
	 * @param minWidth {Number} The width of your wrapper or your page's minimum width.
	 * @return {Void}
	 * author of scalePage fxn: http://binarystash.blogspot.com/2013/04/scaling-entire-page-through-css3.html
	 */
	function scalePage(minWidth) {

		//Check parameters
		if (minWidth == "") {
			console.log("minWidth not defined. Exiting");
			return;
		}

		//Do not scale if a touch device is detected.
		if (isTouchDevice()) {
			return;
		}

		//The 'body' tag should generally be the parent element, but hack works better with Canvas
		var parentElem = "#wrapper-container";

		//Wrap content to prevent long vertical scrollbars
		$(parentElem).wrapInner('<div id="resizer-boundary" />');
		$("#resizer-boundary").wrapInner('<div id="resizer-supercontainer" />');

		var boundary = $("#resizer-boundary");
		var superContainer = $("#resizer-supercontainer");

		//Get current dimensions of content
		var winW = $(window).width();
		var docH = $(parentElem).height();

		scalePageNow();
		$(window).resize(scalePageNow);

		//Nested functions

		function scalePageNow() {
			//Defining the width of 'supercontainer' ensures that content will be
			//centered when the window is wider than the original content.
			superContainer.width(minWidth);

			//Get the width of the window
			winW = $(window).width();

			var newWidth = winW / minWidth; //percentage
			var newHeight = (docH * (newWidth * minWidth)) / minWidth; //pixel
			superContainer.css({
				"transform": "scale(" + newWidth + ")",
				"transform-origin": "0 0",
				"-ms-transform": "scale(" + newWidth + ")",
				"-ms-transform-origin": "0 0",
				"-moz-transform": "scale(" + newWidth + ")",
				"-moz-transform-origin": "0 0",
				"-o-transform": "scale(" + newWidth + ")",
				"-o-transform-origin": "0 0",
				"-webkit-transform": "scale(" + newWidth + ")",
				"-webkit-transform-origin": "0 0"
			});
			boundary.css({
				"position": "relative",
				"overflow": "hidden",
				"height": newHeight + "px"
			});
		}

		function isTouchDevice() {
			return !!('ontouchstart' in window || window.navigator.msMaxTouchPoints);
		}
	}

	// END OF FUNCTION: scalePage()

	$("NAV#breadcrumbs UL LI").last().after('<li style="float:right; background-image:none;"><div id="wms_presenter_exit_btn"><div id="wms_presenter_exit_text" class="wmsPresenterRotate wmsDisplayNone">Exit&nbsp;Presenter&nbsp;View</div><a id="wms_presenter_breadcrumb" class="btn-mini" href="#" title="Enable Presenter View"><i class="icon-off"></i> Presenter View</a>&nbsp;&nbsp;</div></li>');

	// Presenter View: Create custom toggle click state
	(function ($) {
		$.fn.togglePresenterView = function () {
			var ele = this;
			ele.data('clickState', 0);
			ele.click(function () {
				if (ele.data('clickState')) {
					// refresh page
					location.reload();
				}
				else {
					// hide breadcrumb link and page elements
					$("#wms_presenter_breadcrumb").addClass("wmsDisplayNone");
					$("DIV#header").addClass("wmsDisplayNone");
					$("DIV#left-side").addClass("wmsDisplayNone");
					$("DIV#right-side-wrapper").addClass("wmsDisplayNone");
					$("DIV#main").addClass("wmsMarginZero").css("cssText", "padding-left: 25px;max-width: 900px !important;"); // max-width should match value given to scalePage(), below
					// force all images to zoom correctly and avoid cutting off images; requires removing the default style: IMG{max-width:1050px}
					$("IMG").css("cssText","max-width: 100% !important;");

					// do scale function
					scalePage(900); // set somewhat arbitrary hardcoded minWidth value

					// show exit button (on extreme left side)
					$("#wms_presenter_exit_btn").addClass("wmsPresenterExit").prop("title", "Exit Presenter View");
					$("#wms_presenter_exit_text").removeClass("wmsDisplayNone");
				}
				ele.data('clickState', !ele.data('clickState'));
			});
		};
	})(jQuery);
	$("#wms_presenter_exit_btn").togglePresenterView();


	/***********************************************
	 ** Customize UI: LOGIN PAGE
	 ***********************************************/
	if (window.location.href.match(/\/login/ig)) {
		// change title of page (formerly: Log In to Canvas)
		$(document).attr('title', 'Glow');

		// change labels/text
		$("#login_form label[for=pseudonym_session_unique_id]>span").text("Username");
		$("#login_forgot_password").text("Forgot password?");

		// add tabindex attributes
		$("#login_form INPUT#pseudonym_session_unique_id").prop('tabindex', '1');
		$("#login_form INPUT#pseudonym_session_password").prop('tabindex', '2');
		$("#login_form BUTTON.btn-primary").prop('tabindex', '3');

		// custom footer links (only on login page)
		$("#modal-box-inner").append(
			'<p id="wms-login-footer"><a class="not_external hint-text" href="http://oit.williams.edu/glow/" target="_blank" title="Williams Help">Williams Help</a>&nbsp;<span class="hint-text">&#124;</span>&nbsp;' +
				'<a class="not_external hint-text" href="http://oit.williams.edu/glow/terms-of-service/" target="_blank" title="Terms of service">Terms of service</a></p>'
		);

		// hide standard footer links because login page has custom links (created above)
		$("#footer-links").css("display", "none");

		// MOBILE HACKS
		// Add type=text to username input field (so that default styles apply to it same as to password field)
		$("#login_form.front.face INPUT.input-block-level[name='pseudonym_session[unique_id]']").prop('type', 'text');
		// Change labels/text
		$("#login_form.front.face A.forgot-password").text("Forgot password?");
	}


	/***********************************************
	 ** Customize UI: INTERNAL PAGES
	 ***********************************************/
	// UI Internal pages: Correct gap between buckets and colorbar decorations
	var wmsCoursesLabel = $("#courses_menu_item.menu-item A.menu-item-title").text();
	if (wmsCoursesLabel.match(/Groups/ig)) {
		// Courses & Groups
		$("#courses_menu_item").css("cssText", "margin-right: -10px !important;");
	}
	else {
		// Courses (lacking Groups)
		$("#courses_menu_item").css("cssText", "margin-right: 16px !important;");
	}
	if (!$("#assignments_menu_item.menu-item A.menu-item-title i").hasClass("icon-mini-arrow-down")) {
		// Assignments (lacking arrow)
		$("#assignments_menu_item").css("cssText", "margin-right: 10px !important;");
	}
	;


	/***********************************************
	 ** Footer/Branding Link Overrides
	 ***********************************************/
		// Footer Links: Edit
	$("#footer-links A[href='http://help.instructure.com/']").text('Williams Help').prop('href', 'http://oit.williams.edu/glow/').prop('target','_blank').prop('class','');
	$("#footer-links A[href='http://www.instructure.com/policies/terms-of-use']").prop('href', 'http://oit.williams.edu/glow/terms-of-service/').prop('target','_blank');
	// Footer Links: Add
	// $("#footer-links").append("<a href='http://www.williams.edu'>Williams</a>");


	/***********************************************
	 ** Add Google Analytics
	 ***********************************************/
	(function (i, s, o, g, r, a, m) {
		i['GoogleAnalyticsObject'] = r;
		i[r] = i[r] || function () {
			(i[r].q = i[r].q || []).push(arguments)
		}, i[r].l = 1 * new Date();
		a = s.createElement(o),
			m = s.getElementsByTagName(o)[0];
		a.async = 1;
		a.src = g;
		m.parentNode.insertBefore(a, m)
	})(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');

	ga('create', 'UA-10912569-3', 'auto');
	ga('send', 'pageview');


}); // END OF: (document).ready
