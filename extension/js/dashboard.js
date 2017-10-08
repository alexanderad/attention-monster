import logger from "./logger.js";
import db from "./db.js";
import reporter from "./reporter.js";

let start = moment()
  .startOf("day")
  .valueOf();
let startOfWorkDay = moment(start)
  .hours(10)
  .valueOf();
let endOfWorkDay = moment(start)
  .hours(21)
  .valueOf();
let end = moment()
  .endOf("day")
  .valueOf();

reporter.onScreenTimeReport(start, end).then(records => {
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
      startOfWorkDay,
      endOfWorkDay,
      record.timeIntervals
    );
    $(`#id-frequency-${idx}`).append(frequencyChart);
  });
});
