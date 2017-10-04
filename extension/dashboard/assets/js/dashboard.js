$(document).ready(function() {
  let breakdownTable = $("#id-breakdown");

  let db = new Dexie("events");
  db.version(1).stores({
    events:
      "++id, type, subType, time, page.domain, page.icon, page.window, page.audible"
  });

  db.events
    .orderBy("id")
    .reverse()
    .limit(100)
    .each(function(event) {
      console.log(event);
      let time = new Date(event.time);
      breakdownTable.append(
        `
        <tr>
            <td><img width="32" src="${event.page.icon}" /></td>
            <td><strong>${event.page.domain}</strong></td>
            <td>${event.totalTime}</td>
        </tr>
        `
      );
    });
});
