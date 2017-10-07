const db = new Dexie("attention-monster");
db.version(1).stores({
  // schema is expected to specify only indexed fields
  events: "++id, type, time, domain", // + window, audible
  icons: "domain" // + icon
});

export default db;
