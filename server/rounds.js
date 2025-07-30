const { getAllRounds, getRoundByID, addRound, updateRound, deleteRound } = require('./db');

const roundsRouter = require('express').Router();

module.exports = roundsRouter;

// GET all rounds
roundsRouter.get('/', getAllRounds);

// GET round by ID
roundsRouter.get('/:id', getRoundByID);

// POST new round
roundsRouter.post('/', addRound);

// PUT update round
roundsRouter.put('/:id', updateRound);

// DELETE a round
roundsRouter.delete('/:id', deleteRound);