const listHelper = require('../utils/list_helper')
const helper = require('./test_helper')

describe('favourite blog is', () => {
  test('of a bigger list', () => {
      const result = listHelper.favouriteBlog(helper.initialBlogs)
      expect(result).toEqual({
          title: "Canonical string reduction",
          author: "Edsger W. Dijkstra",
          likes: 12
        })
  })
  test('of a list of one', () => {
      const result = listHelper.favouriteBlog(helper.oneList)
      expect(result).toEqual({
          title: 'Go To Statement Considered Harmful',
          author: 'Edsger W. Dijkstra',
          likes: 5,
      })
  })
})