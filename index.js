const express = require('express')
const app = express()
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/users/:userId/courses/', (req, res) => {
  res.send(`Courses of user -- ${req.params.userId}`);
});

app.get('/list-all-courses', (req, res) => {
  res.send(
    [
      { id: 1, 
        course_name: "Design thinking",
        course_year: "2018",
        course_semester: "fall",
        max_occupancy: "20",
        current_availability: "19",
        instructor_id: 1,
       },
      { id: 2, 
        course_name: "Critical thinking",
        course_year: "2018",
        course_semester: "fall",
        max_occupancy: "10",
        current_availability: "7",
        instructor_id: 1,
       },

    ]
  );
})

/*
app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})
*/
app.listen(3000, () => console.log('Server running on port 3000'))


