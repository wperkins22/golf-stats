const { getAllRounds, getRoundByID, addRound, updateRound, deleteRound, checkExistingRoundID } = require('./db');

const roundsRouter = require('express').Router();

module.exports = roundsRouter;

// GET all rounds
roundsRouter.get('/', getAllRounds);

// GET round by ID
roundsRouter.get('/:id', checkExistingRoundID, getRoundByID);

// POST new round
roundsRouter.post('/', addRound);

// PUT update round
roundsRouter.put('/:id', updateRound);

// DELETE a round
roundsRouter.delete('/:id', checkExistingRoundID, deleteRound);