const { userOneId, userOne, setupDatabase } = require('./fixtures/db')
const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/user')



beforeEach(setupDatabase)

test('Should signup a new user', async () => {
    const response = await request(app)
        .post('/users')
        .send({
            name: 'Andrew Pettit',
            email: 'andrew@example.com',
            password: 'MyPass777!'
        })
        .expect(201)

    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()
    // Assertions about response

    expect(response.body).toMatchObject({
        user: {
            name: 'Andrew Pettit',
            email: 'andrew@example.com'
        },
        token: user.tokens[0].token
    })
    expect(user.password).not.toBe('MyPass777!')

})

test('Should login in existing user', async () => {
    const response = await request(app)
        .post('/users/login')
        .send({
            email: userOne.email,
            password: userOne.password
        })
        .expect(200)
    const user = await User.findById(userOneId)
    expect(response.body.token).toBe(user.tokens[1].token)

})

test('Should fail to login', async () => {
    await request(app)
        .post('/users/login')
        .send({
            email: 'mike@example',
            password: 'wrongpassword'
        })
        .expect(400)
})

test('Should get profile for user', async () => {
    await request(app)
        .get('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
})

test('Should fail to get profile due to auth error', async () => {
    await request(app)
        .get('/users/me')
        .send()
        .expect(401)
})

// Close account

test('Should delete account for user', async () => {
    await request(app)
        .delete('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)

    const user = await User.findById(userOneId)
    expect(user).toBeNull()
})

test('Should fail to delete account for user', async () => {
    await request(app)
        .delete('/users/me')
        .send()
        .expect(401)
})

test('Should upload avatar image', async () => {
    await request(app)
        .post('/users/me/avatar')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .attach('avatar', 'tests/fixtures/profile-pic.jpg')
        .expect(200)
    const user = await User.findById(userOneId)
    expect(user.avatar).toEqual(expect.any(Buffer))

})

//1. Update valid user fields
// find in database and check name has changed

// 2. Check fail to update

test('Should Update valid user fields', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            name: 'John'
        })
        .expect(200)
    const user = await User.findById(userOneId)
    expect(user.name).toEqual('John')
})

test('Should not Update invalid user fields', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            location: 'London'
        })
        .expect(400)
})

