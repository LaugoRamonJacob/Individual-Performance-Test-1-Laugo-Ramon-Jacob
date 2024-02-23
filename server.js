const express = require('express');
const MongoClient = require('mongodb').MongoClient;

const app = express();
const port = 3000;

// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'mongo-test';

// Use connect method to connect to the server
MongoClient.connect(url, function(err, client) {
  if(err) {
    console.error('Error occurred while connecting to MongoDB', err);
    return;
  }
  console.log('Connected successfully to server');

  const db = client.db(dbName);

  // Define endpoint to retrieve all published backend courses
  app.get('/backend-courses', async (req, res) => {
    try {
      const courses = await db.collection('courses').find({}).toArray();
      const backendCourses = [];
      courses.forEach(year => {
        Object.values(year).forEach(semester => {
          semester.forEach(course => {
            if (course.tags.includes('BSIS') || course.tags.includes('BSIT')) {
              backendCourses.push({
                name: course.description,
                specialization: course.tags.find(tag => ['BSIS', 'BSIT'].includes(tag))
              });
            }
          });
        });
      });
      // Sort courses alphabetically by name
      backendCourses.sort((a, b) => a.name.localeCompare(b.name));
      res.json(backendCourses);
    } catch (err) {
      console.error('Error occurred while retrieving backend courses', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
  });
});
