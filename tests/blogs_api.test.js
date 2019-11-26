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

test('does POST work and is the content saved correctly on the database', async () => {
    const newBlog = {
        title: 'Esimerkkiblogi',
        author: 'Arnold The Doughnut',
        url: 'https://www.google.com/search?q=arnold%27s+doughnuts',
        likes: 8864531421
    }

    await api.post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const blogsInDB = await api.get('/api/blogs')

    expect(blogsInDB.body.length).toBe(helper.initialBlogs.length + 1)
    expect(blogsInDB.body[helper.initialBlogs.length].title).toBe('Esimerkkiblogi')

})

afterAll(() => {
    mongoose.connection.close()
})