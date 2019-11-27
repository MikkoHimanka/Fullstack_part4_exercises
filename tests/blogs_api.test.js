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
        .expect(200)
        .expect('Content-Type', /application\/json/)

    const blogsInDB = await api.get('/api/blogs')

    expect(blogsInDB.body.length).toBe(helper.initialBlogs.length + 1)
    expect(blogsInDB.body[helper.initialBlogs.length].title).toBe('Esimerkkiblogi')
})

test('if the "likes" value is missing it will default to 0', async () => {
    const newBlog = {
        title: 'Esimerkkiblogi',
        author: 'Arnold The Doughnut',
        url: 'https://www.google.com/search?q=arnold%27s+doughnuts'
    }

    await api.post('/api/blogs').send(newBlog)
        .expect(response => expect(response.body.likes).toBe(0))
})

test('if title or url is missing 400 is returned', async () => {
    const newBlog = {
        author: 'Arnold The Doughnut',
        url: 'https://www.google.com/search?q=arnold%27s+doughnuts',
        likes: 8864531421
    }
    await api.post('/api/blogs').send(newBlog).expect(400)

    const newBlog2 = {
        title: 'No URL',
        author: 'Arnold The Doughnut',
        likes: 7
    }
    await api.post('/api/blogs').send(newBlog2).expect(400)

    const newBlog3 = {
        author: 'Arnold The Doughnut',
        likes: 7
    }
    await api.post('/api/blogs').send(newBlog3).expect(400)
})

afterAll(() => {
    mongoose.connection.close()
})