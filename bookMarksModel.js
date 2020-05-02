const mongoose = require('mongoose');
var uuidv4 = require('uuid/v4');


//specify our collection schema
//building the structure od the table
const bookmarksCollectionSchema = mongoose.Schema({
    id : {
        type: String,
        default: uuidv4,
        require: true,
    },
    title : {
        type: String,
        require: true,
        unique : true
    },
    description : {
        type: String,
        require: true
    },
    url : {
        type: String,
        require: true
    },
    rating: {
        type: Number,
        require: true
    }
})

//create the schema if doesnt exist in mongo shield and if already exist 
const bookmarksCollection = mongoose.model( 'bookmarksdb' , bookmarksCollectionSchema );

//Queries

const Bookmarks = {
    createBookmark : function( newBookmark ) {
        return bookmarksCollection
                //insert new student
                .create(newBookmark)
                //send the information return
                .then(createdBookmark => {
                    return createdBookmark;
                })
                //error of any kind
                .catch( error => {
                    return error;
                });
    },

    getAllBookmarks : function () {
        return bookmarksCollection
            .find()
            //send the information return
            .then(allBookmarks => {
                return allBookmarks;
            })
            //error of any kind
            .catch( error => {
                return error;
            });

    },

    getByTitleBookmark : function (title){
        return bookmarksCollection
            .find({"title": title })
            //send the information return
            .then(bookmarkTitle => {
                return bookmarkTitle;
            })
            //error of any kind
            .catch( error => {
                return error
            });
    },

    getByIdBookmark : function (id){
        return bookmarksCollection
            .find({"id": id })
            //send the information return
            .then(bookmarkTitle => {
                return bookmarkTitle;
            })
            //error of any kind
            .catch( error => {
                return error
            });
    },

    deleteBookmark : function (id) {
        return bookmarksCollection
            .remove({"id": id })
            //send the information return
            .then(removeBookMark => {
                return removeBookMark;
            })
            //error of any kind
            .catch( error => {
                return error;
            });
    },

    patchBookmark : function( updateBookmark , id){
        return bookmarksCollection
            .update({"id": id },{$set: updateBookmark})
            //send the information return
            .then(updateBookMark => {
                return updateBookMark;
            })
            //error of any kind
            .catch( error => {
                return error;
            });
    },

}


module.exports = {Bookmarks};