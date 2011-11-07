/*globals jQuery,$,document*/
/*jslint white: false*/

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
 * * Wijmo Grid Widget.
 *
 * Depends:
 * jquery-1.4.2.js
 * jquery.ui.core.js
 * jquery.ui.widget.js
 * jquery.glob.js
 * jquery.wijmo.wijutil.js
 * jquery.wijmo.wijdatasource.js
 *
 * Optional dependencies for paging feature:
 * jquery.wijmo.wijpager.js
 *
 * Optional dependencies for scrolling feature:
 * jquery.wijmo.wijsuperpanel.js
 *
 * Optional dependencies for filtering feature:
 * jquery.ui.position.js
 * jquery.wijmo.wijinputdate.js
 * jquery.wijmo.wijinputmask.js
 * jquery.wijmo.wijinputnumber.js
 * jquery.wijmo.wijlist.js
 *
 * Optional dependencies for column moving feature:
 * jquery.ui.draggable.js
 * jquery.ui.droppable.js
 * jquery.ui.position.js
 *
 */

(function ($) {
	"use strict";
	$.widget("wijmo.wijgrid", {
		options: {
			/// <summary>
			/// A value indicating whether columns can be sized.
			/// Default: false.
			/// Type: Boolean.
			/// Code example: $("#element").wijgrid({ allowColSizing: false });
			/// </summary>
			allowColSizing: false,

			/// <summary>
			/// A value indicating whether columns can be moved.
			/// Default: false.
			/// Type: Boolean.
			/// Code example: $("#element").wijgrid({ allowColMoving: false });
			/// </summary>
			allowColMoving: false,

			/// <summary>
			/// A value indicating whether keyboard navigation is allowed.
			/// Default: false.
			/// Type: Boolean.
			/// Code example: $("#element").wijgrid({ allowKeyboardNavigation: false });
			/// </summary>
			allowKeyboardNavigation: false,

			/// <summary>
			/// A value indicating whether the widget can be paged.
			/// Default: false.
			/// Type: Boolean.
			/// Code example: $("#element").wijgrid({ allowPaging: false });
			/// </summary>
			allowPaging: false,

			/// <summary>
			/// A value indicating whether the widget can be sorted.
			/// Default: false.
			/// Type: Boolean.
			/// Code example: $("#element").wijgrid({ allowSorting: false });
			/// </summary>
			allowSorting: false,

			/// <summary>
			/// A value indicating whether editing is enabled.
			/// Default: false.
			/// Type: Boolean.
			/// Code example: $("#element").wijgrid({ allowEditing: false });
			/// </summary>
			allowEditing: false,

			/// <summary>
			/// Determines whether wijgrid should parse underlying data at each operation requiring data re-fetching, like calling the ensureControl(true) method, paging, sorting, etc.
			/// If the option is disabled, wijgrid parses data only at the first fetch.
			/// The option is ignored if dynamic data load feature is used, in this case data are always parsed.
			///
			/// Default: true
			/// Type: Boolean.
			/// Code example: $("#element").wijgrid({ alwaysParseData: true });
			/// </summary>
			///
			/// <remarks>
			/// Turning off the option enhance wijgrid performance but if underlying data are changed by a developer it is necessary
			/// that changes match column datatype.
			/// </remarks>
			alwaysParseData: true,

			/// <summary>
			/// Determines behavior for column autogeneration.
			///
			/// Possible values are: "none", "append", "merge".
			///
			/// "none": column auto-generation is turned off.
			/// "append": a column will be generated for each data field and added to the end of the columns collection.
			/// "merge": each column having dataKey option not specified will be automatically bound to the first unreserved data field.
			/// For each data field not bound to any column a new column will be generated and added to the end of the columns collection.
			/// To prevent automatic binding of a column to a data field set its dataKey option to null.
			///
			/// Default: "merge".
			/// Type: String.
			/// Code example: $("#element").wijgrid({ columnsAutogenerationMode: "merge" });
			/// </summary>
			///
			/// <remarks>
			/// Note: columns autogeneration process affects the options of columns and the columns option itself.
			/// </remarks>
			columnsAutogenerationMode: "merge",

			/// <summary>
			/// Function used for styling the cells in wijgrid.
			/// Default: undefined,
			/// Type: Function.
			/// Code example: $("#element").wijgrid({ cellStyleFormatter: function(args) { } });
			/// </summary>
			/// <param name="args" type="Object">
			/// args.$cell: jQuery object that represents cell to format.
			/// args.column: Options of the column to which the cell belongs.
			/// args.state: state of a cell to format, the following $.wijmo.wijgrid.renderState values or their combination can be applied to the cell: rendering, current, selected.
			/// args.row: information about associated row.
			/// args.row.$rows: jQuery object that represents rows to format.
			/// args.row.data: associated data.
			/// args.row.dataRowIndex: data row index.
			/// args.row.dataItemIndex: data item index.
			/// args.row.virtualDataItemIndex: virtual data item index.
			/// args.row.type: type of the row, one of the $.wijmo.wijgrid.rowType values.
			/// </param>
			cellStyleFormatter: undefined,

			/// <summary>
			/// An array of column options.
			/// Default: [].
			/// Type: Array.
			/// Code example: $("#element").wijgrid({ columns: [ { headerText: "column0", allowSort: false }, { headerText: "column1", dataType: "number" } ] });
			/// </summary>
			columns: [],

			/// <summary>
			/// Determines the culture ID.
			/// Default: "".
			/// Type: String.
			/// Code example: $("#element").wijgrid({ culture: "en" });
			/// </summary>
			culture: "",

			/// <summary>
			/// An array of custom user filters.
			///
			/// Custom user filter is an object which contains the following properties:
			///   name - operator name.
			///   arity - the number of filter operands. Can be either 1 or 2.
			///   css - the name of the CSS-class determining filter icon. If no value is set, then "filter-<name.toLowerCase()>" class is used.
			///   applicableTo - an array of datatypes to which the filter can be applied. Possible values for elements of the array are "string", "number", "datetime", "currency" and "boolean".
			///   operator - comparison operator, the number of accepted parameters depends upon the arity. The first parameter is a data value, the second parameter is a filter value.
			///
			/// Default: [].
			/// Type: Array.
			/// Code example:
			///
			///   var oddFilterOp = {
			///     name: "customOperator-Odd",
			///     arity: 1,
			///     applicableTo: ["number"],
			///     operator: function(dataVal) { return (dataVal % 2 !== 0); }
			///  }
			///
			///  $("#element").wijgrid({ customFilterOperators: [oddFilterOp] });
			/// </summary>
			customFilterOperators: [],

			/// <summary>
			/// Determines the datasource.
			/// Possible datasources include:
			///
			///   1. A DOM table. This is the default datasource, used if the data option is null.
			///     Table must be contained in a DOM element to which wijgrid is attached, must have no cells with rowSpan and colSpan attributes.
			///   2. A two-dimensional array, such as [[0, "a"], [1, "b"]]
			///   3. An array of hashes, such as [{field0: 0, field1: "a"}, {field0: 1, field1: "b'}]
			///   4. A wijdatasource
			///
			/// Type: Object.
			/// Default: null
			/// Code example:
			/// /* DOM table */
			/// $("#element").wijgrid();
			///
			/// /* two-dimensional array */
			/// $("#element").wijgrid({ data: [[0, "a"], [1, "b"]] });
			/// </summary>
			data: null,

			/// <summary>
			/// Determines whether to use number type column width as the real width of the column.
			/// Default: false.
			/// Type: Boolean.
			/// Code example: $("#element").wijgrid({ ensurePxWidth: true });
			/// </summary>
			/// <remarks>
			/// If this option is set to true, wijgrid will not expand itself to expand the available space.
			/// Instead, it will use the width option of each column widget.
			/// </remarks>
			ensureColumnsPxWidth: false,

			/// <summary>
			/// Determines the order of items in the filter dropdown list.
			/// Possible values are: "none", "alphabetical", "alphabeticalCustomFirst" and "alphabeticalEmbeddedFirst"
			///
			/// "none" - operators follow the order of addition, built-in operators goes before custom ones.
			/// "alphabetical" - operators are sorted alphabetically.
			/// "alphabeticalCustomFirst" - operators are sorted alphabetically with custom operators going before built-in ones.
			/// "alphabeticalEmbeddedFirst" - operators are sorted alphabetically with built-in operators going before custom operators.
			///
			/// Note: "NoFilter" operator is always first.
			///
			/// Type: String.
			/// Default: "alphabeticalCustomFirst"
			/// Code example: $("#element").wijgrid({ filterOperatorsSortMode: "alphabeticalCustomFirst" });
			/// </summary>
			filterOperatorsSortMode: "alphabeticalCustomFirst",

			/// <summary>
			/// Determines the caption of the group area.
			/// Default: "Drag a column here to group by that column.".
			/// Type: String.
			/// Code example: $("#element").wijgrid({ groupAreaCaption: "Drag a column here to group by that column." });
			/// </summary>
			groupAreaCaption: "Drag a column here to group by that column.",

			/// <summary>
			/// Determines the indentation of the groups.
			/// Default: 10.
			/// Type: Number.
			/// Code example: $("#element").wijgrid({ groupIndent: 10 });
			/// </summary>
			groupIndent: 10,

			/// <summary>
			/// Cell values equal to this property value are considered as null value.
			/// Case-sensitive for built-in parsers.
			/// Default: undefined.
			/// Type: String.
			/// Code example: $("#element").wijgrid({ nullString: "" });
			/// </summary>
			nullString: undefined,

			/// <summary>
			/// Determines the zero-based index of the current page.
			/// The default value is 0.
			/// Type: Number.
			/// Code example: $("#element").wijgrid({ pageIndex: 0 });
			/// </summary>
			pageIndex: 0,

			/// <summary>
			/// Number of rows to place on a single page.
			/// The default value is 10.
			/// Type: Number.
			/// Code example: $("#element").wijgrid({ pageSize: 10 });
			/// </summary>
			pageSize: 10,

			/// <summary>
			/// Pager settings.
			/// Note: See jquery.wijmo.wijpager.js for more information.
			/// Type: Object.
			/// Default: { mode: "numeric", pageButtonCount: 10, position: "bottom" }.
			/// Code example: $("#element").wijgrid({ pagerSettings: { position: "bottom" } });
			/// </summary>
			pagerSettings: {
				mode: "numeric",
				pageButtonCount: 10,
				position: "bottom"
			},

			/// A value indicating whether DOM cell attributes can be passed within a data values.
			/// Default: false.
			/// Type: Boolean.
			/// Code example: $("#element").wijgrid({ readAttributesFromData: false });
			/// </summary>
			/// <remarks>
			/// This option allows binding collection of values to data and automatically converting them as attributes of corresponded DOM table cells during rendering.
			///
			/// Values should be passed as an array of two items, where first item is a value of the data field, the second item is a list of values:
			///
			/// $("#element").wijgrid({
			///   data: [
			///     [ [1, { "style": "color: red", "class": "myclass" } ], a ]
			///   ]
			/// });
			///
			/// or
			///
			/// $("#element").wijgrid({
			///   data: [
			///     { col0: [1, { "style": "color: red", "class": "myclass" }], col1: "a" }
			///   ]
			/// });
			///
			/// Note: during conversion wijgrid extracts the first item value and makes it data field value, the second item (list of values) is removed:
			///  [ { col0: 1, col1: "a" } ]
			/// 
			/// If DOM table is used as a datasource then attributes belonging to the cells in tBody section of the original table will be read and applied to the new cells.
			///
			/// rowSpan and colSpan attributes are not allowed.
			/// </remarks>
			readAttributesFromData: false,

			/// <summary>
			/// Function used for styling the rows in wijgrid.
			/// Default: undefined,
			/// Type: Function.
			/// Code example: $("#element").wijgrid({ rowStyleFormatter: function(args) { } });
			/// </summary>
			/// <param name="args" type="Object">
			/// args.state: state of a row to format, the following $.wijmo.wijgrid.renderState values or their combination can be applied to the row: rendering, current, hovered.
			/// args.$rows: jQuery object that represents rows to format.
			/// args.data: associated data.
			/// args.dataRowIndex: data row index.
			/// args.dataItemIndex: data item index.
			/// args.virtualDataItemIndex: virtual data item index.
			/// args.type: type of the row, one of the $.wijmo.wijgrid.rowType values.
			/// </param>
			rowStyleFormatter: undefined,

			/// <summary>
			/// Determines the scrolling mode.
			///
			/// Possible values are:
			/// "none": scrolling is not used, staticRowIndex value is ignored.
			/// "auto": scrollbars appear automatically depending upon content size.
			/// "horizontal": horizontal scrollbar is active.
			/// "vertical": vertical scrollbar is active.
			/// "both": both horizontal and vertical scrollbars are active.
			///
			/// Default: "none".
			/// Type: String.
			/// Code example: $("#element").wijgrid({ scrollMode: "none" });
			/// </summary>
			scrollMode: "none",

			/// <summary>
			/// Represents selection behavior.
			/// Possible values are: "none", "singleCell", "singleColumn", "singleRow", "singleRange", "multiColumn", "multiRow" and "multiRange".
			///
			/// "none": selection is turned off.
			/// "singleCell": only a single cell can be selected at the same time.
			/// "singleColumn": only a single column can be selected at the same time.
			/// "singleRow": only a single row can be selected at the same time.
			/// "singleRange": only a single range of cells can be selected at the same time.
			/// "multiColumn": it is possible to select more than one row at the same time using the mouse and the CTRL or SHIFT keys.
			/// "multiRow": it is possible to select more than one row at the same time using the mouse and the CTRL or SHIFT keys.
			/// "multiRange": it is possible to select more than one cells range at the same time using the mouse and the CTRL or SHIFT keys.
			///
			/// Default: "singleRow".
			/// Type: String.
			/// Code example: $("#element").wijgrid({ selectionMode: "singleRow" });
			/// </summary>
			selectionMode: "singleRow",

			/// <summary>
			/// A value indicating whether filter row is visible.
			/// Default: false.
			/// Type: Boolean.
			/// Code example: $("#element").wijgrid({ showFilter: false });
			/// </summary>
			showFilter: false,

			/// <summary>
			/// A value indicating whether footer row is visible.
			/// Default: false.
			/// Type: Boolean.
			/// Code example: $("#element").wijgrid({ showFooter: false });
			/// </summary>
			showFooter: false,

			/// <summary>
			/// A value indicating whether group area is visible.
			/// Default: false.
			/// Type: Boolean.
			/// Code example: $("#element").wijgrid({ showGroupArea: false });
			/// </summary>
			showGroupArea: false,

			/// <summary>
			/// A value indicating whether the row header is visible.
			/// Default: false.
			/// Type: Boolean.
			/// Code example: $("#element").wijgrid({ showRowHeader: false });
			/// </summary>
			showRowHeader: false,

			/*dma> Commented by YK for removing unsupported options.
			/// <summary>
			/// A value indicating whether the grid view should split content into several views with the ability to resize and scroll each view independently.
			/// Default: false.
			/// Type: Boolean.
			/// Code example: $("#element").wijgrid({ splits: false });
			/// </summary>
			splits: false,

			/// <summary>
			/// Determines the distance in pixels for the vertical splitter. Applicable when the splits option is true.
			/// Default: 50.
			/// Type: Number.
			/// Code example: $("#element").wijgrid({ splitDistanceX: 50 });
			/// </summary>
			splitDistanceX: 50,

			/// <summary>
			/// Determines the distance in pixels for the horizontal splitter. Applicable when the splits option is true.
			/// Default: 50.
			/// Type: Number.
			/// Code example: $("#element").wijgrid({ splitDistanceY: 50 });
			/// </summary>
			splitDistanceY: 50,

			/// <summary>
			/// Indicates the zero-based  index  of  the column that will be shown on the
			/// left when the grid view scrolled horizontally. Note, that all columns
			/// before the static column will be automatically marked as static, too. Set
			/// this option to false or to any negative value if you want to turn
			/// off the static columns feature.
			///
			/// Default: -1.
			/// Type: Number.
			/// Code example: $("#element").wijgrid({ staticColumnIndex: -1 });
			/// </summary>
			staticColumnIndex: -1,*/

			/// <summary>
			/// Indicates whether header is static or not. Static header is always
			/// shown on the top when the wijgrid is scrolled vertically.
			/// Set this option to 0 to turn on the static header feature or to -1 to turn it off.
			///
			/// Default: -1.
			/// Type: Number.
			/// Code example: $("#element").wijgrid({ staticRowIndex: -1 });
			/// </summary>
			staticRowIndex: -1,
			/*<dma*/

			/* --- events */

			/// <summary>
			/// The afterCellEdit event handler. A function called after editing is completed.
			/// Default: null.
			/// Type: Function.
			/// Code example:
			/// Supply a callback function to handle the afterCellEdit event:
			/// $("#element").wijgrid({ afterCellEdit: function (e, args) { } });
			/// Bind to the event by type:
			/// $("#element").bind("wijgridaftercelledit", function (e, args) { });
			/// </summary>
			///
			/// <param name="e" type="Object">jQuery.Event object.</param>
			/// <param name="args" type="Object">
			/// The data with this event.
			/// args.cell: gets the edited cell's information.
			/// args.event: event that initiated the cell updating.
			/// args.handled: gets or sets value determining whether the developer finalizes editing of the cell manually.
			///   The default value is false which means that the widget will try to finalize editing of the cell automatically.
			///   If the developer provides a custom editing front end then this property must be set to true.
			/// </param>
			afterCellEdit: null,

			/// <summary>
			/// The afterCellUpdate event handler. A function called after a cell has been updated.
			/// Default: null.
			/// Type: Function.
			/// Code example:
			/// Supply a callback function to handle the afterCellUpdate event:
			/// $("#element").wijgrid({ afterCellUpdate: function (e, args) { } });
			/// Bind to the event by type:
			/// $("#element").bind("wijgridaftercellupdate", function (e, args) { });
			/// </summary>
			///
			/// <param name="e" type="Object">jQuery.Event object.</param>
			/// <param name="args" type="Object">
			/// The data with this event.
			/// args.cell: gets the edited cell's information.
			/// </param>
			afterCellUpdate: null,

			/// <summary>
			/// The beforeCellEdit event handler. A function called before a cell enters edit mode. Cancellable.
			/// Default: null.
			/// Type: Function.
			/// Code example:
			/// Supply a callback function to handle the beforeCellEdit event:
			/// $("#element").wijgrid({ beforeCellEdit: function (e, args) { } });
			/// Bind to the event by type:
			/// $("#element").bind("wijgridbeforecelledit", function (e, args) { });
			/// </summary>
			///
			/// <param name="e" type="Object">jQuery.Event object.</param>
			/// <param name="args" type="Object">
			/// The data with this event.
			/// args.cell: information about the cell to be edited.
			/// args.event: event initiated cell editing.
			/// args.handled: gets or sets a value determining whether developer initiates cell editor(s) manually.
			///   The default value is false which means that widget will trying to provide editing control automatically.
			///   If cells contain custom controls or if developer wants to provide a custom editing front end then he
			///   must set this property to true.
			///</param>
			beforeCellEdit: null,

			/// <summary>
			/// The beforeCellUpdate event handler. A function called before a cell is updated.
			/// Default: null.
			/// Type: Function.
			///
			/// Code example:
			/// Supply a callback function to handle the beforeCellUpdate event:
			/// $("#element").wijgrid({ beforeCellUpdate: function (e, args) { } });
			/// Bind to the event by type:
			/// $("#element").bind("wijgridbeforecellupdate", function (e, args) { });
			/// </summary>
			///
			/// <param name="e" type="Object">jQuery.Event object.</param>
			/// <param name="args" type="Object">
			/// The data with this event.
			/// args.cell: gets information of the edited cell.
			/// args.value: returns the new cell value. If the property value is not changed the widget will try to
			///   extract the new cell value automatically. If the developer provides custom editing front end then
			///   the new cell value must be returned within this property.
			/// </param>
			beforeCellUpdate: null,

			/// <summary>
			/// The columnDragging event handler. A function called when column dragging is started, but before wijgrid handles the operation. Cancellable.
			/// Default: null.
			/// Type: Function.
			/// Code example:
			/// Supply a callback function to handle the columnDragging event:
			/// $("#element").wijgrid({ columnDragging: function (e, args) { } });
			/// Bind to the event by type:
			/// $("#element").bind("wijgridcolumndragging", function (e, args) { });
			/// </summary>
			///
			/// <param name="e" type="Object">jQuery.Event object.</param>
			/// <param name="args" type="Object">
			/// The data with this event.
			/// args.drag: drag source, column being dragged.
			/// args.dragSource: the place where the dragged column widget is located, possible value: "groupArea", "columns".
			/// </param>
			columnDragging: null,

			/// <summary>
			/// The columnDragged event handler. A function called when column dragging has been started.
			/// Default: null.
			/// Type: Function.
			/// Code example:
			/// Supply a callback function to handle the columnDragged event:
			/// $("#element").wijgrid({ columnDragged: function (e, args) { } });
			/// Bind to the event by type:
			/// $("#element").bind("wijgridcolumndragged", function (e, args) { });
			/// </summary>
			///
			/// <param name="e" type="Object">jQuery.Event object.</param>
			/// <param name="args" type="Object">
			/// The data with this event.
			/// args.drag: drag source, column being dragged.
			/// args.dragSource: the place where the dragged column widget is located, possible value: "groupArea", "columns".
			/// </param>
			columnDragged: null,

			/// <summary>
			/// The columnDropping event handler. A function called when column is dropped, but before wijgrid handles the operation. Cancellable.
			/// Default: null.
			/// Type: Function.
			/// Code example:
			/// Supply a callback function to handle the columnDropping event:
			/// $("#element").wijgrid({ columnDropping: function (e, args) { } });
			/// Bind to the event by type:
			/// $("#element").bind("wijgridcolumndropping", function (e, args) { });
			/// </summary>
			///
			/// <param name="e" type="Object">jQuery.Event object.</param>
			/// <param name="args" type="Object">
			/// The data with this event.
			/// args.drag: drag source, column being dragged.
			/// args.drop: drop target, column on which drag source is dropped(be null if dropping a column into empty group area).
			/// args.at: position to drop (one of the "left", "right" and "center" values) relative to drop target(be "left" if dropping a column into empty group area).
			/// </param>
			columnDropping: null,

			/// <summary>
			/// The columnDropped event handler. A function called when column has been dropped.
			/// Default: null.
			/// Type: Function.
			/// Code example:
			/// Supply a callback function to handle the columnDropped event:
			/// $("#element").wijgrid({ columnDropped: function (e, args) { } });
			/// Bind to the event by type:
			/// $("#element").bind("wijgridcolumndropped", function (e, args) { });
			/// </summary>
			///
			/// <param name="e" type="Object">jQuery.Event object.</param>
			/// <param name="args" type="Object">
			/// The data with this event.
			/// args.drag: drag source, column being dragged.
			/// args.drop: drop target, column on which drag source is dropped(be null if dropping a column into empty group area).
			/// args.at: position to drop (one of the "left", "right" and "center" values) relative to drop target(be "left" if dropping a column into empty group area).
			/// </param>
			columnDropped: null,

			/// <summary>
			/// The columnGrouping event handler. A function called when column is dropped into the group area, but before wijgrid handles the operation. Cancellable.
			/// Default: null.
			/// Type: Function.
			/// Code example:
			/// Supply a callback function to handle the columnGrouping event:
			/// $("#element").wijgrid({ columnGrouping: function (e, args) { } });
			/// Bind to the event by type:
			/// $("#element").bind("wijgridcolumngrouping", function (e, args) { });
			/// </summary>
			///
			/// <param name="e" type="Object">jQuery.Event object.</param>
			/// <param name="args" type="Object">
			/// The data with this event.
			/// args.drag: drag source, column being dragged.
			/// args.drop: drop target, column on which drag source is dropped (be null if dropping a column into empty group area).
			/// args.dragSource: the place where the dragged column widget is located, possible value: "groupArea", "columns".
			/// args.dropSource: the place where the dropped column widget is located, possible value: "groupArea", "columns".
			/// args.at: position to drop (one of the "left", "right" and "center" values) relative to drop target(be "left" if dropping a column into empty group area).
			/// </param>
			columnGrouping: null,

			/// <summary>
			/// The columnGrouped event handler. A function called when column has been dropped into the group area.
			/// Default: null.
			/// Type: Function.
			/// Code example:
			/// Supply a callback function to handle the columnGrouped event:
			/// $("#element").wijgrid({ columnGrouped: function (e, args) { } });
			/// Bind to the event by type:
			/// $("#element").bind("wijgridcolumngrouped", function (e, args) { });
			/// </summary>
			///
			/// <param name="e" type="Object">jQuery.Event object.</param>
			/// <param name="args" type="Object">
			/// The data with this event.
			/// args.drag: drag source, column being dragged.
			/// args.drop: drop target, column on which drag source is dropped (be null if dropping a column into empty group area).
			/// args.dragSource: the place where the dragged column widget is located, possible value: "groupArea", "columns".
			/// args.dropSource: the place where the dropped column widget is located, possible value: "groupArea", "columns".
			/// args.at: position to drop (one of the "left", "right" and "center" values) relative to drop target(be "left" if dropping a column into empty group area).
			/// </param>
			columnGrouped: null,

			/// <summary>
			/// The columnResizing event handler. A function called when column is resized, but before wijgrid handles the operation. Cancellable.
			/// Default: null.
			/// Type: Function.
			/// Code example:
			/// Supply a callback function to handle the columnResizing event:
			/// $("#element").wijgrid({ columnResizing: function (e, args) { } });
			/// Bind to the event by type:
			/// $("#element").bind("wijgridcolumnresizing", function (e, args) { });
			/// </summary>
			///
			/// <param name="e" type="Object">jQuery.Event object.</param>
			/// <param name="args" type="Object">
			/// The data with this event.
			/// args.column: column that is being resized.
			/// args.oldWidth: the old width of the column before resized.
			/// args.newWidth: the new width being set to the column.
			/// </param>
			columnResizing: null,

			/// <summary>
			/// The columnResized event handler. A function called when column has been resized.
			/// Default: null.
			/// Type: Function.
			/// Code example:
			/// Supply a callback function to handle the columnResized event:
			/// $("#element").wijgrid({ columnResized: function (e) { } });
			/// Bind to the event by type:
			/// $("#element").bind("wijgridcolumnresized", function (e) { });
			/// </summary>
			///
			/// <param name="e" type="Object">jQuery.Event object.</param>
			/// <param name="args" type="Object">
			/// The data with this event.
			/// args.column: column that is being resized.
			/// </param>
			columnResized: null,

			/// <summary>
			/// The columnUngrouping event handler. A function called when column is removed from the group area, but before wijgrid handles the operation. Cancellable.
			/// Default: null.
			/// Type: Function.
			/// Code example:
			/// Supply a callback function to handle the columnUngrouping event:
			/// $("#element").wijgrid({ columnUngrouping: function (e, args) { } });
			/// Bind to the event by type:
			/// $("#element").bind("wijgridcolumnungrouping", function (e, args) { });
			/// </summary>
			///
			/// <param name="e" type="Object">jQuery.Event object.</param>
			/// <param name="args" type="Object">
			/// The data with this event.
			/// args.column: column being removed.
			/// </param>
			columnUngrouping: null,

			/// <summary>
			/// The columnUngrouped event handler. A function called when column has been removed from the group area.
			/// Default: null.
			/// Type: Function.
			/// Code example:
			/// Supply a callback function to handle the columnUngrouped event:
			/// $("#element").wijgrid({ columnUngrouped: function (e, args) { } });
			/// Bind to the event by type:
			/// $("#element").bind("wijgridcolumnungrouped", function (e, args) { });
			/// </summary>
			///
			/// <param name="e" type="Object">jQuery.Event object.</param>
			/// <param name="args" type="Object">
			/// The data with this event.
			/// args.column: column being removed.
			/// </param>
			columnUngrouped: null,

			/// <summary>
			/// The currentCellChanging event handler. A function called before the current cell is changed. Cancellable.
			/// Default: null.
			/// Type: Function.
			/// Code example:
			/// Supply a callback function to handle the currentCellChanging event:
			/// $("#element").wijgrid({ currentCellChanging: function (e, args) { } });
			/// Bind to the event by type:
			/// $("#element").bind("wijgridcurrentcellchanging", function (e, args) { });
			/// </summary>
			///
			/// <param name="e" type="Object">jQuery.Event object.</param>
			/// <param name="args" type="Object">
			/// The data with this event.
			/// args.cellIndex: new cell index.
			/// args.rowIndex: new row index.
			/// args.oldCellIndex: old cell index.
			/// args.oldRowIndex: old row index.
			/// </param>
			currentCellChanging: null,

			/// <summary>
			/// The currentCellChanged event handler. A function called after the current cell is changed.
			/// Default: null.
			/// Type: Function.
			/// Code example:
			/// Supply a callback function to handle the currentCellChanged event:
			/// $("#element").wijgrid({ currentCellChanged: function (e) { } });
			/// Bind to the event by type:
			/// $("#element").bind("wijgridcurrentcellchanged", function (e) { });
			/// </summary>
			///
			/// <param name="e" type="Object">jQuery.Event object.</param>
			currentCellChanged: null,

			/// <summary>
			/// The filterOperatorsListShowing event handler. A function called before the filter drop-down list is shown.
			/// Default: null.
			/// Type: Function.
			/// Code example:
			/// Supply a callback function to handle the filterOperatorsListShowing event:
			/// $("#element").wijgrid({ filterOperatorsListShowing: function (e, args) { } });
			/// Bind to the event by type:
			/// $("#element").bind("wijgridfilteroperatorslistshowing", function (e, args) { });
			/// </summary>
			///
			/// <param name="e" type="Object">jQuery.Event object.</param>
			/// <param name="args" type="Object">
			/// The data with this event.
			/// args.column: associated column.
			/// args.operators: An array of filter operators.
			/// </param>
			filterOperatorsListShowing: null,

			/// <summary>
			/// The groupAggregate event handler. A function called when groups are being created and the "aggregate" option of the column object has been set to "custom".
			/// Default: null.
			/// Type: Function.
			/// Code example:
			/// Supply a callback function to handle the groupAggregate event:
			/// $("#element").wijgrid({ groupAggregate: function (e, args) { } });
			/// Bind to the event by type:
			/// $("#element").bind("wijgridgroupaggregate", function (e, args) { });
			/// </summary>
			///
			/// <param name="e" type="Object">jQuery.Event object.</param>
			/// <param name="args" type="Object">
			/// The data with this event.
			/// args.data: data object.
			/// args.column: column that is being grouped.
			/// args.groupByColumn: column initiated grouping.
			/// args.groupText: text that is being grouped.
			/// args.text: text that will be displayed in the group header or group footer.
			/// args.groupingStart: first index for the data being grouped.
			/// args.groupingEnd: last index for the data being grouped.
			/// args.isGroupHeader: indicates whether row that is being grouped is a group header or not.
			/// </param>
			groupAggregate: null,

			/// <summary>
			/// The groupText event handler. A function called when groups are being created and the groupInfo.headerText or groupInfo.footerText of the groupInfo option has been set to "custom".
			/// Default: null.
			/// Type: Function.
			/// Code example:
			/// Supply a callback function to handle the groupText event:
			/// $("#element").wijgrid({ groupText: function (e, args) { } });
			/// Bind to the event by type:
			/// $("#element").bind("wijgridgrouptext", function (e, args) { });
			/// </summary>
			///
			/// <param name="e" type="Object">jQuery.Event object.</param>
			/// <param name="args" type="Object">
			/// The data with this event.
			/// args.data: data object.
			/// args.column: column that is being grouped.
			/// args.groupByColumn: column initiated grouping.
			/// args.groupText: text that is being grouped.
			/// args.text: text that will be displayed in the group header or group footer.
			/// args.groupingStart: first index for the data being grouped.
			/// args.groupingEnd: last index for the data being grouped.
			/// args.isGroupHeader: indicates whether the row that is being grouped is a group header or not.
			/// args.aggregate: aggregate value.
			/// </param>
			groupText: null,

			/// <summary>
			/// The invalidCellValue event handler. A function called when a cell needs to start updating but the cell value is invalid.
			/// Default: null.
			/// Type: Function.
			/// Code example:
			/// Supply a callback function to handle the invalidCellValue event:
			/// $("#element").wijgrid({ invalidCellValue: function (e, args) { } });
			/// Bind to the event by type:
			/// $("#element").bind("wijgridinvalidcellvalue", function (e, args) { });
			/// </summary>
			///
			/// <param name="e" type="Object">jQuery.Event object.</param>
			/// <param name="args" type="Object">
			/// The data with this event.
			/// args.cell: gets the information of edited cell.
			/// args.value: current value.
			/// </param>
			invalidCellValue: null,

			/// <summary>
			/// The pageIndexChanging event handler. A function called before page index is changed. Cancellable.
			/// Default: null.
			/// Type: Function.
			/// Code example:
			/// Supply a callback function to handle the pageIndexChanging event:
			/// $("#element").wijgrid({ pageIndexChanging: function (e, args) { } });
			/// Bind to the event by type:
			/// $("#element").bind("wijgridpageindexchanging", function (e, args) { });
			/// </summary>
			///
			/// <param name="e" type="Object">jQuery.Event object.</param>
			/// <param name="args" type="Object">
			/// The data with this event.
			/// args.newPageIndex: new page index.
			/// </param>
			pageIndexChanging: null,

			/// <summary>
			/// The pageIndexChanged event handler. A function called after page index is changed.
			/// Default: null.
			/// Type: Function.
			/// Code example:
			/// Supply a callback function to handle the pageIndexChanged event:
			/// $("#element").wijgrid({ pageIndexChanged: function (e) { } });
			/// Bind to the event by type:
			/// $("#element").bind("wijgridpageindexchanged", function (e) { });
			/// </summary>
			///
			/// <param name="e" type="Object">jQuery.Event object.</param>
			pageIndexChanged: null,

			/// <summary>
			/// The selectionChanged event handler. A function called after the selection is changed.
			/// Default: null.
			/// Type: Function.
			/// Code example:
			/// Supply a callback function to handle the selectionChanged event:
			/// $("#element").wijgrid({ selectionChanged: function (e, args) { } });
			/// Bind to the event by type:
			/// $("#element").bind("wijgridselectionchanged", function (e, args) { });
			/// </summary>
			///
			/// <param name="e" type="Object">jQuery.Event object.</param>
			/// <param name="args" type="Object">
			/// The data with this event.
			/// args.addedCells: cells added to the selection.
			/// args.removedCells: cells removed from the selection.
			/// </param>
			selectionChanged: null,

			/// <summary>
			/// The sorting event handler. A function called before the sorting operation is started. Cancellable.
			/// Type: Function.
			/// Default: null.
			/// Code example:
			/// Supply a callback function to handle the sorting event:
			/// $("#element").wijgrid({ sorting: function (e, args) { } });
			/// Bind to the event by type:
			/// $("#element").bind("wijgridsorting", function (e, args) { });
			/// </summary>
			///
			/// <param name="e" type="Object">jQuery.Event object.</param>
			/// <param name="args" type="Object">
			/// The data with this event.
			/// args.column: column that is being sorted.
			/// args.sortDirection: new sort direction.
			/// </param>
			sorting: null,

			/// <summary>
			/// The sorted event handler. A function called after the widget is sorted.
			/// Default: null.
			/// Type: Function.
			/// Code example:
			/// Supply a callback function to handle the sorted event:
			/// $("#element").wijgrid({ sorted: function (e, args) { } });
			/// Bind to the event by type:
			/// $("#element").bind("wijgridsorted", function (e, args) { });
			/// </summary>
			///
			/// <param name="e" type="Object">jQuery.Event object.</param>
			/// <param name="args" type="Object">
			/// The data with this event.
			/// args.column: column that is being sorted.
			/// </param>
			sorted: null,

			/* events --- */

			/* --- life-cycle events */
			/// <summary>
			/// The ajaxError event handler. A function called when wijgrid is bound to remote data and
			/// the ajax request fails.
			/// Default: null.
			/// Type: Function.
			/// Code example:
			/// Supply a callback function to handle the ajaxError event:
			/// $("#element").wijgrid({ ajaxError: function (e, args) { } });
			/// Bind to the event by type:
			/// $("#element").bind("wijgridajaxerror", function (e, args) { });
			/// </summary>
			/// <param name="e" type="Object">jQuery.Event object.</param>
			/// <param name="args" type="Object">
			/// The data corresponded with this event.
			/// args.XMLHttpRequest: the XMLHttpRequest object.
			/// args.textStatus: a string describing the error type.
			/// args.errorThrown: an exception object.
			///
			/// Refer to the jQuery.ajax.error event documentation for more details on this arguments.
			/// </param>
			ajaxError: null,

			/// <summary>
			/// The dataLoading event handler. A function called when wijgrid loads a portion of data from the underlying datasource.
			/// Default: null.
			/// Type: Function.
			/// Code example:
			/// Supply a callback function to handle the dataLoading event:
			/// $("#element").wijgrid({ dataLoading: function (e) { } });
			/// Bind to the event by type:
			/// $("#element").bind("wijgriddataloading", function (e) { });
			/// </summary>
			/// <param name="e" type="Object">jQuery.Event object.</param>
			dataLoading: null,

			/// <summary>
			/// The dataLoaded event handler. A function called when data are loaded.
			/// Default: null.
			/// Type: Function.
			/// Code example:
			/// Supply a callback function to handle the dataLoaded event:
			/// $("#element").wijgrid({ dataLoaded: function (e) { } });
			/// Bind to the event by type:
			/// $("#element").bind("wijgriddataloaded", function (e) { });
			/// </summary>
			/// <param name="e" type="Object">jQuery.Event object.</param>
			dataLoaded: null,

			/// <summary>
			/// The loading event handler. A function called at the beginning of the wijgrid's lifecycle.
			/// Default: null.
			/// Type: Function.
			/// Code example:
			/// Supply a callback function to handle the loading event:
			/// $("#element").wijgrid({ loading: function (e) { } });
			/// Bind to the event by type:
			/// $("#element").bind("wijgridloading", function (e) { });
			/// </summary>
			/// <param name="e" type="Object">jQuery.Event object.</param>
			loading: null,

			/// <summary>
			/// The loaded event handler. A function called at the end the wijgrid's lifecycle when wijgrid is
			/// filled with data and rendered.
			/// Default: null.
			/// Type: Function.
			/// Code example:
			/// Supply a callback function to handle the loaded event:
			/// $("#element").wijgrid({ loaded: function (e) { } });
			/// Bind to the event by type:
			/// $("#element").bind("wijgridloaded", function (e) { });
			/// </summary>
			/// <param name="e" type="Object">jQuery.Event object.</param>
			loaded: null,

			/// <summary>
			/// The rendering event handler. A function called when wijgrid is about to render.
			/// Default: null.
			/// Type: Function.
			/// Code example:
			/// Supply a callback function to handle the rendering event:
			/// $("#element").wijgrid({ rendering: function (e) { } });
			/// Bind to the event by type:
			/// $("#element").bind("wijgridrendering", function (e) { });
			/// </summary>
			/// <param name="e" type="Object">jQuery.Event object.</param>
			rendering: null,

			/// <summary>
			/// The rendered event handler. A function called when wijgrid is rendered.
			/// Default: null.
			/// Type: Function.
			/// Code example:
			/// Supply a callback function to handle the rendered event:
			/// $("#element").wijgrid({ rendered: function (e) { } });
			/// Bind to the event by type:
			/// $("#element").bind("wijgridrendered", function (e) { });
			/// </summary>
			/// <param name="e" type="Object">jQuery.Event object.</param>
			rendered: null

			/* life-cycle events --- */
		},

		// private fields **
		_staticColumnIndex: -1,
		_data$prefix: "wijgrid",
		_customSortOrder: 1000,
		_reverseKey: false,
		_pageSizeKey: 10,
		// ** private fields

		_ajaxError: function (xhttpr, textStatus, error) {
			this._trigger("ajaxError", null, {
				XMLHttpRequest: xhttpr,
				textStatus: textStatus,
				errorThrown: error
			});

			this.outerDiv.removeClass("wijmo-wijgrid-loading");
		},

		_dataLoading: function (userData) {
			this._trigger("dataLoading");
			this.outerDiv.addClass("wijmo-wijgrid-loading");
		},

		_dataLoaded: function (userData) {
			this._trigger("dataLoaded");
			this.outerDiv.removeClass("wijmo-wijgrid-loading");
			this.doRefresh(userData);
			this._trigger("loaded");
		},

		ensureControl: function (loadData, userData) {
			/// <summary>
			/// Moves column widgets options to wijgrid options and renders wijgrid
			/// Code example: $("#element").wijgrid("ensureControl", true);
			/// </summary>
			/// <param name="loadData" type="Boolean">Determines if wijgrid must load data from linked data source before rendering.</param>
			this._trigger("loading");

			if (!$.isPlainObject(userData)) {
				userData = {
					data: null,
					afterRefresh: null,
					beforeRefresh: null
				};
			}

			if (this._initialized) {
				this._ownerise(false);
				this._widgetsToOptions();
			} else {
				this._prepareColumnOptions(false); // prepare static columns only
			}

			this._ownerise(true);

			if (loadData === true) {
				this._dataStore.load(userData);
			} else {
				this.doRefresh(userData);
				this._trigger("loaded");
			}
		},

		doRefresh: function (userData) {
			/// <summary>
			/// Re-renders wijgrid.
			/// Code example: $("#element").wijgrid("doRefresh");
			/// </summary>
			if (!this._initialized) {
				try {
					this._prepareColumnOptions(true); // prepare static and dynamic columns
				}
				catch (e) {
					throw e;
				}
				finally {
					this._initialized = true;
				}
			} else {
				if (userData && $.isFunction(userData.beforeRefresh)) {
					userData.beforeRefresh.apply(this);
				}
			}

			this._rebuildLeaves(); // build leaves, visible leaves, set dataIndex etc

			var dataSlice = this._dataStore.getDataSlice(),
				table = dataSlice.data,
				leaves, ri, rowsLen, dataItem, newItem, i, len, leaf, tmp;

			$.each(this._field("leaves"), function () { // copy totals
				this._totalsValue = (dataSlice.totals)
						? dataSlice.totals[this.dataKey]
						: undefined;
			});

			this._setPageCount(dataSlice);

			leaves = this._field("leaves");
			this.dataTable = [];

			if (rowsLen = table.length) { // process data items
				for (ri = 0; ri < rowsLen; ri++) {
					dataItem = table[ri];
					newItem = [];

					for (i = 0, len = leaves.length; i < len; i++) {
						leaf = leaves[i];

						if ($.wijmo.wijgrid.validDataKey(leaf.dataKey)) {
							newItem.push({
								value: dataItem.values[leaf.dataKey],
								__attr: (dataItem.attributes) ? dataItem.attributes.cellsAttributes[leaf.dataKey] : {},
								__style: {}
							});

							newItem.originalRowIndex = dataItem.originalRowIndex;
						}
					}

					newItem.rowType = $.wijmo.wijgrid.rowType.data;
					if (ri % 2 !== 0) {
						newItem.rowType |= $.wijmo.wijgrid.rowType.dataAlt;
					}

					newItem.__style = {};
					newItem.__attr = (dataItem.attributes) ? dataItem.attributes.rowAttributes : {};

					this.dataTable.push(newItem);
				}
			} else {
				// process empty data row
				if (dataSlice.emptyData && (rowsLen = dataSlice.emptyData.length)) {
					for (ri = 0; ri < rowsLen; ri++) {
						dataItem = dataSlice.emptyData[ri];
						newItem = [];
						tmp = this._field("visibleLeaves").length;

						for (i = 0, len = dataItem.length; i < len; i++) {
							newItem.push({
								html: dataItem[i],
								__attr: {
									colSpan: ((tmp > 0 && ri === rowsLen - 1)
										? tmp - ri
										: 1)
								},
								__style: {}
							});
						}

						newItem.rowType = $.wijmo.wijgrid.rowType.emptyDataRow;
						newItem.__style = {};
						newItem.__attr = {};

						this.dataTable.push(newItem);
					}
				}
			}

			this._trigger("rendering");
			this._refresh();
			this._trigger("rendered");

			if (userData && $.isFunction(userData.afterRefresh)) {
				userData.afterRefresh.apply(this);
			}
		},

		_prepareColumnOptions: function (dataLoaded) {
			$.wijmo.wijgrid.traverse(this.options.columns, function (column) {
				column.isBand = ($.isArray(column.columns) || (column.clientType === "c1band"));
			});

			// set .isLeaf
			new $.wijmo.wijgrid.bandProcessor()._getVisibleHeight(this.options.columns, true);

			// prepare leaves
			var leaves = [],
				boundedToDOM,
				headerRow = this._originalHeaderRowData(),
				footerRow = this._originalFooterRowData(),
				autogenerationMode = (this.options.columnsAutogenerationMode || "").toLowerCase();

			if (dataLoaded) {
				boundedToDOM = this._dataStore.dataMode() === $.wijmo.wijgrid.dataMode.dom;

				if (autogenerationMode !== "none") {
					(new $.wijmo.wijgrid.columnsGenerator(this)).generate(autogenerationMode, this._dataStore, this.options.columns);
				}
			}

			$.wijmo.wijgrid.setTraverseIndex(this.options.columns); // build indices (linearIdx, travIdx, parentIdx)

			// * merge options with defaults and build "pure" leaves list.
			$.wijmo.wijgrid.traverse(this.options.columns, function (column) {
				// merge options **
				column.isBand = ($.isArray(column.columns) || (column.clientType === "c1band"));

				$.wijmo.wijgrid.shallowMerge(column, $.wijmo.c1basefield.prototype.options); // merge with the c1basefield default options

				if (!column.isBand) {
					$.wijmo.wijgrid.shallowMerge(column, $.wijmo.c1field.prototype.options); // merge with the c1field default options

					if (!column.clientType) {
						column.clientType = "c1field";
					}
				} else {
					column.clientType = "c1band";
				}
				// ** merge options

				if (column.isLeaf && !column.isBand) {
					leaves.push(column);
				}
			});

			this._field("leaves", leaves); // contains static columns only when dataLoaded == false, used by the "dynamic data load" feature during request initialization.

			if (dataLoaded) {
				// assume headerText and footerText
				$.each(leaves, function (i, leaf) {
					var thIndex = (typeof (leaf.dataKey) === "number")
						? leaf.dataKey
						: i;

					if (autogenerationMode === "merge" || leaf.dynamic === true) { // assume headerText options of the static columns only when using "merge" mode.
						if (leaf.headerText === undefined) {
							if (boundedToDOM && headerRow && (thIndex < headerRow.length)) {
								leaf.headerText = $.trim(headerRow[thIndex]); // copy th
							} else {
								if ($.wijmo.wijgrid.validDataKey(leaf.dataKey)) {
									leaf.headerText = "" + leaf.dataKey; // copy dataKey
								}
							}
						}
					}

					if (boundedToDOM && footerRow && (thIndex < footerRow.length)) {
						leaf._footerTextDOM = $.trim(footerRow[thIndex]);
					}
				});

			}
		},

		_rebuildLeaves: function () {
			var tmpColumns = [],
				leaves = [],
				tmp;

			if (this.options.showRowHeader) { // append rowHeader
				tmp = $.wijmo.wijgrid.createDynamicField({ clientType: "c1basefield", dataIndex: -1, travIdx: -1, parentVis: true,
					allowMoving: false, allowSizing: false, allowSort: false
				});
				tmp.owner = this;
				tmpColumns.push(tmp);
			}

			$.each(this.options.columns, function (index, item) {
				tmpColumns.push(item); // append columns
			});

			// generate span table and build leaves
			this._field("spanTable", new $.wijmo.wijgrid.bandProcessor().generateSpanTable(tmpColumns, leaves));
			this._field("leaves", leaves);

			this._onLeavesCreated();
		},

		_onLeavesCreated: function () {
			var leaves = this._field("leaves"),
				dataIndex = 0,
				visLeavesIdx = 0,
				self = this;

			// build visible leaves list, set dataParsers, dataIndices
			this._field("visibleLeaves", $.grep(leaves, function (leaf, index) {
				leaf.leavesIdx = index;

				if ($.wijmo.wijgrid.validDataKey(leaf.dataKey)) {
					leaf.dataIndex = dataIndex++;
				} else {
					leaf.dataIndex = -1;
				}

				// attach data parser **
				if (!leaf.isBand) {
					self._ensureDataParser(leaf);

					if ($.isFunction(leaf.dataParser)) {
						leaf.dataParser = new leaf.dataParser();
					}
				}
				// ** attach data parser

				if (leaf.parentVis) {
					leaf.visLeavesIdx = visLeavesIdx++;
					return true;
				}

				return false;
			}));
		},

		_create: function () {
			if (!this.element.is("table")) {
				throw "invalid markup";
			}

			var styleHeight = this.element[0].style.height,
				styleWidth = this.element[0].style.width;

			this.rendered = false;

			// initialize data
			this._dataStore = new $.wijmo.wijgrid.dataStore(this);

			//this.element.addClass("ui-widget wijmo-wijgrid ui-widget-content ui-corner-all");
			this.element.addClass("wijmo-wijgrid-root");
			this.element.wrap("<div class=\"ui-widget wijmo-wijgrid ui-widget-content ui-corner-all\"></div>");
			this.outerDiv = this.element.parent();

			// -
			//this.outerDiv.css({ "height": this.element.css("height"), "width": this.element.css("width") });
			if (styleHeight) {
				this.outerDiv.css("height", this.element[0].style.height);
			}

			if (styleHeight !== "" && styleHeight !== "auto") {
				this._autoHeight = false;
			}
			else {
				this._autoHeight = true;
			}

			if (styleWidth) {
				this.outerDiv.css("width", this.element[0].style.width);
			}

			if (styleWidth !== "" && styleWidth !== "auto") {
				this._autoWidth = false;
			}
			else {
				this._autoWidth = true;
			}

			this.element.css({ "height": "", "width": "" });
			// -

			this.filterOperatorsCache = new $.wijmo.wijgrid.filterOperatorsCache();

			// process build-in filtering operators
			this._registerFilterOperator($.wijmo.wijgrid.embeddedFilters);

			if (this.options.disabled) {
				this.disable();
			}

			// formatters
			this.cellFormatter = new $.wijmo.wijgrid.cellFormatterHelper();
			this.rowStyleFormatter = new $.wijmo.wijgrid.rowStyleFormatterHelper(this);
			this.cellStyleFormatter = new $.wijmo.wijgrid.cellStyleFormatterHelper(this);
		},

		_init: function () {
			this.$superPanelHeader = null;
			this.$topPagerDiv = null;
			this.$bottomPagerDiv = null;
			this.$groupArea = null;

			// processing custom filtering operators
			this.filterOperatorsCache.removeCustom();
			$.each(this.options.customFilterOperators, function (index, value) {
				value.custom = true;
			});
			this._registerFilterOperator(this.options.customFilterOperators);

			// culture
			this._field("closestCulture", $.findClosestCulture(this.options.culture) || $.findClosestCulture("default"));

			if (!this.options.data) { // dataSource is a domTable
				if (!this._field("thead")) { // read tHead section
					this._field("thead", $.wijmo.wijgrid.readTableSection(this.element, 1));
				}

				if (!this._field("tfoot")) { // read tFoot section
					this._field("tfoot", $.wijmo.wijgrid.readTableSection(this.element, 3));
				}
			}

			this._initialized = this._initialized || false; // to avoid reinitialization.

			this.ensureControl(true);
		},

		_setOption: function (key, value) {
			var presetFunc = this["_preset_" + key],
				oldValue = this.options[key],
				optionChanged, postsetFunc;

			if (presetFunc !== undefined) {
				value = presetFunc.apply(this, [value, oldValue]);
			}

			optionChanged = (value !== oldValue);

			//$.Widget.prototype._setOption.apply(this, arguments); note: there is no dynamic linkage between the arguments and the formal parameter values when strict mode is used
			$.Widget.prototype._setOption.apply(this, [key, value]); // update this.options

			if (optionChanged) {
				postsetFunc = this["_postset_" + key];
				if (postsetFunc !== undefined) {
					postsetFunc.apply(this, [value, oldValue]);
				}
			}
		},

		destroy: function () {
			///	<summary>
			///	Destroy wijgrid widget and reset the DOM element.
			/// Code example: $("#element").wijgrid("destroy");
			///	</summary>

			var tmp,
				self = this;

			this._view().dispose();

			this._detachEvents(true);

			if (tmp = this._field("resizer")) {
				tmp.dispose();
			}

			$.wijmo.wijgrid.iterateChildrenWidgets(this.outerDiv, function (index, widget) {
				if (widget !== self) {
					widget.destroy();
				}
			});

			// YK: destroy outer div after restoring element.
			this.element.insertBefore(this.outerDiv);
			this.outerDiv.remove();

			if (tmp = this._field("selectionui")) {
				tmp.dispose();
			}

			if (tmp = this._field("dragndrop")) {
				tmp.dispose();
			}

			// cleanup $data
			$.wijmo.wijgrid.remove$dataByPrefix(this.element, this._data$prefix);

			$.Widget.prototype.destroy.apply(this, arguments);
		},

		// * public
		columns: function () {
			/// <summary>
			/// Returns a one-dimensional array of widgets bound to visible column headers.
			/// Code example: var colWidgets = $("#element").wijgrid("columns");
			/// </summary>
			/// <returns type="Array" elementType="$.wijmo.c1basefield">A one-dimensional array of widgets bound to visible column headers.</returns>
			return this._field("columns") || [];
		},

		currentCell: function (cellInfo /* cellIndex */, rowIndex /* opt */) {
			/// <summary>
			/// Gets or sets the current cell for the grid.
			/// Note: Use (-1, -1) value to hide the current cell.
			/// Code example:
			/// -) Getter:
			///   var current = $("#element).wijgrid("currentCell");
			/// -) Setter:
			///   $("#element).wijgrid("currentCell", new $.wijmo.wijgrid.cellInfo(0, 0));
			///   or
			///   $("#element).wijgrid("currentCell", 0, 0);
			/// </summary>
			/// <param name="cellInfo" type="$.wijmo.wijgrid.cellInfo">Object that represents a single cell.</param>
			/// <param name="cellIndex" type="Number" integer="true" optional="true">Zero-based index of the required cell inside the corresponding row.</param>
			/// <param name="rowIndex" type="Number" integer="true" optional="true">Zero-based index of the row that contains required cell.</param>
			/// <returns type="$.wijmo.wijgrid.cellInfo">Object that represents current cell of the grid</returns>

			var currentCell;

			if (arguments.length === 0) { // getter
				currentCell = this._field("currentCell");
				if (!currentCell) {
					this._field("currentCell", currentCell = $.wijmo.wijgrid.cellInfo.prototype.outsideValue);
				}
				return currentCell;
			} else { // setter

				currentCell = (arguments.length === 1)
					? cellInfo._clone()
					: new $.wijmo.wijgrid.cellInfo(cellInfo, rowIndex);

				if (!currentCell.isEqual($.wijmo.wijgrid.cellInfo.prototype.outsideValue)) {
					if (!currentCell._isValid()) {
						throw "invalid arguments";
					}

					currentCell._clip(this._getDataCellsRange());

					if (currentCell.rowIndex() >= 0 && !(this.dataTable[currentCell.rowIndex()].rowType & $.wijmo.wijgrid.rowType.data)) {
						return;
					}
				}

				currentCell._setGridView(this);

				this._changeCurrentCell(currentCell);

				return this._field("currentCell");
			}
		},

		data: function () {
			/// <summary>
			/// Gets a array of the underlying data.
			/// Code example: var data = $("#element").wijgrid("data");
			/// </summary>
			/// <returns type="Array"></returns>
			return this._dataStore.dataSource().items;
		},

		selection: function () {
			/// <summary>
			/// Gets an object that manages selection in the grid.
			/// Code example:
			///   var selection = $("#element").wijgrid("selection");
			/// </summary>
			/// <returns type="$.wijmo.wijgrid.selection">Object that manages selection in the grid.</returns>
			var selection = this._field("selection");
			if (!selection) {
				this._field("selection", selection = new $.wijmo.wijgrid.selection(this));
			}
			return selection;
		},

		beginEdit: function () {
			/// <summary>
			/// Puts the current cell in editing mode.
			/// Note: works only if the allowEditing option is set to true.
			/// Code example: $("#element").wijgrid("beginEdit");
			/// </summary>
			/// <returns type="Boolean">True if the cell is successfully put in edit mode, otherwise false.</returns>
			return this._beginEditInternal(null);
		},

		endEdit: function () {
			/// <summary>
			/// Finishes editing the current cell.
			/// Code example: $("#element").wijgrid("endEdit");
			/// </summary>
			return this._endEditInternal(null);
		},

		pageCount: function () {
			/// <summary>
			/// Gets the number of pages.
			/// Code example:
			/// var pageCount = $("#element").wijgrid("pageCount");
			/// </summary>
			/// <returns type="Number" integer="true">True if the cell is successfully put in edit mode, otherwise false.</returns>
			return this.options.allowPaging
				? this._field("pageCount") || 1
				: 1;
		},

		// * public
		_dragndrop: function () {
			var dnd = this._field("dragndrop");

			if (!dnd) {
				this._field("dragndrop", dnd = new $.wijmo.wijgrid.dragAndDropHelper(this));
			}

			return dnd;
		},

		_headerRows: function () {
			var accessor = this._field("headerRowsAccessor"),
				bottomOffset;

			if (!accessor) {
				bottomOffset = this.options.showFilter ? 1 : 0;
				this._field("headerRowsAccessor", accessor = new $.wijmo.wijgrid.rowAccessor(this._view(), 1 /* thead */, 0, bottomOffset));
			}

			return accessor;
		},

		_filterRow: function () {
			if (this.options.showFilter) {
				var tHeadAccessor = new $.wijmo.wijgrid.rowAccessor(this._view(), 1 /* thead */, 0, 0);

				return tHeadAccessor.item(tHeadAccessor.length() - 1); // filter is the last row in the tHead section
			}

			return null;
		},

		_rows: function () {
			var accessor = this._field("rowsAccessor");

			if (!accessor) {
				this._field("rowsAccessor", accessor = new $.wijmo.wijgrid.rowAccessor(this._view(), 2 /* tbody */, 0, 0));
			}

			return accessor;
		},

		_selectionui: function () {
			var selectionui = this._field("selectionui");

			if (!selectionui) {
				this._field("selectionui", selectionui = new $.wijmo.wijgrid.selectionui(this));
			}

			return selectionui;
		},

		_setPageCount: function (dataSlice) {
			this._field("pageCount", Math.ceil(dataSlice.totalRows / this.options.pageSize) || 1);
		},

		_registerFilterOperator: function (value) {
			var i, len;

			if (value && $.isArray(value)) {
				for (i = 0, len = value.length; i < len; i++) {
					this.filterOperatorsCache.add(value[i]);
				}
			}
			else {
				for (i = 0, len = arguments.length; i < len; i++) {
					this.filterOperatorsCache.add(arguments[i]);
				}
			}
		},

		//

		// * propeties (pre-\ post-)
		_postset_allowColMoving: function (value, oldValue) {
			var self = this;

			$.each(this.columns(), function (idx, wijField) {
				if (value) {
					self._dragndrop().attach(wijField);
				} else {
					self._dragndrop().detach(wijField);
				}
			});

			$.each(this._field("groupedWidgets"), function (idx, wijField) {
				if (value) {
					self._dragndrop().attach(wijField);
				} else {
					self._dragndrop().detach(wijField);
				}
			});
		},

		_postset_allowSorting: function (value, oldValue) {
			this.ensureControl(false);
		},

		_postset_columns: function (value, oldValue) {
			throw "read-only";
		},

		_postset_allowPaging: function (value, oldValue) {
			this.ensureControl(true);
		},

		_postset_culture: function (value, oldValue) {
			//this._field("closestCulture", $.findClosestCulture(this.options.culture));
			throw "read-only";
		},

		_postset_customFilterOperators: function (value, oldValue) {
			this.filterOperatorsCache.removeCustom();
			$.each(this.options.customFilterOperators, function (index, value) {
				value.custom = true;
			});
			this._registerFilterOperator(value);
		},

		_postset_data: function (value, oldValue) {
			throw "read-only";
		},

		_postset_disabled: function (value, oldValue) {
			// update children widgets
			var self = this;

			$.wijmo.wijgrid.iterateChildrenWidgets(this.outerDiv, function (index, widget) {
				if (widget !== self) {
					widget.option("disabled", value);
				}
			});
		},

		_postset_groupIndent: function (value, oldValue) {
			this.ensureControl(false);
		},

		_postset_groupAreaCaption: function (value, oldValue) {
			var groupedColumns = this._field("groupedColumns");

			if (this.$groupArea && (!groupedColumns || !groupedColumns.length)) { // update html when the group area is empty only.
				this.$groupArea.html(value || "&nbsp;");
			}
		},

		_preset_pageIndex: function (value, oldValue) {
			if (isNaN(value)) {
				throw "out of range";
			}

			var pageCount = this.pageCount();

			if (value > pageCount - 1) {
				value = pageCount - 1;
			}

			if (value < 0) {
				value = 0;
			}

			if (this.options.allowPaging && value !== oldValue) {
				if (!this._onPageIndexChanging({ newPageIndex: value })) {
					value = oldValue;
				}
			}

			return value;
		},

		_postset_pageIndex: function (value, oldValue) {
			if (this.options.allowPaging) {
				this.ensureControl(true, {
					afterRefresh: function () { this._onPageIndexChanged(); }
				});
			}
		},

		_preset_pageSize: function (value, oldValue) {
			if (isNaN(value)) {
				throw "out of range";
			}

			if (value <= 0) {
				value = 1;
			}

			return value;
		},

		_postset_pageSize: function (value, oldValue) {
			this.options.pageIndex = 0;

			if (this.options.allowPaging) {
				this.ensureControl(true);
			}
		},

		_postset_pagerSettings: function (value, oldValue) {
			this.ensureControl(false);
		},

		_postset_scrollMode: function (value, oldValue) {
			if (value === "none" || oldValue === "none") { // wijsuperpanel is enabled or disabled.
				this.ensureControl(false);
			} else { // wijsuperpanel is used, updating it.
				// refresh panel.
				this._view().refreshPanel();
			}
		},

		_postset_selectionMode: function (value, oldValue) {
			var selection = this.selection(),
				currentCell = this.currentCell();

			selection.beginUpdate();

			selection.clear();

			if (currentCell && currentCell._isValid()) {
				selection._selectRange(new $.wijmo.wijgrid.cellInfoRange(currentCell, currentCell), false, false, 0 /* none */, null);
			}

			selection.endUpdate();

			this._view().toggleDOMSelection(value === "none"); // disable or enable DOM selection
		},

		_postset_showFilter: function (value, oldValue) {
			this.ensureControl(false);
		},

		_postset_showGroupArea: function (value, oldValue) {
			this.ensureControl(false);
		},

		_postset_showRowHeader: function (value, oldValue) {
			this.ensureControl(false);
		},

		_postset_staticRowIndex: function () {
			if (this.options.scrollMode !== "none") { // staticRowIndex is ignored when scrolling is turned off.
				this.ensureControl(false);
			}
		},
		/*_postset_staticColumnIndex: function() {
		//this._refresh(0);
		this._ensureControl(0);
		},*/

		// * propeties (pre-\ post-)

		// * private
		_columnWidgetsFactory: function ($node, columnOpt) {
			var columnWidget,
				clientType = columnOpt.clientType;

			if (!clientType && columnOpt.isBand) {
				clientType = "c1band";
			}

			//columnOpt.owner = this;
			columnOpt = $.extend({ owner: this }, columnOpt, { disabled: this.options.disabled });

			switch (clientType) {
				case "c1basefield":
					columnWidget = $node.c1basefield(columnOpt);
					break;

				case "c1band":
					columnWidget = $node.c1band(columnOpt);
					break;

				default:
					columnWidget = $node.c1field(columnOpt);
			}

			return columnWidget;
		},

		_field: function (name, value) {
			//return $.wijmo.wijgrid.dataPrefix(this.element, this._data$prefix, name, value);
			return $.wijmo.wijgrid.dataPrefix(this.element[0], this._data$prefix, name, value);
		},

		_removeField: function (name) {
			var internalDataName = this._data$prefix + name;

			this.element.removeData(internalDataName);
		},

		_changeRenderState: function ($obj, state, combine) {
			var $dp = $.wijmo.wijgrid.dataPrefix,
				prevState = $dp($obj, this._data$prefix, "renderState");

			if (combine) { // combine
				state = prevState | state;
				$dp($obj, this._data$prefix, "renderState", state);
			} else { // clear
				state = prevState & ~state;
				$dp($obj, this._data$prefix, "renderState", state);
			}

			return state;
		},

		_prepareFilterRequest: function (isLocal) {
			var leaves = this._field("leaves"),
				result;

			if (!leaves) {
				return [];
			}

			result = $.map(leaves, $.proxy(function (element, index) {
				if (!element.isBand && ($.wijmo.wijgrid.validDataKey(element.dataKey)/*element.dataIndex >= 0*/) && element.filterOperator) {
					var opName = element.filterOperator.toLowerCase(),
						operator;

					// check operator name
					if (opName !== "nofilter" && (operator = this.filterOperatorsCache.getByName(opName))) {

						// check dataType
						if ($.inArray(element.dataType || "string", operator.applicableTo) >= 0) {

							// check arity + filterValue
							if (operator.arity === 1 || (operator.arity > 1 && element.filterValue !== undefined)) {
								return (isLocal)
									? [{ column: element, operator: operator}]
									: [{ dataKey: element.dataKey, filterOperator: element.filterOperator, filterValue: element.filterValue}];
							}
						}
					}
				}

				return null;
			}, this));

			return result;
		},

		_preparePageRequest: function (isLocal) {
			if (this.options.allowPaging) {
				return {
					pageIndex: this.options.pageIndex,
					pageSize: this.options.pageSize
				};
			}
			return null;
		},

		_prepareSortRequest: function (isLocal) {
			var leaves = this._field("leaves"),
				result;

			if (!leaves || !this.options.allowSorting) {
				return [];
			}

			result = $.map(leaves, function (element, index) {
				var value = null;

				if (!element.isBand && element.allowSort && ($.wijmo.wijgrid.validDataKey(element.dataKey))) {
					if (element.groupInfo && (element.groupInfo.position !== "none") && (element.sortDirection === "none")) {
						element.sortDirection = "ascending"; // use "ascending" for grouped columns by default
					}

					value = (element.sortDirection === "ascending" || element.sortDirection === "descending")
						? [{ dataKey: element.dataKey,
							sortDirection: element.sortDirection,
							sortOrder: element.sortOrder || 0
						}]
						: null;
				}

				return value;
			});

			// sort by .sortOrder
			result.sort(function (a, b) {
				return a.sortOrder - b.sortOrder;
			});

			// remove .sortOrder
			$.each(result, function (idx, item) {
				//item.sortOrder = idx;
				delete item.sortOrder;
			});

			return result;
		},

		_prepareTotalsRequest: function (isLocal) {
			var leaves = this._field("leaves"),
				result;

			if (!leaves || !this.options.showFooter) {
				return [];
			}

			result = $.map(leaves, function (element, index) {
				if (!element.isBand && $.wijmo.wijgrid.validDataKey(element.dataKey) && element.aggregate && element.aggregate !== "none") {
					return (isLocal)
						? [{ column: element, aggregate: element.aggregate}]
						: [{ dataKey: element.dataKey, aggregate: element.aggregate}];
				}

				return null;
			});

			return result;
		},

		_widgetsToOptions: function () {
			var colOptionsList = $.wijmo.wijgrid.flatten(this.options.columns);

			$.each(this.columns(), function (index, colWidget) {
				delete colWidget.options.columns; // only options of the column itself will be merged at the next step.
				var congruentColOption = colOptionsList[colWidget.options.travIdx];
				$.extend(true, congruentColOption, colWidget.options);
			});
		},

		_recreateColumnWidgets: function () {
			$.each(this.columns(), function (index, item) {
				item.destroy();
			});

			var columns = [],
				headerRows = this._headerRows(),
				visibleColumns, i, len, column, headerRowObj, th, columnWidget;

			if (/* tHead.length*/headerRows && headerRows.length()) {
				visibleColumns = []; // visible bands and leaves

				$.wijmo.wijgrid.traverse(this.options.columns, function (column) {
					if (column.parentVis) {
						visibleColumns.push(column);
					}
				});

				for (i = 0, len = visibleColumns.length; i < len; i++) {
					column = visibleColumns[i];
					headerRowObj = headerRows.item(column.thY);
					th = new $.wijmo.wijgrid.rowAccessor().getCell(headerRowObj, column.thX);

					columnWidget = this._columnWidgetsFactory($(th), column);
					columns.push(columnWidget.data(columnWidget.data($.wijmo.c1basefield.prototype._data$prefix + "widgetName"))); // store actual widget instance
				}
			}

			this._field("columns", columns);
		},

		_ownerise: function (flag) {
			if (flag) {
				var self = this;

				$.wijmo.wijgrid.traverse(this.options.columns, function (column) {
					column.owner = self;

					var tmp, i, len;

					if ((tmp = column.groupInfo)) {
						tmp.owner = column;

						if (tmp.expandInfo) {
							for (i = 0, len = tmp.expandInfo.length; i < len; i++) {
								tmp.expandInfo[i].owner = tmp;
							}
						}
					}
				});
			} else {

				$.wijmo.wijgrid.traverse(this.options.columns, function (column) {
					delete column.owner;

					var tmp, i, len;

					if ((tmp = column.groupInfo)) {
						delete tmp.owner;

						if (tmp.expandInfo) {
							for (i = 0, len = tmp.expandInfo.length; i < len; i++) {
								delete tmp.expandInfo[i].owner;
							}
						}
					}
				});
			}
		},

		_updateSplits: function (scrollValue) {
			if (this._view().updateSplits !== null) {
				this._view().updateSplits(scrollValue);
			}
		},

		_refresh: function () {
			var view, currentCell, resizer,
				scrollValue = { type: "", hScrollValue: null, vScrollValue: null },
				filterEditorsInfo = [];

			//$.wijmo.wijgrid.timerOn("refresh");

			if (this._view()) {
				scrollValue = this._view().getScrollValue();
			}

			this._detachEvents(false);

			this.element.detach();
			this.element.empty();
			this.outerDiv.empty();
			this.outerDiv.append(this.element);

			if (this._field("selectionui")) {
				this._field("selectionui").dispose();
				this._field("selectionui", null);
			}

			if (this._field("headerRowsAccessor")) {
				this._field("headerRowsAccessor", null);
			}

			if (this._field("rowsAccessor")) {
				this._field("rowsAccessor", null);
			}

			if (this._field("resizer")) {
				this._field("resizer").dispose();
			}

			// apply grouping
			new $.wijmo.wijgrid.grouper().group(this, this.dataTable, this._field("leaves"));

			// apply merging
			new $.wijmo.wijgrid.merger().merge(this.dataTable, this._field("visibleLeaves"));

			// view
			//if (!this.options.splits && (this.options.staticRowIndex >= 0 || this.options.staticColumnIndex >= 0)) {
			// only support fixing row feature in this version.
			if (this.options.scrollMode !== "none" && (this._staticColumnIndex >= 0 || this.options.staticRowIndex >= 0)) {
				this._field("view", view = new $.wijmo.wijgrid.fixedView(this));
			} else {
				this._field("view", view = new $.wijmo.wijgrid.flatView(this));
			}

			this._render();

			// (re)create iternal widgets
			this._ownerise(false);
			this._recreateColumnWidgets();
			this._ownerise(true);

			// pager
			if (this.options.allowPaging) {
				// top pager
				if (this.$topPagerDiv) {
					this.$topPagerDiv.wijpager(this._pagerSettings2PagerWidgetSettings());
				}

				// bottom pager
				if (this.$bottomPagerDiv) {
					this.$bottomPagerDiv.wijpager(this._pagerSettings2PagerWidgetSettings());
				}
			}

			// (re)create iternal widgets

			// update css
			//this._updateCss();

			// attach events
			this._attachEvents();

			// currentCell
			view.focusableElement().attr("tabIndex", 0); // to handle keyboard\ focus events

			//because after setting some options affecting the current cell,
			//the current cell info is not correct.
			//if (this.currentCell()._isValid()) {
			//	this.currentCell(this.currentCell())._isEdit(false);
			if (this.currentCell()._isValid() && this.currentCell(this.currentCell())) {
				this.currentCell()._isEdit(false);
			} else {
				this.currentCell(this._getFirstDataRowCell(0));
			}

			// selection
			this._field("selection", null); // always recreate selection object
			currentCell = this.currentCell();
			if (currentCell._isValid()) {
				this.selection()._startNewTransaction(currentCell);
				this.selection()._selectRange(new $.wijmo.wijgrid.cellInfoRange(currentCell, currentCell), false, false, 0 /* none */, null);
			}

			// selection ui
			this._selectionui();

			// initialize resizer
			resizer = new $.wijmo.wijgrid.resizer(this);
			$.each(this.columns(), function (index, colWidget) {
				var o = colWidget.options;

				if (o.visible && o.parentVis && o.isLeaf) {
					resizer.addElement(colWidget);
				}
			});
			this._field("resizer", resizer);

			this.rendered = true;

			this._updateSplits(scrollValue); /*dma*/

			// update filter editors widths
			$.each(this.columns(), function (index, colWidget) {
				if (!colWidget.options.isBand && colWidget.options.showFilter === true) {
					var width = colWidget._getFilterEditorWidth();

					if (width !== undefined) {
						filterEditorsInfo.push({
							widget: colWidget,
							width: width
						});
					}
				}
			});

			$.each(filterEditorsInfo, function (index, item) {
				item.widget._setFilterEditorWidth(item.width);
			});

			//window.defaultStatus = $.wijmo.wijgrid.timerOff("refresh");
		},

		_render: function () {
			var view = this._view(),
				content;

			view.render();

			// YK: for fixing pager is not align to top and bottom when header is fixed.
			content = this.outerDiv;
			if (this.options.scrollMode !== "none") {
				// fixed header content
				if (this.options.staticRowIndex >= 0) { // interpreted as bool, use getRealStaticRowIndex() to get the actual value.
					content = this.outerDiv.find("div.wijmo-wijgrid-scroller:first");
				}
				else {
					content = this.outerDiv.find(".wijmo-wijgrid-content-area");
				}
			}

			this.$superPanelHeader = null;

			// top pager (top div)
			if (this.$topPagerDiv) {
				if (this.$topPagerDiv.data("wijpager")) {
					this.$topPagerDiv.wijpager("destroy");
				}

				this.$topPagerDiv.remove();
			}

			this.$topPagerDiv = null;

			if (this.options.allowPaging && ((this.options.pagerSettings.position === "top") || (this.options.pagerSettings.position === "topAndBottom"))) {
				if (!this.$topPagerDiv) {
					content.prepend(this.$superPanelHeader = $("<div class=\"wijmo-wijsuperpanel-header\"></div>"));
					this.$superPanelHeader.prepend(this.$topPagerDiv = $("<div class=\"wijmo-wijgrid-header ui-widget-header ui-corner-top\"></div>"));
				}
			}

			if (this.options.showGroupArea) {
				this._processGroupArea(content);
			} else {
				this.$groupArea = null;
			}

			// bottom pager (bottom div)
			if (this.$bottomPagerDiv) {
				if (this.$bottomPagerDiv.data("wijpager")) {
					this.$bottomPagerDiv.wijpager("destroy");
				}

				this.$bottomPagerDiv.remove();
			}

			this.$bottomPagerDiv = null;

			if (this.options.allowPaging && ((this.options.pagerSettings.position === "bottom") || (this.options.pagerSettings.position === "topAndBottom"))) {
				if (!this.$bottomPagerDiv) {
					content.append(this.$bottomPagerDiv = $("<div class=\"wijmo-wijgrid-footer wijmo-wijsuperpanel-footer ui-state-default ui-corner-bottom\"></div>"));
				}
			}
		},

		_processGroupArea: function (content) {
			var self = this,
				groupCollection = this._field("groupedColumns"),
				groupWidgetCollection = [];

			this.$groupArea = $("<div class=\"ui-widget-content ui-helper-clearfix\"></div>");

			if (groupCollection.length > 0) {
				$.each(groupCollection, function (index, item) {
					var groupElement = $("<a href=\"#\"></a>").appendTo(self.$groupArea);

					groupElement.c1groupedfield($.extend({ owner: self }, {
						allowMoving: item.allowMoving,
						allowSort: item.allowSort,
						dataIndex: item.dataIndex,
						headerText: item.headerText,
						isBand: item.isBand,
						isLeaf: item.isLeaf,
						linearIdx: item.linearIdx,
						parentIdx: item.parentIdx,
						sortDirection: item.sortDirection,
						travIdx: item.travIdx,
						groupedIndex: item.groupedIndex
					}, { disabled: self.options.disabled }));

					groupWidgetCollection.push(groupElement.data("c1groupedfield"));
				});
			}
			else {
				this.$groupArea
					.addClass("wijmo-wijgrid-group-area")
					.html(this.options.groupAreaCaption || "&nbsp;");
			}

			this._field("groupedWidgets", groupWidgetCollection);

			if (!this.$superPanelHeader) {
				content.prepend(this.$superPanelHeader = $("<div class=\"wijmo-wijsuperpanel-header\"></div>"));
			}

			this.$superPanelHeader.prepend(this.$groupArea);

			this._dragndrop().attachGroupArea(this.$groupArea);
		},

		/*
		_updateCss: function() {
		var view = this._view();

		$.each(view.subTables(), function(index, item) {
		var domTable = item.element();
		$(domTable).addClass("wijmo-wijgrid-table");

		if (domTable.tBodies) {
		var tBody = domTable.tBodies[0];
		if (tBody) {
		$(tBody).addClass("ui-widget-content wijmo-wijgrid-data");
		}
		}
		});

		view.updateCss();
		},*/

		_attachEvents: function () {
			var view = this._view(),
				$fe = view.focusableElement();

			$fe.bind("keydown." + this.widgetName, $.proxy(this._onKeyDown, this));
			$fe.bind("keypress." + this.widgetName, $.proxy(this._onKeyPress, this));

			$.each(view.subTables(), $.proxy(function (index, element) {
				var domTable = element.element();
				if (domTable) {
					if (domTable.tHead) {
						$(domTable.tHead).bind("click." + this.widgetName, $.proxy(this._onClick, this));
					}

					if (domTable.tBodies.length) {
						$(domTable.tBodies[0])
							.bind("click." + this.widgetName, $.proxy(this._onClick, this))
							.bind("dblclick." + this.widgetName, $.proxy(this._onDblClick, this))
							.bind("mousemove." + this.widgetName, $.proxy(this._onMouseMove, this))
							.bind("mouseout." + this.widgetName, $.proxy(this._onMouseOut, this));
					}
				}
			}, this));

			// attach "onGroupExpandCollapseIconClick" event
			$.each(view.getJoinedTables(true, 0), $.proxy(function (index, item) {
				if (item && typeof (item) !== "number") {
					var domTable = item.element(); // item is a htmlTableAccessor instance

					$(domTable)
						.find("> tbody")
						.find("> tr.wijmo-wijgrid-groupheaderrow > td .wijmo-wijgrid-grouptogglebtn")
						.bind("click." + this.widgetName, $.proxy(this._onGroupBtnClick, this));
				}
			}, this));
		},

		_detachEvents: function (destroy) {
			var view = this._view(),
				self = this,
				$fe;

			if (view) {
				$fe = view.focusableElement();

				$fe.unbind("keydown." + this.widgetName);
				$fe.unbind("keypress." + this.widgetName);

				$.each(view.subTables(), function () {
					var domTable = this.element(); // item (this) is a htmlTableAccessor instance 

					if (domTable) {
						if (domTable.tHead) {
							$(domTable.tHead).unbind("." + self.widgetName);
						}

						if (domTable.tBodies.length) {
							$(domTable.tBodies[0]).unbind("." + self.widgetName);
						}
					}
				});

				if (destroy) {
					// detach "onGroupExpandCollapseIconClick" event
					$.each(view.getJoinedTables(true, 0), function (index, item) {
						if (item && typeof (item) !== "number") {
							$(item.element()) // item (this) is a htmlTableAccessor instance 
								.find("> tbody")
								.find("> tr.wijmo-wijgrid-groupheaderrow > td .wijmo-wijgrid-grouptogglebtn")
								.unbind("." + self.widgetName);
						}
					});
				}
			}
		},

		_handleSort: function (column, multiSort) {
			var columns = this.options.columns,
				travIdx = column.travIdx,
				newSortDirection, args;

			//if (this.options.allowSorting && ($.inArray(columnWidget, columns) >= 0)) {
			if (column && this.options.allowSorting) {
				newSortDirection = ((column.sortDirection === "none")
					? "ascending"
					: ((column.sortDirection === "ascending") ? "descending" : "ascending"));

				args = { column: column, sortDirection: newSortDirection };

				if (this._onColumnSorting(args)) {
					args.column.sortDirection = args.sortDirection;

					if (multiSort) {
						args.column.sortOrder = this._customSortOrder++;
					} else {
						this._customSortOrder = 1000; // reset to default

						// reset sortDirection for all column widgets except sorting one and grouped columns
						$.each(this.columns(), function (index, item) {
							item.options.sortOrder = 0;

							if (item.options.travIdx !== travIdx && !(item.options.groupInfo && item.options.groupInfo.position !== "none")) {
								item.options.sortDirection = "none";
							}
						});

						// ensure invisible columns.
						$.wijmo.wijgrid.traverse(columns, function (item) {
							item.sortOrder = 0;

							if (item.travIdx !== travIdx && !(item.groupInfo && item.groupInfo.position !== "none")) {
								item.sortDirection = "none";
							}
						});
					}

					this.ensureControl(true, {
						afterRefresh: function () { this._onColumnSorted({ column: args.column }); }
					});
				}
			}
		},

		_pagerSettings2PagerWidgetSettings: function () {
			return $.extend({}, this.options.pagerSettings,
				{
					disabled: this.options.disabled,
					pageCount: this.pageCount(),
					pageIndex: this.options.pageIndex,
					pageIndexChanging: $.proxy(this._onPagerWidgetPageIndexChanging, this),
					pageIndexChanged: $.proxy(this._onPagerWidgetPageIndexChanged, this)
				});
		},

		_handleDragnDrop: function (dragTravIdx, dropTravIdx, at, dragInGroup, dropInGroup) {
			var drag = $.wijmo.wijgrid.getColumnByTravIdx(this.options.columns, dragTravIdx),
				drop = $.wijmo.wijgrid.getColumnByTravIdx(this.options.columns, dropTravIdx),
				dragSource = dragInGroup ? "groupArea" : "columns",
				dropSource = dropInGroup ? "groupArea" : "columns";

			if (dropInGroup) { // drag is dropped into the group area
				if (this._onColumnGrouping({ drag: drag.found, drop: drop ? drop.found : null, dragSource: dragSource, dropSource: dropSource, at: at })) {
					this.ensureControl(true, {
						beforeRefresh: function () {
							if (!drop) { // drag is dropped into the empty group area.
								drag.found.groupedIndex = 0;
							} else {
								switch (at) {
									case "left":
										drag.found.groupedIndex = drop.found.groupedIndex - 0.5;
										break;

									case "right":
										drag.found.groupedIndex = drop.found.groupedIndex + 0.5;
										break;
								}
							}

							if (!dragInGroup) {
								$.extend(true, drag.found, {
									groupInfo: {
										position: "header"
									}
								});
							}
						},

						afterRefresh: function () {
							this._onColumnGrouped({ drag: drag.found, drop: drop ? drop.found : null, dragSource: dragSource, dropSource: dropSource, at: at });
						}
					});
				}
			} else {
				if (this._onColumnDropping({ drag: drag.found, drop: drop.found, at: at })) {
					this.ensureControl(false, {
						beforeRefresh: function () {
							/* modifying the wijgrid.options.columns option */
							drag.at.splice(drag.found.linearIdx, 1);

							//because when drag is before drop, the index of drop is affected.
							switch (at) {
								case "left":
									if (drag.at === drop.at && drag.found.linearIdx < drop.found.linearIdx) {
										drop.at.splice(drop.found.linearIdx - 1, 0, drag.found);
									} else {
										drop.at.splice(drop.found.linearIdx, 0, drag.found);
									}
									break;

								case "right":
									if (drag.at === drop.at && drag.found.linearIdx < drop.found.linearIdx) {
										drop.at.splice(drop.found.linearIdx, 0, drag.found);
									} else {
										drop.at.splice(drop.found.linearIdx + 1, 0, drag.found);
									}
									break;

								case "center": // drop is a band
									drop.found.columns.push(drag.found);
									break;
							}

							// rebuild indices (linearIdx, travIdx, parentIdx)
							$.wijmo.wijgrid.setTraverseIndex(this.options.columns);
						},

						afterRefresh: function () {
							this._onColumnDropped({ drag: drag.found, drop: drop.found, at: at });
						}
					});
				}
			}
		},

		_handleFilter: function (column, rawOperator, rawValue) {
			var operator = this.filterOperatorsCache.getByName(rawOperator),
				value, ok;

			if (operator) {
				if (operator.arity > 1) {
					// check value
					value = this._parse(column.options, rawValue);
					ok = (value !== null && (column.options.dataType === "string" || !isNaN(value)));
				} else {
					ok = true;
				}

				if (ok) {
					if (this._onColumnFiltering({ column: column.options, operator: operator.name, value: value })) {
						column.options.filterValue = value;
						column.options.filterOperator = operator.name;

						this.options.pageIndex = 0;

						this.ensureControl(true, {
							afterRefresh: function () { this._onColumnFiltered({ column: column.options }); }
						});
					}
				}
			}
		},

		_handleUngroup: function (columnTravIdx) {
			var column = $.wijmo.wijgrid.getColumnByTravIdx(this.options.columns, columnTravIdx);
			if (column && column.found) {
				column = column.found;

				if (this._onColumnUngrouping({ column: column })) {

					this.ensureControl(false, {
						beforeRefresh: function () {
							delete column.groupedIndex;

							$.extend(true, column, {
								groupInfo: {
									position: "none"
								}
							});							
						},

						afterRefresh: function () {
							this._onColumnUngrouped({ column: column });
						}
					});
				}
			}
		},

		// * event handlers

		_onColumnDropping: function (args) {
			return this._trigger("columnDropping", null, args);
		},

		_onColumnDropped: function (args) {
			this._trigger("columnDropped", null, args);
		},

		_onColumnGrouping: function (args) {
			return this._trigger("columnGrouping", null, args);
		},

		_onColumnGrouped: function (args) {
			this._trigger("columnGrouped", null, args);
		},

		_onColumnUngrouping: function (args) {
			return this._trigger("columnUngrouping", null, args);
		},

		_onColumnUngrouped: function (args) {
			this._trigger("columnUngrouped", null, args);
		},

		_onColumnFiltering: function (args) {
			return true;
		},

		_onColumnFiltered: function (args) {
		},

		_onColumnSorting: function (args) {
			return this._trigger("sorting", null, args);
		},

		_onColumnSorted: function (args) {
			this._trigger("sorted", null, args);
		},

		_onCurrentCellChanged: function () {
			if (this.options.allowKeyboardNavigation) {
				var currentCell = this._field("currentCell");

				if (currentCell && !currentCell.isEqual(currentCell.outsideValue)) {
					this._view().scrollTo(currentCell);
				}
			}

			this._trigger("currentCellChanged");
		},

		_onPageIndexChanging: function (args) {
			return this._trigger("pageIndexChanging", null, args);
		},

		_onPageIndexChanged: function (args) {
			this._trigger("pageIndexChanged");
		},

		_onPagerWidgetPageIndexChanging: function (sender, args) {
			args.handled = true;
		},

		_onPagerWidgetPageIndexChanged: function (sender, args) {
			this._setOption("pageIndex", args.newPageIndex);
		},

		_onClick: function (args) {
			if (!this._canInteract() || !args.target) {
				return;
			}

			// info[0] - clicked cell
			// info[1] - wijmo-wijgrid-table
			var view = this._view(),
				info = this._getParentSubTable(args.target, ["td", "th"], view.subTables()),
				clickedCell, $row, clickedCellInfo,
				extendMode = 0, // none
				currentCell, selection;

			if (info) {
				clickedCell = info[0];

				$row = $(clickedCell).closest("tr");

				if (!($row.is(".wijmo-wijgrid-datarow") || $row.is(".wijmo-wijgrid-headerrow"))) {
					return;
				}

				if (!$row.length) {
					return;
				}

				clickedCellInfo = view.getAbsoluteCellInfo(clickedCell)._dataToAbs(this._getDataToAbsOffset());

				if (clickedCellInfo.cellIndex() < 0 || clickedCellInfo.rowIndex() < 0) { // header cell, rowheader cell or filter cell

					if (clickedCellInfo.rowIndex() >= 0) { // rowheader cell
						// move current cell to the first cell of the clicked row
						clickedCellInfo = new $.wijmo.wijgrid.cellInfo(0, clickedCellInfo.rowIndex());
						extendMode = 2; // extend to row
					} else { // header cell
						// move current cell to the first data cell of the clicked column
						clickedCellInfo = this._getFirstDataRowCell(clickedCellInfo.cellIndex());
						extendMode = 1; // extend to column
					}
				}

				this._changeCurrentCell(clickedCellInfo);

				currentCell = this.currentCell();
				selection = this.selection();

				if (!args.shiftKey || (!selection._multipleRangesAllowed() && this.options.selectionMode.toLowerCase() !== "singlerange")) {
					selection._startNewTransaction(currentCell);
				}

				selection.beginUpdate();

				if (args.shiftKey && args.ctrlKey) {
					selection._clearRange(new $.wijmo.wijgrid.cellInfoRange(currentCell, currentCell), extendMode);
				} else {
					selection._selectRange(new $.wijmo.wijgrid.cellInfoRange(selection._anchorCell(), currentCell), args.ctrlKey, args.shiftKey, extendMode, null);
				}

				selection.endUpdate();
			}
		},

		_onDblClick: function (args) {
			this._beginEditInternal(args);
		},

		_onGroupBtnClick: function (args) {
			var $row = $(args.target).closest("tr"),
				gh = new $.wijmo.wijgrid.groupHelper(),
				groupInfo = gh.getGroupInfo($row[0]),
				column, group;

			if (groupInfo) {
				column = gh.getColumnByGroupLevel(this._field("leaves"), groupInfo.level);
				if (column) {
					group = column.groupInfo.expandInfo[groupInfo.index];

					if (group.isExpanded) {
						group.collapse(args.shiftKey);
					} else {
						group.expand(args.shiftKey);
					}
					this._view().ensureWidth(); /*dma*/
				}
			}
		},

		_onKeyDown: function (args) {
			if (!this._canInteract) {
				return true;
			}

			var tag = args.target.tagName.toLowerCase(),
				canChangePos = false,
				curPos, cell, currentCell, selection;

			if ((tag === "input" || tag === "option" || tag === "select" || tag === "textarea") &&
				 ($(args.target).closest("tr.wijmo-wijgrid-datarow").length === 0)) { // not a datarow ?
				return true;
			}

			if (this.options.allowEditing) {
				if (args.which === 113) { // F2: start editing
					this._beginEditInternal(args);
					return false;
				} else
				// ESC: cancel editing
					if ((args.which === $.ui.keyCode.ESCAPE) && (this.currentCell()._isValid() && this.currentCell()._isEdit())) {
						this._endEditInternal(args);
						return false;
					}
			}

			if (!this.options.allowKeyboardNavigation) {
				return true;
			}

			//switch (args.keyCode) {
			switch (args.which) {
				case $.ui.keyCode.LEFT:
				case $.ui.keyCode.RIGHT:
				case $.ui.keyCode.DOWN:
				case $.ui.keyCode.UP:
				case $.ui.keyCode.PAGE_DOWN:
				case $.ui.keyCode.PAGE_UP:
				case $.ui.keyCode.HOME:
				case $.ui.keyCode.END:
				case $.ui.keyCode.TAB:

					curPos = this._getNextCurrencyPos(this._getDataCellsRange(), this.currentCell(), args.keyCode, args.shiftKey);
					canChangePos = this._canMoveToAnotherCell(args.target, args.which); // TODO: add tab navigation

					break;
			}

			if (canChangePos) {
				cell = this._changeCurrentCell(new $.wijmo.wijgrid.cellInfo(curPos.cellIndex, curPos.rowIndex));

				currentCell = this.currentCell();
				selection = this.selection();

				if (!args.shiftKey || (!selection._multipleRangesAllowed() && this.options.selectionMode.toLowerCase() !== "singlerange")) {
					selection._startNewTransaction(currentCell);
				}

				selection.beginUpdate();
				selection._selectRange(new $.wijmo.wijgrid.cellInfoRange(selection._anchorCell(), currentCell), false, args.shiftKey, 0 /* none */, null);
				selection.endUpdate();

				// TODO: tab navigation

				return false; // stop bubbling
			}

			return true;
		},

		_onKeyPress: function (args) {
			if (this._canInteract() && this.options.allowEditing) {
				var charCode = args.which,
					currentCell = this.currentCell(),
					tag, table, domSubTables;

				if (charCode && currentCell._isValid() && !currentCell._isEdit()) {
					tag = args.target.tagName.toLowerCase();

					if (tag !== "input" && tag !== "option" && tag !== "select" && tag !== "textarea") {
						table = $(args.target).closest(".wijmo-wijgrid-table");
						// if (table.length && (table[0] === this.$table[0])) {
						if (table.length) {

							domSubTables = $.map(this._view().subTables(), function (item, index) {
								return item.element();
							});

							if ($.inArray(table[0], domSubTables) >= 0) {
								if ($.wij.charValidator.isPrintableChar(String.fromCharCode(charCode))) {
									//new $.wijmo.wijgrid.cellEditorHelper().currentCellEditStart(this, args);
									this._beginEditInternal(args);
									return false;
								}
							}
						}
					}
				}
			}
		},

		_onMouseMove: function (args) {
			if (!this._canInteract()) {
				return;
			}

			var view = this._view(),
				info = this._getParentSubTable(args.target, ["td", "th"], view.subTables()),
				hoveredCell, $hoveredRow, hoveredCellInfo, rowIndex, rowObj, rowInfo,
				$rs = $.wijmo.wijgrid.renderState;

			if (info) {
				hoveredCell = info[0];
				$hoveredRow = $(hoveredCell).closest("tr");

				if (!$hoveredRow.length || $hoveredRow.is(".wijmo-wijgrid-foorow") || !($hoveredRow.is(".wijmo-wijgrid-datarow") || $hoveredRow.is(".wijmo-wijgrid-headerrow"))) {
					return;
				}

				hoveredCellInfo = view.getAbsoluteCellInfo(hoveredCell)._dataToAbs(this._getDataToAbsOffset());

				rowIndex = this._field("hoveredRow"); // previous row index
				if (rowIndex !== undefined && hoveredCellInfo.rowIndex() !== rowIndex) {
					rowObj = this._rows().item(rowIndex);
					if (rowObj) {
						rowInfo = this._createRowInfo(rowObj);
						rowInfo.state = this._changeRenderState(rowInfo.$rows, $rs.hovered, false);
						this.rowStyleFormatter.format(rowInfo);
					}
				}

				rowIndex = hoveredCellInfo.rowIndex();
				this._field("hoveredRow", rowIndex);
				//if (rowIndex >= 1) { // yk to inclue the first row.
				if (rowIndex >= 0) {
					rowObj = this._rows().item(rowIndex);
					if (rowObj) {
						rowInfo = this._createRowInfo(rowObj);
						rowInfo.state = this._changeRenderState(rowInfo.$rows, $rs.hovered, true);
						this.rowStyleFormatter.format(rowInfo);
					}
				}
			}
		},

		_onMouseOut: function (args) {
			if ($(args.relatedTarget).closest(".wijmo-wijgrid-data").length === 0) { // remove hovering
				var hovRowIndex = this._field("hoveredRow"),
					rowObj, rowInfo;

				if (hovRowIndex >= 0) {
					rowObj = this._rows().item(hovRowIndex);
					if (rowObj) {
						rowInfo = this._createRowInfo(rowObj);
						rowInfo.state = this._changeRenderState(rowInfo.$rows, $.wijmo.wijgrid.renderState.hovered, false);
						this.rowStyleFormatter.format(rowInfo);
					}
				}
			}
		},
		// * event handlers


		// * resizing
		_fieldResized: function (fieldWidget, oldWidth, newWidth) {
			if (oldWidth < 0) {
				oldWidth = 0;
			}

			if (newWidth <= 0) {
				newWidth = 1;
			}

			if (this._trigger("columnResizing", null, { column: fieldWidget.options, oldWidth: oldWidth, newWidth: newWidth }) !== false) {
				//we should set the width option with the column resized
				//this.options.columns[fieldWidget.options.$uid].width = newWidth;
				fieldWidget.option("width", newWidth);

				this._trigger("columnResized", null, { column: fieldWidget.options });
			}
		},
		// * resizing

		// * currentCell
		_changeCurrentCell: function (cellInfo) {
			var result = null,
				currentCell = this.currentCell(),
				dataRange = this._getDataCellsRange(),
				args, cellEditCompleted;

			// if cellInfo has a valid value
			if ((dataRange._isValid() && dataRange._containsCellInfo(cellInfo)) || (cellInfo.isEqual(cellInfo.outsideValue))) {

				// other cell than current cell
				if (currentCell.cellIndex() !== cellInfo.cellIndex() || currentCell.rowIndex() !== cellInfo.rowIndex()) {
					args = {
						cellIndex: cellInfo.cellIndex(),
						rowIndex: cellInfo.rowIndex(),
						oldCellIndex: currentCell.cellIndex(),
						oldRowIndex: currentCell.rowIndex()
					};

					if (this._trigger("currentCellChanging", null, args)) {

						cellEditCompleted = false;
						if (!this.options.allowEditing || !currentCell._isEdit() || (cellEditCompleted = this._endEditInternal(null))) {
							if (dataRange._containsCellInfo(currentCell)) {
								this._changeCurrentCellUI(currentCell, false); // remove the current one
							}

							currentCell = cellInfo._clone();
							currentCell._setGridView(this);

							result = this._changeCurrentCellUI(currentCell, true);

							this._field("currentCell", currentCell); // set currentCell

							//this._trigger("currentCellChanged");
							this._onCurrentCellChanged();
						}
					}
				} else { // the same cell
					result = this._changeCurrentCellUI(currentCell, true); // ensure
				}
			} else { // cellInfo is invalid
				// do nothing

				// this._changeCurrentCellUI(currentCell, false);
				// this._field("currentCell", currentCell.outsideValue); // set currentCell
			}

			return result;
		},

		_changeCurrentCellUI: function (cellInfo, add) {
			if (cellInfo && !cellInfo.isEqual(cellInfo.outsideValue)) {
				var view = this._view(),
					leaves = this._field("visibleLeaves"),
					dataOffset = this._getDataToAbsOffset(),
					x = cellInfo.cellIndex() + dataOffset.x,
					y = cellInfo.rowIndex() + dataOffset.y,
					cell, $cell, dataRowObj, dataRowInfo, headerRowInfo,
					$rs = $.wijmo.wijgrid.renderState,
					state;

				if (y >= 0) {
					dataRowObj = view.getJoinedRows(y, 0);

					if (dataRowObj) {
						dataRowInfo = this._createRowInfo(dataRowObj);
						dataRowInfo.state = this._changeRenderState(dataRowInfo.$rows, $rs.current, add);
						this.rowStyleFormatter.format(dataRowInfo);
					}

					if (x >= 0 && x < leaves.length) {
						cell = view.getHeaderCell(x);
						if (cell) { // activate header cell
							headerRowInfo = this._createRowInfo(this._headerRows().item(cellInfo.column().thY));

							$cell = $(cell);
							state = this._changeRenderState($cell, $rs.current, add);
							this.cellStyleFormatter.format($cell, x, cellInfo.column(), headerRowInfo, state);
						}

						cell = view.getCell(x, y);
						if (cell) { // activate data cell
							$cell = $(cell);
							state = this._changeRenderState($cell, $rs.current, add);
							this.cellStyleFormatter.format($cell, x, cellInfo.column(), dataRowInfo, state);
						}
					}

					return view.getCell(x, y);
				} // if y >= 0
			}

			return null;
		},
		// * currentCell


		// * editing
		_beginEditInternal: function (e) {
			if (this._canInteract() && this.options.allowEditing) {
				var column = this.currentCell().column(),
					res;

				if (column && !column.readOnly) {
					res = new $.wijmo.wijgrid.cellEditorHelper().currentCellEditStart(this, e);
					if (res) {
						// this._view().ensureWidth(undefined, column.visLeavesIdx);
					}
					return res;
				}
			}

			return false;
		},

		_endEditInternal: function (e) {
			if (this._canInteract() && this.options.allowEditing) {
				//var column = this.currentCell().column(),
				var res = new $.wijmo.wijgrid.cellEditorHelper().currentCellEditEnd(this, e);

				if (res) {
					// this._view().ensureWidth(undefined, column.visLeavesIdx);
				}
				return res;
			}

			return false;
		},
		// * editing

		// misc

		_createRow: function (tableSection, rowType, rowIndex) {
			return tableSection.insertRow(-1);
		},

		_createCell: function (rowType, rowIndex, rowCell) {
			var rt = $.wijmo.wijgrid.rowType;

			switch (rowType) {
				case rt.header:
					return "<th><div class=\"wijmo-wijgrid-innercell\"></div></th>";

				case rt.filter:
					return "<td />";

				default: // body section - data, data | dataAlt, groupFooter, groupHeader, emptyDataRow
					// footer section - footer
					return "<td><div class=\"wijmo-wijgrid-innercell\"></div></td>";
			}
		},

		_cellCreated: function ($cell, cellIndex, column, rowInfo, state, attr, style) {
			$.wijmo.wijgrid.dataPrefix($cell, this._data$prefix, "renderState", state);

			this.cellStyleFormatter.format($cell, cellIndex, column, rowInfo, state, attr, style);

			this._changeRenderState($cell, $.wijmo.wijgrid.renderState.rendering, false);
		},

		_rowCreated: function (rowInfo, rowAttr, rowStyle) {
			$.wijmo.wijgrid.dataPrefix(true, rowInfo.$rows, this._data$prefix, {
				dataTableRowIndex: rowInfo._dataTableRowIndex,
				dataRowIndex: rowInfo.dataRowIndex,
				rowType: rowInfo.type,
				dataItemIndex: rowInfo.dataItemIndex,
				virtualDataItemIndex: rowInfo.virtualDataItemIndex,
				renderState: rowInfo.state
			});

			this.rowStyleFormatter.format(rowInfo, rowAttr, rowStyle);

			this._changeRenderState(rowInfo.$rows, $.wijmo.wijgrid.renderState.rendering, false);
		},

		_createRowInfo: function (rowObj, rowType /*opt*/, renderState /*opt*/, dataTableRowIndex /*opt*/, dataRowIndex /*opt*/, dataItemIndex/*opt*/, virtualDataItemIndex/*opt*/) {
			var dataTable = this.dataTable,
				sourceDataRow = null,
				$rows = (rowObj[1] ? $(rowObj) : $(rowObj[0])),
				tmp,
				$getData = $.wijmo.wijgrid.dataPrefix;

			if (isNaN(rowType)) {
				rowType = $getData($rows, this._data$prefix, "rowType");
			}

			if (isNaN(renderState)) {
				renderState = $getData($rows, this._data$prefix, "renderState");
			}

			if (isNaN(dataTableRowIndex)) {
				dataTableRowIndex = $getData($rows, this._data$prefix, "dataTableRowIndex");
			}

			if (isNaN(dataRowIndex)) {
				dataRowIndex = $getData($rows, this._data$prefix, "dataRowIndex");
			}

			if (isNaN(dataItemIndex)) {
				dataItemIndex = $getData($rows, this._data$prefix, "dataItemIndex");
			}

			if (isNaN(virtualDataItemIndex)) {
				virtualDataItemIndex = $getData($rows, this._data$prefix, "virtualDataItemIndex");
			}

			if (dataTableRowIndex >= 0) {
				tmp = dataTable[dataTableRowIndex].originalRowIndex;
				if (tmp >= 0) {
					sourceDataRow = this.data()[tmp];
				}
			}

			return {
				$rows: $rows,
				state: renderState,
				type: rowType,
				data: sourceDataRow,
				dataRowIndex: dataRowIndex,
				dataItemIndex: dataItemIndex,
				virtualDataItemIndex: virtualDataItemIndex,
				_dataTableRowIndex: dataTableRowIndex
			};
		},

		_ensureDataParser: function (column) {
			switch (column.dataType) {
				case undefined: // default parser
				case "string":
					if (!column.dataParser) {
						column.dataParser = $.wijmo.wijgrid.embeddedParsers.stringParser;
					}
					break;

				case "boolean":
					if (!column.dataParser) {
						column.dataParser = $.wijmo.wijgrid.embeddedParsers.boolParser;
					}
					break;

				case "number":
					if (!column.dataParser) {
						column.dataParser = $.wijmo.wijgrid.embeddedParsers.numberParser;
					}
					break;

				case "currency":
					if (!column.dataParser) {
						column.dataParser = $.wijmo.wijgrid.embeddedParsers.currencyParser;
					}
					break;

				case "datetime":
					if (!column.dataParser) {
						column.dataParser = $.wijmo.wijgrid.embeddedParsers.dateTimeParser;
					}
					break;

				default:
					throw $.wijmo.wijgrid.stringFormat("Unsupported dataType value: \"{0}\"", column.dataType);
			}
		},

		_parseDOM: function (column, value) {
			return column.dataParser.parseDOM(value, this._field("closestCulture"), column.dataFormatString, this.options.nullString, true);
		},

		_parse: function (column, value) {
			var parsedValue = column.dataParser.parse(value, this._field("closestCulture"), column.dataFormatString, this.options.nullString, true);

			switch (column.dataType) {
				case "datetime":
					if (parsedValue !== null && !(parsedValue instanceof Date)) {
						throw "invalid value.";
					}
					break;

				case "number":
				case "currency":
					if (parsedValue !== null && (typeof (parsedValue) !== "number" || isNaN(parsedValue))) {
						throw "invalid value.";
					}
					break;

				case "boolean":
					if (parsedValue !== null && (typeof (parsedValue) !== "boolean" || isNaN(parsedValue))) {
						throw "invalid value.";
					}

					break;
			}

			return parsedValue;
		},

		_toStr: function (column, value) {
			return column.dataParser.toStr(value, this._field("closestCulture"), column.dataFormatString, this.options.nullString, true);
		},

		_funcOptions: function () {
			return ["cellStyleFormatter", "rowStyleFormatter", "afterCellEdit", "afterCellUpdate", "beforeCellEdit", "beforeCellUpdate",
				"columnDragging", "columnDragged", "columnDropping", "columnDropped", "columnResizing", "columnResized",
				"columnGrouping", "columnGrouped", "columnUngrouping", "columnUngrouped", "currentCellChanging", "currentCellChanged",
				"filterOperatorsListShowing", "groupAggregate", "groupText", "invalidCellValue", "pageIndexChanging", "pageIndexChanged",
				"selectionChanged", "sorting", "sorted", "ajaxError", "dataLoading", "dataLoaded", "loading", "loaded", "rendering", "rendered"];
		},

		_canInteract: function () {
			return !this.options.disabled;
		},

		_canMoveToAnotherCell: function (domElement, keyCode) {
			var tag = domElement.tagName.toLowerCase(),
				len, selectionRange, kc, res;

			switch (tag) {
				case "input":
					if ($(domElement).hasClass("wijgridinput")) {

						if (domElement.type === "text") {
							len = domElement.value.length;
							selectionRange = new $.wijmo.wijgrid.domSelection(domElement).getSelection();

							kc = $.ui.keyCode;

							res = ((keyCode === kc.UP || keyCode === kc.DOWN || keyCode === kc.PAGE_DOWN || keyCode === kc.PAGE_UP) ||
								(selectionRange.length === 0 &&
									(
										(selectionRange.start === 0 && (keyCode === kc.LEFT || keyCode === kc.HOME)) ||
										(selectionRange.end >= len && (keyCode === kc.RIGHT || keyCode === kc.END))
									)
								));

							return res;
						}

						return true;
					}

					return false;

				case "textarea":
				case "select":
					return false;
			}

			return true;
		},

		_getDataToAbsOffset: function () {
			var x = 0,
				y = 0,
				headerRows = this._headerRows();

			if (this.options.showRowHeader) {
				x++;
			}

			if (headerRows) {
				y += headerRows.length();
			}

			if (this._filterRow()) {
				y++;
			}

			return {
				x: x,
				y: y
			};
		},

		_getDataCellsRange: function () {
			var minCol = 0,
				minRow = 0,
				maxCol = this._field("visibleLeaves").length - 1, // = this._field("dataCache").<maxWidth>
				maxRow = this.dataTable.length - 1;

			if (this.options.showRowHeader) {
				maxCol--;
			}

			if (maxCol < 0 || maxRow < 0) {
				minCol = minRow = maxCol = maxRow = -1;
			}

			return new $.wijmo.wijgrid.cellInfoRange(new $.wijmo.wijgrid.cellInfo(minCol, minRow),
				new $.wijmo.wijgrid.cellInfo(maxCol, maxRow));
		},

		_getFirstDataRowCell: function (absCellIndex) {
			var rowIndex, dataRow,
				$rt = $.wijmo.wijgrid.rowType;

			for (rowIndex = 0; dataRow = this.dataTable[rowIndex]; rowIndex++) {
				if (dataRow.rowType & $rt.data) {
					return new $.wijmo.wijgrid.cellInfo(absCellIndex, rowIndex);
				}
			}

			return $.wijmo.wijgrid.cellInfo.prototype.outsideValue;
		},

		_getNextCurrencyPos: function (dataRange, cellInfo, keyCode, shiftKeyPressed) {
			var cellIndex = cellInfo.cellIndex(),
				rowIndex = cellInfo.rowIndex(),
				tmp;

			switch (keyCode) {
				case $.ui.keyCode.PAGE_UP:
					if (this._reverseKey && rowIndex === dataRange.topLeft().rowIndex()) {
						rowIndex = dataRange.bottomRight().rowIndex();
					} else {
						rowIndex -= this._pageSizeKey;

						if (rowIndex < (tmp = dataRange.topLeft().rowIndex())) {
							rowIndex = tmp;
						}
					}
					break;

				case $.ui.keyCode.PAGE_DOWN:
					if (this._reverseKey && rowIndex === dataRange.bottomRight().rowIndex()) {
						rowIndex = dataRange.TopLeft().RowIndex();
					}
					else {
						rowIndex += this._pageSizeKey;

						if (rowIndex > (tmp = dataRange.bottomRight().rowIndex())) {
							rowIndex = tmp;
						}
					}

					break;

				case $.ui.keyCode.END:
					cellIndex = (this._reverseKey && cellIndex === dataRange.bottomRight().cellIndex())
						? dataRange.topLeft().cellIndex()
						: dataRange.bottomRight().cellIndex();

					break;

				case $.ui.keyCode.HOME:
					cellIndex = (this._reverseKey && cellIndex === dataRange.topLeft().cellIndex())
						? dataRange.bottomRight().cellIndex()
						: dataRange.topLeft().cellIndex();

					break;

				case $.ui.keyCode.LEFT:
					if (cellIndex > dataRange.topLeft().cellIndex()) {
						cellIndex--;
					} else
						if (this._reverseKey) {
							cellIndex = dataRange.bottomRight().cellIndex();
						}

					break;

				case $.ui.keyCode.UP:
					if (rowIndex > dataRange.topLeft().rowIndex()) {
						rowIndex--;
					}
					else
						if (this._reverseKey) {
							rowIndex = dataRange.bottomRight().rowIndex();
						}

					break;

				case $.ui.keyCode.RIGHT:
					if (cellIndex < dataRange.bottomRight().cellIndex()) {
						cellIndex++;
					}
					else
						if (this._reverseKey) {
							cellIndex = dataRange.topLeft().cellIndex();
						}

					break;

				case $.ui.keyCode.ENTER:
				case $.ui.keyCode.DOWN:
					if (rowIndex < dataRange.bottomRight().rowIndex()) {
						rowIndex++;
					}
					else
						if (this._reverseKey) {
							rowIndex = dataRange.topLeft().rowIndex();
						}

					break;

				case $.ui.keyCode.TAB:
					if (false /* TODO - tab navigation */) {
						if (shiftKeyPressed) {
							cellIndex--;

							if (cellIndex < dataRange.topLeft().cellIndex()) {

								cellIndex = dataRange.bottomRight().cellIndex();
								rowIndex--;

								if (rowIndex < dataRange.topLeft().rowIndex()) {
									rowIndex = dataRange.bottomRight().rowIndex();
								}
							}
						}
						else {
							cellIndex++;

							if (cellIndex > dataRange.bottomRight().cellIndex()) {
								cellIndex = dataRange.topLeft().cellIndex();
								rowIndex++;

								if (rowIndex > dataRange.bottomRight().rowIndex()) {
									rowIndex = dataRange.topLeft().rowIndex();
								}
							}
						}

					}

					break;
			}

			return { cellIndex: cellIndex, rowIndex: rowIndex };
		},

		_getParentSubTable: function (root, tagsToFind, subTables) {
			var domSubTables = $.map(subTables, function (item, index) { return item.element(); }),
				subTable = null,
				lastCoincidentEl = null,
				tag;

			for (; root !== null && subTable === null; root = root.parentNode) {
				tag = (root.tagName)
					? root.tagName.toLowerCase()
					: undefined;

				if ($.inArray(tag, tagsToFind) >= 0) {
					lastCoincidentEl = root;
				} else {
					//if ($(root).hasClass("wijmo-wijgrid-table")) {
					if ($.inArray(root, domSubTables) >= 0) {
						subTable = root;
					}
				}
			}

			return (lastCoincidentEl && subTable)
				? [lastCoincidentEl, subTable]
				: null;
		},

		//  index of the fixed leaf inside the visibleLeaves collection.
		_getRealStaticColumnIndex: function () {
			if (this._staticColumnIndex >= 0) {
				var leaves = this._field("visibleLeaves"),
					len = leaves.length,
					i = this._staticColumnIndex;

				if (this.options.showRowHeader === true) {
					i++;
				}

				// If child column of some band is fixed then the top and right-most column of the root band contained current column will be fixed.
				for (; i < len; i++) {
					if (leaves[i].parentIdx === -1) {
						return i; // index of the first leaf which is not contained inside a band.
					}
				}

				return len - 1;
			}

			return this._staticColumnIndex;
		},

		_getRealStaticRowIndex: function () {
			if (this.options.staticRowIndex >= 0) {
				var index = this._field("spanTable").length - 1; //the whole header is fixed in case of staticRowIndex >= 0.

				if (this.options.showFilter) {
					index++; // filter row is placed inside the header, so it is fixed too.
				}

				return index;
			} else {
				return this.options.staticRowIndex;
			}
		},

		_view: function () {
			return this._field("view");
		},

		_originalFooterRowData: function () {
			var footer = this._field("tfoot");

			return (footer && footer.length)
				? footer[0] // first row only
				: null;
		},

		_originalHeaderRowData: function () {
			var header = this._field("thead");

			return (header && header.length)
				? header[0] // first row only
				: null;
		}

		// * misc
	});
})(jQuery);
/*
 Provides the base widget for columns in the wijgrid.
*/

(function ($) {
	"use strict";
	$.widget("wijmo.c1basefield", {
		_data$prefix: "c1basefield",
		options: {
			/// <summary>
			/// A value indicating whether the column can be moved.
			/// Default: true.
			/// Type: Boolean.
			/// Code example: $("#element").wijgrid({ columns: [ { allowMoving: true } ] });
			/// </summary>
			allowMoving: true,

			/// <summary>
			/// A value indicating whether the column can be sized.
			/// Default: true.
			/// Type: Boolean.
			/// Code example: $("#element").wijgrid({ columns: [ { allowSizing: true } ] });
			/// </summary>
			allowSizing: true,

			/// <summary>
			/// A value indicating the key of the data field associated with a column.
			/// If an array of hashes is used as a datasource for wijgrid, this should be string value,
			/// otherwise this should be an integer determining an index of the field in the datasource.
			/// Default: undefined
			/// Type: String or Number.
			/// Code example: $("#element").wijgrid({ columns: [ { dataKey: "ProductID" } ] });
			/// </summary>
			dataKey: undefined,

			/// <summary>
			/// Function used for changing content, style and attributes of the column cells.
			/// Default: undefined.
			/// Type: Function.
			/// Code example: $("#element").wijgrid({ columns: [ { cellFormatter: function(args) { } } ] });
			/// </summary>
			/// <remarks>
			/// Important: cellFormatter should not alter content of header and filter row cells container.
			/// </remarks>
			/// <param name="args" type="Object">
			/// args.$container: jQuery object that represents cell container to format.
			/// args.afterDefaultCallback: callback function which is invoked after applying default formatting.
			/// args.column: Options of the formatted column.
			/// args.formattedValue: Formatted value of the cell.
			/// args.row: information about associated row.
			/// args.row.$rows: jQuery object that represents rows to format.
			/// args.row.data: associated data.
			/// args.row.dataRowIndex: data row index.
			/// args.row.dataItemIndex: data item index.
			/// args.row.virtualDataItemIndex: virtual data item index.
			/// args.row.type: type of the row, one of the $.wijmo.wijgrid.rowType values.
			/// </param>
			/// <returns type="Boolean">True if container content has been changed and wijgrid should not apply the default formatting to the cell.</returns>
			cellFormatter: undefined,

			/// <summary>
			/// Gets or sets the footer text.
			/// The text may include a placeholder: "{0}" is replaced with the aggregate.
			/// Default: undefined.
			/// Type: String.
			/// Code example: $("#element").wijgrid({ columns: [ { footerText: "footer" } ] });
			/// </summary>
			/// <remarks>
			/// If the value is undefined the footer text will be determined automatically depending on the type of the datasource:
			///  DOM table - text in the footer cell.
			/// </remarks>
			footerText: undefined,

			/// <summary>
			/// Gets or sets the header text.
			/// Default: undefined.
			/// Type: String.
			/// Code example: $("#element").wijgrid({ columns: [ { headerText: "column0" } ] });
			/// </summary>
			/// <remarks>
			/// If the value is undefined the header text will be determined automatically depending on the type of the datasource:
			///  DOM table - text in the header cell.
			///  Array of hashes - dataKey (name of the field associated with column).
			///  Two-dimensional array - dataKey (index of the field associated with column).
			/// </remarks>
			headerText: undefined,

			/// <summary>
			/// A value indicating whether column is visible.
			/// Default: true.
			/// Type: Boolean.
			/// Code example: $("#element").wijgrid({ columns: [ { visible: true } ] });
			/// </summary>
			visible: true,

			/// <summary>
			/// Determines the width of the column.
			/// Default: undefined.
			/// Type: Number or String.
			/// Code example:
			/// $("#element").wijgrid({ columns: [ { width: 150 } ] });
			/// $("#element").wijgrid({ columns: [ { width: "10%" } ]});
			/// </summary>
			/// <remarks>
			/// The option could either be a number of string.
			/// Use number to specify width in pixel.
			/// Use string to specify width in percentage.
			/// By default, wijgrid emulates the table element behavior when using number as width.
			/// This means wijgrid may not have the exact width specified.
			/// If exact width is needed, please set ensureColumnsPxWidth option of wijgrid to true.
			/// </remarks>
			width: undefined
		},

		_create: function () {
			var wijgrid = this.options.owner;

			this.element.addClass("ui-widget wijmo-c1basefield ui-state-default");
			this._field("owner", wijgrid);
			delete this.options.owner;
			this._field("widgetName", this.widgetName);

			if (this.options.disabled) {
				this.disable();
			}

			if (wijgrid.options.allowColMoving) {
				wijgrid._dragndrop().attach(this);
			}
		},

		_init: function () {
			this.element.wrapInner("<div class='wijmo-wijgrid-innercell'></div>");
			this._refreshHeaderCell();
		},

		destroy: function () {
			var wijgrid = this._owner();

			if (wijgrid) {
				wijgrid._dragndrop().detach(this);
			}

			$.wijmo.wijgrid.remove$dataByPrefix(this.element, this._data$prefix);
		},

		_field: function (name, value) {
			//return $.wijmo.wijgrid.dataPrefix(this.element, this._data$prefix, name, value);
			return $.wijmo.wijgrid.dataPrefix(this.element[0], this._data$prefix, name, value);
		},

		_removeField: function (name) {
			var internalDataName = this._data$prefix + name;

			this.element.removeData(internalDataName);
		},

		//isInvokedOutside stands for whether setOption is invoked by related widget
		_setOption: function (key, value, isInvokedOutside) {
			var presetFunc = this["_preset_" + key],
				oldValue = this.options[key],
				optionChanged, postsetFunc;

			if (presetFunc !== undefined) {
				value = presetFunc.apply(this, [value, oldValue, isInvokedOutside]);
			}

			optionChanged = (value !== oldValue);

			//$.Widget.prototype._setOption.apply(this, arguments);  note: there is no dynamic linkage between the arguments and the formal parameter values when strict mode is used
			$.Widget.prototype._setOption.apply(this, [key, value]);

			if (optionChanged) {
				postsetFunc = this["_postset_" + key];
				if (postsetFunc !== undefined) {
					postsetFunc.apply(this, [value, oldValue, isInvokedOutside]);
				}
			}
		},

		_postset_allowMoving: function (value, oldValue, isInvokedOutside) {
			//no need to detach because there is allowMoving judgment in draganddrop
			/*
			if (value) {
				if (this._owner().options.allowColMoving) {
					this._owner()._dragndrop().attach(this);
				}
			} else {
				this._owner()._dragndrop().detach(this);
			}
			*/
			this._invokeGroupedColumn("allowMoving", value, isInvokedOutside);
		},

		_preset_clientType: function (value, oldValue) {
			throw "read-only";
		},

		_postset_headerText: function (value, oldValue, isInvokedOutside) {
			this._refreshHeaderCell();
			this._invokeGroupedColumn("headerText", value, isInvokedOutside);
		},

		_postset_visible: function (value, oldValue) {
			this._owner().ensureControl(false);
		},

		_postset_width: function (value, oldValue) {
			// change width of column.
			this._owner()._view().ensureWidth(value, this.options.visLeavesIdx);
		},

		_invokeGroupedColumn: function (key, value, isInvokedOutside) {
			//invoke setOption method to set the property of related widget
			if (!isInvokedOutside && this.options.groupedIndex !== undefined) {
				var groupWidget = this._owner()._field("groupedWidgets")[this.options.groupedIndex];
				groupWidget._setOption(key, value, true);
			}
		},

		_owner: function () {
			return this._field("owner");
		},

		_canSize: function () {
			return this.options.allowSizing && this._owner().options.allowColSizing;
		},

		// drag-n-drop
		_canDrag: function () {
			return this.options.allowMoving === true;
		},

		_canDropTo: function (wijField) {
			// parent can't be dropped into a child
			if ($.wijmo.wijgrid.isChildOf(this._owner().options.columns, wijField, this)) {
				return false;
			}

			return true;
		},

		_refreshHeaderCell: function () {
			var $container = this.element.children(".wijmo-wijgrid-innercell")
				.empty()
				.html(this.options.headerText || "") // html(value) returns "" if value is undefined
				.wrapInner("<span class=\"wijmo-wijgrid-headertext\" />");
		}
	});
})(jQuery);

/*
 Provides the widget for columns in the wijgrid.
*/

(function ($) {
	"use strict";
	$.widget("wijmo.c1field", $.wijmo.c1basefield, {
		options: {
			/// <summary>
			/// Causes the grid to calculate aggregate values on the column and place them in the column footer cell or group header and footer rows.
			/// If the <see cref="showFooter"/> option is disabled or grid does not contain any groups, setting the "aggregate" option has no effect.
			/// 
			/// Possible values are: "none", "count", "sum", "average", "min", "max", "std", "stdPop", "var", "varPop" and "custom".
			///
			/// "none": no aggregate is calculated or displayed.
			/// "count": count of non-empty values.
			/// "sum": sum of numerical values.
			/// "average": average of the numerical values.
			/// "min": minimum value (numerical, string, or date).
			/// "max": maximum value (numerical, string, or date).
			/// "std": standard deviation (using formula for Sample, n-1).
			/// "stdPop": standard deviation (using formula for Population, n).
			/// "var": variance (using formula for Sample, n-1).
			/// "varPop": variance (using formula for Population, n).
			/// "custom": custom value (causing grid to throw groupAggregate event).
			///
			/// Default: "none".
			/// Type: String.
			/// Code example: $("#element").wijgrid({ columns: [{ aggregate: "none" }] });
			/// </summary>
			aggregate: "none",

			/// <summary>
			/// A value indicating whether column can be sorted.
			/// Default: true.
			/// Type: Boolean.
			/// Code example: $("#element").wijgrid({ columns: [{ allowSort: true }] });
			/// </summary>
			allowSort: true,

			/// <summary>
			/// Column data type. Used to determine the rules for sorting, grouping, aggregate calculation, and so on.
			/// Possible values are: "string", "number", "datetime", "currency" and "boolean".
			///
			/// "string": if using built-in parser any values are acceptable; "&nbsp;" considered as an empty string, nullString as null.
			/// "number": if using built-in parser only numeric values are acceptable, also "&nbsp;", "" and nullString which are considered as null. Any other value throws an exception.
			/// "datetime": if using built-in parser only date-time values are acceptable, also "&nbsp;", "" and nullString which are considered as null. Any other value throws an exception.
			/// "currency": if using built-in parser only numeric and currency values are acceptable, also "&nbsp;", "" and nullString which are considered as null. Any other value throws an exception.
			/// "boolean": if using built-in parser only "true" and "false" (case-insensitive) values are acceptable, also "&nbsp;", "" and nullString which are considered as null. Any other value throws an exception.
			/// 
			/// Default: "string".
			/// Type: String.
			/// Code example: $("#element").wijgrid({ columns: [{ dataType: "string" }] });
			/// </summary>
			dataType: "string",

			/// <summary>
			/// Data converter that is able to translate values from a string representation to column data type and back.
			/// 
			/// The dataParser is an object which must contains the following methods:
			///   parseDOM(value, culture, format): converts given DOM element into the typed value.
			///   parse(value, culture, format): converts the value into typed value.
			///   toStr(value, culture, format): converts the value into its string representation.
			///
			/// Default: undefined (widget built-in parser for supported datatypes will be used).
			/// Type: Object.
			///
			/// Code example:
			///   var myBoolParser = {
			///     parseDOM: function (value, culture, format, nullString) {
			///       return this.parse(value.innerHTML, culture, format, nullString);
			///     },
			///
			///     parse: function (value, culture, format, nullString) {
			///       if (typeof (value) === "boolean")  return value;
			///
			///       if (!value || (value === "&nbsp;") || (value === nullString)) {
			///         return null;
			///       }
			///
			///       switch (value.toLowerCase()) {
			///         case "on": return true;
			///         case "off": return false;
			///       }
			///
			///       return NaN;
			///     },
			///
			///     toStr: function (value, culture, format, nullString) {
			///       if (value === null)  return nullString;
			///       return (value) ? "on" : "off";
			///     }
			///   }
			///
			///   $("#element").wijgrid({ columns: [ { dataType: "boolean", dataParser: myBoolParser } ] });
			/// </summary>
			dataParser: undefined,

			/// <summary>
			/// A pattern used for formatting and parsing column values. See jquery.glob.js for possible values.
			/// The default value is undefined ("n" pattern will be used for "number" dataType, "d" for "datetime", "c" for "currency").
			/// Default: undefined.
			/// Type: String.
			/// Code example: $("#element").wijgrid({ columns: [ { dataType: "number", dataFormatString: "n" } ] });
			/// </summary>
			dataFormatString: undefined,

			/// <summary>
			/// An operation set for filtering. Must be either one of the embedded operators or custom filter operator.
			/// Case insensitive.
			///
			// Embedded filter operators include:
			///   "NoFilter": no filter.
			///   "Contains": applicable to "string" data type.
			///   "NotContain": applicable to "string" data type.
			///   "BeginsWith": applicable to "string" data type.
			///   "EndsWith": applicable to "string" data type.
			///   "Equals": applicable to "string", "number", "datetime", "currency" and "boolean" data types.
			///   "NotEqual": applicable to "string", "number", "datetime", "currency" and "boolean" data types.
			///   "Greater": applicable to "string", "number", "datetime", "currency" and "boolean" data types.
			///   "Less": applicable to "string", "number", "datetime", "currency" and "boolean" data types.
			///   "GreaterOrEqual": applicable to "string", "number", "datetime", "currency" and "boolean" data types.
			///   "LessOrEqual": applicable to "string", "number", "datetime", "currency" and "boolean" data types.
			///   "IsEmpty": applicable to "string".
			///   "NotIsEmpty": applicable to "string".
			///   "IsNull": applicable to "string", "number", "datetime", "currency" and "boolean" data types.
			///   "NotIsNull": applicable to "string", "number", "datetime", "currency" and "boolean" data types.
			///
			/// Default: "nofilter".
			/// Type: String.
			/// Code example: $("#element").wijgrid({ columns: [ { filterOperator: "nofilter" } ] });
			/// </summary>
			filterOperator: "nofilter",

			/// <summary>
			/// A value set for filtering.
			/// Default: undefined.
			/// Type: Depends on column data type.
			/// Code example: $("#element").wijgrid({ columns: [ { filterValue: "abc" } ] });
			/// </summary>
			filterValue: undefined,

			/// <summary>
			/// Using to customize the appearance and position of groups.
			/// Default: {
			///   groupSingleRow: true,
			///   collapsedImageClass: "ui-icon-triangle-1-e",
			///   expandedImageClass: "ui-icon-triangle-1-se",
			///   position: "none",
			///   outlineMode: "startExpanded",
			///   headerText: undefined,
			///   footerText: undefined
			/// }
			/// Type: Object.
			/// Code example: $("#element").wijgrid({ columns: [{ groupInfo: { position: "header" }}] });
			/// </summary>
			groupInfo: {
				expandInfo: [], // infrastructure

				/// <summary>
				/// A value indicating whether groupings containing a single row are grouped.
				/// The default value is true.
				/// Type: Boolean.
				/// </summary>
				groupSingleRow: true,

				/// <summary>
				/// Determines the css used to show collapsed nodes on the grid.
				/// The default value is "ui-icon-triangle-1-e".
				/// Type: String.
				/// </summary>
				collapsedImageClass: "ui-icon-triangle-1-e",

				/// <summary>
				/// Determines the css used to show expanded nodes on the grid.
				/// The default value is "ui-icon-triangle-1-se".
				/// Type: String.
				/// </summary>
				expandedImageClass: "ui-icon-triangle-1-se",

				/// <summary>
				/// Determines whether the grid should insert group header and/or group footer rows for this column.
				///
				/// Possible values are: "none", "header", "footer", "headerAndFooter".
				///  "none" -  disables grouping for the column.
				///  "header" - inserts header rows.
				///  "footer" - inserts footer rows.
				///  "headerAndFooter" - inserts header and footer rows.
				///
				/// The default value is "none".
				/// Type: String.
				/// </summary>
				position: "none",

				/// <summary>
				/// Determines whether the user will be able to collapse and expand the groups by clicking on the group headers,
				/// and also determines whether groups will be initially collapsed or expanded.
				///
				/// Possible values are: "none", "startCollapsed", "startExpanded".
				///  "none" -  disables collapsing and expanding.
				///  "startCollapsed" - groups are initially collapsed.
				///  "startExpanded" - groups are initially expanded.
				///
				/// The default value is "startExpanded".
				/// Type: String.
				/// </summary>
				outlineMode: "startExpanded",

				/// <summary>
				/// Determines the text that is displayed in the group header rows.
				///
				/// The text may include up to three placeholders:
				/// "{0}" is replaced with the value being grouped on.
				/// "{1}" is replaced with the group's column header.
				/// "{2}" is replaced with the aggregate
				///
				/// The text may be set to "custom". Doing so causes the grid groupText event to be raised when
				/// processing a grouped header.
				///
				/// The default value is undefined.
				/// Type: String.
				/// </summary>
				headerText: undefined,

				/// <summary>
				/// Determines the text that is displayed in the group footer rows.
				///
				/// The text may include up to three placeholders:
				/// "{0}" is replaced with the value being grouped on.
				/// "{1}" is replaced with the group's column header.
				/// "{2}" is replaced with the aggregate
				///
				/// The text may be set to "custom". Doing so causes the grid groupText event to be raised when
				/// processing a grouped footer.
				///
				/// The default value is undefined.
				/// Type: String.
				/// </summary>
				footerText: undefined
			},

			/// <summary>
			/// A value indicating whether the cells in the column can be edited.
			/// Default: false.
			/// Type: Boolean.
			/// Code example: $("#element").wijgrid({ columns: [ { readOnly: false } ] });
			/// </summary>
			readOnly: false,

			/// <summary>
			/// Determines whether rows are merged.
			/// Possible values are: "none", "free" and "restricted".
			///
			/// "none": no row merging.
			/// "free": allows row with identical text to merge.
			/// "restricted": keeps rows with identical text from merging if rows in the previous column are merged.
			/// 
			/// Default: "none".
			/// Type: String.
			/// Code example: $("#element").wijgrid({ columns: [{ rowMerge: "none" }] });
			/// </summary>
			rowMerge: "none",

			/// <summary>
			/// A value indicating whether filter editor will be shown in the filter row.
			/// Default: true.
			/// Type: Boolean.
			/// Code example: $("#element").wijgrid({ columns: [ { showFilter: true } ] });
			/// </summary>
			showFilter: true,

			/// <summary>
			/// Determines the sort direction.
			/// Possible values are: "none", "ascending" and "descending".
			///
			/// "none": no sorting.
			/// "ascending": sort from smallest to largest.
			/// "descending": sort from largest to smallest.
			/// 
			/// Default: "none".
			/// Type: String.
			/// Code example: $("#element").wijgrid({ columns: [{ sortDirection: "none" }] });
			/// </summary>
			sortDirection: "none",

			/// <summary>
			/// A value indicating whether null value is allowed during editing.
			/// Default: false.
			/// Type: Boolean.
			/// Code example: $("#element").wijgrid({ columns: [ { valueRequired: false } ] });
			/// </summary>
			valueRequired: false
		},

		_create: function () {
			$.wijmo.c1basefield.prototype._create.apply(this, arguments);
			this.element.addClass("ui-widget wijmo-c1field");
		},

		destroy: function () {
			this.element.find("*").unbind("." + this.widgetName);

			if (this.$filterEditor) {
				this.$filterEditor
					.closest("td") // column filter cell
					.find("*")
					.unbind("." + this.widgetName);

				switch (this.options.dataType) {
					case "number":
					case "currency":
						this.$filterEditor.wijinputnumber("destroy");
						break;

					case "datetime":
						this.$filterEditor.wijinputdate("destroy");
						break;

					default:
						this.$filterEditor.wijinputmask("destroy");
						break;
				}

				this.$filterEditor = null;
			}

			this._removeDropDownFilterList();

			$.wijmo.c1basefield.prototype.destroy.apply(this, arguments);
		},

		_init: function () {
			$.wijmo.c1basefield.prototype._init.apply(this, arguments);

			this.$filterEditor = null;

			var wijgrid = this._owner();

			this.filterRow = wijgrid._filterRow();
			if (wijgrid.options.showFilter && this.options.showFilter && (this.options.dataIndex >= 0)) {
				this._prepareFilterCell();
			}
		},

		_postset_aggregate: function (value, oldValue) {
			this._owner().ensureControl(false);
		},

		_postset_allowSort: function (value, oldValue, isInvokedOutside) {
			//this.element.find("#contentCell").empty();
			//this._headerTextDOM(this.options.headerText);
			this._refreshHeaderCell();
			this._invokeGroupedColumn("allowSort", value, isInvokedOutside);
		},

		_postset_dataType: function (value, oldValue) {
			throw "read-only";
		},

		_postset_dataParser: function (value, oldValue) {
			this._owner().ensureControl(false);
		},

		_postset_dataFormatString: function (value, oldValue) {
			this._owner().ensureControl(false);
		},

		_postset_filterOperator: function (value, oldValue) {
			this._owner().ensureControl(true);
		},

		_postset_filterValue: function (value, oldValue) {
			this._owner().ensureControl(true);
		},

		_postset_groupInfo: function (value, oldValue) {
			this._owner().ensureControl(true);
		},

		_postset_rowMerge: function (value, oldValue) {
			this._owner().ensureControl(false);
		},

		_postset_showFilter: function (value, oldValue) {
			this._owner().ensureControl(false);
		},

		_postset_sortDirection: function (value, oldValue) {
			this.options.sortOrder = 0;
			this._owner().ensureControl(true);
		},

		_postset_width: function (value, oldValue) {
			this._setFilterEditorWidth(1);
			$.wijmo.c1basefield.prototype._postset_width.apply(this, arguments);
			this._setFilterEditorWidth(this._getFilterEditorWidth());
		},

		_canDropTo: function(wijField) {
			if ($.wijmo.c1basefield.prototype._canDropTo.apply(this, arguments)) {
				//the grouped column can't be dropped into group area
				if (this.options.groupedIndex !== undefined && (wijField instanceof $.wijmo.c1groupedfield)) {
					return false;
				}

				return true;
			}
 
			return false;
		},

		_canSort: function () {
			var grid = this._owner();

			return (grid && grid.options.allowSorting && this.options.allowSort && (this.options.dataIndex >= 0));
		},

		_refreshHeaderCell: function () {
			if (this._canSort()) {
				var $anchor,
					$container = this.element.children(".wijmo-wijgrid-innercell")
						.empty()
						.html(this.options.headerText || "") // html(value) returns "" if value is undefined
						.wrapInner("<a class=\"wijmo-wijgrid-headertext\" href=\"#\" role=\"button\" />");

				$anchor = $container.children("a").bind("click." + this.widgetName, this, this._onHrefClick);

				switch (this.options.sortDirection) { // sorting icon
					case "ascending":
						$anchor.append($("<span class=\"ui-icon ui-icon-triangle-1-n\">ascending</span>"));
						break;

					case "descending":
						$anchor.append($("<span class=\"ui-icon ui-icon-triangle-1-s\">descending</span>"));
						break;
				}
			} else {
				$.wijmo.c1basefield.prototype._refreshHeaderCell.apply(this, arguments);
			}
		},

		_prepareFilterCell: function () {
			var filterCellIndex = this.options.visLeavesIdx,
				gridView = null, filterCell = null, dataValue,
				editorOptions;

			if (filterCellIndex >= 0) {
				gridView = this._owner();

				if (this.filterRow) {
					filterCell = $(new $.wijmo.wijgrid.rowAccessor().getCell(this.filterRow, filterCellIndex));
				} else {
					throw "exception";
				}

				filterCell.find(".wijmo-wijgrid-filtericon").attr("class", this._getFilterOpIconCss(gridView, this.options.filterOperator));
				this.$filterEditor = filterCell.find("input");

				//var editorWidth = this._getFilterEditorWidth();
				//this.$filterEditor.setOutWidth(editorWidth);

				dataValue = gridView._parse(this.options, this.options.filterValue);

				// set default value
				if (dataValue === null) {
					switch (this.options.dataType) {
						case "boolean":
							dataValue = false;
							break;

						case "number":
						case "currency":
						case "datetime":
							dataValue = 0;
							break;

						default:
							dataValue = "";
					}
				}

				editorOptions = {
					culture: gridView.options.culture,
					disabled: gridView.options.disabled,
					decimalPlaces: (function (pattern) { // map decimal places specified within the dataFormatString option into the decimalPlaces option of the wijinputnumber.
						var test = /^(n|p|c){1}(\d*)$/.exec(pattern);

						if (test) {
							if (test[2]) {
								return parseInt(test[2], 10);
							}
						}

						return 2;
					})(this.options.dataFormatString)
				};

				// create editor
				switch (this.options.dataType) {
					case "number":
						this.$filterEditor.wijinputnumber($.extend(editorOptions, { value: dataValue }));
						break;

					case "datetime":
						this.$filterEditor.wijinputdate($.extend(editorOptions, { date: dataValue }));
						break;

					case "currency":
						this.$filterEditor.wijinputnumber($.extend(editorOptions, { type: "currency", value: dataValue }));
						break;

					default:
						this.$filterEditor.wijinputmask({ text: dataValue });
				}

				// create button
				//var filterButton = filterCell.find(".filterBtn");
				filterCell.find(".wijmo-wijgrid-filter-trigger") // filter button
					.attr({ "role": "button", "aria-haspopup": "true" })
					.bind("mouseenter." + this.widgetName, function (e) {
						$(this).addClass("ui-state-hover");
					}).bind("mouseleave." + this.widgetName, function (e) {
						$(this).removeClass("ui-state-hover ui-state-active");
					}).bind("mouseup." + this.widgetName, this, function (e) {
						$(this).removeClass("ui-state-active");
					}).bind("mousedown." + this.widgetName, { column: this }, this._onFilterBtnClick)
					.bind("click." + this.widgetName, function (e) { e.preventDefault(); }); // prevent # being added to url.
			}
		},

		_onFilterBtnClick: function (e) {
			var column = e.data.column,
				wijgrid, filterOpLC, applicableFilters, args, items, key, operator, eventGuid;

			if (column.options.disabled) {
				return false;
			}

			if (column.$dropDownFilterList) { // close the dropdown list
				column._removeDropDownFilterList();
				return false;
			}

			wijgrid = column._owner();
			filterOpLC = column.options.filterOperator.toLowerCase();
			applicableFilters = wijgrid.filterOperatorsCache.getByDataType(column.options.dataType);

			wijgrid.filterOperatorsCache.sort(applicableFilters, wijgrid.options.filterOperatorsSortMode);

			args = $.extend(true, {}, { operators: applicableFilters, column: column.options });
			wijgrid._trigger("filterOperatorsListShowing", null, args);

			items = [];
			if (args.operators) {
				for (key in args.operators) {
					if (args.operators.hasOwnProperty(key)) {
						operator = args.operators[key];
						items.push({ label: operator.name, value: operator.name, selected: operator.name.toLowerCase() === filterOpLC });
					}
				}
			}

			column.$dropDownFilterList = $("<div class=\"wijmo-wijgrid-filterlist\"></div").appendTo(document.body).wijlist(
			{
				autoSize: true,
				maxItemsCount: 8,
				selected: function (data, arg) {
					column._removeDropDownFilterList();
					wijgrid._handleFilter(column, arg.item.value, column.$filterEditor.val());
				}
			});

			column.$dropDownFilterList
				.wijlist("setItems", items)
				.wijlist("renderList");

			if (items.length > 8) {
				column.$dropDownFilterList.width(column.$dropDownFilterList.width() + 20);
			}

			column.$dropDownFilterList.$button = $(this);

			column.$dropDownFilterList
				.wijlist("refreshSuperPanel")
				.position({
					of: $(this),
					my: "left top",
					at: "left bottom"
				});

			eventGuid = column.$dropDownFilterList.eventGuid = new Date().getTime();
			$(document).bind("mousedown." + column.widgetName + "." + eventGuid, { column: column }, column._onDocMouseDown);
		},

		_getFilterOpIconCss: function (gridView, filterOpName) {
			var css = "filter-nofilter",
				filterOp = gridView.filterOperatorsCache.getByName(filterOpName.toLowerCase());

			if (filterOp) {
				if (filterOp.css) {
					css = filterOp.css;
				} else {
					css = "filter-" + filterOp.name.toLowerCase();
				}
			}

			return "wijmo-wijgrid-filtericon " + css;
		},

		_onDocMouseDown: function (e) {
			var $target = $(e.target),
				$filterList = $target.parents(".wijmo-wijgrid-filterlist:first"),
				$filterButton = $target.is(".wijmo-wijgrid-filter-trigger")
					? $target
					: $target.parents(".wijmo-wijgrid-filter-trigger:first");

			if (($filterButton.length && ($filterButton[0] === e.data.column.$dropDownFilterList.$button[0])) ||
			 ($filterList.length && ($filterList[0] === e.data.column.$dropDownFilterList[0]))) {
				// do nothing
			} else {
				e.data.column._removeDropDownFilterList();
			}
		},

		_onHrefClick: function (args) {
			if (args.data.options.disabled) {
				return false;
			}

			if (args.data.options.allowSort) {
				args.data._owner()._handleSort(args.data.options, args.ctrlKey);
			}

			return false;
		},

		_removeDropDownFilterList: function () {
			if (this.$dropDownFilterList) {
				var eventGuid = this.$dropDownFilterList.eventGuid;

				this.$dropDownFilterList.remove();

				this.$dropDownFilterList = null;

				$(document).unbind("mousedown." + this.widgetName + "." + eventGuid, this._onDocMouseDown);
			}
		},

		_getFilterEditorWidth: function () {
			if (this.$filterEditor) {
				var $fd = this.$filterEditor.closest(".wijmo-wijgrid-filter"),
					value = $fd.width() - $fd.find(".wijmo-wijgrid-filtericon").outerWidth();

				if (!value || value < 0) {
					value = 0;
				}

				return value;
			}

			return undefined;
		},

		_setFilterEditorWidth: function (width) {
			if (this.$filterEditor) {
				width -= this.$filterEditor.leftBorderWidth() + this.$filterEditor.rightBorderWidth();

				if (width < 0) {
					width = 0;
				}

				switch (this.options.dataType) {
					case "number":
					case "currency":
						this.$filterEditor.wijinputnumber("widget").width(width);
						break;
					case "datetime":
						this.$filterEditor.wijinputdate("widget").width(width);
						break;
					default:
						this.$filterEditor.wijinputmask("widget").width(width);
						break;
				}

				this.$filterEditor.setOutWidth(width);
			}
		}
	});
})(jQuery);


/*
 Provides the grouped widget for columns in the wijgrid.
*/

(function ($) {
	"use strict";
	$.widget("wijmo.c1groupedfield", {
		_data$prefix: "c1groupedfield",
		options: {
			/// <summary>
			/// A value indicating whether the column can be moved.
			/// Default: true.
			/// Type: Boolean.
			/// Code example: $("#element").wijgrid({ columns: [ { allowMoving: true } ] });
			/// </summary>
			allowMoving: true,

			/// <summary>
			/// A value indicating whether column can be sorted.
			/// Default: true.
			/// Type: Boolean.
			/// Code example: $("#element").wijgrid({ columns: [{ allowSort: true }] });
			/// </summary>
			allowSort: true,

			/// <summary>
			/// Gets or sets the header text.
			/// Default: undefined.
			/// Type: String.
			/// Code example: $("#element").wijgrid({ columns: [ { headerText: "column0" } ] });
			/// </summary>
			/// <remarks>
			/// If the value is undefined the header text will be determined automatically depending on the type of the datasource:
			///  DOM table - text in the header cell.
			///  Array of hashes - dataKey (name of the field associated with column).
			///  Two-dimensional array - dataKey (index of the field associated with column).
			/// </remarks>
			headerText: undefined,

			/// <summary>
			/// Determines the sort direction.
			/// Possible values are: "none", "ascending" and "descending".
			///
			/// "none": no sorting.
			/// "ascending": sort from smallest to largest.
			/// "descending": sort from largest to smallest.
			/// 
			/// Default: "none".
			/// Type: String.
			/// Code example: $("#element").wijgrid({ columns: [{ sortDirection: "none" }] });
			/// </summary>
			sortDirection: "none"
		},

		_create: function () {
			var wijgrid = this.options.owner;

			this.element.addClass("wijmo-wijgrid-group-button ui-state-default ui-corner-all");
			this._field("owner", wijgrid);
			delete this.options.owner;

			if (this.options.disabled) {
				this.disable();
			}

			if (wijgrid.options.allowColMoving) {
				wijgrid._dragndrop().attach(this);
			}
		},

		_init: function () {
			this._refreshHeaderCell();
		},

		destroy: function () {
			this.element.find("*").unbind("." + this.widgetName);

			var wijgrid = this._owner();

			if (wijgrid) {
				wijgrid._dragndrop().detach(this);
			}

			$.wijmo.wijgrid.remove$dataByPrefix(this.element, this._data$prefix);
		},

		_field: function (name, value) {
			return $.wijmo.wijgrid.dataPrefix(this.element[0], this._data$prefix, name, value);
		},

		_removeField: function (name) {
			var internalDataName = this._data$prefix + name;

			this.element.removeData(internalDataName);
		},

		_setOption: function (key, value, isInvokedOutside) {
			var presetFunc = this["_preset_" + key],
				oldValue = this.options[key],
				optionChanged, postsetFunc;

			if (presetFunc !== undefined) {
				value = presetFunc.apply(this, [value, oldValue, isInvokedOutside]);
			}

			optionChanged = (value !== oldValue);

			//$.Widget.prototype._setOption.apply(this, arguments);  note: there is no dynamic linkage between the arguments and the formal parameter values when strict mode is used
			$.Widget.prototype._setOption.apply(this, [key, value]);

			if (optionChanged) {
				postsetFunc = this["_postset_" + key];
				if (postsetFunc !== undefined) {
					postsetFunc.apply(this, [value, oldValue, isInvokedOutside]);
				}
			}
		},

		_postset_headerText: function (value, oldValue, isInvokedOutside) {
			this._refreshHeaderCell();
		},

		_postset_allowSort: function (value, oldValue, isInvokedOutside) {
			this._refreshHeaderCell();
		},

		_owner: function () {
			return this._field("owner");
		},

		_canSize: function () {
			return this.options.allowSizing && this._owner().options.allowColSizing;
		},

		// drag-n-drop
		_canDrag: function () {
			return this.options.allowMoving === true;
		},

		_canDropTo: function (wijField) {
			//band can't be dropped into group area
			if (!(wijField instanceof $.wijmo.c1groupedfield)) {
				return false;
			}

			// parent can't be dropped into a child
			if ($.wijmo.wijgrid.isChildOf(this._owner().options.columns, wijField, this)) {
				return false;
			}

			return true;
		},

		_canSort: function () {
			var grid = this._owner();

			return (grid && grid.options.allowSorting && this.options.allowSort && (this.options.dataIndex >= 0));
		},

		_refreshHeaderCell: function () {
			var $closeButton = $("<span class=\"wijmo-wijgrid-group-button-close ui-state-default ui-corner-all\"><span class=\"ui-icon ui-icon-close\"></span></span>")
				.bind("click." + this.widgetName, this, this._onCloseClick);
			this.element
				.html(this.options.headerText || "") // html(value) returns "" if value is undefined
				.prepend($closeButton)
				.bind("click." + this.widgetName, this, this._onHrefClick);
			if (this._canSort()) {
				switch (this.options.sortDirection) { // sorting icon
					case "ascending":
						this.element.append($("<span class=\"wijmo-wijgrid-group-button-sort ui-icon ui-icon-triangle-1-n\"></span>"));
						break;

					case "descending":
						this.element.append($("<span class=\"wijmo-wijgrid-group-button-sort ui-icon ui-icon-triangle-1-s\"></span>"));
						break;
				}
			}
		},

		_onCloseClick: function (args) {
			args.data._owner()._handleUngroup(args.data.options.travIdx);

			return false;
		},

		_onHrefClick: function (args) {
			var wijgrid = args.data._owner(),
				options = args.data.options,
				column;

			if (!options.disabled && options.allowSort) {
				//find the column according to the c1groupedfield widget
				column = $.wijmo.wijgrid.search(wijgrid.columns(), function (test) {
					return test.options.travIdx === options.travIdx;
				});

				column = (!column.found) // grouped column is invisible?
					? $.wijmo.wijgrid.getColumnByTravIdx(wijgrid.options.columns, options.travIdx).found
					: column.found.options;

				if (column) {
					wijgrid._handleSort(column, args.ctrlKey);
				}
			}

			return false;
		}
	});
})(jQuery);

(function ($) {
	"use strict";
	$.widget("wijmo.c1band", $.wijmo.c1basefield, {
		options: {
			/// <summary>
			/// Gets a array of objects representing the columns of the band.
			/// The default value is an empty array.
			/// Type: Array.
			/// </summary>
			columns: []
		},

		_create: function () {
			$.wijmo.c1basefield.prototype._create.apply(this, arguments);
			this.element.addClass("ui-widget wijmo-c1band");
		},

		_canDropTo: function(wijField) {
			if ($.wijmo.c1basefield.prototype._canDropTo.apply(this, arguments)) {
				//band can't be dropped into group area
				return (wijField instanceof $.wijmo.c1groupedfield);
			}
 
			return false;
		}
	});
})(jQuery);

(function ($) {
	"use strict";
	// traversing, band processing
	$.extend($.wijmo.wijgrid, {
		bandProcessor: function () {
			var height, width, table, traverseList, shift, inc, savedXPos;

			this.generateSpanTable = function (root, leaves) {
				height = width = inc = shift = 0;
				table = [];
				traverseList = [];
				savedXPos = [];

				var spanTable = this._generateSpanTable(root, leaves, true);

				return spanTable;
			};

			this._generateSpanTable = function (root, leaves, parentVisibility) {
				var i, j;
					height = this._getVisibleHeight(root, parentVisibility);

				leaves = leaves || [];

				//var foo = function(self) {
				$.wijmo.wijgrid.traverse(root, function (column) {
					if (column.isLeaf) {
						leaves.push(column);
					}
					traverseList.push(column);
					//self.traverseList.push(column);
				});
				//} (this); // make closure

				width = leaves.length;

				for (i = 0; i < height; i++) {
					table[i] = [];
					for (j = 0; j < width; j++) {
						table[i][j] = { column: null, colSpan: 0, rowSpan: 0 };
					}
				}

				this._setTableValues(root, 0, 0);

				return table;
			};

			this._getVisibleHeight = function (root, parentVisibility) {
				var i, len, colVis, tmp, result = 0;

				if ($.isArray(root)) { // columns
					for (i = 0, len = root.length; i < len; i++) {
						tmp = this._getVisibleHeight(root[i], parentVisibility);
						result = Math.max(result, tmp);
					}
				} else { // column
					colVis = (root.visible === undefined) ? true : root.visible;
					root.parentVis = colVis && parentVisibility;

					if (root.isBand) { // band
						for (i = 0, len = root.columns.length; i < len; i++) {
							tmp = this._getVisibleHeight(root.columns[i], root.parentVis);
							result = Math.max(result, tmp);
						}

						if (!root.parentVis) {
							return result;
						}

						root.isLeaf = (result === 0);
						result++;
					} else { // general column
						root.isLeaf = true;
						if (root.parentVis) {
							result = 1;
						}
					}
				}

				return result;
			};

			this._getVisibleParent = function (column) {

				while (column) {
					column = traverseList[column.parentIdx];
					if (column && (column.parentVis || column.parentVis === undefined)) {
						return column;
					}
				}

				return null;
			};

			this._setTableValues = function (root, y, x) {
				var i, len, tx, posX, parentIsLeaf, visibleParent;

				if ($.isArray(root)) { //
					for (i = 0, len = root.length; i < len; i++) {
						this._setTableValues(root[i], y, x);
					}
				} else { // column
					if (root.travIdx === undefined) {
						throw "undefined travIdx";
					}

					tx = x + shift;

					if (root.parentVis) {
						posX = tx + inc;
						table[y][posX].column = root;
						savedXPos[root.travIdx] = posX;
					}

					if (root.isBand) { // band
						for (i = 0, len = root.columns.length; i < len; i++) {
							this._setTableValues(root.columns[i], y + 1, x);
						}
					}

					if (root.parentVis) {
						if (shift - tx === 0) { //root is column or band without visible nodes
							table[y][savedXPos[root.travIdx]].rowSpan = height - y;
							shift++;
						} else { // band with visible nodes
							table[y][savedXPos[root.travIdx]].colSpan = shift - tx;
						}
					} else {
						if (!root.isBand && height > 0) {
							visibleParent = this._getVisibleParent(root);

							parentIsLeaf = (visibleParent)
							? visibleParent.isLeaf
							: false;

							if (parentIsLeaf) {
								inc++;
							}

							if (y >= height) {
								y = height - 1;
							}

							posX = x + shift + inc;

							table[y][posX].column = root;

							if (!parentIsLeaf) {
								if (visibleParent && (savedXPos[visibleParent.travIdx] === posX)) {
									this._shiftTableElements(posX, y);
								}

								inc++;
							}
						}
					}
				}
			};

			this._shiftTableElements = function (x, untilY) {
				var i;

				for (i = 0; i < untilY; i++) {
					table[i][x + 1] = table[i][x];
					table[i][x] = { column: null, colSpan: 0, rowSpan: 0 };

					if (table[i][x + 1].column) {
						savedXPos[table[i][x + 1].column.travIdx]++;
					}
				}
			};
		},

		// returns both visible and invisible leaves.
		getAllLeaves: function (columns) {
			var leaves = [];

			this._getAllLeaves(columns, leaves);

			return leaves;
		},

		_getAllLeaves: function (columns, leaves) {
			var i, len, column, subColumns;

			if (columns) {
				for (i = 0, len = columns.length; i < len; i++) {
					column = columns[i];

					if (column.options) { // widget
						column = column.options;
					}

					subColumns = column.columns;
					if (subColumns && subColumns.length) {
						this._getAllLeaves(subColumns, leaves);
					}
					else {
						leaves.push(column);
					}
				}
			}
		},

		// returns null or { found (object), at (array) } object.
		getColumnByTravIdx: function (columns, travIdx) {
			var i, len, column, result = null;

			if (columns && travIdx >= 0) {
				for (i = 0, len = columns.length; i < len && !result; i++) {
					column = columns[i];

					if (column.options) { // widget
						column = column.options;
					}

					if (column.travIdx === travIdx) {
						return { found: column, at: columns };
					}

					if (column.columns) {
						result = this.getColumnByTravIdx(column.columns, travIdx);
					}
				}
			}

			return result;
		},

		isChildOf: function (columns, child, parent) {
			if (child.options) {
				child = child.options;
			}

			if (parent.options) {
				parent = parent.options;
			}

			if (parent.isBand && child.parentIdx >= 0) {
				if (child.parentIdx === parent.travIdx) {
					return true;
				}

				if (child.parentIdx > parent.travIdx) {
					var traverse = this.flatten(columns);

					while (true) {
						child = traverse[child.parentIdx];

						if (child.travIdx === parent.travIdx) {
							return true;
						}

						if (child.parentIdx === -1) {
							break;
						}
					}
				}
			}

			return false;
		},

		getLeaves: function (columns) {
			var leaves = [];

			this._getLeaves(columns, leaves);

			return leaves;
		},

		_getLeaves: function (columns, leaves) {
			var i, len, column;

			if (columns) {
				for (i = 0, len = columns.length; i < len; i++) {
					column = columns[i];

					if (column.isLeaf) {
						leaves.push(column);
					}

					if (column.columns) {
						this._getLeaves(column.columns, leaves);
					}
				}
			}
		},

		setTraverseIndex: function (columns) {
			return this._setTraverseIndex(columns, 0, -1); // -> columns length
		},

		_setTraverseIndex: function (columns, idx, parentIdx) {
			var i, len, column;

			if (columns) {
				for (i = 0, len = columns.length; i < len; i++) {
					column = columns[i];

					if (column.options) { // widget
						column = column.options;
					}

					column.linearIdx = i;
					column.travIdx = idx++;
					column.parentIdx = parentIdx;

					if (column.columns) {
						idx = this._setTraverseIndex(column.columns, idx, idx - 1);
					}
				}
			}

			return idx;
		},

		flatten: function (columns) {
			var result = [];

			this.traverse(columns, function (column) {
				result.push(column);
			});

			return result;
		},

		traverse: function (columns, callback) {
			var i, len, column;

			if (columns && ($.isFunction(callback))) {
				for (i = 0, len = columns.length; i < len; i++) {
					column = columns[i];

					if (column.options) { // widget
						column = column.options;
					}

					callback(column);

					if (column.columns) { // go deeper
						this.traverse(column.columns, callback);
					}
				}
			}
		},

		getAriaHeaders: function (visibleLeaves, traverseList) {
			var i, len, leaf, value, result = [];

			for (i = 0, len = visibleLeaves.length; i < len; i++) {
				leaf = visibleLeaves[i];
				value = "";

				do {
					value += escape(leaf.headerText) + " ";
				} while ((leaf = traverseList[leaf.parentIdx])/*&& leaf.parentVis*/);

				result[i] = $.trim(value);
			}

			return result;
		}
	});
})(jQuery);(function ($) {
	"use strict";
	$.extend($.wijmo.wijgrid, {
		// section:
		// 1 - tHead
		// 2 - tBody
		// 3 - tFoot
		// otherwise - table
		getTableSection: function (table, section) {
			if (table && !table.nodeType) {
				table = table[0]; // jQuery
			}

			if (table) {
				switch (section) {
					case 1:
						return table.tHead;

					case 2:
						if (table.tBodies) {
							return table.tBodies[0] || null;
						}
						break;

					case 3:
						return table.tFoot;

					default:
						return table;
				}
			}

			return null;
		},

		// section:
		// 1 - tHead
		// 2 - tBody
		// 3 - tFoot
		// otherwise - table
		getTableSectionLength: function (table, section) {
			if (table && !table.nodeType) {
				table = table[0]; // jQuery
			}

			return (table && (section = this.getTableSection(table, section)))
				? section.rows.length
				: 0;
		},

		getTableSectionRow: function (table, section, rowIndex) {
			if (table && !table.nodeType) {
				table = table[0]; // jQuery
			}

			return (table && (section = this.getTableSection(table, section)))
				? section.rows[rowIndex] || null
				: null;
		},

		// section:
		// 1 - tHead
		// 2 - tBody
		// 3 - tFoot
		// otherwise - table
		readTableSection: function (table, section, readAttributes) {
			var ri, rowLen, ci, celLen, row, tmp,
				result = [],
				prevent = function (attrName) {
					attrName = attrName.toLowerCase();
					return attrName === "rowspan" || attrName === "colspan";
				}

			if (table && !table.nodeType) {
				table = table[0]; // jQuery
			}

			if (table && (section = this.getTableSection(table, section))) {
				for (ri = 0, rowLen = section.rows.length; ri < rowLen; ri++) {
					row = section.rows[ri];
					tmp = [];

					if (readAttributes) {
						tmp.rowAttributes = null; // $.wijmo.wijgrid.getAttributes(row);
						tmp.cellsAttributes = [];
					}

					for (ci = 0, celLen = row.cells.length; ci < celLen; ci++) {
						tmp[ci] = row.cells[ci].innerHTML;

						if (readAttributes) {
							tmp.cellsAttributes[ci] = $.wijmo.wijgrid.getAttributes(row.cells[ci], prevent);
						}
					}

					result[ri] = tmp;
				}
			}

			return result;
		}
	});
})(jQuery);(function ($) {
	"use strict";
	$.extend($.wijmo.wijgrid, {
		dataMode: {
			dom: 1,
			statical: 2,
			remoteStatical: 4,
			dynamical: 8
		},

		dataStore: function (wijgrid) {
			var _dataSource = null,
				_self = this,
				_isLoaded = false,
				_clonedItems = null,
				_attributes = null, // store attributes here (an array of a { rowAttributes, cellsAttributes }
				_transformedData, // { data: array, totalRows: int }
				_parsed = false,
				_transformed = false;

			this.dataMode = function () {
				return _dataMode();
			};

			this.dataSource = function () {
				return _dataSource;
			};

			this.getFieldNames = function () {

				if (!_isLoaded) {
					throw "data is not loaded yet";
				}

				var result = [],
					key, fooKey, firstItem;

				if (_dataSource.items && _dataSource.items.length) {
					firstItem = _dataSource.items[0];
				} else {
					if ((_dataMode() === $.wijmo.wijgrid.dataMode.dom) && _dataSource.header && _dataSource.header.length) { // DOMTable contains no data rows but header.
						firstItem = _dataSource.header[0];
					}
				}

				if (firstItem) {
					for (key in firstItem) {
						if (firstItem.hasOwnProperty(key)) {
							result.push((!isNaN(key)) ? parseInt(key, 10) : key);
						}
					}
				}

				return result;
			};

			// { data: array, totalRows: int }
			this.getDataSlice = function () {

				if (!_isLoaded) {
					throw "data is not loaded yet";
				}

				if (!_parsed) {
					_parsed = true; // todo try/ finally
					_parseData(_clonedItems);
				}

				if (!_transformed) {
					_transformed = true; // todo try/ finally

					if (_dataMode() !== $.wijmo.wijgrid.dataMode.dynamical) {
						_transformedData = _transform(_clonedItems, _dataSource.emptyData);
					} else {
						_transformedData = {
							data: _clonedItems, //  $.extend(true, [], _clonedItems),
							totalRows: _dataSource.data.totalRows,
							totals: _dataSource.data.totals || {},
							emptyData: _dataSource.emptyData
						};
					}
				}

				return _transformedData;
			};

			this.load = function (userData) {
				if (!_dataSource) {
					_dataSource = $.proxy(_createDataSource, this)(wijgrid);
				}

				if (_dataMode() === $.wijmo.wijgrid.dataMode.dynamical) { // always load data
					userData.data = _prepareRequest();
					if (_dataSource.proxy) { // remote 
						_dataSource.proxy.options.data = $.extend(_dataSource.proxy.options.data, userData.data);
					}

					_attributes = null; // indicates that we should read attributes
					_dataSource.load(userData, true);
				} else { // local
					if (!_isLoaded) { // first time ?
						_attributes = null; // indicates that we should read attributes
						_dataSource.load(userData);
					} else {
						_dataLoading(_dataSource, userData);
						_dataLoaded(_dataSource, userData);
					}
				}
			};

			this.isLoaded = function () {
				return _isLoaded;
			};

			this.updateValue = function (originalRowIndex, dataKey, newValue) {
				if (!_isLoaded) {
					throw "data is not loaded yet";
				}

				this.dataSource().items[originalRowIndex][dataKey] = newValue;
			};

			// private

			function _createDataSource(grid) {
				var dataSource = null,
					gridData = grid.options.data,
					oldError;

				if (gridData === null) { // DOMTable
					dataSource = new wijdatasource({
						data: grid.element,
						reader: new _dataReaderWrapper(new _domTableDataReader()),
						loading: $.proxy(_dataLoading, this),
						loaded: $.proxy(_dataLoaded, this)
					});
				} else
					if ($.isArray(gridData)) { // Array
						dataSource = new wijdatasource({
							data: gridData,
							reader: new _dataReaderWrapper(new wijarrayreader()),
							loading: $.proxy(_dataLoading, this),
							loaded: $.proxy(_dataLoaded, this)
						});
					} else { // wijdatasource
						dataSource = new wijdatasource(gridData);

						dataSource.reader = new _dataReaderWrapper(gridData.reader);

						dataSource.loading = $.proxy(function (ds, data) {
							if ($.isFunction(gridData.loading)) {
								gridData.loading(ds, data);
							}

							$.proxy(_dataLoading, this)(ds, data);
						}, this);

						dataSource.loaded = $.proxy(function (ds, data) {
							if ($.isFunction(gridData.loaded)) {
								gridData.loaded(ds, data);
							}

							$.proxy(_dataLoaded, this)(ds, data);
						}, this);

						if (dataSource.proxy && dataSource.proxy.options) {
							oldError = dataSource.proxy.options.error;
							dataSource.proxy.options.error = function () {
								_error.apply(this, arguments);

								if ($.isFunction(oldError)) {
									oldError.apply(this, arguments);
								}
							};
						}
					}

				return dataSource;
			}

			function _dataLoading(wijDataSource, userData) {
				if (_self.dataMode() === $.wijmo.wijgrid.dataMode.dynamical || wijgrid.options.alwaysParseData) {
					_parsed = false;  // always parse data
				}

				_transformed = false;
				_transformedData = null;
				_clonedItems = null;
				wijgrid._dataLoading(userData);
			}

			function _dataLoaded(wijDataSource, userData) {
				_isLoaded = true;

				// clone original items and get attributes (optional), extend them to a { value, originalRowIndex, attributes } triplet
				var i, len, item, dataKey, dataValue, tmp,
					mode = _dataMode(),
					readAttributes = (!_attributes && wijgrid.options.readAttributesFromData);

				if (!_attributes) { // first time?
					_attributes = []; 
				}

				_clonedItems = [];

				for (i = 0, len = wijDataSource.items.length; i < len; i++) {
					item = wijDataSource.items[i];

					if (readAttributes) {
						if (mode === $.wijmo.wijgrid.dataMode.dom) { // Row and cells attributes are provided by the tableReader within rowAttributes and cellsAttributes properties of the data item itself.
							_attributes.push({
								rowAttributes: item.rowAttributes,
								cellsAttributes: item.cellsAttributes
							});

							delete item.rowAttributes;
							delete item.cellsAttributes;
						} else { // Otherwise cell attributes can be passed within data values as an array of size 2. First element points to a data value, second element points to an attributes hash.
							tmp = {};

							for (dataKey in item) {
								if (item.hasOwnProperty(dataKey) && $.isArray(dataValue = item[dataKey])) {
									tmp[dataKey] = dataValue[1]; // copy attributes to tmp
									item[dataKey] = dataValue[0]; // overwrite item[dataKey] with actual data value
								}
							}

							_attributes.push({
								rowAttributes: {},
								cellsAttributes: tmp
							});
						}
					}

					_clonedItems.push({
						values: item, // important!!: the same object is shared between _clonedItems and wijDataSource(aka _dataSource).items
						originalRowIndex: i,
						attributes: _attributes[i]
					});
				}

				wijgrid._dataLoaded(userData);
			}

			function _error() {
				wijgrid._ajaxError.apply(wijgrid, arguments);
			}

			function _dataMode() {
				if (!_dataSource.data) { // dataSource.data == domTable
					return $.wijmo.wijgrid.dataMode.dom;
				}

				if (_dataSource.dynamic === true) {
					return $.wijmo.wijgrid.dataMode.dynamical;
				}

				return $.wijmo.wijgrid.dataMode.statical;
			}

			function _parseData(data) {
				if (data && data.length) {

					var dataLeaves = [],
						dataLen, ri, len, dataRow, di, value, dataLeaf;

					$.wijmo.wijgrid.traverse(wijgrid.options.columns, function (column) {
						if ($.wijmo.wijgrid.validDataKey(column.dataKey)) {
							dataLeaves.push(column);
						}
					});

					dataLen = Math.min(dataLeaves.length, /*_self.getFieldsCount()*/_self.getFieldNames().length);
					for (ri = 0, len = data.length; ri < len; ri++) {
						dataRow = data[ri];

						for (di = 0; di < dataLen; di++) {
							value = null;
							dataLeaf = dataLeaves[di];

							if (dataLeaf && dataLeaf.dataParser) {
								value = wijgrid._parse(dataLeaf, dataRow.values[dataLeaf.dataKey]);
								dataRow.values[dataLeaf.dataKey] = value;
							}

						} // for di
					} // for ri
				}
			}

			// { data: array, totalRows: int }
			function _transform(data, emptyData) {
				if (data && data.length) {
					var filterRequest = wijgrid._prepareFilterRequest(true),
						pageRequest = wijgrid._preparePageRequest(true),
						sortRequest = wijgrid._prepareSortRequest(true),
						totalsRequest = wijgrid._prepareTotalsRequest(true),
						result = new $.wijmo.wijgrid.dataHelper().getDataSlice(wijgrid, data /*$.extend(true, [], data)*/, filterRequest, pageRequest, sortRequest, totalsRequest);

					return result;
				}

				return {
					data: [],
					totalRows: 0,
					totals: {},
					emptyData: emptyData
				};
			}

			function _prepareRequest() {
				var result = {
					filtering: wijgrid._prepareFilterRequest(false),
					paging: wijgrid._preparePageRequest(false),
					sorting: wijgrid._prepareSortRequest(false),
					totals: wijgrid._prepareTotalsRequest(false)
				};

				return result;
			}

			// * data readers *
			function _dataReaderWrapper(dataReader) {

				this.read = function (dataSource) {
					dataSource.items = null;

					if (dataReader && $.isFunction(dataReader.read)) {
						dataReader.read(dataSource);
					}

					if (!$.isArray(dataSource.items)) {
						dataSource.items = [];

						if ($.isArray(dataSource.data)) {
							dataSource.items = dataSource.data;
						} else {
							if (dataSource.data && $.isArray(dataSource.data.rows)) {
								dataSource.items = dataSource.data.rows; // remoteDynamical
							}
						}
					}

					if (_dataMode() === $.wijmo.wijgrid.dataMode.dynamical) {
						if (!dataSource.data || isNaN(dataSource.data.totalRows)) {
							throw "totalRows value is missing";
						}
					}

					if (!dataSource.items || !$.isArray(dataSource.items)) {
						dataSource.items = [];
					}
				};
			}

			function _domTableDataReader() {
				this.read = function (wijDataSource) {
					wijDataSource.items = [];

					if (wijDataSource && wijDataSource.data && wijDataSource.data.length) {
						if ($.wijmo.wijgrid.getTableSectionLength(wijDataSource.data, 2) === 1 &&
							$($.wijmo.wijgrid.getTableSectionRow(wijDataSource.data, 2, 0)).hasClass("wijmo-wijgrid-emptydatarow")) { // special case - empty data row
							wijDataSource.emptyData = $.wijmo.wijgrid.readTableSection(wijDataSource.data, 2);
						} else { // read data rows
							wijDataSource.items = $.wijmo.wijgrid.readTableSection(wijDataSource.data, 2, wijgrid.options.readAttributesFromData);
						}

						wijDataSource.header = $.wijmo.wijgrid.readTableSection(wijDataSource.data, 1);
						wijDataSource.data = null;
					} else {
						throw "invalid data source";
					}
				};
			}
		},

		dataHelper: function () {

			this.getDataSlice = function (gridView, dataCache, filterRequest, pageRequest, sortRequest, totalsRequest) {
				// apply filtering
				dataCache = _applyFiltering(dataCache, filterRequest, gridView);

				// apply sorting
				$.proxy(_applySort, this)(dataCache, sortRequest);

				var totalRows = dataCache.length, // number of rows in the data source (before paging will be applied)
					start, end, pagedData, i, j, len,
					totals = {};

				// calculate totals
				totals = _getTotals(dataCache, totalsRequest, gridView);

				// apply paging
				if (pageRequest) {
					start = Math.min(dataCache.length - 1, pageRequest.pageIndex * pageRequest.pageSize);

					if (start < 0) {
						start = 0;
					}

					end = Math.min(dataCache.length, start + pageRequest.pageSize);

					pagedData = [];
					for (i = start, len = 0, j = 0; i < end; i++, j++) {
						pagedData[j] = dataCache[i];
					}

					dataCache = pagedData;
				}

				return {
					data: dataCache,
					totalRows: totalRows,
					totals: totals
				};
			};

			// totalsRequest: [ {column, aggregate} ]
			function _getTotals(data, totalsRequest, gridView) {
				var i, len, j, len2, dataItemValues,
					tallies = [],
					result = {};

				for (i = 0, len = totalsRequest.length; i < len; i++) {
					tallies.push(new $.wijmo.wijgrid.tally());
				}

				for (i = 0, len = data.length; i < len; i++) {
					dataItemValues = data[i].values;

					for (j = 0, len2 = tallies.length; j < len2; j++) {
						tallies[j].add(dataItemValues[totalsRequest[j].column.dataKey]);
					}
				}

				for (i = 0, len = tallies.length; i < len; i++) {
					result[totalsRequest[i].column.dataKey] = tallies[i].getValueString(totalsRequest[i].column);
				}

				return result;
			}

			// filterRequest: [ {column, filterOperator} ]
			function _applyFiltering(data, filterRequest, gridView) {
				var dataLength, filterLength,
					filterValues = {},
					i, fi, operator, column,
					dataRes = [],
					dataRow, flag, j, dataVal;

				if (!data || (dataLength = data.length) === 0 ||
					!filterRequest || (filterLength = filterRequest.length) === 0) {

					return data;
				}

				// preformat filterValues
				for (i = 0; i < filterLength; i++) {
					fi = filterRequest[i];
					operator = fi.operator;
					column = fi.column;

					if (operator.arity > 1) {
						filterValues[i] = gridView._parse(column, column.filterValue);
					}
				}

				for (i = 0; i < dataLength; i++) {
					dataRow = data[i];
					flag = true;

					for (j = 0; j < filterLength && flag; j++) {
						fi = filterRequest[j];
						dataVal = dataRow.values[fi.column.dataKey];

						flag &= fi.operator.operator(dataVal, filterValues[j]);
					}

					if (flag) {
						dataRes.push(dataRow);
					}
				}

				return dataRes;
			}

			// sortRequest: array of { dataKey, sortDirection } 
			function _applySort(data, sortRequest) {
				if (sortRequest.length) {

					var builder = [],
						i, len, arg, si, dataKey, idx;

					builder.push("var context = this;"); // declare "context" variable explicitly to avoid js minimization issue.
					builder.push("this.sort = function(a, b)\n{\n");

					for (i = 0, len = sortRequest.length; i < len; i++) {
						arg = "arg" + i;
						si = sortRequest[i];

						dataKey = (typeof (si.dataKey) === "string")
							? "\"" + si.dataKey + "\""
							: si.dataKey;

						if (si.sortDirection === "ascending" || si.sortDirection === "descending") {
							if (si.sortDirection === "ascending") {
								builder.push("var ", arg, " = context._sortAsc", "(a.values[", dataKey, "], b.values[", dataKey, "]);\n");
							}
							else {
								builder.push("var ", arg, " = context._sortDesc", "(a.values[", dataKey, "], b.values[", dataKey, "]);\n");
							}
						} else { // sortDirection === none: restore original order
							builder.push("var ", arg, " = context._sortDigitAsc", "(a.originalRowIndex, b.originalRowIndex);\n");
						}

						builder.push("if (", arg, " === 0)\n");
						builder.push("{\n");
					}

					idx = sortRequest.length - 1;
					if (idx >= 0) { // sort identical values using originalRowIndex
						arg = "arg" + idx;
						si = sortRequest[idx];

						dataKey = (typeof (si.dataKey) === "string")
							? "\"" + si.dataKey + "\""
							: si.dataKey;

						if ((si.sortDirection === "ascending") || (si.sortDirection === "descending")) {
							if (si.sortDirection === "ascending") {
								builder.push("var ", arg, " = context._sortDigitAsc", "(a.originalRowIndex, b.originalRowIndex);\n");
							}
							else {
								builder.push("var ", arg, " = context._sortDigitDesc", "(a.originalRowIndex, b.originalRowIndex);\n");
							}
						}
					}

					for (i = sortRequest.length - 1; i >= 0; i--) {
						builder.push("}\n");
						arg = "arg" + i;
						builder.push("return ", arg, ";\n");
					}

					builder.push("}");

					eval(builder.join(""));

					data.sort(this.sort);
				}
			}

			this._sortAsc = function (a, b) {
				if (a instanceof Date) {
					a = a.getTime();
				}

				if (b instanceof Date) {
					b = b.getTime();
				}

				if (a === b) {
					return 0;
				}

				if (a === null) {
					return -1;
				}

				if (b === null) {
					return 1;
				}

				return (a < b) ? -1 : 1;
			};

			this._sortDesc = function (a, b) {
				if (a instanceof Date) {
					a = a.getTime();
				}

				if (b instanceof Date) {
					b = b.getTime();
				}

				if (a === b) {
					return 0;
				}

				if (a === null) {
					return 1;
				}

				if (b === null) {
					return -1;
				}

				return (a < b) ? 1 : -1;
			};

			this._sortDigitAsc = function (a, b) {
				return a - b;
			};

			this._sortDigitDesc = function (a, b) {
				return b - a;
			};
		}
	});
})(jQuery);(function ($) {
	"use strict";
	$.extend($.wijmo.wijgrid, {
		groupRange: function (expanded, range, sum, position) {
			this.value = -1;

			switch (arguments.length) {
				case 4:
					this.isExpanded = expanded;
					this.cr = range;
					this.sum = sum;
					this.position = position;
					break;

				case 1:
					this.isExpanded = expanded;
					this.cr = new $.wijmo.wijgrid.cellRange(-1, -1);
					this.sum = -1;
					this.position = "none";
					break;

				default:
					this.isExpanded = false;
					this.cr = new $.wijmo.wijgrid.cellRange(-1, -1);
					this.sum = -1;
					this.position = "none";
			}

			this.isSubRange = function (groupRange) {
				return ((this.cr.r1 >= groupRange.cr.r1) && (this.cr.r2 <= groupRange.cr.r2));
			};

			this.toString = function () {
				return this.cr.r1 + "-" + this.cr.r2;
			};

			this._getHeaderImageClass = function (expanded) {
				var groupInfo = this.owner;

				if (groupInfo) {
					return expanded
						? groupInfo.expandedImageClass || $.wijmo.c1field.prototype.options.groupInfo.expandedImageClass /*"ui-icon-triangle-1-se"*/
						: groupInfo.collapsedImageClass || $.wijmo.c1field.prototype.options.groupInfo.collapsedImageClass /*"ui-icon-triangle-1-e"*/;
				}

				return null;
			};

			this.collapse = function () {
				var groupInfo, column, grid, groupHelper, leaves, groupedColumnsCnt;

				if ((groupInfo = this.owner) && (column = groupInfo.owner) && (grid = column.owner)) {
					groupHelper = new $.wijmo.wijgrid.groupHelper();
					leaves = grid._field("leaves");

					if (groupHelper.isParentExpanded(leaves, this.cr, groupInfo.level)) {
						if ((groupInfo.position !== "footer") && (groupInfo.outlineMode !== "none")) { // do not collapse groups with .position == "footer"
							groupedColumnsCnt = groupHelper.getGroupedColumnsCount(leaves);
							_collapse(groupHelper, grid._rows(), leaves, this, groupedColumnsCnt);
						}
					}
				}
			};

			this.expand = function (expandChildren) {
				var groupInfo, column, grid, groupHelper, leaves, groupedColumnsCnt;

				if ((groupInfo = this.owner) && (column = groupInfo.owner) && (grid = column.owner)) {
					groupHelper = new $.wijmo.wijgrid.groupHelper();
					leaves = grid._field("leaves");

					if (groupHelper.isParentExpanded(leaves, this.cr, groupInfo.level)) {
						groupedColumnsCnt = groupHelper.getGroupedColumnsCount(leaves);
						/*var tbody = grid.$table.find("> tbody")[0];*/

						_expand(groupHelper, grid._rows(), leaves, this, groupedColumnsCnt, expandChildren, true);
					}
				}
			};

			// private members

			function _collapse(groupHelper, rowAccessor, leaves, groupRange, groupedColumnsCnt) {
				var groupInfo = groupRange.owner,
					dataStart = groupRange.cr.r1,
					dataEnd = groupRange.cr.r2,
					rowObj, i, len,
					childRanges, childRange, j;

				switch (groupInfo.position) {
					case "header":
					case "headerAndFooter":
						rowObj = rowAccessor.item(groupRange.cr.r1);

						if (rowObj) {
							if (rowObj[0]) {
								rowObj[0]["aria-expanded"] = "false";
							}

							if (rowObj[1]) {
								rowObj[1]["aria-expanded"] = "false";
							}
						}

						dataStart++;
						break;
				}

				// hide child rows
				for (i = dataStart; i <= dataEnd; i++) {
					rowObj = rowAccessor.item(i);
					if (rowObj) {
						if (rowObj[0]) {
							rowObj[0].style.display = "none";
							rowObj[0]["aria-hidden"] = "true";
						}

						if (rowObj[1]) {
							rowObj[1].style.display = "none";
							rowObj[1]["aria-hidden"] = "true";
						}
					}

					//tbody.rows[i].style.display = "none";
				}

				// update isExpanded property
				groupRange.isExpanded = false;
				_updateHeaderIcon(rowAccessor, groupRange);

				for (i = groupInfo.level + 1; i <= groupedColumnsCnt; i++) {
					childRanges = groupHelper.getChildGroupRanges(leaves, groupRange.cr, /*groupRange.owner.level*/ i - 1);
					for (j = 0, len = childRanges.length; j < len; j++) {
						childRange = childRanges[j];
						childRange.isExpanded = false;

						switch (childRange.owner.position) {
							case "header":
							case "headerAndFooter":
								rowObj = rowAccessor.item(childRange.cr.r1);

								if (rowObj) {
									if (rowObj[0]) {
										rowObj[0]["aria-expanded"] = "false";
									}

									if (rowObj[1]) {
										rowObj[1]["aria-expanded"] = "false";
									}
								}

								break;
						}

						_updateHeaderIcon(rowAccessor, childRange);
					}
				}
			}

			function _expand(groupHelper, rowAccessor, leaves, groupRange, groupedColumnsCnt, expandChildren, isRoot) {
				var groupInfo = groupRange.owner,
					dataStart = groupRange.cr.r1,
					dataEnd = groupRange.cr.r2,
					rowObj, i, len,
					childRanges, childRange, childIsRoot;

				switch (groupInfo.position) {
					case "header":
						rowObj = rowAccessor.item(dataStart);
						if (rowObj) {
							if (rowObj[0]) {
								rowObj[0].style.display = "";
								rowObj[0]["aria-hidden"] = "false";

								if (isRoot || expandChildren) {
									rowObj[0]["aria-expanded"] = "true";
								}
							}

							if (rowObj[1]) {
								rowObj[1].style.display = "";
								rowObj[1]["aria-hidden"] = "false";

								if (isRoot || expandChildren) {
									rowObj[1]["aria-expanded"] = "true";
								}
							}
						}
						dataStart++;
						break;
					case "footer":
						rowObj = rowAccessor.item(dataEnd);
						if (rowObj) {
							if (rowObj[0]) {
								rowObj[0].style.display = "";
								rowObj[0]["aria-hidden"] = "false";
							}

							if (rowObj[1]) {
								rowObj[1].style.display = "";
								rowObj[1]["aria-hidden"] = "false";
							}
						}
						dataEnd--;
						break;
					case "headerAndFooter":
						rowObj = rowAccessor.item(dataStart);
						if (rowObj) {
							if (rowObj[0]) {
								rowObj[0].style.display = "";
								rowObj[0]["aria-hidden"] = "false";

								if (isRoot || expandChildren) {
									rowObj[0]["aria-expanded"] = "true";
								}
							}

							if (rowObj[1]) {
								rowObj[1].style.display = "";
								rowObj[1]["aria-hidden"] = "false";

								if (isRoot || expandChildren) {
									rowObj[1]["aria-expanded"] = "true";
								}
							}
						}
						if (isRoot) {
							rowObj = rowAccessor.item(dataEnd);
							if (rowObj) {
								if (rowObj[0]) {
									rowObj[0].style.display = "";
									rowObj[0]["aria-hidden"] = "false";
								}

								if (rowObj[1]) {
									rowObj[1].style.display = "";
									rowObj[1]["aria-hidden"] = "false";
								}
							}
						}
						dataStart++;
						dataEnd--;
						break;
				}

				if (isRoot) {
					groupRange.isExpanded = true;
					_updateHeaderIcon(rowAccessor, groupRange);
				} else {
					return;
				}

				if (groupRange.owner.level === groupedColumnsCnt) { // show data rows
					for (i = dataStart; i <= dataEnd; i++) {
						rowObj = rowAccessor.item(i);
						if (rowObj) {
							if (rowObj[0]) {
								rowObj[0].style.display = "";
								rowObj[0]["aria-hidden"] = "false";
							}

							if (rowObj[1]) {
								rowObj[1].style.display = "";
								rowObj[1]["aria-hidden"] = "false";
							}
						}

					}
				} else {
					childRanges = groupHelper.getChildGroupRanges(leaves, groupRange.cr, groupRange.owner.level);

					if (expandChildren) { // throw action deeper
						for (i = 0, len = childRanges.length; i < len; i++) {
							childRange = childRanges[i];
							_expand(groupHelper, rowAccessor, leaves, childRange, groupedColumnsCnt, expandChildren, true);
						}
					} else { // show only headers of the child groups or fully expand child groups with .position == "footer"\ .outlineMode == "none"
						for (i = 0, len = childRanges.length; i < len; i++) {
							childRange = childRanges[i];

							childIsRoot = (childRange.owner.position === "footer" || childRange.owner.outlineMode === "none")
								? true
								: false;

							_expand(groupHelper, rowAccessor, leaves, childRange, groupedColumnsCnt, false, childIsRoot);
						}
					}
				}
			}

			function _updateHeaderIcon(rowAccessor, groupRange) {
				if (groupRange.owner.position !== "footer") {
					var imageDiv = null,
						rowObj = rowAccessor.item(groupRange.cr.r1);

					if (rowObj) {
						if (rowObj[0]) {
							imageDiv = $(rowObj[0]).find("div.wijmo-wijgrid-grouptogglebtn:first-child");
						}
					}

					if (imageDiv && imageDiv.length) {
						imageDiv.toggleClass(groupRange._getHeaderImageClass(!groupRange.isExpanded), false);
						imageDiv.toggleClass(groupRange._getHeaderImageClass(groupRange.isExpanded), true);
					}
				}
			}
		},

		grouper: function () {

			this.group = function (grid, data, leaves) {
				this._grid = grid;
				this._data = data;
				this._leaves = leaves;
				this._groupRowIdx = 0;
				this._groupHelper = new $.wijmo.wijgrid.groupHelper();

				var level = 1,
					i, len, leaf,
					groupCollection = [],
					needReset = false,
					groupLength = 0;

				//get the grouped columns
				for (i = 0, len = leaves.length; i < len; i++) {
					leaf = leaves[i];

					if (leaf.groupInfo) {
						delete leaf.groupInfo.level;
						delete leaf.groupInfo.expandInfo;
					}

					if (/*(leaf.dynamic !== true) && */leaf.groupInfo && (leaf.groupInfo.position && (leaf.groupInfo.position !== "none")) &&
						(leaf.dataIndex >= 0)) {
						if (leaf.groupedIndex === undefined) {
							needReset = true;
						}
					} else {
						if (leaf.groupedIndex !== undefined) {
							delete leaf.groupedIndex;
						}
					}
				}
				if (needReset) {
					for (i = 0, len = leaves.length; i < len; i++) {
						leaf = leaves[i];

						if (/*(leaf.dynamic !== true) && */leaf.groupInfo && (leaf.groupInfo.position && (leaf.groupInfo.position !== "none")) &&
							(leaf.dataIndex >= 0)) {
							leaf.groupedIndex = groupLength++;
							groupCollection.push(leaf);
						}
					}
				} else {
					groupCollection = $.map(leaves, function (element, index) {
						return element.groupedIndex !== undefined ? element : null;
					});
					groupCollection.sort(function (a, b) {
						return a.groupedIndex - b.groupedIndex;
					});
					$.each(groupCollection, function (index, item) {
						item.groupedIndex = index;
					});
				}

				grid._field("groupedColumns", groupCollection);

				for (i = 0, len = groupCollection.length; i < len; i++) {
					leaf = groupCollection[i];
					this._groupRowIdx = 0;

					if (/*(leaf.dynamic !== true) && */leaf.groupInfo && (leaf.groupInfo.position && (leaf.groupInfo.position !== "none")) &&
						(leaf.dataIndex >= 0)) {
						leaf.groupInfo.level = level;
						leaf.groupInfo.expandInfo = [];
						this._processRowGroup(leaf, level++);
					}
				}
				/*
				for (i = 0, len = leaves.length; i < len; i++) {
					leaf = leaves[i];
					this._groupRowIdx = 0;

					if ((leaf.dynamic !== true) && leaf.groupInfo && (leaf.groupInfo.position && (leaf.groupInfo.position !== "none")) &&
						(leaf.dataIndex >= 0) && !leaf.groupInfo.expandInfo) {
						leaf.groupInfo.level = level;
						leaf.groupInfo.expandInfo = [];
						this._processRowGroup(leaf, level++);
					}
				}
				*/
				delete this._grid;
				delete this._data;
				delete this._leaves;
			};

			this._processRowGroup = function (leaf, level) {
				var row, cellRange, isExpanded, startCollapsed, indentRow,
					groupRange, isParentCollapsed, header, footer, i;

				for (row = 0; row < this._data.length; row++) {
					// if (this._data[row].rowType !== "data") {
					if (!(this._data[row].rowType & $.wijmo.wijgrid.rowType.data)) {
						continue;
					}

					cellRange = this._getGroupCellRange(row, leaf, level);
					isExpanded = true;
					startCollapsed = (leaf.groupInfo.outlineMode === "startCollapsed");

					if (startCollapsed || this._groupHelper.isParentCollapsed(this._leaves, cellRange, level)) {
						if ((leaf.groupInfo.groupSingleRow === false) && (cellRange.r1 === cellRange.r2)) {
							continue;
						}
						isExpanded = false;
					}

					// indent
					if (level && this._grid.options.groupIndent) {
						for (indentRow = cellRange.r1; indentRow <= cellRange.r2; indentRow++) {
							this._addIndent(this._data[indentRow][0], level);
						}
					}

					// insert group header/ group footer
					switch (leaf.groupInfo.position) {
						case "header":
							groupRange = this._addGroupRange(leaf.groupInfo, cellRange, isExpanded);
							this._updateByGroupRange(groupRange, level);

							isParentCollapsed = this._groupHelper.isParentCollapsed(this._leaves, groupRange.cr, level);
							header = this._buildGroupRow(groupRange, cellRange, true, isParentCollapsed);

							for (i = cellRange.r1; i <= cellRange.r2; i++) {
								this._data[i].__attr["aria-level"] = level + 1;
								if (!isExpanded) {
									this._data[i].__style.display = "none";
									this._data[i].__attr["aria-hidden"] = true;

								}
							}

							this._data.splice(cellRange.r1, 0, header); // insert group header

							header.__attr["arial-level"] = level;
							header.__attr["aria-expanded"] = isExpanded;
							if (isParentCollapsed) {
								header.__style.display = "none";
								header.__attr["aria-hidden"] = true;
							}

							row = cellRange.r2 + 1;
							break;

						case "footer":
							groupRange = this._addGroupRange(leaf.groupInfo, cellRange, true);
							this._updateByGroupRange(groupRange, level);

							footer = this._buildGroupRow(groupRange, cellRange, false, false);
							footer.__attr["aria-level"] = level;

							this._data.splice(cellRange.r2 + 1, 0, footer);
							row = cellRange.r2 + 1;

							isParentCollapsed = this._groupHelper.isParentCollapsed(this._leaves, groupRange.cr, level);
							if (isParentCollapsed) {
								footer.__style.display = "none";
								footer.__attr["aria-hidden"] = true;
							}

							break;

						case "headerAndFooter":
							groupRange = this._addGroupRange(leaf.groupInfo, cellRange, isExpanded);
							this._updateByGroupRange(groupRange, level);

							isParentCollapsed = this._groupHelper.isParentCollapsed(this._leaves, groupRange.cr, level);
							header = this._buildGroupRow(groupRange, cellRange, true, isParentCollapsed);
							footer = this._buildGroupRow(groupRange, cellRange, false, false);

							for (i = cellRange.r1; i <= cellRange.r2; i++) {
								this._data[i].__attr["aria-level"] = level + 1;
								if (!isExpanded) {
									this._data[i].__style.display = "none";
									this._data[i].__attr["aria-hidden"] = true;
								}
							}

							this._data.splice(cellRange.r2 + 1, 0, footer);
							footer.__attr["aria-level"] = level;
							if (isParentCollapsed || !isExpanded) {
								footer.__style.display = "none";
								footer.__attr["aria-hidden"] = true;
							}

							this._data.splice(cellRange.r1, 0, header);
							header.__attr["aria-level"] = level;
							header.__attr["aria-expanded"] = isExpanded;
							if (isParentCollapsed) {
								header.__style.display = "none";
								header.__attr["aria-hidden"] = true;
							}

							row = cellRange.r2 + 2;
							break;

						default:
							throw $.wijmo.wijgrid.stringFormat("Unknown Position value: \"{0}\"", leaf.groupInfo.position);
					}

					this._groupRowIdx++;
				}
			};

			this._buildGroupRow = function (groupRange, cellRange, isHeader, isParentCollapsed) {
				//when some column is hidden, the group row is not correct.
				var groupInfo = groupRange.owner,
					leaf = groupInfo.owner,
					gridView = leaf.owner,
					row = [],
					groupByText = "",
					//headerOffset = 0,
					aggregate = "",
					tmp, cell, caption, args, span, col, bFirst, agg;

				row.__style = {};
				row.__attr = {};

				row.__attr.id = ((isHeader) ? "GH" : "GF") + this._groupRowIdx + "-" + groupInfo.level;

				row.rowType = (isHeader)
					? $.wijmo.wijgrid.rowType.groupHeader //"groupHeader"
					: $.wijmo.wijgrid.rowType.groupFooter; // "groupFooter";

				//if (cellRange.c1 > -1 && ((tmp = this._data[cellRange.r1][cellRange.c1].value) !== null)) {
				if ((leaf.dataIndex >= 0) && ((tmp = this._data[cellRange.r1][leaf.dataIndex].value) !== null)) {
					groupByText = gridView._toStr(leaf, tmp);
				}

				if (this._grid.options.showRowHeader) {
					row.push({ html: "&nbsp;" });
				}

				// create the summary cell
				cell = { html: "", __attr: {}, __style: {} };
				if (isHeader && groupInfo.outlineMode !== "none") {
					if (groupRange.isExpanded) {
						cell.html = "<div class=\"ui-icon " + groupRange._getHeaderImageClass(true) +
						" wijmo-wijgrid-grouptogglebtn\">&nbsp;</div>";
					}
					else {
						cell.html = "<div class=\"ui-icon " + groupRange._getHeaderImageClass(false) +
						" wijmo-wijgrid-grouptogglebtn\">&nbsp;</div>";
					}
				}

				row.push(cell);

				// add group header text
				if (leaf.aggregate && (leaf.aggregate !== "none")) {
					//aggregate = this._getAggregate(cellRange, leaf, groupInfo.owner, isHeader, groupByText);
					aggregate = this._getAggregate(cellRange, leaf, leaf, isHeader, groupByText);

					//if (leaf.parentVis) {
					//	headerOffset = 1;
					//}
				}

				caption = (isHeader)
					? groupInfo.headerText
					: groupInfo.footerText;

				// format caption

				// The text may include up to three placeholders:
				// "{0}" is replaced with the value being grouped on and
				// "{1}" is replaced with the group's column header
				// "{2}" is replaced with the aggregate
				if (caption === "custom") {
					args = {
						data: this._data, // data object.
						column: leaf, // column that is being grouped.
						groupByColumn: groupInfo.owner, // column initiated grouping.
						groupText: groupByText, // text that is being grouped.
						text: "", // text that will be displayed in the groupHeader or Footer.
						groupingStart: cellRange.r1, // first index for the data being grouped.
						groupingEnd: cellRange.r2, // last index for the data being grouped.
						isGroupHeader: isHeader,
						aggregate: aggregate
					};

					if (this._grid._trigger("groupText", null, args)) {
						caption = args.text;
					}
				} else {
					if ((caption === undefined) || (caption === null)) { // use default formatting
						if (isHeader) {
							caption = "{1}: {0}";
						}

						if (aggregate || (aggregate === 0)) {
							caption = caption
								? caption + " {2}"
								: "{2}";
						}
					}

					caption = $.wijmo.wijgrid.stringFormat(caption, groupByText,
						leaf && leaf.headerText ? leaf.headerText : "",
						aggregate.toString());
				}

				if (!caption) {
					caption = "&nbsp;";
				}

				cell.html += "<span>" + caption + "</span>";
				this._addIndent(cell, groupInfo.level - 1);

				// summary cells span until the end of the row or the first aggregate
				//span = headerOffset;
				span = 1;
				col = (this._grid.options.showRowHeader)
					? 1
					: 0;

				//for (; col < cellRange.c1; col++) { // c1 is an index of the leaf inside the this._leaves
				//	if (this._leaves[col].parentVis) {
				//		span++;
				//	}
				//}

				//col = cellRange.c1 + headerOffset;
				bFirst = true;
				for (; col < this._leaves.length; col++) {
					tmp = this._leaves[col];
					if (tmp.parentVis) {
						if (bFirst) {
							bFirst = false;
							continue;
						}
						if ((tmp.dynamic !== true) && tmp.aggregate && (tmp.aggregate !== "none")) {
							break;
						}

						span++;
					}
				}

				// add aggregates (or blanks) until the end of the row
				for (; col < this._leaves.length; col++) {
					tmp = this._leaves[col];
					if (tmp.parentVis) {
						agg = this._getAggregate(cellRange, tmp, groupInfo.owner, isHeader, groupByText);
						if (!agg && (agg !== 0)) {
							agg = "&nbsp;";
						}

						row.push({
							html: agg.toString(),
							__attr: { groupInfo: { leafIndex: tmp.leavesIdx, purpose: $.wijmo.wijgrid.groupRowCellPurpose.aggregateCell} } // will be passed into the cellStyleFormatter
						});
					}
				}

				cell.__attr.colSpan = span;
				cell.__attr.groupInfo = { leafIndex: leaf.leavesIdx, purpose: $.wijmo.wijgrid.groupRowCellPurpose.groupCell }; // will be passed into the cellStyleFormatter

				return row;
			};

			this._getAggregate = function (cellRange, column, groupByColumn, isGroupHeader, groupByText) {
				var aggregate = "",
					args, tally, row;

				if (!column.aggregate || (column.aggregate === "none")) {
					return aggregate;
				}

				if (column.aggregate === "custom") {
					args = {
						data: this._data, // data object
						column: column, // column that is being grouped.
						groupByColumn: groupByColumn, // column initiated grouping.
						groupText: groupByText, // text that is being grouped.
						text: "", // text that will be displayed in the groupHeader or groupFooter.
						groupingStart: cellRange.r1, // first index for the data being grouped.
						groupingEnd: cellRange.r2, // last index for the data being grouped.
						isGroupHeader: isGroupHeader
					};

					if (this._grid._trigger("groupAggregate", null, args)) {
						aggregate = args.text;
					}
				} else {
					tally = new $.wijmo.wijgrid.tally();

					for (row = cellRange.r1; row <= cellRange.r2; row++) {
						tally.add(this._data[row][column.dataIndex].value);
					}

					aggregate = tally.getValueString(column);
				}

				return aggregate;
			};

			this._getGroupCellRange = function (row, leaf, level) {
				//var range = new $.wijmo.wijgrid.cellRange(row, leaf.dataIndex);
				var idx = leaf.leavesIdx, // $.inArray(leaf, this._leaves);
					range = new $.wijmo.wijgrid.cellRange(row, idx),
					parentRange = this._groupHelper.getParentGroupRange(this._leaves, range, level),
					str, count;

				//if (this._data[row].rowType === "data") {
				if (this._data[row].rowType & $.wijmo.wijgrid.rowType.data) {
					str = this._data[row][leaf.dataIndex].value;

					for (range.r2 = row, count = this._data.length - 1; range.r2 < count; range.r2++) {
						//if ((this._data[range.r2 + 1].rowType !== "data") || (parentRange && (range.r2 + 1 > parentRange.r2))) {
						if (!(this._data[range.r2 + 1].rowType & $.wijmo.wijgrid.rowType.data) || (parentRange && (range.r2 + 1 > parentRange.r2))) {
							break;
						}

						if (this._data[range.r2 + 1][leaf.dataIndex].value !== str) {
							break;
						}
					}
				}

				return range;
			};

			this._addGroupRange = function (groupInfo, cellRange, isExpanded) {
				var result = null,
					idx = this._groupHelper.getChildGroupIndex(cellRange, groupInfo.expandInfo),
					range, expandState, r1, r2;

				if (idx >= 0 && idx < groupInfo.expandInfo.length) {
					result = groupInfo.expandInfo[idx];
				} else {
					range = new $.wijmo.wijgrid.cellRange(cellRange.r1, cellRange.r1, cellRange.r2, cellRange.r2); // clone
					expandState = (groupInfo.position === "footer")
						? true
						: isExpanded && (groupInfo.outlineMode !== "startCollapsed");

					result = new $.wijmo.wijgrid.groupRange(expandState, range, -1, groupInfo.position);

					result.owner = groupInfo;

					groupInfo.expandInfo.push(result);
				}

				if (result) {
					r1 = cellRange.r1;
					r2 = cellRange.r2;

					if (groupInfo.position === "headerAndFooter") {
						r2 += 2;
					}

					if (groupInfo.position !== "headerAndFooter") {
						r2++;
					}

					result.cr.r2 = r2;
				}

				return result;
			};

			this._updateByGroupRange = function (groupRange, level) {
				var i, len, groupInfo, len2, j, cur, delta;

				for (i = 0, len = this._leaves.length; i < len; i++) {
					groupInfo = this._leaves[i].groupInfo;

					//
					// if (groupInfo) {
					//

					if (groupInfo && (groupInfo.level < level)) {

						len2 = (groupInfo.expandInfo)
							? groupInfo.expandInfo.length
							: 0;

						for (j = 0; j < len2; j++) {
							cur = groupInfo.expandInfo[j];
							//
							//if (cur.cr.r1 !== groupRange.cr.r1) {
							//
							delta = (groupRange.position === "headerAndFooter") ? 2 : 1;

							if (cur.cr.r1 >= groupRange.cr.r1 && !((cur.cr.r1 === groupRange.cr.r1) && (cur.position === "footer"))) {
								cur.cr.r1 += delta;
							}

							if (cur.cr.r2 >= groupRange.cr.r1) {
								cur.cr.r2 += delta;
							}
							//
							//}
							//
						}
					}
				}
			};

			this._addIndent = function (cellObj, level) {
				var indent;

				if (level > 0 && (indent = this._grid.options.groupIndent)) {
					cellObj.__style.paddingLeft = (indent * level) + "px";
				}
			};
		}
	});
})(jQuery);
(function ($) {
	"use strict";
	$.extend($.wijmo.wijgrid, {
		groupHelper: function () {

			this.getGroupInfo = function (domRow) {

				if (domRow) {
					if (!$.wijmo.wijgrid._getGroupInfoRegExp) {
						$.wijmo.wijgrid._getGroupInfoRegExp = new RegExp(".*G([HF]){1}(\\d+)-(\\d+)$");
					}

					var info = $.wijmo.wijgrid._getGroupInfoRegExp.exec(domRow.id),
						level, index, isHeader;

					if (info) {
						level = parseInt(info[3], 10);
						index = parseInt(info[2], 10);
						isHeader = (info[1] === "H");

						return {
							level: level,
							index: index,
							isHeader: isHeader,
							toString: function () {
								return (this.isHeader ? "GH" : "GF") + this.index + "-" + this.level;
							}
						};
					}
				}

				return null;
			};

			this.getColumnByGroupLevel = function (leaves, level) {
				var i, len, leaf;

				for (i = 0, len = leaves.length; i < len; i++) {
					leaf = leaves[i];
					if (leaf.groupInfo && (leaf.groupInfo.level === level)) {
						return leaf;
					}
				}

				return null;
			};

			this.getGroupedColumnsCount = function (leaves) {
				var result = 0,
					i, len, groupInfo;

				for (i = 0, len = leaves.length; i < len; i++) {
					groupInfo = leaves[i].groupInfo;
					if (groupInfo && (groupInfo.position === "header" || groupInfo.position === "headerAndFooter" || groupInfo.position === "footer")) {
						result++;
					}
				}

				return result;
			};

			// cellRange cellRange
			// groupRange[] childExpandInfo
			this.getChildGroupIndex = function (cellRange, childExpandInfo) {
				var left = 0,
					right = childExpandInfo.length - 1,
					median, cmp;

				while (left <= right) {
					median = ((right - left) >> 1) + left;
					cmp = childExpandInfo[median].cr.r1 - cellRange.r1;

					if (cmp === 0) {
						return median;
					}

					if (cmp < 0) {
						left = median + 1;
					} else {
						right = median - 1;
					}
				}

				return left;
				//return ~left;
			};

			// cellRange childRange
			// groupRange[] parentExpandInfo
			this.getParentGroupIndex = function (cellRange, parentExpandInfo) {
				var idx = this.getChildGroupIndex(cellRange, parentExpandInfo);

				if (idx > 0) {
					idx--;
				}

				return (idx < parentExpandInfo.length)
					? idx
					: -1;
			};

			// level: 1-based level of the cellRange;
			this.getChildGroupRanges = function (leaves, cellRange, level) {
				var result = [],
					childRanges, childRange, i, len, firstChildIdx,
					childGroupedColumn = this.getColumnByGroupLevel(leaves, level + 1);

				if (childGroupedColumn) {
					childRanges = childGroupedColumn.groupInfo.expandInfo;

					firstChildIdx = this.getChildGroupIndex(cellRange, childRanges);
					for (i = firstChildIdx, len = childRanges.length; i < len; i++) {
						childRange = childRanges[i];
						if (childRange.cr.r2 <= cellRange.r2) {
							result.push(childRange);
						} else {
							break;
						}
					}

					/*for (var i = 0, len = childRanges.length; i < len; i++) {
					if (childRange.cr.r1 >= cellRange.r1 && childRange.r2 <= cellRange.r2) {
					result.push(childRange);
					}
					}*/
				}

				return result;
			};

			// level: 1-based level of the cellRange; optional.
			this.getParentGroupRange = function (leaves, cellRange, level) {
				var i, groupInfo, idx;

				if (level === undefined) {
					level = 0xFFFF;
				}

				if (level - 2 >= 0) {
					for (i = leaves.length - 1; i >= 0; i--) {
						groupInfo = leaves[i].groupInfo;
						if (!groupInfo || !groupInfo.expandInfo || (groupInfo.level < 0) || (groupInfo.level !== level - 1)) {
							continue;
						}

						idx = this.getParentGroupIndex(cellRange, groupInfo.expandInfo);
						if (idx >= 0) {
							return groupInfo.expandInfo[idx];
						}
					}
				}

				return null;
			};

			// level: 1-based level of the cellRange.
			this.isParentCollapsed = function (leaves, cellRange, level) {
				var i, parentGroupRange;

				if (level === 1) {
					return false;
				}

				for (i = level; i > 1; i--) {
					parentGroupRange = this.getParentGroupRange(leaves, cellRange, i);

					if (parentGroupRange && !parentGroupRange.isExpanded) {
						return true;
					}

					cellRange = parentGroupRange.cr;
				}

				return false;
			};

			// level: 1-based level of the cellRange.
			this.isParentExpanded = function (leaves, cellRange, level) {
				var i, parentGroupRange;

				if (level === 1) {
					return true;
				}

				for (i = level; i > 1; i--) {
					parentGroupRange = this.getParentGroupRange(leaves, cellRange, i);

					if (parentGroupRange && parentGroupRange.isExpanded) {
						return true;
					}

					cellRange = parentGroupRange.cr;
				}

				return false;
			};
		}
	});
})(jQuery);(function ($) {
	"use strict";
	$.extend($.wijmo.wijgrid, {
		cellRange: function (row1, col1, row2, col2) {
			switch (arguments.length) {
				case 2:
					this.r1 = this.r2 = row1;
					this.c1 = this.c2 = col1;
					break;
				case 4:
					this.r1 = row1;
					this.r2 = row2;
					this.c1 = col1;
					this.c2 = col2;
					break;
				default:
					this.r1 = 0;
					this.r2 = 0;
					this.c1 = 0;
					this.c2 = 0;
			}

			this.isSingleCell = function () {
				return ((this.r1 === this.r2) && (this.c1 === this.c2));
			};
		},

		merger: function () {
			this.merge = function (data, visibleLeaves) {
				this.leaves = visibleLeaves;
				this.data = data;

				var i, len, leaf;

				for (i = 0, len = visibleLeaves.length; i < len; i++) {
					leaf = visibleLeaves[i];

					if ((leaf.dataIndex >= 0) && !leaf.isBand && (leaf.rowMerge === "free" || leaf.rowMerge === "restricted")) {
						this.mergeColumn(leaf);
					}
				}
				delete this.data;
				delete this.leaves;
			};

			this.mergeColumn = function (column) {
				var dataIdx = column.dataIndex,
					i, len, range, span, spannedRow;

				for (i = 0, len = this.data.length; i < len; i++) {
					//if (this.data[i].rowType !== "data") {
					if (!(this.data[i].rowType & $.wijmo.wijgrid.rowType.data)) {
						continue;
					}

					range = this.getCellRange(i, column);

					if (range.r1 !== range.r2) {
						span = range.r2 - range.r1 + 1;
						//this.data[range.r1][dataIdx].rowSpan = span;
						this.data[range.r1][dataIdx].__attr.rowSpan = span;

						for (spannedRow = range.r1 + 1; spannedRow <= range.r2; spannedRow++) {
							//this.data[spannedRow][dataIdx] = null;
							this.data[spannedRow][dataIdx].visible = false;
						}
					}

					i = range.r2;
				}
			};

			this.getCellRange = function (rowIdx, column) {
				var columnIdx = column.dataIndex,
					range = new $.wijmo.wijgrid.cellRange(rowIdx, columnIdx),
					str = this.data[rowIdx][columnIdx].value,
					dataLen = this.data.length,
					dataItem, leafIdx, prevLeaf, range2;

				for (range.r2 = rowIdx; range.r2 < dataLen - 1; range.r2++) {
					dataItem = this.data[range.r2 + 1];

					//if ((dataItem.rowType !== "data") || (dataItem[columnIdx].value !== str)) {
					if (!(dataItem.rowType & $.wijmo.wijgrid.rowType.data) || (dataItem[columnIdx].value !== str)) {
						break;
					}
				}

				leafIdx = column.leavesIdx; // $.inArray(column, this.leaves);
				if (leafIdx > 0 && column.rowMerge === "restricted") {
					prevLeaf = this.leaves[leafIdx - 1];
					if (prevLeaf.dataIndex >= 0) {
						range2 = this.getCellRange(rowIdx, prevLeaf);
						range.r1 = Math.max(range.r1, range2.r1);
						range.r2 = Math.min(range.r2, range2.r2);
					}
				}

				return range;
			};
		}
	});
})(jQuery);(function ($) {
	"use strict";
	$.extend($.wijmo.wijgrid, {
		/// <summary>
		/// Row type.
		/// </summary>
		rowType: {
			/// <summary>
			/// Header row.
			/// </summary>
			header: 1,

			/// <summary>
			/// Data row.
			/// </summary>
			data: 2,

			/// <summary>
			/// Data alternating row (used only as modifier of the rowType.data, not as independent value).
			/// </summary>
			dataAlt: 4,

			/// <summary>
			/// Filter row.
			/// </summary>
			filter: 8,

			/// <summary>
			/// Group header row.
			/// </summary>
			groupHeader: 16,

			/// <summary>
			/// Group footer row.
			/// </summary>
			groupFooter: 32,

			/// <summary>
			/// Footer row.
			/// </summary>
			footer: 64,

			/// <summary>
			/// Empty data row
			/// </summary>
			emptyDataRow: 128
		},

		/// <summary>
		/// Determines an object render state.
		/// </summary>
		renderState: {
			/// <summary>
			/// Normal state.
			/// </summary>
			none: 0,

			/// <summary>
			/// Object is being rendered.
			/// </summary>
			rendering: 1,

			/// <summary>
			/// Object is one of the elements determining the current position of the wijgrid.
			/// </summary>
			current: 2,

			/// <summary>
			/// Object is hovered.
			/// </summary>
			hovered: 4,

			/// <summary>
			/// Object is selected.
			/// </summary>
			selected: 8
		},

		/// <summary>
		/// Determines purpose of the group row cells.
		/// </summary>
		groupRowCellPurpose: {
			groupCell: 0,
			aggregateCell: 1
		},

		stringFormat: function (value, params) {
			var i, len;

			if (!value) {
				return "";
			}

			for (i = 1, len = arguments.length; i < len; i++) {
				value = value.replace(new RegExp("\\{" + (i - 1) + "\\}", "gm"), arguments[i]);
			}

			return value;
		},

		validDataKey: function (dataKey) {
			return (dataKey && !(dataKey < 0)) || (dataKey === 0);
		},

		iterateChildrenWidgets: function (item, callback) {
			if (item && callback) {
				if (item.nodeType) {
					item = $(item);
				}

				item.find(".ui-widget").each(function (domIndex, domValue) {
					$.each($(domValue).data(), function (dataKey, dataValue) {
						if (dataValue.widgetName) {
							callback(domIndex, dataValue);
						}
					});
				});
			}
		},

		remove$dataByPrefix: function ($element, prefix) {
			var data$keys = [];

			$.each($element.data(), function (key) {
				if (key.indexOf(prefix) === 0) {
					data$keys.push(key);
				}
			});

			$.each(data$keys, function (idx, key) {
				$element.removeData(key);
			});
		},

		domSelection: function (dom) {
			// The 'dom' must be an input element
			this.getSelection = function () {
				var start = 0,
					end = 0,
					textRange;

				if (dom.selectionStart !== undefined) { // DOM3
					start = dom.selectionStart;
					end = dom.selectionEnd;
				} else {
					if (document.selection) { // IE
						textRange = document.selection.createRange().duplicate();
						end = textRange.text.length; // selection length
						start = Math.abs(textRange.moveStart("character", -dom.value.length)); // move selection to the beginning
						end += start;
					}
				}

				return { start: start, end: end, length: end - start };
			};

			// The 'dom' must be an input element
			this.setSelection = function (range) {
				if (dom.selectionStart !== undefined) { // DOM3
					dom.setSelectionRange(range.start, range.end);
				} else { // IE
					var textRange = dom.createTextRange();

					textRange.collapse(true);
					textRange.moveStart("character", range.start);
					textRange.moveEnd("character", range.end);
					textRange.select();
				}
			};

			this.toggleSelection = function (enable) {
				if (enable) {
					$(dom)
						.enableSelection()
						.css({ "MozUserSelect": "", "WebkitUserSelect": "" });
				} else {
					$(dom)
						.disableSelection()
						.css({ "MozUserSelect": "none", "WebkitUserSelect": "none" });
				}
			};
		},

		createDynamicField: function (options) {
			return $.extend(true,
								{},
								$.wijmo.c1basefield.prototype.options,
								$.wijmo.c1field.prototype.options,
								{ dynamic: true, isLeaf: true, isBand: false, parentIdx: -1 },
								options
							);
		},

		bounds: function (element, client) {
			if (element) {
				var $dom = element.nodeType ? $(element) : element,
					offset = $dom.offset();

				if (offset) {
					if (client) {
						return { top: offset.top, left: offset.left, width: $dom[0].clientWidth || 0, height: $dom[0].clientHeight || 0 };
					}

					return { top: offset.top, left: offset.left, width: $dom.outerWidth(), height: $dom.outerHeight() };
				}
			}

			return null;
		},

		_getDOMText: function (domElement, controlDepth, depth) {
			if (depth === undefined) {
				depth = 0;
			}

			if (domElement && (!controlDepth || (controlDepth && depth < 2))) {
				if (domElement.nodeType === 3) { // text node
					return domElement.nodeValue;
				}
				else
					if (domElement.nodeType === 1) { // element node

						switch (domElement.type) {
							case "button":
							case "text":
							case "textarea":
							case "select-one":
								return domElement.value;
							case "checkbox":
								return domElement.checked.toString();
						}

						var result = "",
							i;

						for (i = 0; domElement.childNodes[i]; i++) {
							result += this._getDOMText(domElement.childNodes[i], controlDepth, depth + 1);
						}
						return result;
					}
			}

			return "";
		},

		ensureTBody: function (domTable) {
			if (domTable) {
				return (domTable.tBodies && domTable.tBodies.length > 0)
					? domTable.tBodies[0]
					: domTable.appendChild(document.createElement("tbody"));
			}

			return null;
		},

		rowTypeFromCss: function ($rows) {
			var test = /wijmo-wijgrid-(\S+)row/.exec($rows.attr("class"));

			if (test) {
				switch (test[1]) {
					case "header":
						return $.wijmo.wijgrid.rowType.header;

					case "filter":
						return $.wijmo.wijgrid.rowType.filter;

					case "data":
						if ($rows.hasClass("wijmo-wijgrid-alternatingrow")) {
							return $.wijmo.wijgrid.rowType.data | $.wijmo.wijgrid.rowType.dataAlt;
						}
						return $.wijmo.wijgrid.rowType.data;

					case "alternating":
						return $.wijmo.wijgrid.rowType.data | $.wijmo.wijgrid.rowType.dataAlt;

					case "groupheader":
						return $.wijmo.wijgrid.rowType.groupHeader;

					case "groupheader":
						return $.wijmo.wijgrid.rowType.groupFooter;
				}
			}
		},

		// deep (boolean, opt), obj, prefix, name (opt), value(s) (opt)
		dataPrefix: function () {
			var len = arguments.length,
				key, value, internalName,
				deep = (typeof (arguments[0]) === "boolean"),
				obj = deep ? arguments[1] : arguments[0],
				is$ = (obj.nodeType === undefined),
				foo, i, currentVal;

			if (len === 3) { // getter
				internalName = arguments[1] + arguments[2];
				return (is$)
					? $.data(obj[0], internalName)
					: $.data(obj, internalName);
			} else { // setter
				if (deep) {
					value = arguments[3];

					for (key in value) {
						currentVal = value[key];
						if (value.hasOwnProperty(key)) {
							internalName = arguments[2] + key;
							if (is$) {
								for (i = 0, len = obj.length; i < len; i++) {
									foo = $.data(obj[i], internalName, currentVal);
								}
							} else {
								$.data(obj, internalName, currentVal);
							}
						}
					}
				} else {
					internalName = arguments[1] + arguments[2];
					currentVal = arguments[3];

					if (is$) {
						for (i = 0, len = obj.length; i < len; i++) {
							foo = $.data(obj[i], internalName, currentVal);
						}
						return foo;
					} else {
						return $.data(obj, internalName, currentVal);
					}
				}
			}
		},

		shallowMerge: function (target, src) {
			if (src && target) {
				var name, value, typeOf;

				for (name in src) {
					if (src.hasOwnProperty(name)) {
						value = src[name];
						typeOf = typeof (value);

						if ((typeOf === "string" || typeOf === "boolean" || typeOf === "number") && (target[name] === undefined)) {
							target[name] = value;
						}
					}
				}
			}
		},

		isCustomObject: function (value) {
			return (value && (typeof (value) === "object") && !(value instanceof Date));
		},

		search: function (value, test) {
			var key, foo,
				isFunc = $.isFunction(test);

			for (key in value) {
				if (value.hasOwnProperty(key)) {

					foo = isFunc
						? test(value[key])
						: (value[key] === test);

					if (foo === true) {
						return {
							at: key,
							found: value[key]
						};
					}
				}
			}

			return {
				at: null,
				found: null
			};
		},

		getAttributes: function (dom, prevent) {
			if (dom) {
				var	i, len,
					cnt = 0,
					result = {},
					attrValue, attrName;

				for (i = 0, len = dom.attributes.length; i < len; i++) {
					attrName = dom.attributes[i].name;
					if (attrName && (!prevent || !prevent(attrName))) {
						attrValue = dom.getAttribute(attrName);

						if (attrName === "style") {
							attrValue = (typeof (attrValue) === "object")
								? attrValue.cssText
								: attrValue;
						}

						if (!attrValue && attrName === "class") {
							attrValue = dom.getAttribute("className");
						}

						if (attrValue && (typeof (attrValue) !== "function")) {
							result[attrName] = attrValue;
							cnt++;
						}
					}
				}

				if (cnt) {
					return result;
				}
			}

			return null;
		}
	});


	/*$.extend($.wijmo.wijgrid, {
	measurments: [],

	timerOn: function (cat) {
	this.measurments[cat] = new Date().getTime();
	},

	timerOff: function (cat) {
	var result = (new Date().getTime() - this.measurments[cat]) / 1000;
	delete this.measurments[cat];
	return result;
	},
	});*/
})(jQuery);(function ($) {
	"use strict";

	$.extend($.wijmo.wijgrid, {
		embeddedParsers: {
			stringParser: {
				// DOM -> string
				parseDOM: function (value, culture, format, nullString, convertEmptyStringToNull) {
					return this.parse($.wijmo.wijgrid._getDOMText(value, true), culture, format, nullString, convertEmptyStringToNull);
				},

				// string -> string
				parse: function (value, culture, format, nullString, convertEmptyStringToNull) {
					switch (value) {
						case null:
							return null;

						case nullString:
							if (convertEmptyStringToNull) {
								return null;
							}

						case undefined:
						case "&nbsp":
							return "";

						default:
							return "" + value;
					}
				},

				// string -> string
				toStr: function (value, culture, format, nullString, convertEmptyStringToNull) {
					if (value === null && convertEmptyStringToNull) {
						return nullString;
					}
					return "" + value;
				}
			},

			numberParser: {
				// DOM -> number
				parseDOM: function (value, culture, format, nullString, convertEmptyStringToNull) {
					return this.parse($.wijmo.wijgrid._getDOMText(value, true), culture, format, nullString, convertEmptyStringToNull);
				},

				// string\ number -> number
				parse: function (value, culture, format, nullString, convertEmptyStringToNull) {
					var type = typeof (value);

					if (type === "number") {
						return isNaN(value)
							? NaN
							: value;
					}

					if ((!value && value !== 0) || (value === "&nbsp;") || (value === nullString && convertEmptyStringToNull)) {
						return null;
					}

					return $.parseFloat(value, 10, culture.name);
				},

				// number -> string
				toStr: function (value, culture, format, nullString, convertEmptyStringToNull) {
					if (value === null && convertEmptyStringToNull) {
						return nullString;
					}

					return $.format(value, format ? format : "n", culture.name);
				}
			},

			currencyParser: {
				// DOM -> number
				parseDOM: function (value, culture, format, nullString, convertEmptyStringToNull) {
					return this.parse($.wijmo.wijgrid._getDOMText(value, true), culture, format, nullString, convertEmptyStringToNull);
				},

				// string\ number -> number
				parse: function (value, culture, format, nullString, convertEmptyStringToNull) {
					var type = typeof (value);

					if (type === "number") {
						return isNaN(value)
							? NaN
							: value;
					}

					if ((!value && value !== 0) || (value === "&nbsp;") || (value === nullString && convertEmptyStringToNull)) {
						return null;
					}

					if (type === "string") {
						value = value.replace(culture.numberFormat.currency.symbol, "");
					}

					return $.parseFloat(value, 10, culture.name);
				},

				// number -> string (currency)
				toStr: function (value, culture, format, nullString, convertEmptyStringToNull) {
					if (value === null && convertEmptyStringToNull) {
						return nullString;
					}

					return $.format(value, format ? format : "c", culture.name);
				}
			},

			dateTimeParser: {
				// DOM -> datetime
				parseDOM: function (value, culture, format, nullString, convertEmptyStringToNull) {
					return this.parse($.wijmo.wijgrid._getDOMText(value, true), culture, format, nullString, convertEmptyStringToNull);
				},

				// string/ datetime -> datetime
				parse: function (value, culture, format, nullString, convertEmptyStringToNull) {
					var match;

					if (value instanceof Date) {
						return value;
					}

					if (!value || (value === "&nbsp;") || (value === nullString && convertEmptyStringToNull)) {
						return null;
					}

					match = /^\/Date\((\d+)\)\/$/.exec(value);
					if (match) {
						return new Date(parseInt(match[1], 10));
					}

					return $.parseDate(value, format, culture.name);
				},

				// datetime -> string
				toStr: function (value, culture, format, nullString, convertEmptyStringToNull) {
					if (value === null && convertEmptyStringToNull) {
						return nullString;
					}

					return $.format(value, format ? format : "d", culture.name);
				}
			},

			boolParser: {
				// DOM -> bool
				parseDOM: function (value, culture, format, nullString, convertEmptyStringToNull) {
					return this.parse($.wijmo.wijgrid._getDOMText(value, true), culture, format, nullString, convertEmptyStringToNull);
				},

				// string\ bool -> bool
				parse: function (value, culture, format, nullString, convertEmptyStringToNull) {
					var valType = typeof (value);

					if (valType === "boolean") {
						return value;
					}

					if (valType === "string") {
						value = $.trim(value);
					}

					if (!value || (value === "&nbsp;") || (value === nullString && convertEmptyStringToNull)) {
						return null;
					}

					switch (value.toLowerCase()) {
						case "true":
							return true;

						case "false":
							return false;
					}

					return NaN;
				},

				// bool -> string
				toStr: function (value, culture, format, nullString, convertEmptyStringToNull) {
					if (value === null && convertEmptyStringToNull) {
						return nullString;
					}

					return (value) ? "true" : "false";
				}
			}
		}
	});
})(jQuery);(function ($) {
	"use strict";
	$.extend($.wijmo.wijgrid, {
		filterOperatorsCache: function () {
			var _cache = {};

			this.add = function (operator) {
				if (operator && operator.name && operator.operator) {
					var name = operator.name.toLowerCase();
					if (!_cache[name]) {
						_cache[name] = operator;
					}
				}
			};

			this.clear = function () {
				_cache.length = 0;
			};

			this.getByName = function (name) {
				return _cache[name.toLowerCase()];
			};

			this.getByDataType = function (dataType) {
				var result = [],
					name, operator;

				for (name in _cache) {
					if (_cache.hasOwnProperty(name)) {
						operator = _cache[name];

						if ($.inArray(dataType, operator.applicableTo) >= 0) {
							result.push(operator);
						}
					}
				}

				return result;
			};

			this.removeCustom = function () {
				var name;

				for (name in _cache) {
					if (_cache[name].custom) {
						delete _cache[name];
					}
				}
			};

			this.sort = function (filtersArray, mode) {
				switch (mode.toLowerCase()) {
					case "alphabetical":
						filtersArray.sort(sortAlpha);
						break;
					case "alphabeticalcustomfirst":
						filtersArray.sort(sortAlphaCustomFirst);
						break;

					case "alphabeticalembeddedFirst":
						filtersArray.sort(sortAlphaEmbeddedFirst);
						break;

					case "none": // do nothing
						break;

					default:
						break;
				}

				return filtersArray;
			};

			function sortAlpha(a, b) {
				var n1 = a.name.toLowerCase(),
					n2 = b.name.toLowerCase();

				if (n1 !== n2) {
					if (n1 === "nofilter") {
						return -1;
					}

					if (n2 === "nofilter") {
						return 1;
					}
				}

				if (n1 === n2) {
					return 0;
				}

				return (n1 < n2)
					? -1
					: 1;
			}

			function sortAlphaEmbeddedFirst(a, b) {
				var n1 = a.name.toLowerCase(),
					n2 = b.name.toLowerCase();

				if (n1 !== n2) {
					if (n1 === "nofilter") {
						return -1;
					}

					if (n2 === "nofilter") {
						return 1;
					}
				}

				if (a.custom !== b.custom) {
					if (a.custom) {
						return 1;
					}

					if (b.custom) {
						return -1;
					}
				}

				if (n1 === n2) {
					return 0;
				}

				return (n1 < n2)
					? -1
					: 1;
			}

			function sortAlphaCustomFirst(a, b) {
				var n1 = a.name.toLowerCase(),
					n2 = b.name.toLowerCase();

				if (n1 !== n2) {
					if (n1 === "nofilter") {
						return -1;
					}

					if (n2 === "nofilter") {
						return 1;
					}
				}

				if (a.custom !== b.custom) {
					if (a.custom) {
						return -1;
					}

					if (b.custom) {
						return 1;
					}
				}

				if (n1 === n2) {
					return 0;
				}

				return (n1 < n2)
					? -1
					: 1;
			}
		}
	});

	$.wijmo.wijgrid.embeddedFilters = [
	{
		name: "NoFilter",
		arity: 1,
		applicableTo: ["string", "number", "datetime", "currency", "boolean"],
		operator: function (dataVal) {
			return true;
		}
	},
	{
		name: "Contains",
		arity: 2,
		applicableTo: ["string"],
		operator: function (dataVal, filterVal) {
			if (dataVal === filterVal) { // handle null and undefined
				return true;
			}

			return (dataVal)
				? dataVal.indexOf(filterVal) >= 0
				: false;
		}
	},
	{
		name: "NotContain",
		arity: 2,
		applicableTo: ["string"],
		operator: function (dataVal, filterVal) {
			if (dataVal === filterVal) { // handle null and undefined
				return false;
			}

			return (dataVal)
				? dataVal.indexOf(filterVal) < 0
				: true;
		}
	},
	{
		name: "BeginsWith",
		arity: 2,
		applicableTo: ["string"],
		operator: function (dataVal, filterVal) {
			if (dataVal === filterVal) { // handle null and undefined
				return true;
			}

			return (dataVal)
				? dataVal.indexOf(filterVal) === 0
				: false;
		}
	},
	{
		name: "EndsWith",
		arity: 2,
		applicableTo: ["string"],
		operator: function (dataVal, filterVal) {
			if (dataVal === filterVal) { // handle null and undefined
				return true;
			}

			if (dataVal) {
				var idx = dataVal.lastIndexOf(filterVal);

				return (idx >= 0)
					? (dataVal.length - idx) === filterVal.length
					: false;
			}

			return false;
		}
	},
	{
		name: "Equals",
		arity: 2,
		applicableTo: ["string", "number", "datetime", "currency", "boolean"],
		operator: function (dataVal, filterVal) {
			if (dataVal instanceof Date) {
				dataVal = dataVal.getTime();
			}

			if (filterVal instanceof Date) {
				filterVal = filterVal.getTime();
			}

			return dataVal === filterVal;
		}
	},
	{
		name: "NotEqual",
		arity: 2,
		applicableTo: ["string", "number", "datetime", "currency", "boolean"],
		operator: function (dataVal, filterVal) {
			if (dataVal instanceof Date) {
				dataVal = dataVal.getTime();
			}

			if (filterVal instanceof Date) {
				filterVal = filterVal.getTime();
			}

			return dataVal !== filterVal;
		}
	},
	{
		name: "Greater",
		arity: 2,
		applicableTo: ["string", "number", "datetime", "currency", "boolean"],
		operator: function (dataVal, filterVal) {
			if (dataVal instanceof Date) {
				dataVal = dataVal.getTime();
			}

			if (filterVal instanceof Date) {
				filterVal = filterVal.getTime();
			}

			return dataVal > filterVal;
		}
	},
	{
		name: "Less",
		arity: 2,
		applicableTo: ["string", "number", "datetime", "currency", "boolean"],
		operator: function (dataVal, filterVal) {
			if (dataVal instanceof Date) {
				dataVal = dataVal.getTime();
			}

			if (filterVal instanceof Date) {
				filterVal = filterVal.getTime();
			}

			return dataVal < filterVal;
		}
	},
	{
		name: "GreaterOrEqual",
		arity: 2,
		applicableTo: ["string", "number", "datetime", "currency", "boolean"],
		operator: function (dataVal, filterVal) {
			if (dataVal instanceof Date) {
				dataVal = dataVal.getTime();
			}

			if (filterVal instanceof Date) {
				filterVal = filterVal.getTime();
			}

			return dataVal >= filterVal;
		}
	},
	{
		name: "LessOrEqual",
		arity: 2,
		applicableTo: ["string", "number", "datetime", "currency", "boolean"],
		operator: function (dataVal, filterVal) {
			if (dataVal instanceof Date) {
				dataVal = dataVal.getTime();
			}

			if (filterVal instanceof Date) {
				filterVal = filterVal.getTime();
			}

			return dataVal <= filterVal;
		}
	},
	{
		name: "IsEmpty",
		arity: 1,
		applicableTo: ["string"],
		operator: function (dataVal) {
			return !dataVal && dataVal !== 0 && dataVal !== false;
		}
	},
	{
		name: "NotIsEmpty",
		arity: 1,
		applicableTo: ["string"],
		operator: function (dataVal) {
			return !!dataVal || dataVal === 0 || dataVal === false;
		}
	},
	{
		name: "IsNull",
		arity: 1,
		applicableTo: ["string", "number", "datetime", "currency", "boolean"],
		operator: function (dataVal) {
			return dataVal === null;
		}
	},
	{
		name: "NotIsNull",
		arity: 1,
		applicableTo: ["string", "number", "datetime", "currency", "boolean"],
		operator: function (dataVal) {
			return dataVal !== null;
		}
	}
];
})(jQuery);(function ($) {
	"use strict";
	$.extend($.wijmo.wijgrid, {
		htmlTableAccessor: function (domTable) {
			var offsets = [],
				width = 0,
				table = domTable;

			_buildOffsets();

			function _buildOffsets() {
				var rowSpan = [],
					rowOffsets, i, rowLen, row, j, jOffset, celLen, cell, cs, rowSpanLen;

				for (i = 0, rowLen = table.rows.length; i < rowLen; i++) {
					rowOffsets = [];
					offsets[i] = rowOffsets;

					row = table.rows[i];
					for (j = 0, jOffset = 0, celLen = row.cells.length; j < celLen; j++, jOffset++) {
						cell = row.cells[j];

						// process rowspan
						for (; rowSpan[jOffset] > 1; jOffset++) {
							rowSpan[jOffset]--;
							rowOffsets[jOffset] = { cellIdx: -1, colIdx: -1 };
						}

						if (!(rowSpan[jOffset] > 1)) {
							rowSpan[jOffset] = cell.rowSpan;
						}

						rowOffsets[jOffset] = { cellIdx: j, colIdx: -1 };
						rowOffsets[j].colIdx = jOffset;

						// process colspan
						cs = cell.colSpan;
						for (; cs > 1; cs--) {
							rowOffsets[++jOffset] = { cellIdx: -1, colIdx: -1 };
						}
					}

					rowSpanLen = rowSpan.length;
					for (; jOffset < rowSpanLen; jOffset++) {
						rowSpan[jOffset]--;
						rowOffsets[jOffset] = { cellIdx: -1, colIdx: -1 };
					}

					width = Math.max(width, rowSpanLen);
				}
			}

			this.element = function () {
				return domTable;
			};

			this.getCellIdx = function (colIdx, rowIdx) {
				return (colIdx < width)
					? offsets[rowIdx][colIdx].cellIdx
					: -1;
			};

			// arguments:
			// (cellIdex, rowIdx)
			// or
			// (domCell)
			this.getColumnIdx = function (cellIdx, rowIdx) {
				if (typeof (cellIdx) !== "number") { // domCell
					var domCell = cellIdx;

					cellIdx = domCell.cellIndex;
					rowIdx = domCell.parentNode.rowIndex;
				}

				return (cellIdx < width)
					? offsets[rowIdx][cellIdx].colIdx
					: -1;
			};

			// section:
			// 1 - tHead
			// 2 - tBody
			// 3 - tFoot
			// otherwise - table
			this.getSectionLength = function (section) {
				return $.wijmo.wijgrid.getTableSectionLength(table, section);
			};

			// section:
			// 1 - tHead
			// 2 - tBody
			// 3 - tFoot
			// otherwise - table
			this.getSectionRow = function (rowIndex, section) {
				return $.wijmo.wijgrid.getTableSectionRow(table, section, rowIndex);
			};

			// iterates through the table rows using natural cells order
			this.forEachColumnCellNatural = function (columnIdx, callback, param) {
				var i, rowLen, row, result;

				for (i = 0, rowLen = table.rows.length; i < rowLen; i++) {
					row = table.rows[i];

					if (columnIdx < row.cells.length) {
						result = callback(row.cells[columnIdx], columnIdx, param);
						if (result !== true) {
							return result;
						}
					}
				}

				return true;
			};

			// iterates through the table rows using colSpan\rowSpan offsets
			this.forEachColumnCell = function (columnIdx, callback, param) {
				var i, rowLen, row, offsetCellIdx, result;

				for (i = 0, rowLen = offsets.length; i < rowLen; i++) {
					row = table.rows[i];

					offsetCellIdx = this.getCellIdx(columnIdx, i);
					if (offsetCellIdx >= 0) {
						result = callback(row.cells[offsetCellIdx], i, param);
						if (result !== true) {
							return result;
						}
					}
				}

				return true;
			};

			// iterates throw the cells of a table row
			this.forEachRowCell = function (rowIndex, callback, param) {
				var row = table.rows[rowIndex],
					i, celLen, result;

				for (i = 0, celLen = row.cells.length; i < celLen; i++) {
					result = callback(row.cells[i], i, param);
					if (result !== true) {
						return result;
					}
				}

				return true;
			};

			this.colGroupTag = function () {
				var cgs = table.getElementsByTagName("colgroup");

				return (cgs !== null && cgs.length > 0) ? cgs[0] : null;
			};

			this.colTags = function () {
				var colGroup = this.colGroupTag();

				return (colGroup !== null) ? colGroup.getElementsByTagName("col") : [];
			};
		}
	});
})(jQuery);(function ($) {
	"use strict";
	$.wijmo.wijgrid.cellInfo = function (cellIndex, rowIndex) {
		/// <summary>
		/// Object that represents a single cell.
		/// Code example: var cell = new $.wijmo.wijgrid.cellInfo(0, 0);
		/// </summary>
		/// <param name="cellIndex">Zero-based index of the required cell inside the corresponding row.</param>
		/// <param name="rowIndex">Zero-based index of the row that contains required cell.</param>
		/// <returns type="$.wijmo.wijgrid.cellInfo">Object that represents a single cell.</returns>

		var _isEdit = false,
			_gridView = null;

		// public
		this.cellIndex = function (value) {
			/// <summary>
			/// Gets the zero-based index of the cell in the row which it corresponds to.
			/// Code example: var index = cellInfoObj.cellIndex();
			/// </summary>
			/// <returns type="Number" integer="true"></returns>

			if (arguments.length === 0) {
				return cellIndex;
			}

			cellIndex = value;
		};

		this.column = function () {
			/// <summary>
			/// Gets the associated column object.
			/// Code example: var index = cellInfoObj.column();
			/// </summary>
			/// <returns type="Object"></returns>

			if (_gridView && this._isValid()) {
				var offset = _gridView._getDataToAbsOffset();

				return _gridView._field("visibleLeaves")[cellIndex + offset.x];
			}

			return null;
		};


		this.rowIndex = function (value) {
			/// <summary>
			/// Gets the zero-based index of the row containing the cell.
			/// Code example: var index = cellInfoObj.rowIndex();
			/// </summary>
			/// <returns type="Number" integer="true"></returns>

			if (arguments.length === 0) {
				return rowIndex;
			}

			rowIndex = value;
		};

		this.isEqual = function (value) {
			/// <summary>
			/// Compares the current object with a specified one and indicates whether they are identical.
			/// Code example: var isEqual = cellInfoObj1.isEqual(cellInfoObj2);
			/// </summary>
			/// <param name="value" type="$.wijmo.wijgrid.cellInfo">Object to compare</param>
			/// <returns type="Boolean">True if the objects are identical, otherwise false.</returns>
			return (value && (value.rowIndex() === rowIndex) && (value.cellIndex() === cellIndex));
		};

		this.tableCell = function () {
			/// <summary>
			/// Returns the table cell element corresponding to this object.
			/// Code example: var domCell = cellInfoObj.tableCell();
			/// </summary>
			/// <returns type="Object" domElement="true" />
			if (_gridView && this._isValid()) {
				var offset = _gridView._getDataToAbsOffset();

				return _gridView._view().getCell(cellIndex + offset.x, rowIndex + offset.y);
			}

			return null;
		};

		this.container = function () {
			/// <summary>
			/// Returns the jQuery object containing a cell content.
			/// Code example: var $container = cellInfoObj.container();
			/// </summary>
			/// <returns type="jQuery" />
			var tableCell = this.tableCell(),
				$innerDiv;

			if (tableCell) {
				$innerDiv = $(tableCell).children("div.wijmo-wijgrid-innercell");
				if ($innerDiv) {
					return $innerDiv;
				}
			}

			return null;
		};

		this.value = function (value/*opt*/) {
			/// <summary>
			/// Gets or sets underlying cell data.
			/// Code example:
			/// -) Getter:
			///   var value = cellInfoObj.value();
			/// -) Setter:
			///   cellInfoObj.value("value");
			/// </summary>
			/// <param name="value" type="Object">Value to set.</param>
			/// <returns type="Object" />
			/// <remarks>
			/// "invalid value" exception will be thrown by the setter if the value does not correspond to associated column.
			/// </remarks>
			var column, dataTableRow;

			if (_gridView && this._isValid()) {
				dataTableRow = _gridView.dataTable[rowIndex];
				if (dataTableRow.rowType & $.wijmo.wijgrid.rowType.data) {
					column = this.column();

					if (arguments.length === 0) { // getter
						return dataTableRow[/*cellIndex*/column.dataIndex].value;
					} else { // setter
						// validation
						value = _gridView._parse(column, value);

						if ((value === null && column.valueRequired) ||
						(column.dataType && column.dataType !== "string" && isNaN(value))) {
							throw "invalid value";
						}

						dataTableRow[column.dataIndex].value = value;
						_gridView._dataStore.updateValue(dataTableRow.originalRowIndex, column.dataKey, value);
					}
				}
			}
		};

		this.row = function () {
			/// <summary>
			/// Gets the accociated row's information.
			/// </summary>
			/// <returns type="object">
			/// Information about associated row.
			/// 
			/// The return value has the following properties:
			/// $rows: jQuery object that represents associated rows.
			/// data: associated data.
			/// dataRowIndex: data row index.
			/// dataItemIndex: data item index.
			/// virtualDataItemIndex: virtual data item index.
			/// type: type of the row, one of the $.wijmo.wijgrid.rowType values.
			/// </returns>

			var rowObj = this._row();

			if (rowObj !== null) {
				rowObj = _gridView._createRowInfo(rowObj);
				return rowObj;
			}

			return null;
		};

		this.toString = function () {
			return cellIndex + ":" + rowIndex;
		};

		// * public

		// internal

		this._dataToAbs = function (offset) {
			cellIndex -= offset.x;
			rowIndex -= offset.y;

			return this;
		};

		this._clip = function (range) {
			var flag = false,
				val;

			if (cellIndex < (val = range.topLeft().cellIndex())) {
				flag = true;
				cellIndex = val;
			}

			if (cellIndex > (val = range.bottomRight().cellIndex())) {
				flag = true;
				cellIndex = val;
			}

			if (rowIndex < (val = range.topLeft().rowIndex())) {
				flag = true;
				rowIndex = val;
			}

			if (rowIndex > (val = range.bottomRight().rowIndex())) {
				flag = true;
				rowIndex = val;
			}

			return flag;
		};

		this._clone = function () {
			return new $.wijmo.wijgrid.cellInfo(cellIndex, rowIndex);
		};

		this._row = function () {
			if (_gridView && this._isValid()) {
				return _gridView._rows().item(rowIndex);
			}

			return null;
		};

		this._isValid = function () {
			return cellIndex >= 0 && rowIndex >= 0;
		};

		this._isEdit = function (value) {
			if (!arguments.length) {
				return _isEdit;
			}

			_isEdit = value;
		};

		this._setGridView = function (value) {
			_gridView = value;
		};

		// internal *
	};

	$.wijmo.wijgrid.cellInfo.prototype.outsideValue = new $.wijmo.wijgrid.cellInfo(-1, -1);

	$.wijmo.wijgrid.cellInfoRange = function (topLeft, bottomRight) {
		/// <summary>
		/// Specifies a range of cells determined by two cells.
		/// Code example: var range = $.wijmo.wijgrid.cellInfoRange(new $.wijmo.wijgrid.cellInfo(0, 0), new $.wijmo.wijgrid.cellInfo(0, 0));
		/// </summary>
		/// <param name="topLeft" type="$.wijmo.wijgrid.cellInfo">Object that represents the top left cell of the range.</param>
		/// <param name="bottomRight" type="$.wijmo.wijgrid.cellInfo">Object that represents the bottom right cell of the range.</param>
		/// <returns type="$.wijmo.wijgrid.cellInfoRange"></returns>

		if (!topLeft || !bottomRight) {
			throw "invalid arguments";
		}

		var _topLeft = topLeft._clone(),
			_bottomRight = bottomRight._clone();

		// public 

		this.bottomRight = function () {
			/// <summary>
			/// Gets the object that represents the bottom right cell of the range.
			/// Code example: var cellInfoObj = range.bottomRight();
			/// </summary>
			/// <returns type="$.wijmo.wijgrid.cellInfo" />
			return _bottomRight;
		};

		this.isEqual = function (range) {
			/// <summary>
			/// Compares the current range with a specified range and indicates whether they are identical.
			/// Code example: var isEqual = range1.isEqual(range2);
			/// </summary>
			/// <param name="range" type="$.wijmo.wijgrid.cellInfoRange">Range to compare.</param>
			/// <returns type="Boolean">True if the ranges are identical, otherwise false.</returns>
			return (range && _topLeft.isEqual(range.topLeft()) && _bottomRight.isEqual(range.bottomRight()));
		};

		this.topLeft = function () {
			/// <summary>
			/// Gets the object that represents the top left cell of the range.
			/// Code example: var cellInfoObj = range.topLeft();
			/// </summary>
			/// <returns type="$.wijmo.wijgrid.cellInfo" />
			return _topLeft;
		};

		this.toString = function () {
			return _topLeft.toString() + " - " + _bottomRight.toString();
		};

		// public *

		// internal
		this._isIntersect = function (range) {
			var rangeH, thisH, rangeW, thisW;

			if (range) {
				rangeH = range.bottomRight().rowIndex() - range.topLeft().rowIndex() + 1;
				thisH = _bottomRight.rowIndex() - _topLeft.rowIndex() + 1;

				if ((range.topLeft().rowIndex() + rangeH) - _topLeft.rowIndex() < rangeH + thisH) {
					rangeW = range.bottomRight().cellIndex() - range.topLeft().cellIndex() + 1;
					thisW = _bottomRight.cellIndex() - _topLeft.cellIndex() + 1;

					return ((range.topLeft().cellIndex() + rangeW) - _topLeft.cellIndex() < rangeW + thisW);
				}
			}

			return false;
		};

		this._isValid = function () {
			return _topLeft._isValid() && _bottomRight._isValid();
		};

		this._clip = function (clipBy) {
			return _topLeft._clip(clipBy) | _bottomRight._clip(clipBy);
		};

		this._clone = function () {
			return new $.wijmo.wijgrid.cellInfoRange(_topLeft._clone(), _bottomRight._clone());
		};

		this._containsCellInfo = function (info) {
			return (info && info.cellIndex() >= _topLeft.cellIndex() && info.cellIndex() <= _bottomRight.cellIndex() &&
				info.rowIndex() >= _topLeft.rowIndex() && info.rowIndex() <= _bottomRight.rowIndex());
		};

		this._containsCellRange = function (range) {
			return (range && this._containsCellInfo(range.topLeft()) && this._containsCellInfo(range.bottomRight()));
		};

		// mode:
		//  0: none
		//  1: extendToColumn
		//  2: extendToRow
		//
		// borders - cellInfoRange
		this._extend = function (mode, borders) {
			if (mode === 1) {
				_topLeft.rowIndex(borders.topLeft().rowIndex());
				_bottomRight.rowIndex(borders.bottomRight().rowIndex());
			} else {
				if (mode === 2) {
					_topLeft.cellIndex(borders.topLeft().cellIndex());
					_bottomRight.cellIndex(borders.bottomRight().cellIndex());
				}
			}

			return this;
		};

		this._normalize = function () {
			var x0 = _topLeft.cellIndex(),
				y0 = _topLeft.rowIndex(),
				x1 = _bottomRight.cellIndex(),
				y1 = _bottomRight.rowIndex();

			_topLeft.cellIndex(Math.min(x0, x1));
			_topLeft.rowIndex(Math.min(y0, y1));

			_bottomRight.cellIndex(Math.max(x0, x1));
			_bottomRight.rowIndex(Math.max(y0, y1));
		};

		// internal *
	};
})(jQuery);(function ($) {
	"use strict";
	$.extend($.wijmo.wijgrid, {
		classFactory: function (base, props) {
			var fakeMarker = "#fake#",

				overrideTest = (/xyz/.test(function () { xyz; }))
					? /\b_base\b/
					: /.*/,

				proto = base
					? base.prototype
					: function () { },

				subClass = base
					? new base(fakeMarker)
					: new proto(),

				key, propVal, result;

			for (key in props) {
				if (props.hasOwnProperty(key)) {
					propVal = props[key];

					if (proto && (typeof (propVal) === "function") && (typeof (proto[key]) === "function") && overrideTest.test(propVal)) {
						subClass[key] = (function (name, func) {
							return function () {
								var tmp = this._base,
									result;

								this._base = proto[name];
								result = func.apply(this, arguments);

								if (tmp !== undefined) {
									this._base = tmp;
								} else {
									delete this._base;
								}

								return result;
							};
						})(key, propVal);
					} else {
						subClass[key] = propVal;
					}
				}
			}

			result = function (fakeFlag) {
				if ((fakeFlag !== fakeMarker) && this.ctor) {
					this.ctor.apply(this, arguments);
				}
			};

			result.prototype = subClass;
			result.constructor = subClass;

			return result;
		}
	});
})(jQuery);

(function ($) {
	"use strict";

	$.wijmo.wijgrid.baseView = $.wijmo.wijgrid.classFactory(null, {
		// ** public
		ctor: function (wijgrid) {
			if (!wijgrid) {
				throw "'wijgrid' must be specified";
			}

			this._verScrollBarSize = 18;
			this._wijgrid = wijgrid;
		},

		dispose: function () {
			this.toggleDOMSelection(true);
		},

		ensureWidth: function (delta, index) {
			if (arguments.length > 0) {
				this._setColumnWidth(index, delta);
			}

			this.refreshPanel();
		},

		getScrollValue: function () {
			throw "not implemented";
		},

		getVisibleAreaBounds: function () {
			throw "not implemented";
		},

		render: function () {
			this._preRender();
			this._renderContent();
			this._postRender();
		},

		refreshPanel: function (scrollValue) {
			throw "not implemented";
		},

		scrollTo: function (currentCell) {
			throw "not implemented"
		},

		toggleDOMSelection: function (enable) {
			$.each(this.subTables(), function (index, htmlTableAccessor) {
				(new $.wijmo.wijgrid.domSelection(htmlTableAccessor.element())).toggleSelection(enable);
			});
		},

		updateSplits: function (scrollValue) {
			this.refreshPanel(scrollValue);
		},

		// public **

		// ** DOMTable abstraction

		focusableElement: function () {
			throw "not implemented";
		},

		forEachColumnCell: function (columnIndex, callback, param) {
			throw "not implemented";
		},

		forEachRowCell: function (rowIndex, callback, param) {
			throw "not implemented";
		},

		getAbsoluteCellInfo: function (domCell) {
			throw "not implemented";
		},

		getAbsoluteRowIndex: function (domRow) {
			throw "not implemented";
		},

		getCell: function (absColIdx, absRowIdx) {
			throw "not implemented";
		},

		getColumnIndex: function (domCell) {
			throw "not implemented";
		},

		getHeaderCell: function (absColIdx) {
			throw "not implemented";
		},

		getJoinedCols: function (columnIndex) {
			throw "not implemented";
		},

		getJoinedRows: function (rowIndex, rowScope) {
			throw "not implemented";
		},

		getJoinedTables: function (byColumn, index) {
			throw "not implemented";
		},

		subTables: function () {
			throw "not implemented";
		},

		// DOMTable abstraction **

		// ** private abstract

		_getGridWidth: function (mode) {
			throw "not implemented";
		},

		_getMappedScrollMode: function () {
			var scrollMode = this._wijgrid.options.scrollMode,
				vScrollBarVisibility = "auto",
				hScrollBarVisibility = "auto";

			switch (scrollMode) {
				case "horizontal":
					vScrollBarVisibility = "hidden";
					hScrollBarVisibility = "visible";
					break;

				case "vertical":
					vScrollBarVisibility = "visible";
					hScrollBarVisibility = "hidden";
					break;

				case "both":
					vScrollBarVisibility = "visible";
					hScrollBarVisibility = "visible";
					break;
			}

			return { vScrollBarVisibility: vScrollBarVisibility, hScrollBarVisibility: hScrollBarVisibility };
		},

		_getSuperPanel: function () {
			throw "not implemented";
		},

		_postRender: function () {
			// disable or enable DOM selection
			this.toggleDOMSelection(this._wijgrid.options.selectionMode === "none");
		},

		_preRender: function () {
			throw "not implemented";
		},

		_renderContent: function () {
			throw "not implemented";
		},

		_setColumnWidth: function (index, px, widthArray) {
			throw "not implemented";
		}

		// private abstract **
	});
})(jQuery);(function ($) {
	"use strict";

	$.wijmo.wijgrid.flatView = $.wijmo.wijgrid.classFactory($.wijmo.wijgrid.baseView, {
		// ** public

		ctor: function (wijgrid) {
			this._base(wijgrid);
			this._dataTable = null;
			this._contentArea = null;
		},

		getScrollValue: function () {
			var superPanelObj = this._getSuperPanel();

			return (superPanelObj)
				? { type: "flat",
					hScrollValue: superPanelObj.options.hScroller.scrollValue,
					vScrollValue: superPanelObj.options.vScroller.scrollValue
				}
				: { type: "flat",
					hScrollValue: null,
					vScrollValue: null
				};
		},

		getVisibleAreaBounds: function () {
			var dataTableBounds = $.wijmo.wijgrid.bounds(this._dataTable.element()),
				splitSEBounds;

			if (this._wijgrid.options.scrollMode === "none") {
				return dataTableBounds;
			} else {
				splitSEBounds = $.wijmo.wijgrid.bounds(this._wijgrid.outerDiv.find(".wijmo-wijgrid-split-area-se:first")[0]);

				return {
					top: dataTableBounds.top,
					left: dataTableBounds.left,
					width: Math.min(splitSEBounds.width, dataTableBounds.width),
					height: Math.min(splitSEBounds.height, dataTableBounds.height)
				};
			}
		},

		refreshPanel: function (scrollValue) {
			var wijgrid = this._wijgrid,
				mode = wijgrid.options.scrollMode,
				outerDiv = wijgrid.outerDiv,
				splitSE, panelModes;

			if (mode !== "none") {
				splitSE = outerDiv.find(".wijmo-wijgrid-content-area");
				panelModes = this._getMappedScrollMode();

				splitSE.width(this._getGridWidth(mode));
				splitSE.height(outerDiv.innerHeight());

				if (!splitSE.data("wijsuperpanel")) {
					splitSE.wijsuperpanel({
						bubbleScrollingEvent: false,
						vScroller: { scrollBarVisibility: panelModes.vScrollBarVisibility, scrollValue: scrollValue.type === "flat" ? scrollValue.vScrollValue : null },
						hScroller: { scrollBarVisibility: panelModes.hScrollBarVisibility, scrollValue: scrollValue.type === "flat" ? scrollValue.hScrollValue : null },

						//auto adjusting height with hscrollbar shown
						hScrollerActivating: function (e, data) {
							var diff;
							if (wijgrid._autoHeight) {
								diff = wijgrid.element.height() - data.contentLength;
								if (diff > 0) {
									splitSE.height(splitSE.height() + diff);
									splitSE.wijsuperpanel("paintPanel");
									return false;
								}
							}
						}
					});
				}
				else {
					splitSE.wijsuperpanel("paintPanel");
				}
			}
		},

		scrollTo: function (currentCell) {
			var superPanelObj = this._getSuperPanel(),
				element = currentCell.tableCell(),
				$dom = element.nodeType ? $(element) : element,
				contentElement, wrapperElement,
				visibleLeft, visibleTop, visibleWidth, visibleHeight,
				elementPosition, elementLeft, elementTop, elementWidth, elementHeight,
				resultLeft = null,
				resultTop = null;

			if (superPanelObj && $dom.is(":visible")) {
				contentElement = superPanelObj.getContentElement();
				wrapperElement = contentElement.parent();
				visibleLeft = parseInt((contentElement.css("left") + "").replace("px", ""), 10) * -1;
				visibleTop = parseInt((contentElement.css("top") + "").replace("px", ""), 10) * -1;
				visibleWidth = wrapperElement.outerWidth();
				visibleHeight = wrapperElement.outerHeight();
				elementPosition = $dom.position();
				elementLeft = Math.abs(elementPosition.left);
				elementTop = Math.abs(elementPosition.top);
				elementWidth = $dom.outerWidth();
				elementHeight = $dom.outerHeight();

				if (elementTop + elementHeight > visibleTop + visibleHeight) {
					visibleTop = resultTop = elementTop + elementHeight - visibleHeight;
				}

				if (elementLeft + elementWidth > visibleLeft + visibleWidth) {
					visibleLeft = resultLeft = elementLeft + elementWidth - visibleWidth;
				}

				if (elementTop < visibleTop) {
					resultTop = elementTop;
				}

				if (elementLeft < visibleLeft) {
					resultLeft = elementLeft;
				}

				if (currentCell.row()._dataTableRowIndex === 0 && visibleTop > 0) {
					resultTop = 0;
				}

				if (resultLeft !== null) {
					superPanelObj.hScrollTo(resultLeft);
				}

				if (resultTop !== null) {
					superPanelObj.vScrollTo(resultTop);
				}
			}
		},

		updateSplits: function (scrollValue) {
			var self = this,
				wijgrid = this._wijgrid,
				o = this._wijgrid.options,
				hasWidth = false,
				gridElement = wijgrid.element,
				widthArray = [],
				visibleLeaves = wijgrid._field("visibleLeaves"),
				mode = wijgrid.options.scrollMode,
				outerDiv = wijgrid.outerDiv,
				splitSE, beforeWidth, after, colIndex, diff, len,
				needVbar, needExpand, expandToColumn,
				thsWithWidth = [];

			$.each(visibleLeaves, function (index, leaf) {
				var th, isPercentage,
					w = leaf.width;

				if (w) {
					hasWidth = true;
					th = self.getHeaderCell(index);
					isPercentage = typeof w === "string";

					if (!isPercentage && o.ensureColumnsPxWidth) {
						self._setColumnWidth(index, w);
						leaf._realWidth = true;
						thsWithWidth.push({ th: $(th), clientWidth: th.clientWidth, index: index, isPercentage: isPercentage, ensurePxWidth: true });
					}
					else {
						th.width = w;
						thsWithWidth.push({ th: $(th), clientWidth: th.clientWidth, index: index, isPercentage: isPercentage });
					}
				}
			});

			// only set width on inner cell div when needed.
			if (o.scrollMode !== "none" || hasWidth || o.allowColSizing ||
			//prevent the width of th from being changed when changing the width of filterEditor
			//o.allowEditing || o.autoExpandColumnIndex) {
					o.showFilter || o.allowEditing || o.autoExpandColumnIndex) {
				if (!o.ensureColumnsPxWidth) {
					splitSE = (o.scrollMode === "none")
						? outerDiv
						: outerDiv.find(".wijmo-wijgrid-content-area");

					needVbar = this._testNeedVBar(outerDiv, gridElement, mode, wijgrid._autoHeight);
					if (needVbar) {
						splitSE.width(splitSE.width() - this._verScrollBarSize);
					}

					needExpand = !o.ensureColumnsPxWidth && splitSE.innerWidth() > gridElement[0].offsetWidth;

					// if table width is not enough to occupy the available space in outerDiv,
					// grid will expand to take up the space
					// if autoExpandColumnIndex is set, the addtional space 
					// will be added to the specified column and keep width of other columns.
					expandToColumn = o.autoExpandColumnIndex;
					if (needExpand && !expandToColumn) {
						// expand to full width by setting width 100%
						gridElement.css("width", "100%");
						beforeWidth = gridElement.width();
					}
				}

				// read column widths.
				$.each(visibleLeaves, function (index, leaf) {
					self._setColumnWidth(index, null, widthArray);
				});

				// remove th width
				$.each(thsWithWidth, function (index, widthObject) {
					if (widthObject.ensurePxWidth) {
						return;
					}
					widthObject.th.removeAttr("width");
					if (!widthObject.isPercentage) {
						widthArray[widthObject.index] = widthObject.clientWidth;
					}
				});

				// set column width on inner cell divs to expand table
				$.each(widthArray, function (index, width) {
					var leaf = visibleLeaves[index];
					if (leaf._realWidth) {
						delete leaf._realWidth;
						return;
					}
					self._setColumnWidth(index, width);
				});

				if (needExpand) {
					if (expandToColumn) {
						beforeWidth = gridElement.width();
					}
					else {
						gridElement.css("width", "auto");
					}

					after = o.autoExpandColumnIndex ? splitSE.width() : gridElement.width();
					diff = after - beforeWidth;
					if (!expandToColumn) {
						// if we are expanding table with 100% width,
						// there may be a 1px difference before 
						// and after adding width on each inner cell div.
						// we need to substract it from one of columns.
						diff = -diff;
					}
				}

				// fix width to account for difference.
				if (diff && visibleLeaves.length > 0) {
					len = widthArray.length - 1;
					colIndex = o.autoExpandColumnIndex || len;
					if (colIndex > len) {
						colIndex = len;
					}
					this._setColumnWidth(colIndex, widthArray[colIndex] + diff);
				}
			}
			else {
				if (outerDiv.innerWidth() > gridElement[0].offsetWidth) {
					gridElement.css("width", "100%");
				}
			}

			this._base(scrollValue); // refresh super panel after width is set.
		},
		// public **

		// ** DOMTable abstraction

		focusableElement: function () {
			return $(this._dataTable.element());
		},

		forEachColumnCell: function (columnIndex, callback, param) {
			return this._dataTable.forEachColumnCell(columnIndex, callback, param);
		},

		forEachRowCell: function (rowIndex, callback, param) {
			return this._dataTable.forEachRowCell(rowIndex, callback, param);
		},

		getAbsoluteCellInfo: function (domCell) {
			return new $.wijmo.wijgrid.cellInfo(this.getColumnIndex(domCell), domCell.parentNode.rowIndex);
		},

		getAbsoluteRowIndex: function (domRow) {
			return domRow.rowIndex;
		},

		getCell: function (absColIdx, absRowIdx) {
			var cellIdx = this._dataTable.getCellIdx(absColIdx, absRowIdx),
				rowObj;

			if (cellIdx >= 0) {
				rowObj = this.getJoinedRows(absRowIdx, 0);
				if (rowObj[0]) {
					return rowObj[0].cells[cellIdx];
				}
			}

			return null;
		},

		getColumnIndex: function (domCell) {
			return this._dataTable.getColumnIdx(domCell);
		},

		getHeaderCell: function (absColIdx) {
			var leaf = this._wijgrid._field("visibleLeaves")[absColIdx],
				headerRow;

			if (leaf && (headerRow = this._wijgrid._headerRows())) {
				return new $.wijmo.wijgrid.rowAccessor().getCell(headerRow.item(leaf.thY), leaf.thX);
			}

			return null;
		},

		getJoinedCols: function (columnIndex) {
			var $colGroup = $(this._dataTable.element()).find("> colgroup");

			if ($colGroup.length) {
				if (columnIndex < $colGroup[0].childNodes.length) {
					return [$colGroup[0].childNodes[columnIndex], null];
				}
			}

			return [null, null];
		},

		getJoinedRows: function (rowIndex, rowScope) {
			return [this._dataTable.getSectionRow(rowIndex, rowScope), null];
		},

		getJoinedTables: function (byColumn, index) {
			return [this._dataTable, null, index];
		},

		subTables: function () {
			return [this._dataTable];
		},

		// DOMTable abstraction **

		// ** private abstract

		_getGridWidth: function (mode) {
			var tableWidth = this._wijgrid.element.width(),
				outWidth = this._wijgrid.outerDiv.innerWidth();

			if (this._testNeedVBar(this._wijgrid.outerDiv, this._wijgrid.element, mode, this._wijgrid._autoHeight)) {
				tableWidth += this._verScrollBarSize;
			}

			if (tableWidth > outWidth) {
				tableWidth = outWidth;
			}

			return tableWidth;
		},

		_getSuperPanel: function () {
			var panelElement = this._wijgrid.outerDiv.find(".wijmo-wijgrid-content-area");

			return panelElement
				? panelElement.data("wijsuperpanel")
				: null;
		},

		_postRender: function () {
			this._wijgrid.element
				.addClass("wijmo-wijgrid-table")
				.find("> tbody").addClass("ui-widget-content wijmo-wijgrid-data");

			this._dataTable = new $.wijmo.wijgrid.htmlTableAccessor(this._wijgrid.element[0]);

			// set width on td inner div of each column after all styles are applied to grid.
			this._wijgrid.element
				.attr({ "role": "grid", "cellpadding": "0", "border": "0", "cellspacing": "0" })
				.css("border-collapse", "separate");

			this._base();
		},

		_preRender: function () {
			if (this._wijgrid.options.scrollMode !== "none") {
				this._wijgrid.outerDiv.wrapInner("<div class=\"wijmo-wijgrid-fixedview\"><div class=\"wijmo-wijgrid-split-area wijmo-wijgrid-split-area-se wijmo-wijgrid-content-area\"></div></div>");
			}
		},

		_renderContent: function () {
			var visibleLeaves = this._wijgrid._field("visibleLeaves"),
				table = this._wijgrid.element[0],
				tHead = null,
				spanTable, span, width, ri, height, domRow, thX, ci,
				$domCell, $container,
				i, len, leaf,
				colGroup, col,
				data, tBody, rowLen,
				dataRow, dataRowLen,
				cellLen, dataIndex, cellIndex, doBreak,
				cellValue, dataValue, rowInfo,
				cellAttr, cellStyle,
				dataRowIndex = -1,
				virtualDataItemIndexBase = 0,
				$rt = $.wijmo.wijgrid.rowType,
				$rs = $.wijmo.wijgrid.renderState,
				isDataRow;

			// create header
			spanTable = this._wijgrid._field("spanTable");
			if (spanTable && spanTable.length) {
				tHead = table.createTHead();
				width = spanTable[0].length;

				for (ri = 0, height = spanTable.length; ri < height; ri++) {
					//domRow = tHead.insertRow(-1);
					domRow = this._wijgrid._createRow(tHead, $rt.header, ri);

					rowInfo = this._wijgrid._createRowInfo([domRow], $rt.header, $rs.rendering, -1, -1, -1, -1);
					thX = 0;

					for (ci = 0; ci < width; ci++) {
						span = spanTable[ri][ci];

						if (span.column && span.column.parentVis) {
							span.column.thX = thX++;
							span.column.thY = ri;

							//$domCell = $("<th><div class=\"wijmo-wijgrid-innercell\"></div></th>");
							$domCell = $(this._wijgrid._createCell($rt.header, ri, ci));

							$container = $domCell.children("div");
							domRow.appendChild($domCell[0]);
							this._wijgrid.cellFormatter.format($container, span.column, span.column.headerText, rowInfo);
							this._wijgrid._cellCreated($domCell, ci, span.column, rowInfo, $rs.rendering, { colSpan: span.colSpan, rowSpan: span.rowSpan });
						} // end if
					} // for ci

					this._wijgrid._rowCreated(rowInfo);

				} // for ri
			} // end if
			// create header end

			// create filter
			if (this._wijgrid.options.showFilter) {
				if (!tHead) {
					tHead = table.createTHead();
				}

				//domRow = tHead.insertRow(-1); // filterRow
				domRow = this._wijgrid._createRow(tHead, $rt.filter, -1);
				rowInfo = this._wijgrid._createRowInfo([domRow], $rt.filter, $rs.rendering, -1, -1, -1, -1);

				for (i = 0, len = visibleLeaves.length; i < len; i++) {
					leaf = visibleLeaves[i];
					//$domCell = $(domRow.insertCell(-1));
					$domCell = $(this._wijgrid._createCell($rt.filter, undefined, i));
					domRow.appendChild($domCell[0]);
					this._wijgrid.cellFormatter.format($domCell, leaf, leaf.filterValue, rowInfo);
					this._wijgrid._cellCreated($domCell, i, leaf, rowInfo, $rs.rendering);
				}

				this._wijgrid._rowCreated(rowInfo);
			}
			// create filter end

			// colgroup
			colGroup = document.createElement("colgroup");
			for (i = 0, len = visibleLeaves.length; i < len; i++) {
				col = document.createElement("col");
				colGroup.appendChild(col);
			}
			table.appendChild(colGroup);
			// end colgroup

			// create body **
			data = this._wijgrid.dataTable;

			tBody = $.wijmo.wijgrid.ensureTBody(table);

			if (this._wijgrid._dataStore.dataMode() === $.wijmo.wijgrid.dataMode.dynamical) {
				virtualDataItemIndexBase = this._wijgrid.options.pageIndex * this._wijgrid.options.pageSize;
			}

			// render rows 
			for (ri = 0, rowLen = data.length; ri < rowLen; ri++) {
				dataRow = data[ri];
				dataRowLen = dataRow.length;
				isDataRow = (dataRow.rowType & $rt.data) !== 0;

				//domRow = tBody.insertRow(-1);
				domRow = this._wijgrid._createRow(tBody, dataRow.rowType, dataRow.originalRowIndex);

				rowInfo = this._wijgrid._createRowInfo([domRow], dataRow.rowType, $rs.rendering,
					ri,
					isDataRow ? ++dataRowIndex : -1,
					isDataRow ? dataRow.originalRowIndex : -1,
					isDataRow ? virtualDataItemIndexBase + dataRow.originalRowIndex : -1);

				// render cells
				for (ci = 0, cellLen = visibleLeaves.length; ci < cellLen; ci++) {
					leaf = visibleLeaves[ci];
					dataIndex = leaf.dataIndex;

					cellIndex = 0;
					doBreak = false;

					switch (dataRow.rowType) {
						case $rt.data:
						case $rt.data | $rt.dataAlt:
							cellIndex = dataIndex; // use [leaf -> data] mapping

							if (cellIndex >= 0 && (!dataRow[cellIndex] || (dataRow[cellIndex].visible === false))) {
								continue; // spanned cell ?
							}
							break;

						case $rt.emptyDataRow:
						case $rt.groupHeader:
						case $rt.groupFooter:
							cellIndex = ci; // just iterate through all dataRow cells.

							if (cellIndex >= dataRowLen) {
								doBreak = true; // don't extend group headers\ footers with additional cells
							}
							break;
					}

					if (doBreak) {
						break;
					}

					//$domCell = $("<td><div class=\"wijmo-wijgrid-innercell\"></div></td>");
					$domCell = $(this._wijgrid._createCell(dataRow.rowType, dataRow.originalRowIndex, cellIndex));
					$container = $domCell.children("div");

					domRow.appendChild($domCell[0]);

					if ((dataRow.rowType & $rt.data) && leaf.dataParser) {
						cellValue = null;

						if (cellIndex >= 0) { // cellIndex is equal to leaf.dataIndex here
							dataValue = dataRow[cellIndex].value;
							cellValue = this._wijgrid._toStr(leaf, dataValue);
						} else { // unbound column
						}

						this._wijgrid.cellFormatter.format($container, leaf, cellValue, rowInfo);
					} else {
						if (cellIndex >= 0) {
							$container.html(dataRow[cellIndex].html); // use original html
						}
					}

					cellAttr = (cellIndex >= 0) ? dataRow[cellIndex].__attr : null;
					cellStyle = (cellIndex >= 0) ? dataRow[cellIndex].__style : null;

					this._wijgrid._cellCreated($domCell, ci, leaf, rowInfo, $rs.rendering, cellAttr, cellStyle);
				} // for ci

				if (!domRow.cells.length) {
					tBody.removeChild(domRow);
				} else {
					this._wijgrid._rowCreated(rowInfo, dataRow.__attr, dataRow.__style);
				}
			} // for ri
			// ** create body

			// footer **
			if (this._wijgrid.options.showFooter) {
				//domRow = table.createTFoot().insertRow(-1);
				domRow = this._wijgrid._createRow(table.createTFoot(), $rt.footer, -1);
				rowInfo = this._wijgrid._createRowInfo([domRow], $rt.footer, $rs.rendering, -1, -1, -1, -1);

				for (ci = 0, cellLen = visibleLeaves.length; ci < cellLen; ci++) {
					leaf = visibleLeaves[ci];

					//$domCell = $("<td><div class=\"wijmo-wijgrid-innercell\"></div></td>");
					$domCell = $(this._wijgrid._createCell($rt.footer, undefined, ci));

					$container = $domCell.children("div");

					domRow.appendChild($domCell[0]);

					this._wijgrid.cellFormatter.format($container, leaf, "", rowInfo);
					this._wijgrid._cellCreated($domCell, i, leaf, rowInfo, $rs.rendering);
				}

				this._wijgrid._rowCreated(rowInfo);
			}
			// ** footer
		},

		_setColumnWidth: function (index, px, widthArray) {
			/// <summary>
			/// Set column width.
			/// </summary>
			/// <param name="index" type="Number">
			/// The index of the column. Start with 0.
			/// </param>
			/// <param name="px" type="Number">
			/// The width of each column.
			/// </param>

			// var tableEle = $(_dataTable.element());
			var th = this.getHeaderCell(index);
			if (th) {
				px = px ? px : th.clientWidth;

				if (widthArray) {
					widthArray.push(px);
					return;
				}

				if (px) {
					// set width on inner div of th and table td in each column.
					$(th).children("div.wijmo-wijgrid-innercell").setOutWidth(px);

					this.forEachColumnCell(index, function (cell, index) {
						var $row = $(cell.parentNode);

						if ($row.parent().is("tbody") && !$row.is(".wijmo-wijgrid-emptydatarow", ".wijmo-wijgrid-groupheaderrow", ".wijmo-wijgrid-groupfooterrow")) {
							$(cell).children("div.wijmo-wijgrid-innercell").setOutWidth(px);
						}

						return true;
					});
				}
			}
		},

		// private abstract **

		// ** private specific

		_testNeedVBar: function (outerDiv, gridElement, mode, autoHeight) {
			var excludeVBarWidth = false,
				gridWidth = gridElement.width(),
				gridHeight = gridElement.height(),
				outerWidth = outerDiv.width(),
				outerHeight = outerDiv.height();

			// remove auto width to make width 100%  take effect. 
			if (gridElement[0].style.width === "auto") {
				gridElement.css("width", "");
			}

			if (mode === "both" || mode === "vertical") {
				excludeVBarWidth = true;
			}
			else {
				excludeVBarWidth = (mode === "auto") && (
					(gridHeight > outerHeight) ||
					(!autoHeight && gridWidth > outerWidth && gridHeight > outerHeight - this._verScrollBarSize)); // When the height needs to be auto adjusted, the vertical scrollbar should not be shown
			}

			return excludeVBarWidth;
		}

		// private specific **
	});
})(jQuery);(function ($) {
	"use strict";
	$.wijmo.wijgrid.fixedView = $.wijmo.wijgrid.classFactory($.wijmo.wijgrid.baseView, {
		// ** public

		ctor: function (wijgrid) {
			this._base(wijgrid);
			this._rowsCount, // total rows count
			this._viewTables = {}, // rendered DOM tables
			this._table00,
			this._table01,
			this._table10,
			this._table11,
			this._scroller, // scrolling div
			this.element = this._wijgrid.element; // table element
		},

		getScrollValue: function () {
			var superPanelObj = this._getSuperPanel();

			return (superPanelObj)
				? { type: "fixed",
					hScrollValue: superPanelObj.options.hScroller.scrollValue,
					vScrollValue: superPanelObj.options.vScroller.scrollValue
				}
				: { type: "fixed",
					hScrollValue: null,
					vScrollValue: null
				};
		},

		getVisibleAreaBounds: function () {
			return $.wijmo.wijgrid.bounds(this._wijgrid.outerDiv.find(".wijmo-wijsuperpanel-contentwrapper:first"));
		},

		refreshPanel: function (scrollValue) {
			var self = this,
				panelModes = this._getMappedScrollMode();

			this._scroller.width(this._getGridWidth(this._wijgrid.options.scrollMode));

			if (!this._scroller.data("wijsuperpanel")) {
				this._scroller.wijsuperpanel({
					scrolled: $.proxy(this._onScrolled, this),
					bubbleScrollingEvent: false,
					vScroller: { scrollBarVisibility: panelModes.vScrollBarVisibility, scrollValue: scrollValue.type === "fixed" ? scrollValue.vScrollValue : null },
					hScroller: { scrollBarVisibility: panelModes.hScrollBarVisibility, scrollValue: scrollValue.type === "fixed" ? scrollValue.hScrollValue : null },
					//auto adjusting height with hscrollbar shown
					hScrollerActivating: function (e, data) {
						var diff, areaSW;
						if (self._wijgrid._autoHeight) {
							diff = self._wijgrid.element.height() + self._wijgrid.options.splitDistanceY - data.contentLength;
							if (diff > 0) {
								areaSW = self._wijgrid.outerDiv.find(".wijmo-wijgrid-split-area-sw");
								areaSW.height(areaSW.height() + diff);
								self._scroller.height(self._scroller.height() + diff);
								self._scroller.wijsuperpanel("paintPanel");
								return false;
							}
						}
					}
				});
			}
			else {
				this._scroller.wijsuperpanel("paintPanel");
			}

			this._wijgrid.outerDiv
				.find(".wijmo-wijgrid-split-area-ne") // area ne (01)
				.width(this._scroller.wijsuperpanel("getContentElement").parent().width());

			// synchronize scroll left of top table with bottom table
			this._onScrolled();
		},

		scrollTo: function (currentCell) {
			var o = this._wijgrid.options,
				superPanelObj = this._getSuperPanel(),
				element = currentCell.tableCell(),
				$dom = element.nodeType ? $(element) : element,
				contentElement, wrapperElement,
				visibleLeft, visibleTop, visibleWidth, visibleHeight,
				elementPosition, elementLeft, elementTop, elementWidth, elementHeight,
				resultLeft = null,
				resultTop = null;

			if (superPanelObj && $dom.is(":visible")) {
				contentElement = superPanelObj.getContentElement();
				wrapperElement = contentElement.parent();
				visibleLeft = parseInt((contentElement.css("left") + "").replace("px", ""), 10) * -1;
				visibleTop = parseInt((contentElement.css("top") + "").replace("px", ""), 10) * -1;
				visibleWidth = wrapperElement.outerWidth() - o.splitDistanceX;
				visibleHeight = wrapperElement.outerHeight() - o.splitDistanceY;
				elementPosition = $dom.position();
				elementLeft = Math.abs(elementPosition.left);
				elementTop = Math.abs(elementPosition.top);
				elementWidth = $dom.outerWidth();
				elementHeight = $dom.outerHeight();

				if (elementTop + elementHeight > visibleTop + visibleHeight) {
					visibleTop = resultTop = elementTop + elementHeight - visibleHeight;
				}

				if (elementLeft + elementWidth > visibleLeft + visibleWidth) {
					visibleLeft = resultLeft = elementLeft + elementWidth - visibleWidth;
				}

				if (elementTop < visibleTop) {
					resultTop = elementTop;
				}

				if (elementLeft < visibleLeft) {
					resultLeft = elementLeft;
				}

				if (resultLeft !== null) {
					superPanelObj.hScrollTo(resultLeft);
				}

				if (resultTop !== null) {
					superPanelObj.vScrollTo(resultTop);
				}
			}
		},

		updateSplits: function (scrollValue) {
			var wijgrid = this._wijgrid,
				o = wijgrid.options,
				thsWithWidth = [],
				expandToColumn,
				rowObj, fooRow,
				beforeWidth, diff, after, len, colIndex, needExpand, headerWidth,
				self = this,
				widthArray = [], // set width to top table th and bottom table td in first row.
				mode = o.scrollMode,
				visibleLeaves = wijgrid._field("visibleLeaves"),
				$tableSE = $(this._table11.element()),
				$tableNE = $(this._table01.element()),
				outerDiv = wijgrid.outerDiv;

			try {
				if (o.staticRowIndex >= 0) { // interpreted as bool, use _getRealStaticRowIndex() to get the actual value.
					o.splitDistanceY = outerDiv.find(".wijmo-wijgrid-split-area-ne table")[0].offsetHeight;
				} else {
					o.splitDistanceY = 0;
				}
				if (wijgrid._staticColumnIndex >= 0) { // interpreted as bool, use _getRealStaticColumnIndex() to get the actual value.
					o.splitDistanceX = outerDiv.find(".wijmo-wijgrid-split-area-nw table")[0].offsetWidth;
				} else {
					o.splitDistanceX = 0;
				}
			} catch (ex) { }

			this._updateSplitAreaBounds();

			// handle autosizing
			/*
			var fixedColIdx = wijgrid._staticColumnIndex; // interpreted as bool, use _getRealStaticColumnIndex() to get the actual value.
			var fixedRowIdx = wijgrid.options.staticRowIndex; // // interpreted as bool, use _getRealStaticRowIndex() to get the actual value.
			if (fixedColIdx >= 0 && fixedColIdx < wijgrid._field("leaves").length - 1 || fixedRowIdx >= 0) {
			this.adjustColumnSizes(this._viewTables['nw'], this._viewTables['sw']);
			this.adjustColumnSizes(this._viewTables['ne'], this._viewTables['se']);
			}
			*/

			// clone a row to expand table in grouping mode.
			rowObj = $tableSE.find("tbody .wijmo-wijgrid-row:not(.wijmo-wijgrid-groupheaderrow):first");

			this.fooRow = fooRow = rowObj
				.clone()
			//.removeClass() // remove all classes
				.removeAttr("datarowindex")
				.addClass("wijmo-wijgrid-foorow")
				.appendTo(rowObj.parent()).show().height(0).css({ "font-size": "0" });

			// fooRowCells belong to the bottom table
			this.fooRowCells = fooRow
				.find(">td")
			//.removeClass() // remove all classes
				.height(0)
				.css({ "border-top": "0", "border-bottom": "0" })
				.find(">div.wijmo-wijgrid-innercell")
			//force the height of fooRow to 0
				.css({ "padding-top": "0px", "padding-bottom": "0px" })
					.empty();

			// hide foo row because it has a 1px height in IE6&7
			fooRow.css("visibility", "hidden"); // use "visibility:hidden" instead of "display:none"

			//if there is no data in table, we must enlarge the table to prevent the width from being 0
			if (fooRow.length === 0) {
				wijgrid.element.css("width", "100%");
			}

			// if any column has width option, we will set the width for inner cells.
			$.each(visibleLeaves, function (index, leaf) {
				var th, isPercentage,
					w = leaf.width;

				if (w) {
					isPercentage = typeof w === "string";
					th = self.getHeaderCell(index);
					if (!isPercentage && o.ensureColumnsPxWidth) {
						self._setColumnWidth(index, w);
						leaf._realWidth = true;
						thsWithWidth.push({ th: $(th), clientWidth: th.clientWidth, index: index, isPercentage: isPercentage, ensurePxWidth: true });
					}
					else {
						th.width = w;
						thsWithWidth.push({ th: $(th), clientWidth: th.clientWidth, index: index, isPercentage: isPercentage });
					}
				}
			});

			if (!o.ensureColumnsPxWidth && this._testNeedVBar(wijgrid.outerDiv, $tableSE, $tableNE, mode, wijgrid._autoHeight)) {
				headerWidth = this._scroller.width() - this._verScrollBarSize;
			}
			else {
				headerWidth = this._scroller.width();
			}

			this._scroller.width(headerWidth);
			$tableNE.parent().width(headerWidth);
			if (!o.ensureColumnsPxWidth) {
				needExpand = $tableNE.width() < outerDiv.innerWidth();
				expandToColumn = o.autoExpandColumnIndex;
				if (needExpand && !expandToColumn) {
					$tableNE.css("width", "100%");
					beforeWidth = $tableNE.width();
				}
			}

			$.each(visibleLeaves, function (index, leaf) {
				self._setColumnWidth(index, null, widthArray);
			});

			// remove th width
			$.each(thsWithWidth, function (index, widthObject) {
				if (widthObject.ensurePxWidth) {
					return;
				}
				widthObject.th.removeAttr("width");
			});

			$.each(widthArray, function (index, width) {
				var leaf = visibleLeaves[index];
				if (leaf._realWidth) {
					delete leaf._realWidth;
					return;
				}
				self._setColumnWidth(index, width);
			});

			if (needExpand) {
				if (expandToColumn) {
					beforeWidth = $tableNE.width();
				}
				else {
					$tableNE.css("width", "auto");
				}
				after = o.autoExpandColumnIndex ? this._scroller.width() : $tableNE.width();
				diff = after - beforeWidth;
				if (!expandToColumn) {
					// if we are expanding table with 100% width,
					// there may be a 1px difference before 
					// and after adding width on each inner cell div.
					// we need to substract it from one of columns.
					diff = -diff;
				}
			}

			// fix width to account for difference.
			if (diff && visibleLeaves.length > 0) {
				len = widthArray.length - 1;
				colIndex = o.autoExpandColumnIndex || len;
				if (colIndex > len) {
					colIndex = len;
				}

				this._setColumnWidth(colIndex, widthArray[colIndex] + diff);
			}

			//the height is set to a wrong value for the height of footer is not taken into account.
			//because the height has already been set, there is no need setting it again.
			//if (this._noHeight) {
			//	this._scroller.height($tableSE.height() + o.splitDistanceY);
			//}

			this._base(scrollValue); // refresh super panel after width is set.
		},
		// public **

		// ** DOMTable abstraction

		focusableElement: function () {
			//return this._table11.element();
			return this._wijgrid.outerDiv;
		},

		forEachColumnCell: function (columnIndex, callback, param) {
			var joinedTables = this.getJoinedTables(true, columnIndex),
				relIdx, callbackRes;

			if (joinedTables[0] !== null) {
				relIdx = joinedTables[2];
				callbackRes = joinedTables[0].forEachColumnCell(relIdx, callback, param);
				if (callbackRes !== true) {
					return callbackRes;
				}

				if (joinedTables[1] !== null) {
					callbackRes = joinedTables[1].forEachColumnCell(relIdx, callback, param);
					if (callbackRes !== true) {
						return callbackRes;
					}
				}
			}

			return true;
		},

		forEachRowCell: function (rowIndex, callback, param) {
			var joinedTables = this.getJoinedTables(false, rowIndex),
				table0 = joinedTables[0],
				table1 = joinedTables[1],
				relIdx, callbackResult;

			if (table0 !== null) {
				relIdx = joinedTables[2];
				if (relIdx < table0.element().rows.length) {
					callbackResult = table0.forEachRowCell(relIdx, callback, param);
					if (callbackResult !== true) {
						return callbackResult;
					}
				}

				if ((table1 !== null) && (relIdx < table1.element().rows.length)) {
					callbackResult = table1.forEachRowCell(relIdx, callback, param);
					if (callbackResult !== true) {
						return callbackResult;
					}
				}
			}

			return true;
		},

		getAbsoluteCellInfo: function (domCell) {
			return new $.wijmo.wijgrid.cellInfo(this.getColumnIndex(domCell), this.getAbsoluteRowIndex(domCell.parentNode));
		},

		getAbsoluteRowIndex: function (domRow) {
			var index = domRow.rowIndex,
				table = domRow.parentNode;

			while (table.tagName.toLowerCase() !== "table") {
				table = table.parentNode;
			}

			return (table === this._table00.element() || table === this._table01.element()) ? index : index + this._wijgrid._getRealStaticRowIndex() + 1;
		},

		getCell: function (absColIdx, absRowIdx) {
			var joinedTablesRow = this.getJoinedTables(false, absRowIdx),
				joinedTablesCol, relRowIdx, relColIdx, table, cellIdx;

			if (joinedTablesRow[0] !== null) {
				joinedTablesCol = this.getJoinedTables(true, absColIdx);
				if (joinedTablesCol[0] !== null) {
					relRowIdx = joinedTablesRow[2];
					relColIdx = joinedTablesCol[2];

					table = null;
					if (joinedTablesRow[1] !== null) {
						table = (absColIdx === relColIdx) ? joinedTablesRow[0] : joinedTablesRow[1];
					}
					else {
						table = joinedTablesRow[0];
					}

					cellIdx = table.getCellIdx(relColIdx, relRowIdx);
					if (cellIdx >= 0) {
						return table.element().rows[relRowIdx].cells[cellIdx];
					}
				}
			}

			return null;
		},

		getColumnIndex: function (domCell) {
			var owner = null,
				htmlTable = null,
				flag = false,
				colIdx;

			for (owner = domCell.parentNode; owner.tagName.toLowerCase() !== "table"; owner = owner.parentNode) {
			}

			if (owner !== null) {
				if (owner === this._table00.element()) {
					htmlTable = this._table00;
				}
				else {
					if (owner === this._table01.element()) {
						htmlTable = this._table01;
						flag = true;
					}
					else {
						if (owner === this._table10.element()) {
							htmlTable = this._table10;
						}
						else {
							if (owner === this._table11.element()) {
								htmlTable = this._table11;
								flag = true;
							}
						}
					}
				}

				if (htmlTable !== null) {
					colIdx = htmlTable.getColumnIdx(domCell);
					if (flag) {
						colIdx += this._wijgrid._getRealStaticColumnIndex() + 1;
					}
					return colIdx;
				}
			}

			return -1;
		},

		getHeaderCell: function (absColIdx) {
			var leaf = this._wijgrid._field("visibleLeaves")[absColIdx],
				headerRow;

			if (leaf && (headerRow = this._wijgrid._headerRows())) {
				return new $.wijmo.wijgrid.rowAccessor().getCell(headerRow.item(leaf.thY), leaf.thX);
			}

			return null;
		},

		getJoinedCols: function (columnIndex) {
			var result = [],
				joinedTables = this.getJoinedTables(true, columnIndex);

			joinedTables.splice(joinedTables.length - 1, 1);
			$.each(joinedTables, function (index, table) {
				result.push($(table.element()).find("col")[columnIndex]);
			});

			return result;
		},

		getJoinedRows: function (rowIndex, rowScope) {
			var row0 = null, row1 = null,
				table0 = null, table1 = null,
				fixedRowIdx = this._wijgrid._getRealStaticRowIndex(),
				fixedColIdx = this._wijgrid._getRealStaticColumnIndex(),
				lastColIdx = this._wijgrid._field("leaves").length - 1,
				lastRowIdx = this._rowsCount - 1,
				allRowsFixed = (fixedRowIdx === lastRowIdx),
				allsRowUnfixed = (fixedRowIdx < 0),
				rowsFixedSlice = !allRowsFixed && !allsRowUnfixed,
				sectionLength = 0;

			if (allRowsFixed || rowsFixedSlice) {
				if (fixedColIdx >= 0 && fixedColIdx < lastColIdx) {
					table0 = this._table00;
					table1 = this._table01;
				}
				else {
					table0 = (fixedColIdx < 0) ? this._table01 : this._table00;
				}
				sectionLength = table0.getSectionLength(rowScope);
				if (rowIndex < sectionLength) {
					row0 = table0.getSectionRow(rowIndex, rowScope);
					if (table1 !== null) {
						row1 = table1.getSectionRow(rowIndex, rowScope);
					}
				}
			}

			if (allsRowUnfixed || (rowsFixedSlice && (row0 === null))) {
				if (!allsRowUnfixed) {
					rowIndex -= sectionLength;
				}

				if (fixedColIdx >= 0 && fixedColIdx < lastColIdx) {
					table0 = this._table10;
					table1 = this._table11;
				}
				else {
					table0 = (fixedColIdx < 0) ? this._table11 : this._table10;
				}

				row0 = table0.getSectionRow(rowIndex, rowScope);

				if (table1 !== null) {
					row1 = table1.getSectionRow(rowIndex, rowScope);
				}
			}

			return (row0 === null && row1 === null) ? null : [row0, row1];
		},

		getJoinedTables: function (byColumn, index) {
			var t0 = null,
				t1 = null,
				idx = index,
				wijgrid = this._wijgrid,
				fixedRowIdx = wijgrid._getRealStaticRowIndex(),
				fixedColIdx = wijgrid._getRealStaticColumnIndex();

			if (byColumn) {
				if (index <= fixedColIdx) {
					t0 = this._table00;
					t1 = this._table10;
				}
				else {
					t0 = this._table01;
					t1 = this._table11;

					idx = idx - (fixedColIdx + 1);
				}

				if (fixedRowIdx < 0) {
					t0 = null;
				}

				if (fixedRowIdx === this._rowsCount - 1) // fixed row is the last row
				{
					t1 = null;
				}
			}
			else {
				if (index <= fixedRowIdx) {
					t0 = this._table00;
					t1 = this._table01;
				}
				else {
					t0 = this._table10;
					t1 = this._table11;

					idx = idx - (fixedRowIdx + 1);
				}

				if (fixedColIdx < 0) {
					t0 = null;
				}
				if (fixedColIdx === wijgrid._field("leaves").length - 1) {
					t1 = null;
				}
			}

			if (t0 === null) {
				t0 = t1;
				t1 = null;
			}
			return [t0, t1, idx];
		},

		subTables: function () {
			return [this._table00, this._table01, this._table10, this._table11];
		},

		// DOMTable abstraction **

		// ** private abstract

		_getGridWidth: function (mode) {
			var wijgrid = this._wijgrid,
				tableWidth = wijgrid.element.outerWidth(true),
				outWidth = wijgrid.outerDiv.innerWidth();

			if (this._testNeedVBar(wijgrid.outerDiv, wijgrid.element, $(this._table01.element()), mode, wijgrid._autoHeight)) {
				tableWidth += this._verScrollBarSize;
			}

			if (tableWidth > outWidth) {
				tableWidth = outWidth;
			}

			return tableWidth;
		},

		_getSuperPanel: function () {
			return this._scroller
				? this._scroller.data("wijsuperpanel")
				: null;
		},

		_postRender: function () {
			var key;

			for (key in this._viewTables) {
				if (this._viewTables.hasOwnProperty(key)) {
					$(this._viewTables[key])
						.addClass("wijmo-wijgrid-table")
						.attr("role", "grid")
						.find("> tbody")
							.addClass("ui-widget-content wijmo-wijgrid-data");
				}
			}

			this._table00 = new $.wijmo.wijgrid.htmlTableAccessor(this._viewTables.nw);
			this._table01 = new $.wijmo.wijgrid.htmlTableAccessor(this._viewTables.ne);
			this._table10 = new $.wijmo.wijgrid.htmlTableAccessor(this._viewTables.sw);
			this._table11 = new $.wijmo.wijgrid.htmlTableAccessor(this._viewTables.se);

			this._rowsCount = Math.max(this._viewTables.nw.rows.length, this._viewTables.ne.rows.length) +
				Math.max(this._viewTables.sw.rows.length, this._viewTables.se.rows.length);

			// use separate instead of collapse to avoid a disalignment issue in chrome.
			$(this._viewTables.ne)
				.attr({ "cellpadding": "0", "border": "0", "cellspacing": "0" })
				.css("border-collapse", "separate");

			$(this._viewTables.se)
				.attr({ "cellpadding": "0", "border": "0", "cellspacing": "0" })
				.css("border-collapse", "separate");

			this._base();
		},

		_preRender: function () {
			this._wijgrid.outerDiv.wrapInner("<div class=\"wijmo-wijgrid-fixedview\"><div class=\"wijmo-wijgrid-scroller\"><div class=\"wijmo-wijgrid-split-area-se wijmo-wijgrid-content-area\"></div></div></div>");
			this._scroller = this._wijgrid.outerDiv.find(".wijmo-wijgrid-scroller");

			this._scroller.after("<div class=\"wijmo-wijgrid-split-area wijmo-wijgrid-split-area-nw\" style=\"overflow:hidden;position:absolute;z-index:4;top:0px;left:0px;\"></div>");
			this._scroller.after("<div class=\"wijmo-wijgrid-split-area wijmo-wijgrid-split-area-ne\" style=\"overflow:hidden;position:absolute;z-index:4;top:0px;left:0px;\"></div>");
			this._scroller.after("<div class=\"wijmo-wijgrid-split-area wijmo-wijgrid-split-area-sw\" style=\"overflow:hidden;position:absolute;z-index:4;top:0px;left:0px;\"></div>");
		},

		_renderContent: function () {
			var wijgrid = this._wijgrid,
				visibleLeaves = wijgrid._field("visibleLeaves"),
				docFragment = document.createDocumentFragment(),
				spanTable = wijgrid._field("spanTable"),
				staticRowIndex = wijgrid._getRealStaticRowIndex(),
				staticColumnIndex = wijgrid._getRealStaticColumnIndex(),
				tHeads = {},
				width, ri, height,
				dataRow, dataRowLen,
				leftDomRow, rightDomRow,
				thX, ci, span, $domCell,
				i, len, leaf,
				correspondTables, key, colGroup, col, table,
				data,
				tBodies = {},
				staticDataRowIndex, rowLen,
				cellLen, dataIndex, cellIndex, doBreak, $container, cellValue, dataValue,
				nwArea, neArea, swArea, seArea,
				cellAttr, cellStyle, rowInfo,
				dataRowIndex = -1,
				virtualDataItemIndexBase = 0,
				$rt = $.wijmo.wijgrid.rowType,
				$rs = $.wijmo.wijgrid.renderState,
				isDataRow;

			this._viewTables = {
				nw: docFragment.appendChild(document.createElement("table")),
				ne: docFragment.appendChild(document.createElement("table")),
				sw: docFragment.appendChild(document.createElement("table")),
				se: docFragment.appendChild(wijgrid.element[0])
			};

			// create header
			if (spanTable && spanTable.length) {
				tHeads.nw = this._viewTables.nw.createTHead();
				tHeads.ne = this._viewTables.ne.createTHead();
				/*tHeads.sw = this._viewTables.sw.createTHead(); // <-- user can fix the whole header only, not a random row.
				tHeads.sw = this._viewTables.se.createTHead();*/

				width = spanTable[0].length;

				for (ri = 0, height = spanTable.length; ri < height; ri++) {
					leftDomRow = null;
					rightDomRow = null;

					//if (ri <= staticRowIndex) {
					// now header rows are always fixed by design, so we can create header cells inside the fixed areas (nw + ne) only.
					//leftDomRow = tHeads.nw.insertRow(-1);
					//rightDomRow = tHeads.ne.insertRow(-1);
					leftDomRow = wijgrid._createRow(tHeads.nw, $rt.header, ri);
					rightDomRow = wijgrid._createRow(tHeads.ne, $rt.header, ri);
					/*} else {
					leftDomRow = this._viewTables["sw"].tHead.insertRow(-1);
					rightDomRow = this._viewTables["se"].tHead.insertRow(-1);
					}*/

					rowInfo = wijgrid._createRowInfo([leftDomRow, rightDomRow], $rt.header, $rs.rendering, -1, -1, -1, -1);

					thX = 0;

					for (ci = 0; ci < width; ci++) {
						span = spanTable[ri][ci];

						if (span.column && span.column.parentVis) {
							span.column.thX = thX++;
							span.column.thY = ri;

							//$domCell = $("<th><div class=\"wijmo-wijgrid-innercell\"></div></th>");
							$domCell = $(wijgrid._createCell($rt.header, ri, ci));

							$container = $domCell.children("div");

							if (ci <= staticColumnIndex) {
								leftDomRow.appendChild($domCell[0]);
							} else {
								rightDomRow.appendChild($domCell[0]);
							}

							wijgrid.cellFormatter.format($container, span.column, span.column.headerText, rowInfo);
							wijgrid._cellCreated($domCell, ci, span.column, rowInfo, $rs.rendering, { colSpan: span.colSpan, rowSpan: span.rowSpan });
						} // end if
					} // for ci

					wijgrid._rowCreated(rowInfo);
				} // for ri

			} // end if
			// create header end

			// create filter -- now only the whole header can be fixed by design, so the tHeads can contain only "nw" or (and) "ne" keys.
			if (wijgrid.options.showFilter) {
				if (tHeads.nw) { // fixed columns area
					//leftDomRow = tHeads.nw.insertRow(-1);
					leftDomRow = wijgrid._createRow(tHeads.nw, $rt.filter, -1);
				}

				if (tHeads.ne) { // unfixed columns area
					//rightDomRow = tHeads.ne.insertRow(-1);
					rightDomRow = wijgrid._createRow(tHeads.ne, $rt.filter, -1);
				}

				rowInfo = wijgrid._createRowInfo([leftDomRow, rightDomRow], $rt.filter, $rs.rendering, -1, -1, -1, -1);

				for (i = 0, len = visibleLeaves.length; i < len; i++) {
					leaf = visibleLeaves[i];

					/*$domCell = (i <= staticColumnIndex)
					? $(leftDomRow.insertCell(-1))
					: $(rightDomRow.insertCell(-1));*/
					$domCell = $(wijgrid._createCell($rt.filter, undefined, i));

					if (i <= staticColumnIndex) {
						leftDomRow.appendChild($domCell[0]);
					} else {
						rightDomRow.appendChild($domCell[0]);
					}

					wijgrid.cellFormatter.format($domCell, leaf, leaf.filterValue, rowInfo);
					wijgrid._cellCreated($domCell, i, leaf, rowInfo, $rs.rendering);
				}

				wijgrid._rowCreated(rowInfo);
			}
			// create filter end

			// colgroup

			// nw - sw
			correspondTables = { t0: this._viewTables.nw, t1: this._viewTables.sw };
			for (key in correspondTables) {
				if (correspondTables.hasOwnProperty(key)) {
					colGroup = document.createElement("colgroup");
					for (i = 0; i <= staticColumnIndex; i++) {
						col = document.createElement("col");
						colGroup.appendChild(col);
					}
					table = correspondTables[key];
					table.appendChild(colGroup);
				}
			}

			// ne - se
			correspondTables = { t0: this._viewTables.ne, t1: this._viewTables.se };
			for (key in correspondTables) {
				if (correspondTables.hasOwnProperty(key)) {
					colGroup = document.createElement("colgroup");
					for (i = staticColumnIndex + 1; i < visibleLeaves.length; i++) {
						col = document.createElement("col");
						colGroup.appendChild(col);
					}
					table = correspondTables[key];
					table.appendChild(colGroup);
				}
			}
			// end colgroup

			// create body **
			data = wijgrid.dataTable;

			tBodies = {
				nw: $.wijmo.wijgrid.ensureTBody(this._viewTables.nw),
				ne: $.wijmo.wijgrid.ensureTBody(this._viewTables.ne),
				sw: $.wijmo.wijgrid.ensureTBody(this._viewTables.sw),
				se: $.wijmo.wijgrid.ensureTBody(this._viewTables.se)
			};

			staticDataRowIndex = staticRowIndex - (spanTable.length + (wijgrid.options.showFilter ? 1 : 0));

			if (wijgrid._dataStore.dataMode() === $.wijmo.wijgrid.dataMode.dynamical) {
				virtualDataItemIndexBase = wijgrid.options.pageIndex * wijgrid.options.pageSize;
			}

			// render rows
			for (ri = 0, rowLen = data.length; ri < rowLen; ri++) {
				dataRow = data[ri];
				dataRowLen = dataRow.length;
				isDataRow = (dataRow.rowType & $rt.data) !== 0;

				leftDomRow = null;
				rightDomRow = null;

				if (ri <= staticDataRowIndex) {
					//leftDomRow = tBodies.nw.insertRow(-1);
					//rightDomRow = tBodies.ne.insertRow(-1);
					leftDomRow = wijgrid._createRow(tBodies.nw, dataRow.rowType, dataRow.originalRowIndex);
					rightDomRow = wijgrid._createRow(tBodies.ne, dataRow.rowType, dataRow.originalRowIndex);
				} else {
					//leftDomRow = tBodies.sw.insertRow(-1);
					//rightDomRow = tBodies.se.insertRow(-1);
					leftDomRow = wijgrid._createRow(tBodies.sw, dataRow.rowType, dataRow.originalRowIndex);
					rightDomRow = wijgrid._createRow(tBodies.se, dataRow.rowType, dataRow.originalRowIndex);
				}

				rowInfo = wijgrid._createRowInfo([leftDomRow, rightDomRow], dataRow.rowType, $rs.rendering,
						ri,
						isDataRow ? ++dataRowIndex : -1,
						isDataRow ? dataRow.originalRowIndex : -1,
						isDataRow ? virtualDataItemIndexBase + dataRow.originalRowIndex : -1);

				// render cells
				for (ci = 0, cellLen = visibleLeaves.length; ci < cellLen; ci++) {
					leaf = visibleLeaves[ci];
					dataIndex = leaf.dataIndex;

					cellIndex = 0;
					doBreak = false;

					switch (dataRow.rowType) {
						case $rt.data:
						case $rt.data | $rt.dataAlt:
							cellIndex = dataIndex; // use [leaf -> data] mapping

							if (cellIndex >= 0 && (!dataRow[cellIndex] || (dataRow[cellIndex].visible === false))) {
								continue; // spanned cell ?
							}
							break;

						case $rt.emptyDataRow:
						case $rt.groupHeader:
						case $rt.groupFooter:
							cellIndex = ci; // just iterate through all dataRow cells.

							if (cellIndex >= dataRowLen) {
								doBreak = true; // don't extend group headers\ footers with additional cells
							}
							break;
					}

					if (doBreak) {
						break;
					}

					//$domCell = $("<td><div class=\"wijmo-wijgrid-innercell\"></div></td>");
					$domCell = $(wijgrid._createCell(dataRow.rowType, dataRow.originalRowIndex, cellIndex));

					$container = $domCell.children("div");

					if (ci <= staticColumnIndex) {
						leftDomRow.appendChild($domCell[0]);
					} else {
						rightDomRow.appendChild($domCell[0]);
					}

					if ((dataRow.rowType & $rt.data) && leaf.dataParser) {
						cellValue = null;

						if (cellIndex >= 0) { // cellIndex is equal to leaf.dataIndex here
							dataValue = dataRow[cellIndex].value;
							cellValue = wijgrid._toStr(leaf, dataValue);

						} else { // unbound column
						}

						wijgrid.cellFormatter.format($container, leaf, cellValue, rowInfo);
					} else {
						if (cellIndex >= 0) {
							$container.html(dataRow[cellIndex].html); // use original html
						}
					}

					cellAttr = (cellIndex >= 0) ? dataRow[cellIndex].__attr : null;
					cellStyle = (cellIndex >= 0) ? dataRow[cellIndex].__style : null;

					wijgrid._cellCreated($domCell, ci, leaf, rowInfo, $rs.rendering, cellAttr, cellStyle);
				} // for ci

				if (ri <= staticDataRowIndex) {
					if (!leftDomRow.cells.length) {
						tBodies.nw.removeChild(leftDomRow);
						leftDomRow = null;
					}

					if (!rightDomRow.cells.length) {
						tBodies.ne.removeChild(rightDomRow);
						rightDomRow = null;
					}

					if (leftDomRow || rightDomRow) {
						wijgrid._rowCreated(rowInfo, dataRow.__attr, dataRow.__style);
					}
				} else {
					if (!leftDomRow.cells.length) {
						tBodies.sw.removeChild(leftDomRow);
						leftDomRow = null;
					}

					if (!rightDomRow.cells.length) {
						tBodies.se.removeChild(rightDomRow);
						rightDomRow = null;
					}

					if (leftDomRow || rightDomRow) {
						wijgrid._rowCreated(rowInfo, dataRow.__attr, dataRow.__style);
					}
				}
			} // for ri
			// ** create body

			// create footer **
			if (wijgrid.options.showFooter) {
				//leftDomRow = this._viewTables.sw.createTFoot().insertRow(-1);
				//rightDomRow = this._viewTables.se.createTFoot().insertRow(-1);
				leftDomRow = wijgrid._createRow(this._viewTables.sw.createTFoot(), $rt.footer, -1);
				rightDomRow = wijgrid._createRow(this._viewTables.se.createTFoot(), $rt.footer, -1);

				rowInfo = wijgrid._createRowInfo([leftDomRow, rightDomRow], $rt.footer, $rs.rendering, -1, -1, -1, -1);

				for (ci = 0, cellLen = visibleLeaves.length; ci < cellLen; ci++) {
					leaf = visibleLeaves[ci];

					//$domCell = $("<td><div class=\"wijmo-wijgrid-innercell\"></div></td>");
					$domCell = $(wijgrid._createCell($rt.footer, undefined, ci));

					$container = $domCell.children("div");

					if (ci <= staticColumnIndex) {
						leftDomRow.appendChild($domCell[0]);
					} else {
						rightDomRow.appendChild($domCell[0]);
					}

					wijgrid.cellFormatter.format($container, leaf, "", rowInfo);
					wijgrid._cellCreated($domCell, i, leaf, rowInfo, $rs.rendering);
				}

				wijgrid._rowCreated(rowInfo);
			}
			// ** create footer

			nwArea = wijgrid.outerDiv.find(".wijmo-wijgrid-split-area-nw");
			neArea = wijgrid.outerDiv.find(".wijmo-wijgrid-split-area-ne");
			swArea = wijgrid.outerDiv.find(".wijmo-wijgrid-split-area-sw");
			seArea = wijgrid.outerDiv.find(".wijmo-wijgrid-content-area");

			nwArea[0].innerHTML = "";
			neArea[0].innerHTML = "";
			swArea[0].innerHTML = "";
			seArea[0].innerHTML = "";

			/* Note, empty() throws exception */
			$(this._viewTables.nw).appendTo(nwArea);
			$(this._viewTables.ne).appendTo(neArea);
			$(this._viewTables.sw).appendTo(swArea);
			$(this._viewTables.se).appendTo(seArea);
		},

		_setColumnWidth: function (index, px, widthArray) {
			/// <summary>
			/// Set column width.
			/// </summary>
			/// <param name="index" type="Number">
			/// The index of the column. Start with 0.
			/// </param>
			/// <param name="px" type="Number">
			/// The width of the column.  If px value is undefined, the offset width will be used.
			/// </param>

			var th = this.getHeaderCell(index),
				colWidth = th.clientWidth;

			if (px) {
				if (!widthArray) {
					$(th).children("div.wijmo-wijgrid-innercell").setOutWidth(px);
					this.fooRowCells.eq(index).setOutWidth(px);
				}

				this.forEachColumnCell(index, function (cell, index) {
					var $row = $(cell.parentNode);

					if ($row.parent().is("tbody") && !$row.is(".wijmo-wijgrid-emptydatarow", ".wijmo-wijgrid-groupheaderrow", ".wijmo-wijgrid-groupfooterrow")) {
						if (widthArray) {
							widthArray.push(px);
							return false;
						}
						else {
							$(cell).children("div.wijmo-wijgrid-innercell").setOutWidth(px);
						}
					}

					return true;
				});
			} else { // set column and outer width of td and th.
				this.forEachColumnCell(index, function (cell, index) {
					var $row = $(cell.parentNode);

					if ($row.parent().is("tbody") && !$row.is(".wijmo-wijgrid-groupheaderrow", ".wijmo-wijgrid-groupfooterrow")) {
						if (!widthArray) {
							$(cell).children("div.wijmo-wijgrid-innercell").setOutWidth(colWidth);
						}
						else {
							return false;
						}
					}

					return true;
				});

				if (widthArray) {
					widthArray.push(colWidth);
				}
				else {
					$(th).children("div.wijmo-wijgrid-innercell").setOutWidth(colWidth);
				}
			}
		},

		// private abstract **

		// ** private specific

		adjustCellsSizes: function () {
			var accessor = new $.wijmo.wijgrid.rowAccessor(this, 9/*all*/, 0),
				rowLen = accessor.length(),
				heights = [], // int[rowLen];
				i, j, rowObj,
				row0, len0, row0Span, row0h,
				row1, len1, row1Span, row1h,
				row;

			for (i = 0; i < rowLen; i++) {
				rowObj = this.getJoinedRows(i, 9/*all*/); // = accessor[i];

				row0 = rowObj[0];
				len0 = (row0 !== null) ? row0.cells.length : 0;
				row0Span = false;

				for (j = 0; j < len0 && !row0Span; j++) {
					row0Span = (row0.cells[j].rowSpan > 1);
				}

				row1 = rowObj[1];
				len1 = (row1 !== null) ? row1.cells.length : 0;
				row1Span = false;

				if (!row0Span) {
					for (j = 0; j < len1 && !row1Span; j++) {
						row1Span = (row1.cells[j].rowSpan > 1);
					}
				}

				row0h = (row0 !== null && len0 > 0) ? row0.offsetHeight : 0;
				row1h = (row1 !== null && len1 > 0) ? row1.offsetHeight : 0;

				heights[i] = (row0Span || row1Span) ? Math.min(row0h, row1h) : Math.max(row0h, row1h);
			}

			for (i = 0; i < rowLen; i++) {
				row = this.getJoinedRows(i, 9/*all*/); // = accessor[i];
				accessor.iterateCells(row, this.setCellContentDivHeight, heights[i]);
			}
		},

		/*
		adjustColumnSizes: function(topTable, bottomTable) {
		if (topTable.rows.length > 0 && bottomTable.rows.length > 0) {
		var topRowCells = topTable.rows[0].cells;
		var bottomRowCells = bottomTable.rows[0].cells;

		if (topRowCells.length == bottomRowCells.length) {
		for (var i = 0; i < topRowCells.length; i++) {
		topRowCells[i].style.width = bottomRowCells[i].style.width = Math.max(topRowCells[i].offsetWidth, bottomRowCells[i].offsetWidth);
		}
		}
		}

		topTable.style.width = bottomTable.style.width = Math.max(topTable.offsetWidth, bottomTable.offsetWidth) + "px";
		//alert(topTable.style.width + "?w=" + Math.max(topTable.offsetWidth, bottomTable.offsetWidth));

		topTable.style.tableLayout = "fixed";
		bottomTable.style.tableLayout = "fixed";
		},
		*/

		_onScrolled: function () {
			this._wijgrid.outerDiv.find(".wijmo-wijgrid-split-area-ne")[0].scrollLeft = parseInt((this._wijgrid.outerDiv.find(".wijmo-wijsuperpanel-templateouterwrapper").css("left") + "").replace("px", ""), 10) * -1;
			this._wijgrid.outerDiv.find(".wijmo-wijgrid-split-area-sw")[0].scrollTop = parseInt((this._wijgrid.outerDiv.find(".wijmo-wijsuperpanel-templateouterwrapper").css("top") + "").replace("px", ""), 10) * -1;
		},
		
		setCellContentDivHeight: function (cell, param) {
			cell.style.height = param + "px";
			return true;
		},

		_testNeedVBar: function (outerDiv, gridElement, tableNE, mode, autoHeight) {
			var excludeVBarWidth, gridWidth, gridHeight, outerWidth, outerHeight;

			gridWidth = tableNE.width();
			gridHeight = gridElement.height() + this._wijgrid.options.splitDistanceY;
			outerWidth = outerDiv.width();
			outerHeight = outerDiv.height();

			if (mode === "both" || mode === "vertical") {
				excludeVBarWidth = true;
			}
			else {
				excludeVBarWidth = (mode === "auto") && (
					(gridHeight > outerHeight) ||
					(!autoHeight && gridWidth > outerWidth && gridHeight > outerHeight - this._verScrollBarSize)); // When the height needs to be auto adjusted, the vertical scrollbar should not be shown
			}

			return excludeVBarWidth;
		},

		_updateSplitAreaBounds: function () {
			var wijgrid = this._wijgrid,
				o = wijgrid.options,
				controlWidth = o.width || wijgrid.outerDiv.width(),
				controlHeight = o.height || wijgrid.outerDiv.height(),
				areaNW = wijgrid.outerDiv.find(".wijmo-wijgrid-split-area-nw"),
				areaNE = wijgrid.outerDiv.find(".wijmo-wijgrid-split-area-ne"),
				areaSW = wijgrid.outerDiv.find(".wijmo-wijgrid-split-area-sw"),
				areaSE = wijgrid.outerDiv.find(".wijmo-wijgrid-split-area-se");

			if (controlHeight <= 0) {
				controlHeight = wijgrid.outerDiv.find(".wijmo-wijgrid-split-area-se > table")[0].offsetHeight;
			}

			//if (wijgrid.outerDiv[0].style.height !== "" && wijgrid.outerDiv[0].style.height !== "auto") {
			if (!wijgrid._autoHeight) {
				this._scroller.height(controlHeight);
			}
			else {
				// no height is set for outer div, we need to expand the grid.
				this._scroller.height(controlHeight + o.splitDistanceY);
				//this._noHeight = true;
			}

			this._scroller.width(controlWidth);

			// update splits bounds:
			areaNW.height(o.splitDistanceY);
			areaNE.height(o.splitDistanceY);
			//if (wijgrid.$topPagerDiv !== null) {
			//	areaNE.css("top", wijgrid.$topPagerDiv.outerHeight(true) + "px");
			if (wijgrid.$superPanelHeader !== null) {
				areaNE.css("top", wijgrid.$superPanelHeader.outerHeight(true) + "px");
			}

			//this.element.find(".wijmo-wijgrid-split-area-sw").height(controlHeight - o.splitDistanceY - (!o.splits ? this.horScrollBarSize : 0)).css("top", o.splitDistanceY);

			//the height of areaSW is supposed to match that of areaSE
			//areaSW.height(controlHeight - o.splitDistanceY).css("top", o.splitDistanceY);
			if (!wijgrid._autoHeight) {
				areaSW.height(controlHeight - o.splitDistanceY);
			}
			else {
				areaSW.height(controlHeight);
			}
			areaSW.css("top", o.splitDistanceY);
			areaNW.width(o.splitDistanceX);
			areaSW.width(o.splitDistanceX);

			//areaNE.width(controlWidth - o.splitDistanceX - (!o.splits ? this._verScrollBarSize : 0)).css("left", o.splitDistanceX); //-17 is for scrollbars

			//this.element.find(".wijmo-wijgrid-split-area-se").height(controlHeight - o.splitDistanceY).css("top", o.splitDistanceY);
			//this.element.find(".wijmo-wijgrid-split-area-se").width(controlWidth - o.splitDistanceX).css("left", o.splitDistanceX);
			areaSE.css("marginLeft", o.splitDistanceX);
			areaSE.css("marginTop", o.splitDistanceY);

			areaNE.css("marginLeft", o.splitDistanceX);
		}

		// private specific **
	});
})(jQuery);(function ($) {
	"use strict";
	$.wijmo.wijgrid.selection = function (gridView) {
		/// <summary>
		/// Object that represents selection in the grid.
		/// Code example: var selection = new $.wijmo.wijgrid.selection(gridView);
		/// </summary>
		/// <param name="gridview" type="$.wijmo.wijgrid" mayBeNull="false">gridView</param>
		/// <returns type="$.wijmo.wijgrid.selection">Object that represents selection in the grid</returns>
		var _updates = 0,
			_anchorCell,
			_addedCells = new $.wijmo.wijgrid.cellInfoOrderedCollection(gridView),
			_removedCells = new $.wijmo.wijgrid.cellInfoOrderedCollection(gridView),
			_selectedCells = new $.wijmo.wijgrid.cellInfoOrderedCollection(gridView),
			_addedDuringCurTransactionCells = new $.wijmo.wijgrid.cellInfoOrderedCollection(gridView),
			_selectedColumns = null, // ?
			_selectedRows = null; // ?

		this.selectedCells = function () {
			/// <summary>
			/// Gets a read-only collection of the selected cells.
			/// Code example: var selectedCells = selectionObj.selectedCells();
			/// </summary>
			/// <returns type="$.wijmo.wijgrid.cellInfoOrderedCollection"/>
			return _selectedCells;
		};

		this.addRange = function (cellRange /* x0 */, y0 /* opt */, x1 /* opt */, y1 /* opt */) {
			/// <summary>
			/// Adds a cell range to the current selection.
			///
			/// Usage:
			/// 1. addRange(cellRange)
			/// 2. addRange(x0, y0, x1, y1)
			/// 
			/// The result depends upon the chosen selection mode in the grid. For example, if current selection mode
			/// does not allow multiple selection the previous selection will be removed.
			///
			/// Code example: selectionObj.addRange(0, 0, 1, 1);
			/// </summary>
			/// <param name="cellRange" type="$.wijmo.wijgrid.cellInfoRange">Cell range to select.</param>
			/// <param name="x0" type="Number" integer="true">The x-coordinate that represents the top left cell of the range.</number>
			/// <param name="y0" type="Number" integer="true">The y-coordinate that represents the top left cell of the range.</number>
			/// <param name="x1" type="Number" integer="true">The x-coordinate that represents the bottom right cell of the range.</number>
			/// <param name="y1" type="Number" integer="true">The y-coordinate that represents the bottom right cell of the range.</number>

			if (!cellRange && (arguments.length === 1)) {
				throw "invalid argument";
			}

			var range = (arguments.length === 4)
				? new $.wijmo.wijgrid.cellInfoRange(new $.wijmo.wijgrid.cellInfo(cellRange, y0), new $.wijmo.wijgrid.cellInfo(x1, y1))
				: cellRange._clone();

			range._normalize();

			if (!range._isValid()) {
				throw "invalid argument";
			}

			this.beginUpdate();

			this._startNewTransaction(gridView._field("currentCell"));
			this._selectRange(range, false, true, 0 /* none*/, null);

			this.endUpdate();
		};

		this.clear = function () {
			/// <summary>
			/// Clears the selection.
			/// Code example: selectionObj.clear();
			/// </summary>
			this.beginUpdate();

			_removedCells._clear();
			_removedCells._addFrom(_selectedCells);

			this.endUpdate();
		};

		this.selectAll = function () {
			/// <summary>
			/// Selects all the cells in a grid.
			///
			/// The result depends upon the chosen selection mode in the grid.
			/// For example, if the selection mode is "singleCell", only the top left cell will be selected.
			///
			/// Code example: selectionObj.selectAll();
			/// </summary>
			this.beginUpdate();

			this._selectRange(gridView._getDataCellsRange(), false, false, 0 /* none */, null);

			this.endUpdate();
		};

		this.beginUpdate = function () {
			/// <summary>
			/// Begins the update.
			/// The changes won't have effect until endUpdate() is called.
			/// Code example: selectionObj.beginUpdate();
			/// </summary>
			_updates++;
		};

		this.endUpdate = function () {
			/// <summary>
			/// Ends the update.
			/// The pending changes are executed and the corresponding events are raised.
			/// Code example: selectionObj.endUpdate();
			/// </summary>
			if (_updates > 0) {
				_updates--;

				if (_updates === 0) {
					doSelection(); // values must be clipped before this step

					if (_addedCells.length() || _removedCells.length()) {

						if (_selectedColumns !== null) {
							_selectedColumns.UnderlyingDataChanged(); // notify
						}

						if (_selectedRows !== null) {
							_selectedRows.UnderlyingDataChanged(); // notify
						}

						gridView._trigger("selectionChanged", null, { addedCells: _addedCells, removedCells: _removedCells });
					}

					_addedCells = new $.wijmo.wijgrid.cellInfoOrderedCollection(gridView);
					_removedCells._clear();
				}
			}
		};

		// * internal

		this._multipleRangesAllowed = function () {
			var mode = gridView.options.selectionMode;

			return (mode && ((mode = mode.toLowerCase()) === "multicolumn" || mode === "multirow" || mode === "multirange"));
		};

		this._anchorCell = function () {
			return _anchorCell;
		};

		this._startNewTransaction = function (dataCellInfo) {
			if (dataCellInfo) {
				_anchorCell = dataCellInfo._clone();
				_addedDuringCurTransactionCells = new $.wijmo.wijgrid.cellInfoOrderedCollection(gridView);
			}
		};

		this._clearRange = function (range, extendMode) {
			var selectionMode = gridView.options.selectionMode.toLowerCase(),
				rangeToClear, rowsLen, cellsLen, flag, row, cell,
				i, len, cellInfo;

			if (range._isValid() && (selectionMode !== "none") && (_selectedCells.length() > 0)) {
				rangeToClear = range._clone();

				rangeToClear._normalize();
				rangeToClear._clip(gridView._getDataCellsRange());

				if (!range._isValid()) {
					return;
				}

				rangeToClear = extendRangeBySelectionMode(rangeToClear, selectionMode, extendMode, null);

				this.beginUpdate();

				switch (selectionMode) {
					case "singlecell":
						if (rangeToClear._containsCellInfo(_selectedCells.item(0))) {
							this.clear();
						}
						break;

					case "singlecolumn":
					case "singlerow":
					case "singlerange":
						rowsLen = rangeToClear.bottomRight().rowIndex();
						cellsLen = rangeToClear.bottomRight().cellIndex();

						flag = false;
						for (row = rangeToClear.topLeft().rowIndex(); !flag && row <= rowsLen; row++) {
							for (cell = rangeToClear.topLeft().cellIndex(); !flag && cell <= cellsLen; cell++) {
								flag = _selectedCells.indexOf(cell, row) >= 0;
								if (flag) {
									this.clear();
								}
							}
						}
						break;

					case "multicolumn":
					case "multirow":
					case "multirange":
						for (i = 0, len = _selectedCells.length(); i < len; i++) {
							cellInfo = _selectedCells.item(i);

							if (rangeToClear._containsCellInfo(cellInfo)) {
								_removedCells._add(cellInfo);
							}
						}

						break;
				}

				this.endUpdate();
			}
		};

		this._selectRange = function (range, ctrlKey, shiftKey, extendMode, endPoint) {
			var selectionMode = gridView.options.selectionMode.toLowerCase(),
				rangeToSelect;

			if ((selectionMode !== "none") && range._isValid()) {
				rangeToSelect = range._clone();
				rangeToSelect._normalize();
				rangeToSelect._clip(gridView._getDataCellsRange());

				if (!rangeToSelect._isValid()) {
					return;
				}

				this.beginUpdate();

				if (!this._multipleRangesAllowed()) {
					this.clear();
				}
				else {
					if (ctrlKey || shiftKey) {
						if (shiftKey) {
							_removedCells._clear();
							_removedCells._addFrom(_addedDuringCurTransactionCells);
						}
					}
					else {
						this.clear();
					}
				}

				rangeToSelect = extendRangeBySelectionMode(rangeToSelect, selectionMode, extendMode, endPoint);
				doRange(rangeToSelect, true);

				this.endUpdate();
			}
		};

		// * internal

		// * private
		function extendRangeBySelectionMode(range, selectionMode, preferredExtendMode, endPoint) {
			var dataRange = gridView._getDataCellsRange();

			switch (selectionMode) {
				case "singlecell":
					range = (endPoint === null)
						? new $.wijmo.wijgrid.cellInfoRange(range.topLeft(), range.topLeft())
						: new $.wijmo.wijgrid.cellInfoRange(endPoint, endPoint);

					break;

				case "singlecolumn":
					range = (endPoint === null)
						? new $.wijmo.wijgrid.cellInfoRange(range.topLeft(), range.topLeft())
						: new $.wijmo.wijgrid.cellInfoRange(endPoint, endPoint);
					range._extend(1 /* extendToColumn */, dataRange);

					break;

				case "singlerow":
					range = (endPoint === null)
						? new $.wijmo.wijgrid.cellInfoRange(range.topLeft(), range.topLeft())
						: new $.wijmo.wijgrid.cellInfoRange(endPoint, endPoint);
					range._extend(2 /* extendToRow */, dataRange);
					break;

				case "singlerange":
					range._extend(preferredExtendMode, dataRange);
					break;

				case "multicolumn":
					range._extend(1 /* extendToColumn */, dataRange);
					break;

				case "multirow":
					range._extend(2 /* extendToRow */, dataRange);
					break;

				case "multirange":
					range._extend(preferredExtendMode, dataRange);
					break;
			}

			return range;
		}

		function doSelection() {
			var offsets = gridView._getDataToAbsOffset(),
				cellOffset = offsets.x,
				rowOffset = offsets.y,
				view = gridView._view(),
				i, len, info, cell, $cell, index,
				$rs = $.wijmo.wijgrid.renderState,
				rowInfo, state,
				prevRowIndex = -1;

			for (i = 0, len = _removedCells.length(); i < len; i++) {
				info = _removedCells.item(i);

				if (_addedCells.indexOf(info) < 0) {
					cell = view.getCell(info.cellIndex() + cellOffset, info.rowIndex() + rowOffset);

					if (cell) {
						if (prevRowIndex !== info.rowIndex()) {
							rowInfo = gridView._createRowInfo(info._row());
							prevRowIndex = info.rowIndex();
						}

						$cell = $(cell);
						state = gridView._changeRenderState($cell, $rs.selected, false);
						gridView.cellStyleFormatter.format($cell, info.cellIndex(), info.column(), rowInfo, state);
					}

					_selectedCells._remove(info);
					_addedDuringCurTransactionCells._remove(info);
				}
				else {
					_removedCells._removeAt(i);
					i--;
					len--;
				}
			}

			prevRowIndex = -1;

			for (i = 0, len = _addedCells.length(); i < len; i++) {
				info = _addedCells.item(i);

				index = _selectedCells.indexOf(info);
				if (index < 0) {
					cell = view.getCell(info.cellIndex() + cellOffset, info.rowIndex() + rowOffset);
					if (cell) {
						if (prevRowIndex !== info.rowIndex()) {
							rowInfo = gridView._createRowInfo(info._row());
							prevRowIndex = info.rowIndex();
						}

						$cell = $(cell);
						state = gridView._changeRenderState($cell, $rs.selected, true);
						gridView.cellStyleFormatter.format($cell, info.cellIndex(), info.column(), rowInfo, state);
					}
					_selectedCells._insertUnsafe(info, ~index);
					_addedDuringCurTransactionCells._add(info);
				}
				else {
					_addedCells._removeAt(i);
					i--;
					len--;
				}
			}
		}

		function doRange(range, add) {
			var x0 = range.topLeft().cellIndex(),
				y0 = range.topLeft().rowIndex(),
				x1 = range.bottomRight().cellIndex(),
				y1 = range.bottomRight().rowIndex(),
				cnt, row, col, cell;

			if (add) {
				cnt = _addedCells.length();
				for (row = y0; row <= y1; row++) {
					if (gridView.dataTable[row].rowType & $.wijmo.wijgrid.rowType.data) {
						for (col = x0; col <= x1; col++) {
							cell = new $.wijmo.wijgrid.cellInfo(col, row);

							if (cnt === 0) {
								_addedCells._appendUnsafe(cell);
							}
							else {
								_addedCells._add(cell);
							}
						}
					}
				}
			}
			else {
				cnt = _removedCells.length();
				for (row = y0; row <= y1; row++) {
					for (col = x0; col <= x1; col++) {
						cell = new $.wijmo.wijgrid.cellInfo(col, row);

						if (cnt === 0) {
							_removedCells._appendUnsafe(cell);
						}
						else {
							_removedCells._add(cell);
						}
					}
				}
			}
		}
		// * private
	};

	$.wijmo.wijgrid.cellInfoOrderedCollection = function (gridView) {
		/// <summary>
		/// Ordered read-only collection of a $.wijmo.wijgrid.cellInfo objects.
		/// Code example: var collection = new $.wijmo.wijgrid.cellInfoOrderedCollection(gridView);
		/// </summary>
		/// <param name="gridView" type="$.wijmo.wijgrid" mayBeNull="false">gridView</param>
		/// <returns type="$.wijmo.wijgrid.cellInfoOrderedCollection" />
		if (!gridView) {
			throw "argument is null";
		}

		var _list = [];

		// public
		this.item = function (index) {
			/// <summary>
			/// Gets an item at the specified index.
			/// Code example: var cellInfoObj = collection.item(0);
			/// </summary>
			/// <param name="index" type="Number" integer="true">The zero-based index of the item to get.</param>
			/// <returns type="$.wijmo.wijgrid.cellInfo">The $.wijmo.wijgrid.cellInfo object at the specified index.</returns>
			return _list[index];
		};

		this.length = function () {
			/// <summary>
			/// Gets the total number of the items in the collection.
			/// Code example: var len = collection.length();
			/// </summary>
			/// <returns type="Number" integet="true">The total number of the items in the collection.</returns>
			return _list.length;
		};

		// (cellInfo)
		// (cellIndex, rowIndex)
		this.indexOf = function (cellIndex, rowIndex) {
			/// <summary>
			/// Returns the zero-based index of specified collection item.
			///
			/// Usage:
			/// 1. indexOf(cellInfo) (note: search is done by value, not by reference).
			/// 2. indexOf(cellIndex, rowIndex)
			///
			/// Code example: var index = collection.indexOf(0, 0);
			/// </summary>
			///
			/// <param name="cellInfo" type="$.wijmo.wijgrid.cellInfo">A cellInfo object to return the index of.</param>
			/// <param name="cellIndex" type="Number" integer="true">A zero-based cellIndex component of the cellInfo object to return the index of.</param>
			/// <param name="rowIndex" type="Number" integer="true">A zero-based rowIndex component of the cellInfo object to return the index of.</param>
			/// <returns type="Number" integer="true">The zero-based index of the specified object, or -1 if the specified object is not a member of the collection.</returns>
			if (arguments.length === 1) {
				rowIndex = cellIndex.rowIndex();
				cellIndex = cellIndex.cellIndex();
			}

			var lo = 0,
				hi = _list.length - 1,
				med, current, cmp;

			while (lo <= hi) {
				med = lo + ((hi - lo) >> 1);
				current = _list[med];

				cmp = current.rowIndex() - rowIndex;
				if (cmp === 0) {
					cmp = current.cellIndex() - cellIndex;
				}

				if (cmp < 0) {
					lo = med + 1;
				} else {
					if (cmp > 0) {
						hi = med - 1;
					} else {
						return med;
					}
				}
			}

			return ~lo;
		};

		this.toString = function () {
			var val = "",
				i, len;

			for (i = 0, len = _list.length; i < len; i++) {
				val += _list[i].toString() + "\n";
			}

			return val;
		};

		// public *

		// internal

		this._add = function (value) {
			var idx = this.indexOf(value);
			if (idx < 0) {
				_list.splice(~idx, 0, value);
				value._setGridView(gridView);
				return true;
			}

			return false;
		};

		// addFrom - an cellInfoOrderedCollection instance
		this._addFrom = function (addFrom) {
			if (addFrom) {
				var fromLen = addFrom.length(),
				thisLen = _list.length,
				i;

				if (thisLen === 0) {
					_list.length = fromLen;

					for (i = 0; i < fromLen; i++) {
						_list[i] = addFrom.item(i);
						_list[i]._setGridView(gridView);
					}
				} else {
					for (i = 0; i < fromLen; i++) {
						this._add(addFrom.item(i));
					}
				}
			}
		};

		this._appendUnsafe = function (value) {
			_list[_list.length] = value;
			value._setGridView(gridView);
		};

		this._insertUnsafe = function (value, index) {
			_list.splice(index, 0, value);
		};

		this._clear = function () {
			_list.length = 0;
		};

		this._remove = function (value) {
			var idx = this.indexOf(value);
			if (idx >= 0) {
				_list.splice(idx, 1);
				return true;
			}

			return false;
		};

		this._removeAt = function (index) {
			_list.splice(index, 1);
		};

		this._getColumnsIndicies = function () {
			var columns = [],
				len = _list.length,
				tmpColumns, i, len2;

			if (len) {
				tmpColumns = [];
				for (i = 0; i < len; i++) {
					tmpColumns[_list[i].cellIndex()] = 1;
				}

				len = tmpColumns.length;
				len2 = 0;
				for (i = 0; i < len; i++) {
					if (tmpColumns[i]) {
						columns[len2++] = i;
					}
				}
			}

			return columns;
		};

		this._getSelectedRowsIndicies = function () {
			var rows = [],
				len = _list.length,
				tmpRows, i, len2;

			if (len) {
				tmpRows = [];
				for (i = 0; i < len; i++) {
					tmpRows[_list[i].rowIndex()] = 1;
				}

				len = tmpRows.length;
				len2 = 0;
				for (i = 0; i < len; i++) {
					if (tmpRows[i]) {
						rows[len2++] = i;
					}
				}
			}

			return rows;
		};

		this._rectangulate = function () {
			var len = _list.length,
				x0 = 0xFFFFFFFF,
				y0 = 0xFFFFFFFF,
				x1 = 0,
				y1 = 0,
				i, cellInfo;

			if (len) {
				for (i = 0; i < len; i++) {
					cellInfo = _list[i];

					x0 = Math.min(x0, cellInfo.cellIndex());
					y0 = Math.min(y0, cellInfo.rowIndex());
					x1 = Math.max(x1, cellInfo.cellIndex());
					y1 = Math.max(y1, cellInfo.rowIndex());
				}

				return new $.wijmo.wijgrid.cellInfoRange(new $.wijmo.wijgrid.cellInfo(x0, y0),
					new $.wijmo.wijgrid.cellInfo(x1, y1));
			}

			return null;
		};

		// internal *
	};
})(jQuery);(function ($) {
	"use strict";
	$.extend($.wijmo.wijgrid, {
		selectionui: function (gridView) {
			var _gap_to_start = 10,
				_evntFormat = "{0}." + gridView.widgetName + ".selectionui",
				_addedCells = new $.wijmo.wijgrid.cellInfoOrderedCollection(gridView),
				_startPos,
				_startCellInfo,
				_endCellInfo,
				_prevMouseMoveRange,
				_inProgress = false,
				_additionalEventsAttached = false,
				_view = gridView._view(),
				_visLeavesLen = gridView._field("visibleLeaves").length,
				_rootElement = _view.focusableElement(); //gridView.element;

			_rootElement.bind(_eventKey("mousedown"), _onGridMouseDown);

			this.dispose = function () {
				_rootElement.unbind(_eventKey("mousedown"), _onGridMouseDown);
				_detachAdditionalEvents();
			};

			function _onGridMouseDown(args) {
				if (!gridView._canInteract() || gridView.options.selectionMode.toLowerCase() === "none") {
					return;
				}

				var visibleBounds = _view.getVisibleAreaBounds(),
					mouse = { x: args.pageX, y: args.pageY },
					tag = ((args.target && args.target.tagName !== undefined)
						? args.target.tagName.toLowerCase()
						: undefined),
					$target = $(args.target);

				if ((!tag || $target.is("td.wijgridtd, th.wijgridtd, div.wijmo-wijgrid-innercell")) &&
					(mouse.x > visibleBounds.left && mouse.x < visibleBounds.left + visibleBounds.width) &&
					(mouse.y > visibleBounds.top && mouse.y < visibleBounds.top + visibleBounds.height)) {

					_attachAdditionalEvents();
					_startPos = mouse;

					_startCellInfo = _coordToDataCellInfo(_startPos);
				}
			}

			function _onDocumentMouseMove(args) {
				if (!_startCellInfo || !_startCellInfo._isValid()) {
					return;
				}

				var mouse = { x: args.pageX, y: args.pageY },
					tmp, range, dataOffset, desiredCells, rowsLen, cellsLen,
					row, cell, i, len, info, $cell,
					rowInfo, prevRowIndex, state,
					$rs = $.wijmo.wijgrid.renderState;

				if (!_inProgress) {
					_inProgress = (Math.abs(_startPos.x - mouse.x) > _gap_to_start) ||
						(Math.abs(_startPos.y - mouse.y) > _gap_to_start);
				}

				if (_inProgress) {
					tmp = _coordToDataCellInfo(mouse);
					if (!tmp._isValid()) {
						return;
					}

					_endCellInfo = tmp;

					range = new $.wijmo.wijgrid.cellInfoRange(_startCellInfo, _endCellInfo);
					range._normalize();
					range._clip(gridView._getDataCellsRange());

					if (range._isValid() && !range.isEqual(_prevMouseMoveRange)) {
						dataOffset = gridView._getDataToAbsOffset();

						_prevMouseMoveRange = range;

						desiredCells = new $.wijmo.wijgrid.cellInfoOrderedCollection(gridView);
						rowsLen = range.bottomRight().rowIndex();
						cellsLen = range.bottomRight().cellIndex();

						for (row = range.topLeft().rowIndex(); row <= rowsLen; row++) {
							if (gridView.dataTable[row].rowType & $.wijmo.wijgrid.rowType.data) {
								for (cell = range.topLeft().cellIndex(); cell <= cellsLen; cell++) {
									desiredCells._appendUnsafe(new $.wijmo.wijgrid.cellInfo(cell, row));
								}
							}
						}

						prevRowIndex = -1;
						for (i = 0, len = _addedCells.length(); i < len; i++) {
							info = _addedCells.item(i);
							if (desiredCells.indexOf(info) < 0) // remove css
							{
								if (gridView.selection().selectedCells().indexOf(info) < 0) {
									cell = _view.getCell(info.cellIndex() + dataOffset.x, info.rowIndex() + dataOffset.y);
									if (cell) {
										if (prevRowIndex !== info.rowIndex()) {
											rowInfo = gridView._createRowInfo(info._row());
											prevRowIndex = info.rowIndex();
										}

										$cell = $(cell);
										state = gridView._changeRenderState($cell, $rs.selected, false);
										gridView.cellStyleFormatter.format($cell, info.cellIndex(), info.column(), rowInfo, state);
									}
								}

								_addedCells._removeAt(i);
								i--;
								len--;
							}
						}

						prevRowIndex = -1;
						for (i = 0, len = desiredCells.length(); i < len; i++) {
							info = desiredCells.item(i);
							if (_addedCells.indexOf(info) < 0 && gridView.selection().selectedCells().indexOf(info) < 0) {
								if (_addedCells._add(info)) {
									cell = _view.getCell(info.cellIndex() + dataOffset.x, info.rowIndex() + dataOffset.y);
									if (cell) {
										if (prevRowIndex !== info.rowIndex()) {
											rowInfo = gridView._createRowInfo(info._row());
											prevRowIndex = info.rowIndex();
										}

										$cell = $(cell);
										state = gridView._changeRenderState($cell, $rs.selected, true);
										gridView.cellStyleFormatter.format($cell, info.cellIndex(), info.column(), rowInfo, state);
									}
								}
							}
						}
					} // end if
				}
			}

			function _onDocumentMouseUp(args) {
				_detachAdditionalEvents();

				if (_inProgress) {
					_inProgress = false;

					if (_prevMouseMoveRange && _prevMouseMoveRange._isValid()) {
						gridView._changeCurrentCell(_endCellInfo);

						if (!args.shiftKey || (!gridView.selection()._multipleRangesAllowed() && gridView.options.selectionMode.toLowerCase() !== "singleRange")) {
							gridView.selection()._startNewTransaction(_startCellInfo);
						}

						gridView.selection().beginUpdate();
						gridView.selection()._selectRange(_prevMouseMoveRange, args.shiftKey, args.ctrlKey, 0 /* none */, _endCellInfo);
						gridView.selection().endUpdate();

						var view = gridView._view(),
							dataOffset = gridView._getDataToAbsOffset(),
							i, len, info, cell, $cell,
							prevRowIndex = -1, rowInfo, state,
							$rs = $.wijmo.wijgrid.renderState;

						// clear remained cells
						for (i = 0, len = _addedCells.length(); i < len; i++) {
							info = _addedCells.item(i);
							if (gridView.selection().selectedCells().indexOf(info) < 0) {
								cell = view.getCell(info.cellIndex() + dataOffset.x, info.rowIndex() + dataOffset.y);
								if (cell !== null) {
									if (prevRowIndex !== info.rowIndex()) {
										rowInfo = gridView._createRowInfo(info._row());
										prevRowIndex = info.rowIndex();
									}

									$cell = $(cell);
									state = gridView._changeRenderState($cell, $rs.selected, false);
									gridView.cellStyleFormatter.format($cell, info.cellIndex(), info.column(), rowInfo, state);
								}
							}
						}

						_addedCells._clear();
						_startCellInfo = _endCellInfo = _prevMouseMoveRange = null;

						return false; // cancel bubbling
					}
				}
			}

			function _attachAdditionalEvents() {
				if (!_additionalEventsAttached) {
					try {
						$(document)
							.bind(_eventKey("mousemove"), _onDocumentMouseMove)
							.bind(_eventKey("mouseup"), _onDocumentMouseUp);
					}
					finally {
						_additionalEventsAttached = true;
					}
				}
			}

			function _detachAdditionalEvents() {
				if (_additionalEventsAttached) {
					try {
						$(document)
							.unbind(_eventKey("mousemove"), _onDocumentMouseMove)
							.unbind(_eventKey("mouseup"), _onDocumentMouseUp);
					} finally {
						_additionalEventsAttached = false;
					}
				}
			}

			function _eventKey(eventType) {
				return $.wijmo.wijgrid.stringFormat(_evntFormat, eventType);
			}

			function _coordToDataCellInfo(pnt /* {x, y} */) {
				var left = 0,
					right = _visLeavesLen - 1,
					median = 0,
					cellIdx = -1,
					bounds,
					gridRowsAccessor = new $.wijmo.wijgrid.rowAccessor(_view, 2 /* tbody */, 0, 0),
					rowIdx, rowObj, dataOffset, result;

				// get cell index
				while (left <= right) {
					median = ((right - left) >> 1) + left;

					bounds = $.wijmo.wijgrid.bounds(_view.getHeaderCell(median)); // get header cell
					if (!bounds) { // no header?
						rowObj = gridRowsAccessor.item(0);
						bounds = $.wijmo.wijgrid.bounds(gridRowsAccessor.getCell(rowObj, median)); // get data cell
					}

					if (!bounds) {
						break;
					}

					if (pnt.x < bounds.left) { // -1 
						right = median - 1;
					}
					else
						if (pnt.x > bounds.left + bounds.width) { // 1
							left = median + 1;
						} else { // 0
							cellIdx = median;
							break;
						}
				}

				if (cellIdx === -1) {
					return $.wijmo.wijgrid.cellInfo.prototype.outsideValue;
				}

				gridRowsAccessor = new $.wijmo.wijgrid.rowAccessor(_view, 0 /* all */, 0, 0);

				rowIdx = -1;
				left = 0;
				right = gridRowsAccessor.length() - 1;
				median = 0;

				// get row index
				while (left <= right) {
					median = ((right - left) >> 1) + left;
					rowObj = gridRowsAccessor.item(median);
					bounds = $.wijmo.wijgrid.bounds(gridRowsAccessor.getCell(rowObj, 0));

					if (pnt.y < bounds.top) { // -1
						right = median - 1;
					}
					else
						if (pnt.y > bounds.top + bounds.height) { // 1
							left = median + 1;
						} else { // 0
							rowIdx = median;
							break;
						}
				} // end while { }


				if (rowIdx === -1) {
					return $.wijmo.wijgrid.cellInfo.prototype.outsideValue;
				}

				dataOffset = gridView._getDataToAbsOffset();

				result = new $.wijmo.wijgrid.cellInfo(cellIdx - dataOffset.x, rowIdx - dataOffset.y);
				result._clip(gridView._getDataCellsRange());

				return result;
			}
		}
	});
})(jQuery);(function ($) {
	"use strict";
	$.wijmo.wijgrid.rowAccessor = function (view, scope, offsetTop, offsetBottom) {
		/// <summary>
		/// Object for convenient access to rows of a wijgrid widget.
		/// </summary>

		if (!offsetTop) {
			offsetTop = 0;
		}

		if (!offsetBottom) {
			offsetBottom = 0;
		}

		this.item = function (index) {
			/// <summary>
			/// Gets an array of the table row elements that represents a wijgrid widget row at the specified index.
			/// remark: size of returning array is always two.
			/// </summary>
			/// <param name="index" type="Number" integer="true">
			/// The zero-based index of the row to retrieve.
			/// </param>
			/// <returns type="Array" elementType="object" elementDomElement="true">
			/// The array of the table row elements at the specified index.
			/// </returns>
			var len = this.length();

			return (index < len)
				? view.getJoinedRows(index + offsetTop, scope)
				: null;
		};

		this.length = function () {
			/// <summary>
			/// Gets the total number of elements.
			/// </summary>
			var joinedTables = view.getJoinedTables(true, 0),
				len = 0, htmlAccessor;

			if (htmlAccessor = joinedTables[0]) {
				len = htmlAccessor.getSectionLength(scope);
			}

			if (htmlAccessor = joinedTables[1]) {
				len += htmlAccessor.getSectionLength(scope);
			}

			len -= offsetTop + offsetBottom;

			if (len < 0) {
				len = 0;
			}

			return len;
		};

		this.iterateCells = function (rowObj, callback, param) {
			/// <summary>
			/// Sequentially iterates the cells in a <paramref name="rows"/> array.
			///
			/// example:
			/// Suppose rows is an array containing the following data:
			/// [ ["a", "b"], ["c", "d", "e"] ]
			///
			/// When it is iterated it will sequentially return:
			/// "a", "b", "c", "d", "e"
			/// </summary>
			/// <param name="rowObj" type="Array" elementType="Object" elementDomElement="true">Array of rows to be iterated.</param>
			/// <param name="callback" type="Function">Function that will be called each time a new cell is reached.</param>
			/// <param name="param" type="Object" optional="true">Parameter that can be handled within the callback function.</param>
			if (rowObj && callback) {
				var globCellIdx = 0,
					i, len, domRow, j, cellLen, result;

				for (i = 0, len = rowObj.length; i < len; i++) {
					domRow = rowObj[i];

					if (domRow) {
						for (j = 0, cellLen = domRow.cells.length; j < cellLen; j++) {
							result = callback(domRow.cells[j], globCellIdx++, param);
							if (result !== true) {
								return;
							}
						}
					}
				}
			}
		};

		this.getCell = function (rowObj, globCellIndex) {
			/// <summary>
			/// Gets a cell by its global index in a row's array passed in rowObj.
			/// 
			/// example:
			/// Suppose rows is an array containing the following data:
			/// [ ["a", "b"], ["c", "d", "e"] ]
			///
			/// "a" symbol has a global index 0.
			/// "c" symbol has a global index 2.
			/// </summary>
			/// <param name="rowObj" type="Array" elementType="Object" elementDomElement="true">Array of table row elements.</param>
			/// <param name="index" type="Number" integer="true">Zero-based global index of a cell.</param>
			/// <returns type="Object" domElement="true" elementMayBeNull="true">
			/// A cell or null if a cell with provided index is not found.
			/// </returns>
			var domRow, cellLen;

			if (rowObj && (domRow = rowObj[0])) {
				cellLen = domRow.cells.length;
				if (globCellIndex < cellLen) {
					return domRow.cells[globCellIndex];
				}

				globCellIndex -= cellLen;

				if (domRow = rowObj[1]) {
					cellLen = domRow.cells.length;
					if (globCellIndex < cellLen) {
						return domRow.cells[globCellIndex];
					}
				}
			}

			return null;
		};

		this.cellsCount = function (rowObj) {
			/// <summary>
			/// Gets the number of cells in a array of table row elements.
			/// </summary>
			/// <param name="rowObj" type="Array" elementType="Object" elementDomElement="true">Array of table row elements.</param>
			/// <returns type="Number" integer="true">The number of cells in a array of table row elements.</returns>
			var res = 0,
				domRow;

			if (rowObj && (domRow = rowObj[0])) {
				res = domRow.cells.Length;

				if (domRow = rowObj[1]) {
					res += domRow.cells.Length;
				}
			}

			return res;
		};
	};
})(jQuery);(function ($) {
	"use strict";
	$.extend($.wijmo.wijgrid, {
		cellEditorHelper: function () {
			this.currentCellEditStart = function (grid, e) {
				var result = false,
					currentCell = grid.currentCell(),
					rowObj, args, $innerDiv, rowType;

				if (currentCell._isValid() && !currentCell._isEdit() && (currentCell.column().dataIndex >= 0)) {
					rowObj = currentCell._row();

					if (rowObj && rowObj.length) {
						//rowType = $.wijmo.wijgrid.dataPrefix($(rowObj[0]), grid._data$prefix, "rowType");
						rowType = $.wijmo.wijgrid.dataPrefix(rowObj[0], grid._data$prefix, "rowType");

						if (rowType & $.wijmo.wijgrid.rowType.data) {

							args = {
								cell: currentCell,
								event: e,
								handled: false
							};

							if (result = grid._trigger("beforeCellEdit", null, args)) { // todo
								if (!args.handled) {
									result = defaultBeforeCellEdit(grid, args);
								}
							}

							if (result) {
								currentCell._isEdit(true);

								if (grid.options.showRowHeader) {
									$innerDiv = $(rowObj[0].cells[0]).children("div.wijmo-wijgrid-innercell");
									if ($innerDiv.length) {
										$innerDiv.empty();
										$innerDiv.append($("<div>&nbsp;</div>").addClass("ui-icon ui-icon-pencil"));
									}
								}
							}
						}
					}
				}

				return result;
			};

			this.currentCellEditEnd = function (grid, e) {
				var currentCell = grid.currentCell(),
					result = false,
					rowObj, rowType, escPressed, args, valueIsChanged, a, b;

				if (!currentCell._isValid() || !currentCell._isEdit()) {
					return;
				}

				rowObj = currentCell._row();
				if (rowObj && rowObj.length) {
					//rowType = $.wijmo.wijgrid.dataPrefix($(rowObj[0]), grid._data$prefix, "rowType");
					rowType = $.wijmo.wijgrid.dataPrefix(rowObj[0], grid._data$prefix, "rowType");

					if (!(rowType & $.wijmo.wijgrid.rowType.data)) {
						return result;
					}

					escPressed = (e && e.which === $.ui.keyCode.ESCAPE);

					if (!e || (!escPressed)) {
						args = {
							cell: currentCell,
							value: undefined
						};

						if (result = grid._trigger("beforeCellUpdate", null, args)) {
							if (args.value === undefined) {
								args.value = getCellValue(grid, currentCell); // trying to get value using default implementation.
							}

							valueIsChanged = false;
							if (args.cell.column().dataType === "datetime") {
								a = args.value ? args.value.getTime() : null;
								b = currentCell.value() ? currentCell.value().getTime() : null;
								valueIsChanged = a !== b;

							} else {
								valueIsChanged = args.value !== currentCell.value();
							}

							if (valueIsChanged) {
								// ** update datasource
								try {
									currentCell.value(args.value);
								} catch (ex) {
									result = false;
									grid._trigger("invalidCellValue", null, { cell: currentCell, value: args.value });
								}

								if (result) {
									grid._trigger("afterCellUpdate", null, { cell: currentCell });
								}
							}
						}
					} else {
						// ESC key
						result = true;
					}

					if (result) {
						args = {
							cell: currentCell,
							event: e,
							handled: false
						};

						grid._trigger("afterCellEdit", null, args);

						if (!args.handled) {
							result = defaultAfterCellEdit(grid, args);
						}

						if (result) {
							currentCell._isEdit(false);
						}

						if (grid.options.showRowHeader) {
							$(rowObj[0].cells[0]).children("div.wijmo-wijgrid-innercell").html("&nbsp;"); // remove ui-icon-pencil
						}

						grid.element.focus();
						$(grid._view().focusableElement()).focus();
						currentCell.tableCell().focus();
					}
				}

				return result;
			};

			// private

			function defaultBeforeCellEdit(grid, args) {
				var leafOpt = args.cell.column(),
					result = false,
					value, $container, $input, len, kbEvent;

				if (leafOpt.dataIndex >= 0) {
					value = args.cell.value();
					result = true;

					try {
						$container = args.cell.container();

						if (leafOpt.dataType === "boolean") {
							$input = $container.children("input");
							$input.focus();
							if (args.event && args.event.type === "keypress") {
								$input.one("keyup", function (e) {
									if (e.which === $.ui.keyCode.SPACE) {
										e.preventDefault();
										$input[0].checked = !value;
									}
								});
							}
						} else {
							$input = $("<input />")
								.attr("type", "text")
								.addClass("wijgridinput wijmo-wijinput ui-state-focus")
								.bind("keydown", grid, checkBoxOrInputKeyDown);

							if (args.event && args.event.type === "keypress" && args.event.which) {
								$input.val(String.fromCharCode(args.event.which));
							} else {
								switch (args.cell.column().dataType) {
									case "currency":
									case "number":
										if (value !== null) {
											$input.val(value); // ignore formatting
											break;
										}
										// fall through
									default:
										$input.val(grid._toStr(args.cell.column(), value));
										break;
								}
							}

							$container
								.empty()
								.append($input);

							// move caret to the end of the text
							len = $input.val().length;
							new $.wijmo.wijgrid.domSelection($input[0]).setSelection({ start: len, end: len });

							$input.focus();

							if ($.browser.msie) {
								setTimeout(function () {
									$input.focus();
								}, 0);
							}

							// FF issue: text does not track to the new position of the caret
							if ($.browser.mozilla && document.createEvent && $input[0].dispatchEvent) {
								kbEvent = document.createEvent("KeyboardEvent");
								kbEvent.initKeyEvent("keypress", false, true, null, false, false, false, false, 0, $.ui.keyCode.SPACE);
								$input[0].dispatchEvent(kbEvent);
								kbEvent = document.createEvent("KeyboardEvent");
								kbEvent.initKeyEvent("keypress", false, true, null, false, false, false, false, $.ui.keyCode.BACKSPACE, 0);
								$input[0].dispatchEvent(kbEvent);
							}
						}
					}
					catch (ex) {
						alert(ex.message);
						result = false;
					}
				}

				return result;
			}

			function defaultAfterCellEdit(grid, args) {
				var leafOpt = args.cell.column(),
					result = false,
					$container, cellValue, dataRow, sourceDataRow, input;

				if (leafOpt.dataIndex >= 0) {
					result = true;

					try {
						$container = args.cell.container();
						cellValue = grid._toStr(leafOpt, args.cell.value());

						dataRow = grid.dataTable[args.cell.rowIndex()];
						sourceDataRow = grid.data()[dataRow.originalRowIndex];
						if (leafOpt.dataType === "boolean") {
							input = $container.children("input");

							if (cellValue === "true") {
								input.attr("checked", "checked");
							}
							else {
								input.removeAttr("checked");
							}
						}
						else {
							grid.cellFormatter.format($container, leafOpt, cellValue, dataRow.rowType, sourceDataRow);
						}
					}
					catch (ex) {
						alert("defaultAfterCellEdit: " + ex.message);
						result = false;
					}
				}

				return result;
			}

			function checkBoxOrInputKeyDown(args) {
				if (args.which === $.ui.keyCode.ENTER) { // stop editing when Enter key is pressed
					var grid = args.data;

					if (grid) {
						grid._endEditInternal(args);
						return false; // prevent submit behaviour.
					}
				}
			}

			function getCellValue(gridView, currentCell) {
				var $input = currentCell.container().find(":input:first"),
					result = null;

				if ($input.length) {
					result = ($input.attr("type") === "checkbox")
						? $input[0].checked
						: $input.val();

					result = gridView._parse(currentCell.column(), result);
				}

				return result;
			}

			// private *
		}
	});
})(jQuery);(function ($) {
	"use strict";
	$.extend($.wijmo.wijgrid, {

		resizer: function (gridView) {
			var _elements = [],
				_gap = 10,
				_step = 1,
				_evntFormat = "{0}." + gridView.widgetName + ".resizer",
				_inProgress = false,
				_hoveredField = null,
				_docCursor,
				_startLocation = null,
				_lastLocation = null,
				_proxy = null;

			this.addElement = function (c1basefield) {
				if (c1basefield && c1basefield.element) {
					c1basefield.element
					.bind(eventKey("mousemove"), _onMouseMove)
					.bind(eventKey("mousedown"), _onMouseDown)
					.bind(eventKey("mouseout"), _onMouseOut);

					_elements.push(c1basefield);
				}
			};

			this.dispose = function () {
				$.each(_elements, function (index, c1basefield) {
					c1basefield.element
						.unbind(eventKey("mousemove"), _onMouseMove)
						.unbind(eventKey("mousedown"), _onMouseDown)
						.unbind(eventKey("mouseout"), _onMouseOut);
				});

				detachDocEvents();
			};

			this.inProgress = function () {
				return _inProgress;
			};

			function _onMouseMove(e) {
				if (!_inProgress) {
					var hoveredField = getFieldByPos({ x: e.pageX, y: e.pageY });
					if (hoveredField && hoveredField._canSize() && gridView._canInteract()) {
						hoveredField.element.css("cursor", "e-resize");
						//hoveredField.element.find("> a").css("cursor", "e-resize");
						_hoveredField = hoveredField;
					} else {
						_onMouseOut(e);
					}
				}
			}

			function _onMouseOut(e) {
				if (!_inProgress) {
					if (_hoveredField) {
						_hoveredField.element.css("cursor", "");
						//_hoveredField.element.find("> a").css("cursor", "");
						_hoveredField = null;
					}
				}
			}

			function _onMouseDown(e) {
				_hoveredField = getFieldByPos({ x: e.pageX, y: e.pageY });
				if (_hoveredField && _hoveredField._canSize() && gridView._canInteract()) {
					try {
						_hoveredField.element.css("cursor", "");
						// _hoveredField.element.find("> a").css("cursor", "");

						_docCursor = document.body.style.cursor;
						document.body.style.cursor = "e-resize";
						_startLocation = _lastLocation = $.wijmo.wijgrid.bounds(_hoveredField.element);

						_proxy = $("<div class=\"wijmo-wijgrid-resizehandle ui-state-highlight\">&nbsp;</div>");

						_proxy.css({ "left": e.pageX, "top": _startLocation.top,
							"height": gridView._view().getVisibleAreaBounds().height/* - _hoveredField.element[0].offsetTop*/
						});

						$(document.body).append(_proxy);
					}
					finally {
						attachDocEvents();
						_inProgress = true;
					}
				}
			}

			function _onDocumentMouseMove(e) {
				var deltaX = _step * Math.round((e.pageX - _lastLocation.left) / _step);

				_lastLocation = { left: _lastLocation.left + deltaX, top: e.pageY };
				_proxy.css("left", _lastLocation.left);
			}

			function _onDocumentMouseUp(e) {
				try {
					document.body.style.cursor = _docCursor;

					// destroy proxy object
					_proxy.remove();

					if (_startLocation !== _lastLocation) {
						gridView._fieldResized(_hoveredField, _startLocation.width, _lastLocation.left - _startLocation.left);
					}
				}
				finally {
					_hoveredField = null;
					_proxy = null;
					detachDocEvents();
					_inProgress = false;
				}
			}

			function _onSelectStart(e) {
				e.preventDefault();
			}

			function attachDocEvents() {
				if (!_inProgress) {
					$(document)
						.bind(eventKey("mousemove"), _onDocumentMouseMove)
						.bind(eventKey("mouseup"), _onDocumentMouseUp);

					$(document.body).disableSelection();

					if ($.browser.msie) {
						$(document.body).bind("selectstart", _onSelectStart);
					}
				}
			}

			function detachDocEvents() {
				if (_inProgress) {
					$(document)
						.unbind(eventKey("mousemove"), _onDocumentMouseMove)
						.unbind(eventKey("mouseup"), _onDocumentMouseUp);

					$(document.body).enableSelection();
					if ($.browser.msie) {
						$(document.body).unbind("selectstart", _onSelectStart);
					}
				}
			}

			function getFieldByPos(mouse) {
				var i, len, c1basefield, bounds, res;

				for (i = 0, len = _elements.length; i < len; i++) {
					c1basefield = _elements[i];
					bounds = $.wijmo.wijgrid.bounds(c1basefield.element);

					res = $.ui.isOver(mouse.y, mouse.x,
					bounds.top, bounds.left + bounds.width - _gap,
					bounds.height, _gap);

					if (res) {
						return c1basefield;
					}
				}

				return null;
			}

			function eventKey(eventType) {
				return $.wijmo.wijgrid.stringFormat(_evntFormat, eventType);
			}
		}
	});
})(jQuery);(function ($) {
	"use strict";
	$.extend($.wijmo.wijgrid, {
		cellFormatterHelper: function () {
			this.format = function ($container, column, formattedValue, rowInfo) {
				if (rowInfo.type & $.wijmo.wijgrid.rowType.footer) {
					if (column.aggregate && (column.aggregate !== "none"))  {
						formattedValue = $.wijmo.wijgrid.stringFormat(column.footerText || "{0}", column._totalsValue || "");
					} else {
						formattedValue = column.footerText || column._footerTextDOM || "";
					}
				}

				var useDefault = true,
					defaultFormatter = null,
					args = {
						$container: $container,
						column: column,
						formattedValue: formattedValue,
						row: rowInfo,
						afterDefaultCallback: null
					};

				if ($.isFunction(column.cellFormatter)) {
					useDefault = !column.cellFormatter(args);
				}

				if (useDefault) {
					switch (column.dataType) {
						case "boolean":
							defaultFormatter = boolFormatter;
							break;

						default:
							defaultFormatter = textFormatter;
					}

					if (defaultFormatter) {
						defaultFormatter(args);

						if ($.isFunction(args.afterDefaultCallback)) {
							args.afterDefaultCallback(args);
						}
					}
				}
			};

			// * private
			function textFormatter(args) {
				switch (args.row.type) {
					case $.wijmo.wijgrid.rowType.filter:
						defFormatFilterCell(args);
						break;

					default:
						args.$container.html(args.formattedValue ? args.formattedValue : "&nbsp;");
				}
			}

			function boolFormatter(args) {
				var grid, allowEditing, disableStr = "disabled='disabled'", targetElement, currentCell,
					$rt = $.wijmo.wijgrid.rowType;

				switch (args.row.type) {
					case $rt.data:
					case $rt.data | $rt.dataAlt:
						grid = args.column.owner;
						allowEditing = grid.options.allowEditing && (args.column.readOnly !== true);

						if (allowEditing) {
							disableStr = "";
						}

						if (grid._parse(args.column, args.row.data[args.column.dataKey]) === true) {
							args.$container.html("<input class='wijgridinput' type='checkbox' checked='checked' " + disableStr + " />");
						} else {
							args.$container.html("<input class='wijgridinput' type='checkbox' " + disableStr + " />");
						}

						if (allowEditing) {
							args.$container.children("input").bind("mousedown", function (e) {
								targetElement = args.$container.parent()[0];
								currentCell = grid.currentCell();
								if (currentCell.tableCell() !== targetElement) {
									grid._onClick({ target: targetElement });
								}
								if (!currentCell._isEdit()) {
									grid.beginEdit();
								}
							}).bind("keydown", function (e) {
								if (e.which === $.ui.keyCode.ENTER) {
									grid._endEditInternal(e);
									return false;
								}
							});
						}
						break;

					case $rt.filter:
						defFormatFilterCell(args);
						break;
				}
			}

			function defFormatFilterCell(args) {
				if ((args.column.dataIndex >= 0) && !args.column.isBand && args.column.showFilter) {
					args.$container.html("<div class=\"wijmo-wijgrid-filter ui-widget ui-state-default ui-corner-all\"><span class=\"wijmo-wijgrid-filtericon\"></span><input type=\"text\" class=\"wijmo-wijgrid-filter-input\" style=\"width:1px\" /><a class=\"wijmo-wijgrid-filter-trigger ui-corner-right ui-state-default\" href=\"#\"><span class=\"ui-icon ui-icon-triangle-1-s\"></span></a></div>");
				} else {
					args.$container.html("&nbsp;");
				}
			}

			// * private
		}
	});
})(jQuery);(function ($) {
	"use strict";
	$.extend($.wijmo.wijgrid, {
		dragAndDropHelper: function (wijgrid) {
			var _scope_guid = "scope_" + new Date().getTime(),
				_$bottomArrow = null,
				_$topArrow = null,
				_droppableWijField = null, // to use inside the draggable.drag event.
				_dragEnd = false,
				_dropTargetRedirected, // handles the situation when draggable is moved over the non-empty group area, in this case we assume the rightmost header in the group area as droppable instead of group area itself.
				_wrapHtml = "<div class=\"ui-widget wijmo-wijgrid ui-widget-content ui-corner-all\">" +
								"<table class=\"wijmo-wijgrid-root wijmo-wijgrid-table\">" +
									"<tr class=\"wijmo-wijgrid-headerrow\">" +
									"</tr>" +
								 "</table>" +
							"</div>";

			this.attachGroupArea = function (element) {
				var draggedWijField;
				element.droppable({
					scope: _scope_guid,
					tolerance: "pointer",
					greedy: true,

					accept: function (draggable) {
						if (wijgrid.options.allowColMoving) {
							draggedWijField = _getWijFieldInstance(draggable);

							if (draggedWijField) {
								// The rightmost column header in the the group area can't be dragged to the end of the group area again.
								if ((draggedWijField instanceof $.wijmo.c1groupedfield) && (draggedWijField.options.groupedIndex === wijgrid._field("groupedColumns").length - 1)) {
									return false;
								}

								return !draggedWijField.options.isBand && (draggedWijField.options.groupedIndex === undefined || (draggedWijField instanceof $.wijmo.c1groupedfield));
							}
						}
						return false;
					},

					drop: function (e, ui) {
						if (!_isInElement(e, ui.draggable) && (draggedWijField = _getWijFieldInstance(ui.draggable))) {
							_dragEnd = true;
						}
					},

					over: function (e, ui) {
						var cnt = wijgrid._field("groupedWidgets").length;

						_dropTargetRedirected = (cnt > 0);
						_droppableWijField = (cnt > 0)
							? wijgrid._field("groupedWidgets")[cnt - 1] // use the rightmost header as a drop target
							: element; // special case, the drop target is the group area itself

						element.data("thisDroppableWijField", _droppableWijField);
					},

					out: function (e, ui) {
						if (_droppableWijField === element.data("thisDroppableWijField")) {
							_droppableWijField = null;
						}

						//if (draggedWijField = _getWijFieldInstance(ui.draggable)) {
						//	_hideArrows();
						//}
					}
				});
			};

			this.attach = function (wijField) {
				var element, draggedWijField;

				if (!wijField || !(element = wijField.element)) {
					return;
				}

				element
				.draggable({
					helper: function (e) {
						if (wijField instanceof $.wijmo.c1groupedfield) {
							return element
								.clone()
								.addClass("wijmo-wijgrid-dnd-helper");
						} else {
							return element
								.clone()
								.wrap(_wrapHtml)
								.width(element.width())
								.height(element.height())
								.closest(".wijmo-wijgrid")
								.addClass("wijmo-wijgrid-dnd-helper");

							/*return element
							.clone()
							.width(element.width())
							.height(element.height())
							.addClass("wijmo-wijgrid-dnd-helper");*/
						}
					},

					appendTo: "body",
					//cursor: "pointer",
					scope: _scope_guid,

					drag: function (e, ui) {
						_hideArrows();

						if (_droppableWijField && !_isInElement(e, element)) {
							// indicate insertion position

							var $arrowsTarget = _droppableWijField.element;
							if (!$arrowsTarget) { // _droppableWijField is the group area element
								$arrowsTarget = _droppableWijField;
							}

							_showArrows($arrowsTarget, _getPosition(wijField, _droppableWijField, e, ui));
						}
					},

					start: function (e, ui) {
						if (wijgrid._canInteract() && wijgrid.options.allowColMoving && !wijgrid._field("resizer").inProgress()) {
							//return (wijField._canDrag() === true);

							var column = wijField.options,
								travIdx = wijField.options.travIdx,
								dragInGroup = (wijField instanceof $.wijmo.c1groupedfield),
								dragSource = dragInGroup ? "groupArea" : "columns";

							if (dragInGroup) {
								column = $.wijmo.wijgrid.search(wijgrid.columns(), function (test) {
									return test.options.travIdx === travIdx;
								});

								column = (!column.found) // grouped column is invisible?
									? $.wijmo.wijgrid.getColumnByTravIdx(wijgrid.options.columns, travIdx).found
									: column.found.options;
							}

							if (wijField._canDrag() && wijgrid._trigger("columnDragging", null, { drag: column, dragSource: dragSource })) {
								wijgrid._trigger("columnDragged", null, { drag: column, dragSource: dragSource });
								return true;
							}
						}

						return false;
					},

					stop: function (e, ui) {
						_hideArrows();

						try {
							if (_dragEnd) {
								if (!_droppableWijField.element) { // _droppableWijField is the group area element
									wijgrid._handleDragnDrop(wijField.options.travIdx,
											-1,
											"left",
											wijField instanceof $.wijmo.c1groupedfield,
											true
										);
								} else {
									wijgrid._handleDragnDrop(wijField.options.travIdx,
										_droppableWijField.options.travIdx,
										_getPosition(wijField, _droppableWijField, e, ui),
										wijField instanceof $.wijmo.c1groupedfield,
										_droppableWijField instanceof $.wijmo.c1groupedfield
									);
								}
							}
						}
						finally {
							_droppableWijField = null;
							_dragEnd = false;
						}
					}
				}) // ~draggable

				.droppable({
					hoverClass: "ui-state-hover",
					scope: _scope_guid,
					tolerance: "pointer",
					greedy: true,

					accept: function (draggable) {
						if (wijgrid.options.allowColMoving) {
							if (element[0] !== draggable[0]) { // different DOM elements
								draggedWijField = _getWijFieldInstance(draggable); // dragged column

								if (draggedWijField) {
									return draggedWijField._canDropTo(wijField);
								}
							}
						}
						return false;
					},

					drop: function (e, ui) {
						if (draggedWijField = _getWijFieldInstance(ui.draggable)) {
							// As droppable.drop fires before draggable.stop, let draggable to finish action.
							// Otherwise exception is thrown as during re-rendering element bound to draggable will be already deleted.
							_dragEnd = true;

							// an alternative:
							//window.setTimeout(function () {
							//wijgrid._handleDragnDrop(draggedWijField, wijField, _getPosition(draggedWijField, wijField, e, ui));
							//}, 100);
						}
					},

					over: function (e, ui) {
						_dropTargetRedirected = false;
						_droppableWijField = wijField;

						// to track when droppable.over event of other element fires before droppable.out of that element.
						element.data("thisDroppableWijField", _droppableWijField);
					},

					out: function (e, ui) {
						if (_droppableWijField === wijField.element.data("thisDroppableWijField")) {
							_droppableWijField = null;
						}

						//if (draggedWijField = _getWijFieldInstance(ui.draggable)) {
						//	_hideArrows();
						//}
					}
				}); // ~droppable
			};

			this.detach = function (wijField) {
				var element;

				if (wijField && (element = wijField.element)) {
					if (element.data("draggable")) {
						element.draggable("destroy");
					}

					if (element.data("droppable")) {
						element.droppable("destroy");
					}
				}
			};

			this.dispose = function () {
				if (_$topArrow) {
					_$topArrow.remove();
					_$topArrow = null;
				}

				if (_$bottomArrow) {
					_$bottomArrow.remove();
					_$bottomArrow = null;
				}
			};

			// private
			function _getWijFieldInstance(draggable) {
				var widgetName = draggable.data($.wijmo.c1basefield.prototype._data$prefix + "widgetName");
				if (!widgetName) {
					return draggable.data($.wijmo.c1groupedfield.prototype._data$prefix);
				} else {
					return draggable.data(widgetName);
				}
			}

			// position: "left", "right", "center"
			function _showArrows($element, position) {
				_topArrow()
					.show()
					.position({
						my: "center",
						at: position + " top",
						of: $element
					});

				_bottomArrow()
					.show()
					.position({
						my: "center",
						at: position + " bottom",
						of: $element
					});
			}

			function _hideArrows() {
				_topArrow().hide();
				_bottomArrow().hide();
			}

			function _topArrow() {
				if (!_$topArrow) {
					_$topArrow = $("<div />")
						.addClass("wijmo-wijgrid-dnd-arrow-top")
						.append($("<span />").addClass("ui-icon ui-icon-arrowthick-1-s"))
						.hide()
						.appendTo(document.body);
				}

				return _$topArrow;
			}

			function _bottomArrow() {
				if (!_$bottomArrow) {
					_$bottomArrow = $("<div />")
						.addClass("wijmo-wijgrid-dnd-arrow-bottom")
						.append($("<span />").addClass("ui-icon ui-icon-arrowthick-1-n"))
						.hide()
						.appendTo(document.body);
				}

				return _$bottomArrow;
			}

			function _isInElement(e, element) {
				var bounds = $.wijmo.wijgrid.bounds(element, false);
				return ((e.pageX > bounds.left && e.pageX < bounds.left + bounds.width) && (e.pageY > bounds.top && e.pageY < bounds.top + bounds.height));
			}

			function _getPosition(drag, drop, e, dragui) {
				if (!drop.element) { // drop is the group area element
					return "left";
				}

				if (_dropTargetRedirected) {
					return "right";
				}

				var bounds = $.wijmo.wijgrid.bounds(drop.element, false),
					sixth = bounds.width / 6,
					centerX = bounds.left + (bounds.width / 2),
					result = "right",
					distance;

				if (e.pageX < centerX) {
					result = "left";
				}

				if (drop instanceof $.wijmo.c1groupedfield) { // drag is moved over a grouped column
					if (drag instanceof $.wijmo.c1groupedfield) { // drag is a grouped column too
						distance = drop.options.groupedIndex - drag.options.groupedIndex;

						if (Math.abs(distance) === 1) {
							result = (distance < 0)
								? "left"
								: "right";
						}
					}

					return result;
				}

				// both drag and drop are non-grouped columns
				distance = drop.options.linearIdx - drag.options.linearIdx;

				if (drop.options.isBand &&
					(drag.options.parentIdx !== drop.options.travIdx) && // drag is not an immediate child of drop
					(Math.abs(e.pageX - centerX) < sixth)) {
					return "center";
				}

				// drag and drop are contiguous items of the same level
				if (drag.options.parentIdx === drop.options.parentIdx && Math.abs(distance) === 1) {
					result = (distance < 0)
						? "left"
						: "right";
				}

				return result;
			}
			// ~private
		}
	});
})(jQuery);(function ($) {
	"use strict";
	$.extend($.wijmo.wijgrid, {
		cellStyleFormatterHelper: function (wijgrid) {
			if (!wijgrid) {
				throw "invalid arguments";
			}

			this.format = function ($cell, cellIndex, column, rowInfo, state, cellAttr, cellStyle) {
				var $rs = $.wijmo.wijgrid.renderState,
					$rt = $.wijmo.wijgrid.rowType,
					rowType = rowInfo.type,
					args,
					groupRowCellInfo = null;

				if (cellIndex === 0 && wijgrid.options.showRowHeader) {
					column = null;
				}

				if (rowType === $rt.groupHeader || rowType === $rt.groupFooter) {
					column = null;

					if (cellAttr && (groupRowCellInfo = cellAttr.groupInfo)) {
						column = wijgrid._field("leaves")[groupRowCellInfo.leafIndex]; // replace "column" with the one associated with the $cell's content
						delete cellAttr.groupInfo;
					}
				}

				args = {
					$cell: $cell,
					state: state,
					row: rowInfo,
					column: column,
					_cellIndex: cellIndex,
					_purpose: groupRowCellInfo
						? groupRowCellInfo.purpose
						: undefined
				};

				if (state === $rs.rendering) {
					renderingStateFormatter(args, cellAttr, cellStyle);
				} else {
					currentStateFormatter(args, state & $rs.current);
					//hoveredStateFormatter(args, state & $rs.hovered);
					selectedStateFormatter(args, state & $rs.selected);
				}

				if ($.isFunction(wijgrid.options.cellStyleFormatter)) {
					wijgrid.options.cellStyleFormatter(args);
				}
			};

			// private ---

			function renderingStateFormatter(args, cellAttr, cellStyles) {
				var $rt = $.wijmo.wijgrid.rowType,
					key, value,
					leaf = args.column,
					rowType = args.row.type;

				if (rowType !== $rt.header && rowType !== $rt.filter) {
					args.$cell.addClass("wijgridtd");
				} else if (rowType === $rt.header) {
					args.$cell.addClass("wijgridth");
				}

				// copy attributes
				if (cellAttr) {
					for (key in cellAttr) {
						if (cellAttr.hasOwnProperty(key)) {
							value = cellAttr[key];

							if ((key === "colSpan" || key === "rowSpan") && !(value > 1)) {
								continue;
							}

							if (key === "class") {
								args.$cell.addClass(value);
							} else {
								args.$cell.attr(key, value);
							}
						}
					}
				}

				// copy inline css
				if (cellStyles) {
					for (key in cellStyles) {
						if (cellStyles.hasOwnProperty(key)) {
							if (key === "paddingLeft") { // groupIndent
								args.$cell.children(".wijmo-wijgrid-innercell").css(key, cellStyles[key]);
								continue;
							}
							args.$cell.css(key, cellStyles[key]);
						}
					}
				}

				if (args._cellIndex === 0 && wijgrid.options.showRowHeader) {
					args.$cell
						.attr({ "role": "rowheader", "scope": "row" })
						.addClass(rowType === $rt.header ? "ui-state-default" : "")
						.addClass("wijmo-wijgrid-rowheader");
				} else {
					switch (rowType) {
						case ($rt.header):
							args.$cell.attr({ "role": "columnheader", "scope": "col" });
							break;
						case ($rt.footer):
							args.$cell.attr({ "role": "columnfooter", "scope": "col" });
							break;
						default:
							args.$cell.attr("role", "gridcell");
					}
				}

				//if ((rowType & $rt.data) === $rt.data) {
				if (rowType & $rt.data) {
					if (args._cellIndex >= 0 && leaf && leaf.dataParser) {
						args.$cell.attr("headers", escape(leaf.headerText));

						if (leaf.readOnly) {
							args.$cell.attr("aria-readonly", true);
						}

						if (leaf.dataIndex >= 0) {
							args.$cell.addClass("wijdata-type-" + (leaf.dataType || "string"));
						}
					}
				}

				if (rowType === $rt.groupHeader || rowType === $rt.groupFooter) {
					// append wijdata-type class only to the aggregate cells of the group row, not grouped cells.
					if (leaf && args._purpose === $.wijmo.wijgrid.groupRowCellPurpose.aggregateCell) {
						args.$cell.addClass("wijdata-type-" + (leaf.dataType || "string"));
					}
				}
			}

			function currentStateFormatter(args, add) {
				var $rt = $.wijmo.wijgrid.rowType;

				if (add) {
					args.$cell.addClass("ui-state-active");

					if (args.row.type === $rt.header) {
						args.$cell.addClass("wijmo-wijgrid-current-headercell");
					} else {
						args.$cell.addClass("wijmo-wijgrid-current-cell");
					}
				} else {
					args.$cell.removeClass("ui-state-active");

					if (args.row.type === $rt.header) {
						args.$cell.removeClass("wijmo-wijgrid-current-headercell");
					} else {
						args.$cell.removeClass("wijmo-wijgrid-current-cell");
					}
				}
			}

			function hoveredStateFormatter(args, add) {
				if (add) {
				} else {
				}
			}

			function selectedStateFormatter(args, add) {
				if (add) {
					args.$cell
						.addClass("ui-state-highlight")
						.attr("aria-selected", "true");
				} else {
					args.$cell
						.removeClass("ui-state-highlight")
						.removeAttr("aria-selected");
				}
			}

			// --- private
		}
	});
})(jQuery);(function ($) {
	"use strict";
	$.extend($.wijmo.wijgrid, {
		rowStyleFormatterHelper: function (wijgrid) {
			if (!wijgrid) {
				throw "invalid arguments";
			}

			this.format = function (rowInfo, rowAttr, rowStyle) {
				var $rs = $.wijmo.wijgrid.renderState,
					state = rowInfo.state,
					args = rowInfo;

				if (state === $rs.rendering) {
					renderingStateFormatter(args, rowAttr, rowStyle);
				} else {
					currentStateFormatter(args, state & $rs.current);
					hoveredStateFormatter(args, state & $rs.hovered);
					selectedStateFormatter(args, state & $rs.selected);
				}

				if ($.isFunction(wijgrid.options.rowStyleFormatter)) {
					wijgrid.options.rowStyleFormatter(args);
				}
			};

			// * private
			function renderingStateFormatter(args, rowAttr, rowStyle) {
				var className = "wijmo-wijgrid-row ui-widget-content",
					contentClass = "wijmo-wijgrid-row ui-widget-content",
					$rt = $.wijmo.wijgrid.rowType,
					key;

				args.$rows.attr("role", "row");

				// copy attributes
				if (rowAttr) {
					for (key in rowAttr) {
						if (rowAttr.hasOwnProperty(key)) {
							if (key === "class") {
								args.$rows.addClass(rowAttr[key]);
							} else {
								args.$rows.attr(key, rowAttr[key]);
							}
						}
					}
				}

				// copy inline css
				if (rowStyle) {
					for (key in rowStyle) {
						if (rowStyle.hasOwnProperty(key)) {
							args.$rows.css(key, rowStyle[key]);
						}
					}
				}

				switch (args.type & ~$rt.dataAlt) { // clear dataAlt modifier
					case ($rt.header):
						className = "wijmo-wijgrid-headerrow";
						break;

					case ($rt.data):
						className = contentClass + " wijmo-wijgrid-datarow";

						if (args.type & $rt.dataAlt) {
							className += " wijmo-wijgrid-alternatingrow";
						}

						break;

					case ($rt.emptyDataRow):
						className = contentClass + " wijmo-wijgrid-emptydatarow";
						break;

					case ($rt.filter):
						className = "wijmo-wijgrid-filterrow";
						break;

					case ($rt.groupHeader):
						className = contentClass + " wijmo-wijgrid-groupheaderrow";
						break;

					case ($rt.groupFooter):
						className = contentClass + " wijmo-wijgrid-groupfooterrow";
						break;

					case ($rt.footer):
						className = "wijmo-wijgrid-footerrow ui-state-highlight";
						break;

					default:
						throw $.wijmo.wijgrid.stringFormat("unknown rowType: {0}", args.row.type);
				}

				args.$rows.addClass(className);
			}

			function currentStateFormatter(args, flag) {
				if (wijgrid.options.showRowHeader) {
					// make deal with the row header cell
					if (flag) { // add formatting
						$(args.$rows[0].cells[0]).addClass("ui-state-active wijmo-wijgrid-current-rowheadercell");
					} else { // remove formatting
						$(args.$rows[0].cells[0]).removeClass("ui-state-active wijmo-wijgrid-current-rowheadercell");
					}
				}
			}

			function hoveredStateFormatter(args, flag) {
				if (flag) { // add formatting
					args.$rows.addClass("ui-state-hover");
				} else {  // remove formatting
					args.$rows.removeClass("ui-state-hover");
				}
			}

			function selectedStateFormatter(args, flag) {
				if (flag) { // add formatting
				} else { // remove formatting
				}
			}

			// private *
		}
	});
})(jQuery);(function ($) {
	"use strict";
	$.extend($.wijmo.wijgrid, {

		tally: function () {
			var _sum = 0,
				_sum2 = 0,
				_cntNumbers = 0,
				_cntStrings = 0,
				_max = 0,
				_min = 0,
				_minString,
				_maxString;

			this.add = function (value) {
				if (value === null || value === "") {
					return;
				}

				_cntStrings++;

				if (typeof (value) === "string") {

					if ((_minString === undefined) || (value < _minString)) {
						_minString = value;
					}

					if ((_maxString === undefined) || (value > _maxString)) {
						_maxString = value;
					}

					// value = _parseValue(value);
				}

				//if (!isNaN(value)) { // number
				if (typeof (value) === "number") {
					if (_cntNumbers === 0) {
						_min = value;
						_max = value;
					}

					_cntNumbers++;
					_sum += value;
					_sum2 += value * value;

					if (value < _min) {
						_min = value;
					}

					if (value > _max) {
						_max = value;
					}
				}
			};

			this.getValueString = function (column) {
				if (_cntNumbers) {
					var value = _getValue(column.aggregate),
						gridView = column.owner;

					return gridView._toStr(column, value);
				}

				if (_cntStrings) {
					// we only support max/min and count for strings
					switch (column.aggregate) {
						case "max":
							return _maxString;

						case "min":
							return _minString;

						case "count":
							return _cntStrings.toString();
					}
				}

				return "";
			};

			function _getValue(aggregate) {
				switch (aggregate) {
					case "average":
						return (_cntNumbers === 0)
							? 0
							: _sum / _cntNumbers;

					case "count":
						return _cntStrings;

					case "max":
						return _max;

					case "min":
						return _min;

					case "sum":
						return _sum;

					case "std":
						if (_cntNumbers <= 1) {
							return 0;
						}

						return Math.sqrt(_getValue("var"));

					case "stdPop":
						if (_cntNumbers <= 1) {
							return 0;
						}

						return Math.sqrt(_getValue("varPop"));

					case "var":
						if (_cntNumbers <= 1) {
							return 0;
						}

						return _getValue("varPop") * _cntNumbers / (_cntNumbers - 1);

					case "vapPop":
						if (_cntNumbers <= 1) {
							return 0;
						}

						var tmp = _sum / _cntNumbers;
						return _sum2 / _cntNumbers - tmp * tmp;
				}

				return 0;
			}
		}
	});
})(jQuery);(function ($) {
	"use strict";
	$.extend($.wijmo.wijgrid, {
		columnsGenerator: function (gridView) {
			this.generate = function (mode, dataStore, columns) {
				switch (mode) {
					case "append":
						_processAppendMode(dataStore, columns);
						break;

					case "merge":
						_processMergeMode(dataStore, columns);
						break;

					default:
						throw $.wijmo.wijgrid.stringFormat("Unsupported value: \"{0}\"", mode);
				}
			};

			function _processAppendMode(dataStore, columns) {
				var availableDataKeys = dataStore.getFieldNames(),
					i, len, leaf;

				for (i = 0, len = availableDataKeys.length; i < len; i++) {
					leaf = _createAutoField(availableDataKeys[i]);
					columns.push(leaf);
				}
			}

			function _processMergeMode(dataStore, columns) {
				var columnsHasNoDataKey = [],
					dataFields = dataStore.getFieldNames(),
					dataKeys = {},
					i, len, dataKey, key, leaf;

				for (i = 0, len = dataFields.length; i < len; i++) {
					dataKeys[key = dataFields[i]] = key;
				}

				$.wijmo.wijgrid.traverse(columns, function (column) {
					if (column.isLeaf && !column.isBand) {
						dataKey = column.dataKey;

						if ($.wijmo.wijgrid.validDataKey(dataKey)) {
							if (dataKeys[dataKey] !== undefined) {
								delete dataKeys[dataKey];
							}
						} else {
							if (dataKey !== null) { // don't linkup with any data field if dataKey is null
								columnsHasNoDataKey.push(column);
							}
						}
					}
				});

				if (columnsHasNoDataKey.length) {
					i = 0;
					for (dataKey in dataKeys) {
						if (dataKeys.hasOwnProperty(dataKey)) {
							leaf = columnsHasNoDataKey[i++];
							if (leaf) {
								leaf.dataKey = dataKeys[dataKey];
								delete dataKeys[dataKey];
							}
						}
					}
				}

				for (dataKey in dataKeys) {
					if (dataKeys.hasOwnProperty(dataKey)) {
						leaf = _createAutoField(dataKeys[dataKey]);
						columns.push(leaf);
					}
				}
			}

			function _createAutoField(dataKey) {
				return $.wijmo.wijgrid.createDynamicField({ dataKey: dataKey });
			}
		}
	});
})(jQuery);