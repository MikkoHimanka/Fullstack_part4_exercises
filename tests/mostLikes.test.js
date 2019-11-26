const listHelper = require('../utils/list_helper')
const helper = require('./test_helper')

describe('most likes ', () => {
    test('of a bigger list', () => {
        const result = listHelper.mostLikes(helper.initialBlogs)
        expect(result).toEqual({
            author: 'Edsger W. Dijkstra',
            likes: 17
          })
    })
    test('of list of one', () => {
        const result = listHelper.mostLikes(helper.oneList)
        expect(result).toEqual({
            author: 'Edsger W. Dijkstra',
            likes: 5
          })
    })
})