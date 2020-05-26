const express = require('express')
const Task = require('../models/task')
const router = new express.Router()
const auth = require('../middleware/auth')


// Tasks
// Create Tasks
router.post('/tasks', auth, async (req, res) => {
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })
    try {
        await task.save()
        res.status(201).send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})
// Get Tasks ?completed=true / false 
// get /tasks?limit=10&skip=10
// /tasks?sort=createdAt:desc
router.get('/tasks', auth, async (req, res) => {
    const match = {}
    const sort = {}
    const owner = req.user._id

    if (req.query.completed) {
        match.completed = req.query.completed === 'true'
    }
    if (req.query.sort) {
        const parts = req.query.sort.split(':')
        sort[parts[0]] = parts[1] === 'desc'? -1 : 1

    }
    try {
        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate()
        res.send(req.user.tasks)
    } catch (e) {
        res.status(500).send(e)
    }
})
// Get Task by ID
router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id
    try {
        const task = await Task.findOne({ _id, owner: req.user._id })
        if (!task) {
            return res.status(404).send()
        }
        res.send(task)
    } catch (e) {
        res.status(500).send(e)
    }
})
// Update by ID
router.patch('/tasks/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowed = ['description', 'completed']
    const isValid = updates.every((update) => allowed.includes(update))

    if (!isValid) {
        return res.status(400).send( {error: 'Invalid updates' })
    }

    try {
        const _id = req.params.id
        const task = await Task.findOne({_id, owner: req.user._id})
        
        if (!task) {
            return res.status(404).send()
        }

        updates.forEach((update) => task[update] = req.body[update])
        await task.save()
        res.send(task)
    } catch (e) {
        res.status(500).send(e)
    }
})
// Delete Task by ID
router.delete('/tasks/:id', auth, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({_id: req.params.id, owner: req.user._id})
        if (!task) {
            return res.status(404).send({error: 'Invalid Task'})
        }
        res.send(task)
    } catch (e) {
        res.status(500).send(e)
    }
})
// Delete completed tasks
router.delete('/tasks-completed', auth, async (req, res) => {
    try {
        const tasks = await Task.find({ completed: true, owner: req.user._id })
        const deletes = await Task.deleteMany({ completed: true })
        if (!deletes) {
            return res.status(404).send({error: 'No completed tasks'})
        }
        res.send(tasks)
    } catch (e) {
        res.status(500).send(e)
    }
})

module.exports = router