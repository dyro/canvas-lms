/**
 * Copyright (C) 2011 Instructure, Inc.
 *
 * This file is part of Canvas.
 *
 * Canvas is free software: you can redistribute it and/or modify it under
 * the terms of the GNU Affero General Public License as published by the Free
 * Software Foundation, version 3 of the License.
 *
 * Canvas is distributed in the hope that it will be useful, but WITHOUT ANY
 * WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR
 * A PARTICULAR PURPOSE. See the GNU Affero General Public License for more
 * details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */
define([
  'i18n!site_admin',
  'jquery' /* $ */,
  'jquery.ajaxJSON' /* ajaxJSON */,
  'jqueryui/dialog',
  'jquery.instructure_misc_helpers' /* replaceTags */
], function(I18n, $) {

  $(document).ready(function() {
    $(".over_time_link").live('click', function(event) {
      event.preventDefault();
      var name = $(this).attr('data-name');
      var url = $.replaceTags($(".over_time_url").attr('href'), 'attribute', $(this).attr('data-key'));
      url = $.replaceTags(url, 'category', $(this).attr('data-category'))
      var $link = $(this);
      $link.text(I18n.t('status.loading', "loading..."));
      $.ajaxJSON(url, 'GET', {}, function(data) {
        $link.text(I18n.t('links.over_time', "over time"));
        $("#over_time_dialog .csv_url").attr('href', url + '.csv');
        populateDialog(data, name);
      }, function(data) {
        $link.text("error");
      });
    });
    function populateDialog(data_points, axis) {
      $("#over_time_dialog").dialog({
        width: 630,
        height: 330
      }).dialog('option', 'title', I18n.t('titles.value_over_time', "%{value} Over Time", {value: axis}));
      var data = new google.visualization.DataTable();
      data.addColumn('date', I18n.t('columns.date', 'Date'));
      data.addColumn('number', axis || I18n.t('columns.value', "Value"));
      data.addColumn('string', 'title1');
      data.addColumn('string', 'text1');

      var rows = []
      $.each(data_points, function() {
        var date = new Date();
        date.setTime(this[0]);
        rows.push(
          //this ends up being [(a date), (the number of pageViews on that date), "an annotation tile, (if any)", ""]
          [date, this[1], undefined, undefined]
        )
      });

      data.addRows(rows);

      var chart = new google.visualization.AnnotatedTimeLine(document.getElementById('over_time'));
      chart.draw(data, {displayAnnotations: false});
    }
  });
});

