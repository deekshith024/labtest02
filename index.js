const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
const port = 3000;

// Connect to database
const db = new sqlite3.Database('wh.db', (err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Connected to the SQLite database.');
  });


// // Middleware for parsing request body
// app.use(express.urlencoded({ extended: true }));

// Form page route
app.get('/', (req, res) => {
  res.send(`
    <form action="/formSubmit" method="post">
      <label for="PartNumber">PartNumber:</label>
      <input type="text" id="PartNumber" name="PartNumber" required>
      <button type="submit">Submit</button>
    </form>
  `);
});

// Form submission route
app.post('/formSubmit', (req, res) => {
    const PartNumber = req.body.PartNumber;
 console.log(PartNumber)
 db.get(`SELECT Shelf.ShelfLocation, Bin.BinId, COUNT(PartNumber.PartNumberId) FROM PartNumber JOIN Bin ON PartNumber.BinId = Bin.BinId JOIN Shelf ON Bin.ShelfId = Shelf.ShelfId WHERE PartNumber.PartNumber = ?`,
        [PartNumber],
        function (err, row) {
            if (err) {
                return console.error(err.message);
            }
            console.log(row)
            res.send(`
           
            <h2>Database for warehouse</h2>
            <table >
                <tr>
                    <th>Shelf Number</th>
                    <th>Bin Number</th>
                    <th>PartNumber Count</th>
                </tr>
                <tr>
                    <td>${row.ShelfLocation}</td>
                    <td>${row.BinId}</td>
                    <td>${row['COUNT(PartNumber.PartNumberId)']}</td>
                </tr>
            </table>
                `)
        });
});

  // Perform database query
  /*
  
app.get('/products', (req, res) => {
  db.all('SELECT * FROM products', (err, rows) => {
    if (err) {
      res.status(500).send(err.message);
    } else {
      res.send(rows);
    }
  });
});


app.get('/products', (req, res) => {  
db.all('SELECT * FROM PartNumber WHERE PartNumberId', PartNumberId, (err, rows) => {
    if (err) {
      throw err;
    }
    res.send(`You submitted: ${PartNumberId}. Here are the results from the database: ${JSON.stringify(rows)}`);

  });
});

*/

// Start server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});




// app.get('/', (req, res) => {
//   res.send(`
//     <form action="/submit-form" method="post">
//       <input type="text" name="name" placeholder="Name" />
//       <input type="text" name="age" placeholder="Age" />
//       <button type="submit">Submit</button>
//     </form>
//   `);
// });  


// app.post('/submit-form', (req, res) => {
//   const name = req.body.name;
//   const age = req.body.age;
//   res.send(`HEllo!, ${name}, you are ${age} years old.`);
// });

// app.listen(3000, () => {
//   console.log('Server started on http://localhost:3000');
// });