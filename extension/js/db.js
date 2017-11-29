const db = new Dexie("attention-monster");
db.version(1).stores({
  // schema is expected to specify only indexed fields
  events: "++id, type, time, domain", // + window, audible
  icons: "domain" // + icon
});

db.exportDatabase = function(db) {
  return db.transaction("r", db.tables, () => {
    return Promise.all(
      db.tables.map(table =>
        table.toArray().then(rows => ({ table: table.name, rows: rows }))
      )
    );
  });
};

db.importDatabase = function(data, db) {
  return db.transaction("rw", db.tables, () => {
    return Promise.all(
      data.map(t =>
        db
          .table(t.table)
          .clear()
          .then(() => db.table(t.table).bulkAdd(t.rows))
      )
    );
  });
};

export default db;
