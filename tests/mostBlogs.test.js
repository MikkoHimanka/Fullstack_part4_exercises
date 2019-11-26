const listHelper = require('../utils/list_helper')
const helper = require('./test_helper')

describe('most blogs ', () => {
    test('of a bigger list', () => {
        const result = listHelper.mostBlogs(helper.initialBlogs)
        expect(result).toEqual({
            author: 'Robert C. Martin',
            blogs: 3
          })
    })
    test('of list of one', () => {
        const result = listHelper.mostBlogs(helper.oneList)
        expect(result).toEqual({
            author: 'Edsger W. Dijkstra',
            blogs: 1
          })
    })
})