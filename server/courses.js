const { pool, getAllCourses, getCourseByID, addCourse, updateCourse, deleteCourse } = require('./db');

const coursesRouter = require('express').Router();

module.exports = coursesRouter;

// GET all courses
coursesRouter.get('/', getAllCourses);

// GET course by ID
coursesRouter.get('/:id', getCourseByID);

// POST new course
coursesRouter.post('/', addCourse);

// PUT update course
coursesRouter.put('/:id', updateCourse);

// DELETE a course
coursesRouter.delete('/:id', deleteCourse);