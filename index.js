const express = require('express');
const app = express();
const router = express.Router();
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const userDataPath = path.join(__dirname, 'user.json');
const userData = JSON.parse(fs.readFileSync(userDataPath, 'utf8'));

app.use(bodyParser.json());

/*
- Create new html file name home.html 
- add <h1> tag with message "Welcome to ExpressJs Tutorial"
- Return home.html page to client
*/
router.get('/home', (req,res) => {
  const filePath = path.join(__dirname, 'home.html');

  fs.readFile(filePath, (err, data) => {
    if (err){
      res.status(404).send('file not found');
    } else {
      res.status(200).type('text/html').send(data);
    }
  })
});

/*
- Return all details from user.json file to client as JSON format
*/
router.get('/profile', (req, res) => {
  fs.readFile(userDataPath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ status: false, message: 'Error reading user data.' });
    }

    const user = JSON.parse(data);
    res.status(200).json(user);
  });
});

/*
- Modify /login router to accept username and password as query string parameter
- Read data from user.json file
- If username and  passsword is valid then send resonse as below 
    {
        status: true,
        message: "User Is valid"
    }
- If username is invalid then send response as below 
    {
        status: false,
        message: "User Name is invalid"
    }
- If passsword is invalid then send response as below 
    {
        status: false,
        message: "Password is invalid"
    }
*/
router.get('/login', (req, res) => {
  const { username, password } = req.query;

  if (!username || !password) {
    return res.status(400).json({ status: false, message: 'Both username and password are required.' });
  }

  if (!userData || username !== userData.username) {
    return res.status(401).json({ status: false, message: 'Username is invalid.' });
  }

  if (password !== userData.password) {
    return res.status(401).json({ status: false, message: 'Password is invalid.' });
  }

  res.status(200).json({ status: true, message: 'User is valid.' });
});

/*
- Modify /logout route to accept username as parameter and display message
    in HTML format like <b>${username} successfully logout.<b>
*/
router.get('/logout/:username', (req, res) => {
  const { username } = req.params;

  const htmlMessage = `<b>${username} successfully logged out.</b>`;

  res.status(200).send(htmlMessage);
});

app.use('/', router);

app.listen(process.env.port || 8081);

console.log('Web Server is listening at port '+ (process.env.port || 8081));