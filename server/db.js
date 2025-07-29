const Pool = require('pg').Pool;
const pool = new Pool({
    user: 'db_user',
    host: 'localhost',
    database: 'golf_stats',
    password: 'password',
    port: 5432
});

const getAllCourses = async (req, res, next) => {
    await pool.query(
        'SELECT * FROM course',
        (error, results) => {
            if (error) {
                next(error);
            }
            res.status(200).json(results.rows);
        }
    );
};

const getCourseByID = async (req, res, next) => {
    const id = parseInt(req.params.id);

    try {
        const results = await pool.query('SELECT * FROM course WHERE id = $1', [id]);
        if (!results.rows[0]) {
            res.status(404).send(`Course with ID: ${id} not found`)
        } else {
            res.status(200).json(results.rows);
        }
    } catch (error) {
        next(error);
    }
};

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

const deleteCourse = async (req, res, next) => {
    const id = parseInt(req.params.id);

    const test_id = await pool.query('SELECT * FROM course WHERE id = $1', [id]);

    if (!test_id.rows[0]) {
        res.status(404).send(`Course with ID: ${id} not found`);
    } else {
        await pool.query(
            `DELETE FROM course WHERE id = $1`,
            [id],
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

module.exports = {
    pool,
    getAllCourses,
    getCourseByID,
    addCourse,
    updateCourse,
    deleteCourse
};