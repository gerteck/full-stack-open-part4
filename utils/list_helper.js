var lodashCollections = require('lodash/collection');
var lodashObjects = require('lodash/object');


/**
 * Dummy function that returns 1
 * @param {*} blogs
 */
// eslint-disable-next-line no-unused-vars
const dummy = (blogs) => {
    return 1;
}

const totalLikes = (blogs) => {
    return blogs.reduce((acc, blog) => acc + blog.likes, 0);
}

const favoriteBlog = (blogs) => {
    return blogs.reduce((acc, blog) => {
        // If the current blog has more likes than the running max,
        // choose the current blog
        if (acc.likes < blog.likes) {
            return blog;
        }

        // Otherwise, keep the current max
        return acc;

    }, { likes: 0 });
}

// Returns the author with the most blogs
const mostBlogs = (blogs) => {
    // One method is to sort the blogs by author, then count the number of blogs
    // As in FSO, we can use the Lodash library.
    // In particular, countBy seems to be useful here

    if (blogs.length === 0) {
        return {};
    };

    const authorBlogObject = lodashCollections.countBy(blogs, 'author');

    const maxAuthor = Object.keys(authorBlogObject)
        .reduce(
            (a, b) => authorBlogObject[a] > authorBlogObject[b]
                ? a
                : b
        );


    return { author: maxAuthor, blogs: authorBlogObject[maxAuthor] };
};

const mostBlogLikes = (blogs) => {
    if (blogs.length === 0) {
        return {};
    };

    const blogsByAuthor = lodashCollections.groupBy(blogs, 'author');
    // get {'authorA': [{blog1}, {blog2}], 'authorB': [{blog3}, {blog4}]}

    const likesPerAuthor = lodashObjects.mapValues(blogsByAuthor, (blogs) => {
        return blogs.reduce((acc, blog) => acc + blog.likes, 0);
    });

    const maxAuthor = Object.keys(likesPerAuthor)
        .reduce(
            (a, b) => likesPerAuthor[a] > likesPerAuthor[b]
                ? a
                : b
        );

    return { author: maxAuthor, likes: likesPerAuthor[maxAuthor] };
};


module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostBlogLikes
}