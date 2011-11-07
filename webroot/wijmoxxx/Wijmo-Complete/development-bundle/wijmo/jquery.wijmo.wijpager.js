/*globals jQuery,$*/
/*jslint white: false */
/*
 *
 * Wijmo Library 1.4.1
 * http://wijmo.com/
 *
 * Copyright(c) ComponentOne, LLC.  All rights reserved.
 * 
 * Dual licensed under the Wijmo Commercial or GNU GPL Version 3 licenses.
 * licensing@wijmo.com
 * http://wijmo.com/license
 *
 *
 * * Wijmo Pager widget.
 *
 * Depends:
 *  jquery-1.4.2.js
 *  jquery.ui.core.js
 *  jquery.ui.widget.js
 *
 */
(function ($) {
	"use strict";
	$.widget("wijmo.wijpager", {
		options: {
			/// <summary>
			/// The class of the first-page button.
			/// Default: ui-icon-seek-first.
			/// Type: String
			/// Code example: $("#element").wijpager( { firstButtonClass: "ui-icon-seek-first" } );
			/// </summary>
			firstPageClass: "ui-icon-seek-first",

			/// <summary>
			/// The text to display for the first-page button.
			/// Default: "First".
			/// Type: String
			/// Code example: $("#element").wijpager( { firstPageText: "First" } );
			/// </summary>
			firstPageText: "First",

			/// <summary>
			/// The class of the last-page button.
			/// Default: ui-icon-seek-end.
			/// Type: String
			/// Code example: $("#element").wijpager( { lastPageClass: "ui-icon-seek-end" } );
			/// </summary>
			lastPageClass: "ui-icon-seek-end",

			/// <summary>
			/// The text to display for the last-page button.
			/// Default: "Last".
			/// Type: String
			/// Code example: $("#element").wijpager( { lastPageText: "Last" } );
			/// </summary>
			lastPageText: "Last",

			/// <summary>
			/// Determines the pager mode. Possible values are: "nextPrevious", "nextPreviousFirstLast", "numeric", "numericFirstLast".
			/// 
			/// "nextPrevious" - a set of pagination controls consisting of Previous and Next buttons.
			/// "nextPreviousFirstLast" - a set of pagination controls consisting of Previous, Next, First, and Last buttons.
			/// "numeric" - a set of pagination controls consisting of numbered link buttons to access pages directly.
			/// "numericFirstLast" - a set of pagination controls consisting of numbered and First and Last link buttons.
			///
			/// Default: "numeric".
			/// Type: String
			/// Code example: $("#element").wijpager( { mode: "numeric" } );
			/// </summary>
			mode: "numeric",

			/// <summary>
			/// The class of the next-page button.
			/// Default: ui-icon-seek-next.
			/// Type: String
			/// Code example: $("#element").wijpager( { nextPageClass: "ui-icon-seek-next" } );
			/// </summary>
			nextPageClass: "ui-icon-seek-next",

			/// <summary>
			/// The text to display for the next-page button.
			/// Default: "Next".
			/// Type: String
			/// Code example: $("#element").wijpager( { nextPageText: "Next" } );
			/// </summary>
			nextPageText: "Next",

			/// <summary>
			/// The number of page buttons to display in the pager.
			/// Default: 10.
			/// Type: Number.
			/// Code example: $("#element").wijpager( { pageButtonCount: 10 } );
			/// </summary>
			pageButtonCount: 10,

			/// <summary>
			/// The class of the previous-page button.
			/// Default: ui-icon-seek-prev.
			/// Type: String
			/// Code example: $("#element").wijpager( { previousPageClass: "ui-icon-seek-prev" } );
			/// </summary>
			previousPageClass: "ui-icon-seek-prev",

			/// <summary>
			/// The text to display for the previous-page button.
			/// Default: "Previous".
			/// Type: String
			/// Code example: $("#element").wijpager( { previousPageText: "Previous" } );
			/// </summary>
			previousPageText: "Previous",

			/// <summary>
			/// Total number of pages.
			/// Default: 1.
			/// Type: Number.
			/// Code example: $("#element").wijpager( { pageCount: 1 } );
			/// </summary>
			pageCount: 1,

			/// <summary>
			/// The zero-based index of the current page.
			/// Default: 0.
			/// Type: Number.
			/// Code example: $("#element").wijpager( { pageIndex: 0 } );
			/// </summary>
			pageIndex: 0,

			/// <summary>
			/// pageIndexChanging event handler. A function called when page index is changing. Cancellable.
			/// Default: null.
			/// Type: Function.
			/// Code example:
			/// Supply a callback function to handle the pageIndexChanging event:
			/// $("#element").wijpager({ pageIndexChanging: function (e, args) { } });
			/// Bind to the event by type:
			/// $("#element").bind("wijpagerpageindexchanging", function (e, args) { });
			/// </summary>
			///
			/// <param name="e" type="Object">jQuery.Event object.</param>
			/// <param name="args" type="Object">
			/// The data whith this event.
			/// args.newPageIndex - new page index.
			/// </param>
			pageIndexChanging: null,

			/// <summary>
			/// pageIndexChanged event handler. A function called when the page index is changed.
			/// Default: null.
			/// Type: Function.
			/// Code example:
			/// Supply a callback function to handle the pageIndexChanged event:
			/// $("#element").wijpager({ pageIndexChanged: function (e) { } });
			/// Bind to the event by type:
			/// $("#element").bind("wijpagerpageindexchanged", function (e) { });
			/// </summary>
			///
			/// <param name="e" type="Object">jQuery.Event object.</param>
			pageIndexChanged: null
		},

		_create: function () {
			this.element.addClass("ui-widget wijmo-wijpager ui-helper-clearfix");
			if (this.options.disabled) {
				this.disable();
			}
			this._refresh();
		},

		_init: function () {
		},

		destroy: function () {
			///	<summary>
			///	Destroy wijpager widget and reset the DOM element.
			///	</summary>
			this.element.removeClass("ui-widget wijmo-wijpager ui-helper-clearfix");
			this.$ul.remove();
			$.Widget.prototype.destroy.apply(this, arguments);
		},

		_setOption: function (key, value) {
			$.Widget.prototype._setOption.apply(this, arguments);
			this._refresh();
		},

		_refresh: function () {
			this._validate();

			if (this.$ul) {
				this.$ul.remove();
			}

			this.element.append(this.$ul = $("<ul class=\"ui-list ui-corner-all ui-widget-content ui-helper-clearfix\" role=\"tablist\"></ul>"));

			switch ((this.options.mode || "").toLowerCase()) {
				case "nextprevious":
					this._createNextPrev(false);
					break;

				case "nextpreviousfirstlast":
					this._createNextPrev(true);
					break;

				case "numeric":
					this._createNumeric(false);
					break;

				case "numericfirstlast":
					this._createNumeric(true);
					break;
			}
		},

		_validate: function () {
			if (isNaN(this.options.pageCount) || this.options.pageCount < 1) {
				this.options.pageCount = 1;
			}

			if (isNaN(this.options.pageIndex) || this.options.pageIndex < 0) {
				this.options.pageIndex = 0;
			} else if (this.options.pageIndex >= this.options.pageCount) {
				this.options.pageIndex = this.options.pageCount - 1;
			}

			if (isNaN(this.options.pageButtonCount) || this.options.pageButtonCount < 1) {
				this.options.pageButtonCount = 1;
			}
		},

		_createNextPrev: function (addFirstLast) {
			// first button
			if (addFirstLast && this.options.pageIndex) {
				this.$ul.append(this._createPagerItem(false, this.options.firstPageText)
									.append(this._createPagerControl(1, this.options.firstPageText,
										 this.options.firstPageClass))
								);
			}

			// previous button
			if (this.options.pageIndex) {
				this.$ul.append(this._createPagerItem(false, this.options.previousPageText)
									.append(this._createPagerControl(this.options.pageIndex,
										this.options.previousPageText, this.options.previousPageClass))
								);
			}

			// next button
			if (this.options.pageIndex + 1 < this.options.pageCount) {
				this.$ul.append(this._createPagerItem(false, this.options.nextPageText)
									.append(this._createPagerControl(this.options.pageIndex + 2,
										this.options.nextPageText, this.options.nextPageClass))
								);
			}

			// last button
			if (addFirstLast && (this.options.pageIndex + 1 < this.options.pageCount)) {
				this.$ul.append(this._createPagerItem(false, this.options.lastPageText)
									.append(this._createPagerControl(this.options.pageCount,
										this.options.lastPageText, this.options.lastPageClass))
								);
			}
		},

		_createNumeric: function (addFirstLast) {
			var currentPage = this.options.pageIndex + 1,
			startPageNumber = 1,
			endPageNumber = Math.min(this.options.pageCount, this.options.pageButtonCount),
			i;

			if (currentPage > endPageNumber) {
				startPageNumber = (Math.floor(this.options.pageIndex / this.options.pageButtonCount)) * this.options.pageButtonCount + 1;

				endPageNumber = startPageNumber + this.options.pageButtonCount - 1;
				endPageNumber = Math.min(endPageNumber, this.options.pageCount);

				if (endPageNumber - startPageNumber + 1 < this.options.pageButtonCount) {
					startPageNumber = Math.max(1, endPageNumber - this.options.pageButtonCount + 1);
				}
			}

			// first + "..." buttons
			if (startPageNumber !== 1) {
				// first button
				if (addFirstLast) {
					this.$ul.append(this._createPagerItem(false, this.options.firstPageText)
						.append(this._createPagerControl(1, this.options.firstPageText, this.options.firstPageClass))
					);
				}

				// "..." button
				this.$ul.append(this._createPagerItem(false, "...").append(this._createPagerControl(startPageNumber - 1, "...", "")));
			}

			// page numbers buttons
			for (i = startPageNumber; i <= endPageNumber; i++) {
				this.$ul.append(this._createPagerItem(i === currentPage, i.toString())
					.append(this._createPagerControl(i, i.toString(), "", i === currentPage)));
			}

			// "..." + last buttons
			if (this.options.pageCount > endPageNumber) {
				this.$ul.append(this._createPagerItem(false, "...").append(this._createPagerControl(endPageNumber + 1, "...", "")));

				// last button
				if (addFirstLast) {
					this.$ul.append(this._createPagerItem(false, this.options.lastPageText)
						.append(this._createPagerControl(this.options.pageCount, this.options.lastPageText, this.options.lastPageClass)));
				}
			}
		},

		_createPagerItem: function (active, title) {
			var $li = $("<li />")
				.addClass("ui-page ui-corner-all")
				.attr({ "role": "tab", "aria-label": title, "title": title });
			//                .css("textAlign", "left")

			if (active) {
				$li
					.addClass("ui-state-active")
					.attr("aria-selected", "true");
			} else {
				$li
				.addClass("ui-state-default")
				.hover(
					function () {
						$(this).removeClass("ui-state-default").addClass("ui-state-hover");
					},
					function () {
						$(this).removeClass("ui-state-hover").addClass("ui-state-default");
					}); //.unbind('mouseenter mouseleave');
			}

			return $li;
		},

		_createPagerControl: function (pageIndex, btnText, btnClass, disabled) {
			var ctrl = null;

			if (disabled) {
				ctrl = $("<span />");
			} else {
				if (btnClass) {
					ctrl = $("<span />").addClass("ui-icon " + btnClass);
				} else {
					ctrl = $("<a/>").attr("href", "#");
				}
			}

			ctrl.attr("title", btnText).text(btnText);

			if (!disabled) {
				ctrl.bind("click." + this.widgetName, { newPageIndex: pageIndex - 1 }, $.proxy(this._onClick, this)); // pageIndex is 1-based.
			}

			return ctrl;
		},

		_onClick: function (arg) {
			if (this.options.disabled) {
				return false;
			}

			var eventArg = { newPageIndex: arg.data.newPageIndex, handled: false };

			if (this._trigger("pageIndexChanging", null, eventArg) !== false) {
				if (this.options.pageIndex !== eventArg.newPageIndex) {
					this.options.pageIndex = eventArg.newPageIndex;
					if (!eventArg.handled) {
						this._refresh();
					}
					this._trigger("pageIndexChanged", null, { newPageIndex: eventArg.newPageIndex });
				}
			}

			return false;
		}
	});
})(jQuery);
