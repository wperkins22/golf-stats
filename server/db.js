// Import pg.pool and instantiate a pool for connection to database
const Pool = require('pg').Pool;
const pool = new Pool({
    user: 'db_user',
    host: 'localhost',
    database: 'golf_stats',
    password: 'password',
    port: 5432
});

/* The following functions are middleware helpers for checking that an ID exists in course or round table */
/* These will also set the requested id to req.id and the results of a select * query to req.results */

const checkExistingCourseID = async (req, res, next) => {
    req.id = parseInt(req.params.id);

    try {
        const results = await pool.query('SELECT * FROM course WHERE id = $1', [req.id]);
        if (!results.rows[0]) {
            req.results = null;
        } else {
            req.results = results;
        }
        next();
    } catch (error) {
        next(error);
    }
};

const checkExistingRoundID = async (req, res, next) => {
    req.id = parseInt(req.params.id);

    try {
        const results = await pool.query('SELECT * FROM round WHERE id = $1', [req.id]);
        if (!results.rows[0]) {
            req.results = null;
        } else {
            req.results = results;
        }
        next();
    } catch (error) {
        next(error);
    }
};

/* The following functions are helpers for courses route */

// select all courses from course table
const getAllCourses = async (req, res, next) => {
    if (!req.query.name && !req.query.location_state) {
        await pool.query(
            'SELECT * FROM course',
            (error, results) => {
                if (error) {
                    next(error);
                }
                res.status(200).json(results.rows);
            }
        );
    } else {
        if (req.query.name) {
            const name = req.query.name;
            const results = await pool.query('SELECT * FROM course WHERE name = $1', [name]);
            if (!results.rows[0]) {
                res.status(404).send(`Course(s) with name: ${name} not found`);
            } else {
                res.status(200).send(results.rows);
            }
        } else if (req.query.location_state) {
            const location_state = req.query.location_state;
            const results = await pool.query('SELECT * FROM course WHERE location_state = $1', [location_state]);
            if (!results.rows[0]) {
                res.status(404).send(`Course(s) in state: ${location_state} not found`);
            } else {
                res.status(200).send(results.rows);
            }
        }
    }
};

// select course by ID from course table.
// requires a course ID to be included as parameter 
const getCourseByID = async (req, res, next) => {
    if (!req.results) {
        res.status(404).send(`Course with ID: ${req.id} not found`)
    } else {
        res.status(200).json(req.results.rows);
    }
};

// add a course to the course table
const addCourse = async (req, res, next) => {
    const {
        name,
        rating,
        slope,
        length_yd,
        public,
        location_city,
        location_state
    } = req.body;

    await pool.query(
        'INSERT INTO course (name, rating, slope, length_yd, public, location_city, location_state) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
        [name, rating, slope, length_yd, public, location_city, location_state],
        (error, results) => {
            if (error) {
                next(error);
            }
            res.status(201).send(`Course added with ID: ${results.rows[0].id}`)
        }
    );
};

// update an existing course in the course table. 
// requires an ID passed in as a parameter 
// requires name, rating, slope, length_yd, public, location_city, location_state to be passed in as request body
const updateCourse = async (req, res, next) => {
    const id = parseInt(req.params.id);
    const {
        name,
        rating,
        slope,
        length_yd,
        public,
        location_city,
        location_state
    } = req.body;

    try {
        const results = await pool.query(
            `UPDATE course SET name = $1, rating = $2, slope = $3, length_yd = $4, public = $5, location_city = $6, location_state = $7
            WHERE id = $8 RETURNING *`,
            [name, rating, slope, length_yd, public, location_city, location_state, id]
        );
        if (!results.rows[0]) {
            res.status(404).send(`Course with ID: ${id} not found`);
        } else {
            res.status(201).send(`Course updated with ID: ${id}`);
        }
    } catch (error) {
        next(error);
    }
};

// delete a course from the course table
// requires a course id to be passed in as parameter
const deleteCourse = async (req, res, next) => {
    if (!req.results) {
        res.status(404).send(`Course with ID: ${req.id} not found`);
    } else {
        await pool.query(
            `DELETE FROM course WHERE id = $1`,
            [req.id],
            (error, results) => {
                if (error) {
                    next(error);
                } else {
                    res.status(204).send();
                }
            }
        );
    }
};

/* The following functions are helpers for the rounds route */

// select all rounds from the round table
const getAllRounds = async (req, res, next) => {
    await pool.query(
        'SELECT * FROM round',
        (error, results) => {
            if (error) {
                next(error);
            } else {
                res.status(200).json(results.rows);
            }
        }
    );
};

// select a single round by ID from round table
// requires ID to be passed in as parameter
const getRoundByID = async (req, res, next) => {
    if (!req.results) {
        res.status(404).send(`Round with ID: ${req.id} not found`);
    } else {
        res.status(200).json(req.results.rows);
    }
};

// add a round to the round table
// requires date, played_18, front_9_score, back_9_score, total_score and course_id to be passed in as request body
const addRound = async (req, res, next) => {
    const {
        date,
        played_18,
        front_9_score,
        back_9_score,
        total_score,
        course_id
    } = req.body;

    await pool.query(
        `INSERT INTO round (date, played_18, front_9_score, back_9_score, total_score, course_id)
        VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
        [date, played_18, front_9_score, back_9_score, total_score, course_id],
        (error, results) => {
            if (error) {
                next(error);
            } else {
                res.status(201).send(`Round added with ID: ${results.rows[0].id}`);
            }
        }
    );
};

// update an existing round in the round table
// requires an ID to be passed in as parameter
// requires date, played_18, front_9_score, back_9_score, total_score and course_id to be passed in as request body
const updateRound = async (req, res, next) => {
    const id = parseInt(req.params.id);
    const {
        date,
        played_18,
        front_9_score,
        back_9_score,
        total_score,
        course_id
    } = req.body;

    try {
        const results = await pool.query(
            `UPDATE round SET date = $1, played_18 = $2, front_9_score = $3, back_9_score = $4, total_score = $5, course_id = $6
            WHERE id = $7 RETURNING *`,
            [date, played_18, front_9_score, back_9_score, total_score, course_id, id]
        );
        if (!results.rows[0]) {
            res.status(404).send(`Round with ID: ${id} not found`);
        } else {
            res.status(201).send(`Round updated with ID: ${id}`);
        }
    } catch (error) {
        next(error);
    }
};

// delete a round from the round table
// requires an ID to be passed in as parameter
const deleteRound = async (req, res, next) => {
    if (!req.results) {
        res.status(404).send(`Round with ID: ${req.id} not found`);
    } else {
        await pool.query(
            'DELETE FROM round WHERE id = $1',
            [req.id],
            (error, results) => {
                if (error) {
                    next(error);
                } else {
                    res.status(204).send();
                }
            }
        );
    }
}

module.exports = {
    checkExistingCourseID,
    checkExistingRoundID,
    getAllCourses,
    getCourseByID,
    addCourse,
    updateCourse,
    deleteCourse, 
    getAllRounds,
    getRoundByID,
    addRound,
    updateRound,
    deleteRound
};