const { validationResult } = require('express-validator');
const Post = require('../models/post');
const fs = require('fs');
const path = require('path');

module.exports.getPosts = (req, res, next) => {
    const currentPage = req.query.page || 1;
    const perPage = 2;
    let totalItems;

    Post.find()
        .countDocuments()
        .then(count => {

            if (!count) {
                const error = new Error('Could not find posts.');
                error.statusCode = 404;
                throw error;
            }

            totalItems = count;

            return Post.find()
                .skip((currentPage - 1) * perPage)
                .limit(perPage);

        })
        .then(posts => {
            if (!posts) {
                const error = new Error('Could not find posts.');
                error.statusCode = 404;
                throw error;
            }

            res.status(200).json({
                message: 'Posts fetched.',
                posts: posts
            });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
}

module.exports.createPost = (req, res, next) => {
    const title = req.body.title;
    const content = req.body.content;

    const validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
        const error = new Error('Validation failed, entered data is incorrect.');
        error.statusCode = 422;
        error.data = validationErrors.array();
        throw error;
    }

    if (!req.file) {
        const error = new Error('No image provided.');
        error.statusCode = 422;
        throw error;
    }

    const imagePath = req.file.path;
    const updatedImagePath = imagePath.replace(/\\/g, '/');

    Post.create({
        title: title,
        content: content,
        imageUrl: updatedImagePath,
        creator: { name: 'Maximilian' },
        createdAt: new Date()
    })
        .then(result => {

            if (!result) {
                const error = new Error('Post creation failed.');
                error.statusCode = 500;
                throw error;
            }

            res.status(201).json({
                message: 'Post created successfully!',
                post: result
            });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
}

module.exports.getPost = (req, res, next) => {
    const postId = req.params.postId;

    Post.findById(postId)
        .then(post => {
            if (!post) {
                const error = new Error('Could not find post.');
                error.statusCode = 404;
                throw error;
            }

            res.status(200).json({
                message: 'Post fetched.',
                post: post
            });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
}

module.exports.updatePost = (req, res, next) => {
    const postId = req.params.postId;

    const title = req.body.title;
    const content = req.body.content;

    const validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
        const error = new Error('Validation failed, entered data is incorrect.');
        error.statusCode = 422;
        error.data = validationErrors.array();
        throw error;
    }

    let imagePath = req.body.image;

    if (req.file) {
        const image = req.file.path;
        imagePath = image.replace(/\\/g, '/');
    }

    if (!imagePath) {
        const error = new Error('No file picked.');
        error.statusCode = 422;
        throw error;
    }

    Post.findById(postId)
        .then(post => {
            if (!post) {
                const error = new Error('Could not find post.');
                error.statusCode = 404;
                throw error;
            }

            if (imagePath !== post.imageUrl) {
                clearImage(post.imageUrl);
            }

            post.title = title;
            post.content = content;
            post.imageUrl = imagePath;

            return post.save();
        })
        .then(result => {
            if (!result) {
                const error = new Error('Post update failed.');
                error.statusCode = 500;
                throw error;
            }

            res.status(200).json({
                message: 'Post updated.',
                post: result
            });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
}

module.exports.deletePost = (req, res, next) => {
    const postId = req.params.postId;

    Post.findById(postId)
        .then(post => {
            if (!post) {
                const error = new Error('Could not find post.');
                error.statusCode = 404;
                throw error;
            }

            clearImage(post.imageUrl);

            return Post.findByIdAndDelete(postId);
        })
        .then(result => {
            if (!result) {
                const error = new Error('Post deletion failed.');
                error.statusCode = 500;
                throw error;
            }

            res.status(200).json({
                message: 'Post deleted.'
            });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
}

const clearImage = filePath => {
    filePath = path.join(__dirname, '..', filePath);
    console.log(filePath);
    fs.unlink(filePath, err => console.log(err));
}