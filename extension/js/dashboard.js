import logger from "./logger.js";
import db from "./db.js";
import reporter from "./reporter.js";

let start = moment()
  .startOf("day")
  .valueOf();
let end = moment()
  .endOf("day")
  .valueOf();

reporter.onScreenTimeReport(start, end).then(data => {
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

  $("#id-day-time").text(
    `${moment(stats.dayStart).format("HH:mm")} - ${moment(stats.dayEnd).format(
      "HH:mm"
    )}`
  );

  let grid = $("#id-data>tbody");
  records.forEach(function(record, idx) {
    let recordRendered = `
        <tr>
            <td>
                <div class="record-row-icon truncate">
                    <span><img src="${record.icon}" width="16"></span>
                    <span>${record.domain}</span>
                </div>
            </td>
            <td>${moment.duration(record.totalTime).humanize()}</td>
            <td id="id-frequency-${idx}"></td>
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
});
