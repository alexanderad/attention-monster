import logger from "./logger.js";
import db from "./db.js";
import reporter from "./reporter.js";
import randomFutureQuote from "./future.js";
import debounce from "../vendor/js/debounce.min.js";

function renderReport(reportInterval, query) {
  Promise.resolve().then(() => {
    $(".page-partial").hide();
    $("#id-data > tbody").empty();

    $("#id-prev-interval-link").attr("href", reportInterval.prevHash);
    $("#id-next-interval-link").attr("href", reportInterval.nextHash);
    $("#id-current-interval").text(reportInterval.display);

    var isInFuture = reportInterval.start > moment();
    if (isInFuture) {
      $("#id-no-data-message").html(getRandomFutureQuoteMessage());
      $("#id-no-data-container").fadeIn();
      return;
    } else {
      $("#id-loading-container").show();
    }

    var start = reportInterval.start.valueOf();
    var end = reportInterval.end.valueOf();
    reporter
      .onScreenTimeReport(start, end, query)
      .then(data => {
        let records = data.records;
        let stats = data.stats;

        let grid = $("#id-data > tbody");
        records.forEach(function(record, idx) {
          let iconUrl = record.icon;
          if (iconUrl === undefined) iconUrl = "../icons/default-favicon.png";
          let recordRendered = `
            <tr>
                <td>
                    <div class="record-row-icon is-truncated">
                        <span class="record-icon" style="background-image: url(${iconUrl})"></span>
                        <span class="is-truncated" style="max-width: 220px">
                          <a href="http://${
                            record.domain
                          }" class="has-no-underline is-black">
                            ${record.domain}
                          </a>
                        </span>
                    </div>
                </td>
                <td class="has-no-wrap">
                  ${moment
                    .duration(record.totalTime)
                    .format("d [days] h [hours] m [minutes]", {
                      largest: 2,
                      minValue: 1
                    })}
                </td>
            </tr>
        `;
          grid.append(recordRendered);
        });

        $("#id-total-time").text(
          moment
            .duration(stats.totalTime)
            .format("d [days] h [hours] m [minutes]", {
              largest: 2,
              minValue: 1
            })
        );

        $("#id-loading-container").hide();
        $("#id-data-container").fadeIn();
      })
      .catch(err => {
        console.log(err);
        setTimeout(() => {
          $("#id-loading-container").hide();

          var message = "No data for this time interval.";
          var isToday =
            moment()
              .startOf("day")
              .valueOf() == reportInterval.start;
          if (isToday) {
            message =
              "Your Attention Monster doesn't yet have any stats to show. Keep browsing and check back later!";
          }

          $("#id-no-data-message").html(message);
          $("#id-no-data-container").fadeIn();
        }, 400);
      });
  });
}

function getRandomFutureQuoteMessage() {
  var quote = randomFutureQuote();
  return `
    <div class="is-italic is-size-4 is-lighter">${quote[0]}</div>
    <div class="is-pulled-right is-size-6">&mdash; ${quote[1]}</div>
  `;
}

