import { Client } from 'pg';

export const initConnection = () => {
  const {
    POSTGRES_USER,
    POSTGRES_PASSWORD,
    POSTGRES_DB,
    POSTGRES_PORT,
    POSTGRES_HOST,
  } = process.env;
  const client = new Client({
    user: POSTGRES_USER || 'postgres',
    host: POSTGRES_HOST || 'localhost',
    database: POSTGRES_DB || 'bookshop',
    password: POSTGRES_PASSWORD || 'postgres',
    port: POSTGRES_PORT || 5432,
  });

  return client;
};

export const createStructure = async () => {
  const client = initConnection();
  client.connect();

  await client.query(
    `CREATE TABLE users (id SERIAL PRIMARY KEY NOT NULL, name VARCHAR(30) NOT NULL, date DATE NOT NULL DEFAULT CURRENT_DATE);`
  );
  await client.query(
    `CREATE TABLE categories (id SERIAL PRIMARY KEY NOT NULL, name VARCHAR(30) NOT NULL);`
  );
  await client.query(
    `CREATE TABLE authors (id SERIAL PRIMARY KEY NOT NULL, name VARCHAR(30) NOT NULL);`
  );
  await client.query(
    `CREATE TABLE books (id SERIAL PRIMARY KEY NOT NULL, title VARCHAR(30) NOT NULL,
    userid INTEGER, FOREIGN KEY(userid) REFERENCES users(id) ON DELETE CASCADE,
    authorid INTEGER, FOREIGN KEY(authorid) REFERENCES authors(id) ON DELETE CASCADE REFERENCES,
    categoryid INTEGER, FOREIGN KEY(categoryid) REFERENCES categories(id) ON DELETE CASCADE);`
  );
  await client.query(
    `CREATE TABLE descriptions (id SERIAL PRIMARY KEY NOT NULL,
    description VARCHAR(10000) NOT NULL,
    bookid INTEGER UNIQUE, FOREIGN KEY(bookid) REFERENCES books(id) ON DELETE CASCADE);`
  );
  await client.query(
    `CREATE TABLE reviews (id SERIAL PRIMARY KEY NOT NULL, message VARCHAR(10000) NOT NULL,
    userid INTEGER, FOREIGN KEY(userid) REFERENCES users(id) ON DELETE CASCADE ,
    bookid INTEGER, FOREIGN KEY(bookid) REFERENCES books(id) ON DELETE CASCADE);`
  );

  client.end();
};

export const createItems = async () => {
  const client = initConnection();
  client.connect();

  await client.query(`INSERT INTO users (name) VALUES(\'Sofia'\);`);
  await client.query(`INSERT INTO users (name) VALUES(\'Michael'\);`);
  await client.query(`INSERT INTO users (name) VALUES(\'Julia'\);`);

  await client.query(`INSERT INTO categories (name) VALUES(\'Fantasy'\);`);
  await client.query(`INSERT INTO categories (name) VALUES(\'History'\);`);
  await client.query(`INSERT INTO categories (name) VALUES(\'Detective'\);`);
  await client.query(`INSERT INTO categories (name) VALUES(\'Horror'\);`);

  await client.query(`INSERT INTO authors (name) VALUES(\'J. K. Rowling'\);`);
  await client.query(`INSERT INTO authors (name) VALUES(\'S. King'\);`);
  await client.query(
    `INSERT INTO authors (name) VALUES(\'Sir A. Conan Doyle'\);`
  );

  await client.query(
    `INSERT INTO books(title, userid, authorid, categoryid) VALUES(\'Harry Potter'\, 1, 1, 1);`
  );
  await client.query(
    `INSERT INTO books(title, userid, authorid, categoryid) VALUES(\'Sherlock Holmes'\, 2, 3, 3);`
  );
  await client.query(
    `INSERT INTO books(title, userid, authorid, categoryid) VALUES(\'It'\, 3, 2, 4);`
  );

  await client.query(
    `INSERT INTO descriptions(description, bookid) VALUES(\'The novels chronicle the lives of a young wizard, Harry Potter...'\, 1);`
  );
  await client.query(
    `INSERT INTO descriptions(description, bookid) VALUES(\'Referring to himself as a consulting detective in the stories...'\, 2);`
  );
  await client.query(
    `INSERT INTO descriptions(description, bookid) VALUES(\'The story follows the experiences of seven children...'\, 3);`
  );

  await client.query(
    `INSERT INTO reviews(id, message, userid, bookid) VALUES(\'Very interesting book!'\, 2, 1);`
  );
  await client.query(
    `INSERT INTO reviews(id, message, userid, bookid) VALUES(\'Fantastic plot!'\, 3, 2);`
  );
  await client.query(
    `INSERT INTO reviews(id, message, userid, bookid) VALUES(\'So scary to read...'\, 1, 3);`
  );

  client.end();
};

export const dropTables = async () => {
  const client = initConnection();
  client.connect();

  await client.query('DROP TABLE reviews;');
  await client.query('DROP TABLE descriptions;');
  await client.query('DROP TABLE books;');
  await client.query('DROP TABLE authors;');
  await client.query('DROP TABLE categories;');
  await client.query('DROP TABLE users;');

  client.end();
};
