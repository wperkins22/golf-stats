const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(morgan('dev'));

app.use(cors());

app.use(bodyParser.json());

const roundsRouter = require('./server/rounds');
const coursesRouter = require('./server/courses');

app.use('/rounds', roundsRouter);
app.use('/courses', coursesRouter);

app.use((err, req, res, next) => {
    const status = err.status || 500;
    res.status(status).send(err.message);
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});