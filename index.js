const express = require('express')
const app = express();


const mysql = require('mysql');
let _connection = null;

const connect = () => new Promise((res, rej) => {
  if (_connection) res(_connection)
  else {
    _connection = mysql.createConnection({
      host: process.env.RDS_HOSTNAME,
      user: process.env.RDS_USERNAME,
      password: process.env.RDS_PASSWORD,
      port: process.env.RDS_PORT
    });
    _connection.connect(function (err) {
      err && rej(err) || res();
    });
  }
});

const disconnect = () => new Promise((res, rej) => _connection && _connection.end(function (err) {
  _connection = null;
  res();
}));

const query = (...queryArgs) => {
  const promise = new Promise((resolve, reject) => {
    _connection.query(...queryArgs, function (error, results, fields) {
      if (error) reject(error);
      resolve({ results, fields });
    });
  });
  return promise;
}

function serializeCourses(results) {
  return results;
}

app.get('/', async (req, res) => {
  res.status(400).send('Invalid end-point');
});

app.get('/user/:userId/courses/', async (req, res) => {
  await connect();
  try {
    res.setHeader('Content-Type', 'application/json');
    let { results: course_ids } = await query(`SELECT DISTINCT uc.course_id FROM thinschool_data.users_courses uc WHERE uc.user_id = ? `, req.params.userId);
    if (course_ids.length === 0) return res.send([]);
    let { results: courses } = await query(`SELECT * FROM thinschool_data.courses c WHERE c.id IN (?)`, [course_ids.map(_ => _.course_id)]);
    res.send(serializeCourses(courses));
  }
  finally {
    await disconnect();
  }

});
app.get('/course/:courseId/', async (req, res) => {
  await connect();
  try {
    res.setHeader('Content-Type', 'application/json');
    let { results: course } = await query(`SELECT * FROM thinschool_data.courses c WHERE c.id = ?`, [req.params.courseId]);
    res.send(serializeCourses(course[0]));
  }
  finally {
    await disconnect();
  }

});

app.get('/list-all-courses', async (req, res) => {
  await connect();
  try {
    res.setHeader('Content-Type', 'application/json');
    /* Add any filters if included in @var req */
    let { results: courses } = await query(`SELECT * FROM thinschool_data.courses`);
    res.send(serializeCourses(courses));
  }
  finally {
    await disconnect();
  }
})

app.listen(3000, () => console.log('Server running on port 3000'))


