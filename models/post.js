const mongoose = require('mongoose')

const Schema = mongoose.Schema

const PostSchema = new Schema({
    author: {type: Schema.Types.ObjectId, ref: 'User'},
    title: {type: String, required: true},
    text: {type: String, required: true},
    imgUrl: {type: String},
    published: {type: Boolean, required: true},
    timestamp: {type: Date, required: true},
    // comments: [{type: Schema.Types.ObjectId, ref: 'Comment', required: true}] 
})

PostSchema
.virtual('preview')
.get(function () {
    return this.text.slice(0, 200)
})

module.exports = mongoose.model('Post', PostSchema)