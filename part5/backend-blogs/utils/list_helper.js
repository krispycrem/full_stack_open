const _ = require('lodash')


const dummy = (blogs) => {
    return 1
  }

const totalLikes = (blogs) => {
    if (blogs.length === 0 || blogs[0].likes === undefined) { return 0 }
    else if (blogs[0].likes && blogs.length === 1) { return blogs[0].likes }
    else { 
        const reducer = (sum, item) => {
            return sum + item
          }
        return blogs.map((b) => b.likes).reduce(reducer, 0)
    }
}

const favoriteBlog = (blogs) => {
    const reducer = (mostVoted, blog) => {
      return mostVoted.likes > blog.likes
        ? {
            "title": mostVoted.title,
            "author": mostVoted.author,
            "likes": mostVoted.likes
        }
        : {
            "title": blog.title,
            "author": blog.author,
            "likes": blog.likes
        }
    }
  
    return blogs.length === 0
      ? {}
      : blogs.reduce(reducer, 0)
}

const mostBlogs = (blogs) => {
    if (blogs.length == 0) {
        return {}
    }
    authorsList = _.map(blogs, 'author')

    var authorBlog = {}

    for (let i = 0; i < authorsList.length; i++) {
        author = blogs[i].author
        if (authorBlog[author] == undefined) {
            authorBlog[author] = 1 
        }
        else {
            authorBlog[author] += 1
        }        
    }
    var authorMaxBlog = _.max(Object.keys(authorBlog), o => authorBlog[o])

    return {
        "author": authorMaxBlog, 
        "blogs": authorBlog[authorMaxBlog]
    }

}

const mostLikes = (blogs) => {
    if (blogs.length == 0) {
        return {}
    }

    authorsList = _.map(blogs, 'author')

    var authorLikes = {}
    for (let i = 0; i < authorsList.length; i++) {
        author = blogs[i].author
        if (authorLikes[author] == undefined) {
            authorLikes[author] = blogs[i].likes 
        }
        else {
            authorLikes[author] += blogs[i].likes
        }        
    }

    var authorMaxLikes = _.max(Object.keys(authorLikes), o => authorLikes[o])

    return {
        "author": authorMaxLikes, 
        "likes": authorLikes[authorMaxLikes]
    }
}

  module.exports = {
    dummy, 
    totalLikes,
    favoriteBlog, 
    mostBlogs, 
    mostLikes
}