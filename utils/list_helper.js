const collection = require('lodash/collection')
const object = require('lodash/object')

const dummy = (blogs) => {
	return 1
}

const totalLikes = (blogs) => {
	return blogs.map(x=>x.likes).reduce((a,b) => a + b, 0)
}

const favouriteBlog = (blogs) => {
	const answer = blogs.reduce((a,b) => b.likes > a.likes ? b : a, blogs[0])
	return {
		title: answer.title,
		author: answer.author,
		likes: answer.likes
	}
}

const mostBlogs = (blogs) => {
	const grouped = collection.groupBy(blogs, 'author')
	const mostBlog = object.values(grouped).reduce((a,b) => b.length > a.length ? b : a, object.values(grouped)[0])
	return {
		author: mostBlog[0].author,
		blogs: mostBlog.length
	}
}

module.exports = {
	dummy,
	totalLikes,
	favouriteBlog,
	mostBlogs
}