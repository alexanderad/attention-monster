import logger from "./logger.js";
import db from "./db.js";
import reporter from "./reporter.js";

let start = moment()
  .startOf("day")
  .valueOf();
let end = moment()
  .endOf("day")
  .valueOf();

reporter.onScreenTimeReport(start, end).then(records => {
  let grid = $("#id-data>tbody");
  records.forEach(function(record) {
    let recordRendered = `
        <tr>
            <td>
                <div style="display: table">
                    <span style="vertical-align: middle; display: table-cell"><img src="${record.icon}" width="16" style="vertical-align: middle; display: table-cell"></span>
                    <span style="vertical-align: middle; display: table-cell">
                    &nbsp;&nbsp;${record.domain}
                    </span>
                </div>
            </td>
            <td>${moment.duration(record.totalTime).humanize()}</td>
        </tr>
    `;
    grid.append(recordRendered);
  }, this);
});
