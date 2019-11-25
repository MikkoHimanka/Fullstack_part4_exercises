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

module.exports = {
	dummy,
	totalLikes,
	favouriteBlog
}