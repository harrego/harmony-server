import sqlite3 from 'sqlite3';

function createDb(db) {
  db.serialize(() => {
    db.run(`CREATE TABLE messages (
      messageId VARCHAR(255) PRIMARY KEY,
      authorId VARCHAR(255),
      timestamp INTEGER,
      content TEXT
    );
    `);
  })
}

function queryMessages(db, cond = '') {
  return new Promise((resolve, reject) => {
    let messages = [];

    db.each('SELECT messageId, authorId, content FROM messages', (err, row) => {
      messages.push({
        messageId: row.messageId,
        authorId: row.authorId,
        content: row.content
      });
    }, (err, _) => {
      if (err) {
        reject(err);
        return;
      }

      console.log(messages);
      resolve(messages);
    });
  });
}

function insertMessages(db, message) {
  let stmt = db.prepare('INSERT INTO messages (messageId, authorId, timestamp, content) VALUES (?,?,?,?)');
  stmt.run([message.messageId, message.authorId, message.timestamp, message.content]);
  stmt.finalize();
}

// Export helpers for dealing with the SQLite backend
export default {
   createDb,
   queryMessages,
   insertMessages 
};