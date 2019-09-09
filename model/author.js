var mongoose = require('mongoose');


const AuthorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    age:{
        type:Number,
        required:true
      }
})
const Author = mongoose.model("Author", AuthorSchema);
module.exports = Author