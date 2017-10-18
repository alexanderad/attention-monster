import logger from "./logger.js";
import db from "./db.js";
import reporter from "./reporter.js";

function renderReport(reportDate) {
  let start = reportDate
    .clone()
    .startOf("day")
    .valueOf();
  let end = reportDate
    .clone()
    .endOf("day")
    .valueOf();

  Promise.resolve().then(() => {
    $("#id-prev-day-link").attr(
      "href",
      reportDate
        .clone()
        .subtract(1, "day")
        .format("#YYYY-MM-DD")
    );
    $("#id-current-day").text(reportDate.format("MMMM DD, YYYY"));
    $("#id-next-day-link").attr(
      "href",
      reportDate
        .clone()
        .add(1, "day")
        .format("#YYYY-MM-DD")
    );

    $("#id-no-data-container").hide();
    $("#id-data-container").hide();
    $("#id-loading-container").show();
    $("#id-data > tbody").empty();
    $("#id-total-time").empty();
    $("#id-day-time").empty();
  });

  reporter
    .onScreenTimeReport(start, end)
    .then(data => {
      let records = data.records;
      let stats = data.stats;

      $("#id-total-time").text(moment.duration(stats.totalTime).humanize());
      $("#id-total-time").attr(
        "title",
        moment
          .duration(stats.totalTime)
          .asMinutes()
          .toFixed(0) + " minutes"
      );

      $("#id-day-time").html(
        `<strong>${moment(stats.dayStart).format("HH:mm")}</strong> till 
    <strong>${moment(stats.dayEnd).format("HH:mm")}</strong>`
      );

      let grid = $("#id-data > tbody");
      records.forEach(function(record, idx) {
        let iconUrl = record.icon;
        if (iconUrl === undefined) iconUrl = "../icons/default-favicon.png";
        let recordRendered = `
        <tr>
            <td>
                <div class="record-row-icon truncate">
                    <span><img src="${iconUrl}" width="16"></span>
                    <span>${record.domain}</span>
                </div>
            </td>
            <td class="no-wrap">${moment.duration(record.totalTime).humanize()}</td>
            <td id="id-frequency-${idx}"></td>
            <td class="no-wrap">${record.timeIntervals.length} interactions</td>
        </tr>
    `;
        grid.append(recordRendered);
        let frequencyChart = reporter.frequencyChart(
          stats.dayStart - 15 * 60 * 1000,
          stats.dayEnd + 15 * 60 * 1000,
          record.timeIntervals
        );
        $(`#id-frequency-${idx}`).append(frequencyChart);
      });

      $("#id-loading-container").hide();
      $("#id-data-container").fadeIn();
    })
    .catch(err => {
      setTimeout(() => {
        $("#id-loading-container").hide();
        $("#id-no-data-container").fadeIn();
      }, 400);
    });
}

$(document).ready(function() {
  $(window).bind("hashchange", function() {
    var reportDate = moment();
    var hashDate = location.hash;
    if (hashDate) reportDate = moment(hashDate, "YYYY-MM-DD");
    renderReport(reportDate);
  });

  // initial hash change
  $(window).trigger("hashchange");
});