function getReportInterval() {
  var now = moment();
  var reportInterval = {};
  var hash = location.hash || "#daily";
  var hashSplit = hash.split("/");
  var interval = hashSplit[0];

  if (interval == "#daily") {
    var reportDate;
    if (hashSplit.length == 1) {
      reportDate = now;
    } else {
      reportDate = moment(hashSplit[1], "YYYY-MM-DD");
    }

    var reportInterval = {
      interval: "daily",
      start: reportDate.clone().startOf("day"),
      end: reportDate.clone().endOf("day"),
      prevHash:
        "#daily/" +
        reportDate
          .clone()
          .add(-1, "day")
          .format("YYYY-MM-DD"),
      nextHash:
        "#daily/" +
        reportDate
          .clone()
          .add(1, "day")
          .format("YYYY-MM-DD")
    };
    var isToday =
      moment()
        .startOf("day")
        .valueOf() == reportInterval.start;
    if (isToday) {
      reportInterval.display = "Today";
    } else {
      reportInterval.display = reportDate.format("MMMM D, YYYY");
    }
  }

  if (interval == "#weekly") {
    var reportYear, reportWeek;
    if (hashSplit.length == 1) {
      reportYear = now.year();
      reportWeek = now.week() - 1;
    } else {
      reportYear = hashSplit[1];
      reportWeek = hashSplit[2];
    }

    var week = moment(reportYear + "-01-01").add(reportWeek, "weeks");
    reportInterval = {
      interval: "weekly",
      start: week
        .clone()
        .startOf("week")
        .startOf("day"),
      end: week
        .clone()
        .endOf("week")
        .endOf("day")
    };
    var nextWeek = reportInterval.start
      .clone()
      .add(1, "week")
      .endOf("week");
    var prevWeek = reportInterval.start
      .clone()
      .add(-1, "week")
      .startOf("week");
    reportInterval.nextHash =
      "#weekly/" + nextWeek.year() + "/" + (nextWeek.week() - 1);
    reportInterval.prevHash =
      "#weekly/" + prevWeek.year() + "/" + (prevWeek.week() - 1);

    var isThisWeek =
      moment()
        .startOf("week")
        .startOf("day")
        .valueOf() == reportInterval.start;
    if (isThisWeek) {
      reportInterval.display = "This week";
    } else {
      reportInterval.display =
        "Week of " +
        reportInterval.start.format("MMMM D-") +
        reportInterval.end.format("D, YYYY");
    }
  }

  if (interval == "#monthly") {
    var reportYear, reportMonth;
    if (hashSplit.length == 1) {
      reportYear = now.year();
      reportMonth = now.month();
    } else {
      reportYear = hashSplit[1];
      reportMonth = hashSplit[2];
    }

    var month = moment(reportYear + "-01-01").month(reportMonth);
    reportInterval = {
      interval: "monthly",
      start: month
        .clone()
        .startOf("month")
        .startOf("day"),
      end: month
        .clone()
        .endOf("month")
        .endOf("day")
    };
    var nextMonth = reportInterval.end.clone().add(1, "day");
    var prevMonth = reportInterval.start.clone().add(-1, "day");
    reportInterval.nextHash =
      "#monthly/" + nextMonth.year() + "/" + nextMonth.month();
    reportInterval.prevHash =
      "#monthly/" + prevMonth.year() + "/" + prevMonth.month();

    var isThisMonth =
      moment()
        .startOf("month")
        .startOf("day")
        .valueOf() == reportInterval.start;
    if (isThisMonth) {
      reportInterval.display = "This month";
    } else {
      reportInterval.display = reportInterval.start.format("MMMM, YYYY");
    }
  }

  if (interval == "#alltime") {
    reportInterval = {
      interval: "alltime",
      start: moment("1970-01-01").startOf("day"),
      end: moment().endOf("day"),
      display: "All time"
    };
  }

  $(".menu-link").removeClass("is-active");
  $(".menu-link." + reportInterval.interval).addClass("is-active");

  return reportInterval;
}

function staticPage(pageId) {
  $(".page-partial, #id-time-nav").hide();
  $("#id-" + pageId + "-container").show();
  $(".menu-link").removeClass("is-active");
  $(".menu-link." + pageId).addClass("is-active");
}

$(document).ready(function() {
  // page navigation
  $(window).bind("hashchange", () => {
    switch (location.hash) {
      case "#about":
      case "#clean-browsing-data":
        staticPage(location.hash.substr(1));
        break;

      default:
        $("#id-time-nav").show();
        var reportInterval = getReportInterval();
        renderReport(reportInterval);
    }
  });

  // initial hash change
  $(window).trigger("hashchange");

  // keyboard navigation
  $(window).keyup(function(e) {
    switch (e.key) {
      case "ArrowRight":
        $("#id-next-interval-link")
          .get(0)
          .click();
        break;

      case "ArrowLeft":
        $("#id-prev-interval-link")
          .get(0)
          .click();
        break;
    }
  });

  // options -> cleanup browsing data handler
  $("#id-clean-data-button").bind("click", e => {
    var timeRange = $("#id-clean-data-range")
      .find(":selected")
      .val();
    switch (timeRange) {
      case "ALL":
        var timeIntervalStart = moment("1970-01-01");
        var timeIntervalEnd = moment(moment() + moment.duration("P1D"));
        break;

      default:
        var timeIntervalEnd = moment();
        var timeIntervalStart = moment(
          timeIntervalEnd - moment.duration(timeRange)
        );
    }

    $("#id-clean-data-button > span.icon").show();
    $("#id-clean-data-button > span.clean-text").text("Cleaning...");
    reporter
      .cleanBrowsingData(timeIntervalStart, timeIntervalEnd)
      .then(cleanedCount => {
        logger.log("Cleaned up records: ", cleanedCount);

        $("#id-clean-data-button > span.icon").hide();
        $("#id-clean-data-button > span.clean-text").text("Done!");
        $("#id-clean-data-button")
          .addClass("is-success")
          .removeClass("is-danger");

        setTimeout(() => {
          $("#id-clean-data-button > span.clean-text").text("Clean");
          $("#id-clean-data-button")
            .removeClass("is-success")
            .addClass("is-danger");
        }, 2500);
      });
  });
});
