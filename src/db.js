import sqlite3 from 'sqlite3';

function createDb(db) {
  return new Promise((resolve, reject) => {
    db.run(`CREATE TABLE IF NOT EXISTS messages (
        messageId VARCHAR(255) PRIMARY KEY,
        authorId VARCHAR(255),
        timestamp INTEGER,
        content TEXT
      );
    `), (err) => {
      if (err) {
        reject(err);
    	return;
      }
      resolve();
    };
  });
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
    }, (err, numberOfRows) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(messages);
    });
  });
}

function insertMessages(db, message) {
  return new Promise((resolve, reject) => {
    let stmt = db.prepare('INSERT INTO messages (messageId, authorId, timestamp, content) VALUES (?,?,?,?)');
    stmt.run([message.messageId, message.authorId, message.timestamp, message.content], (err) => {
      if (err) {
        reject(err);
        return;
      }
  	  resolve();
    });
    stmt.finalize();
  });
}

// Export helpers for dealing with the SQLite backend
export default {
   createDb,
   queryMessages,
   insertMessages 
};