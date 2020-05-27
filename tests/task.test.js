const { 
    userOneId, 
    userOne, 
    setupDatabase, 
    userTwoId, 
    userTwo, 
    taskOne, 
    taskTwo,
    taskThree
} = require('./fixtures/db')
const request = require('supertest')
const app = require('../src/app')
const Task = require('../src/models/task')

beforeEach(setupDatabase)

test('Should create task for users', async () => {
    const response = await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            description: 'From my test'
        })
        .expect(201)

        const task = await Task.findById(response.body._id)
        expect(task).not.toBeNull()
        expect(task.completed).toEqual(false)

})

test('Should get all tasks for user one', async () => {
    const response = await request(app)
        .get('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
    expect(response).not.toBeNull()
    expect(response.body.length).toBe(2)
})

test('Should fail to delete userOnes first task logged in as userTwo', async() => {
    const response = await request(app)
        .get(`/tasks/${taskOne._id}`)
        .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
        .send()
        .expect(404)

    const task = await Task.findById(taskOne._id)
    expect(task).not.toBeNull()
})

