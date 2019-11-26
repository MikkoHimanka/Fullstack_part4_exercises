const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')

beforeEach(async () => {
    await Blog.deleteMany({})
    
    const blogObjects = helper.initialBlogs
        .map(blog => new Blog(blog))
    const promiseArray = blogObjects.map(blog => blog.save())
    await Promise.all(promiseArray)
})

test('database has correct amount of blog entries', async () => {
    const res = await api.get('/api/blogs')

    expect(res.body.length).toBe(helper.initialBlogs.length)
})

test('is the unique identifier appropriately named id in all entries', async () => {
    const res = await api.get('/api/blogs')
    
    res.body.map(x => expect(x.id).toBeDefined())
})

afterAll(() => {
    mongoose.connection.close()
})