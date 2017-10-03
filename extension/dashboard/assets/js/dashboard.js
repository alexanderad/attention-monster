$(document).ready(function() {
  let breakdownTable = $("#id-breakdown");

  let db = new Dexie("events");
  db.version(1).stores({
    events:
      "++id, type, subType, time, page.domain, page.icon, page.window, page.audible"
  });
});
