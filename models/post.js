const mongoose = require('mongoose')

const Schema = mongoose.Schema

const PostSchema = new Schema({
    author: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    title: {type: String, required: true},
    text: {type: String, required: true},
    published: {type: Boolean, required: true},
    timestamp: {type: Date, required: true},
    comments: [{type: Schema.Types.ObjectId, ref: 'Comment', required: true}] 
})

module.exports = mongoose.model('Post', PostSchema)