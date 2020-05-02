//import what it is in express library
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const uuid = require('uuid');


const validateApiKey = require('./middleware/validate-bearer-token');

//database
const { Bookmarks } = require('./bookMarksModel');
const mongoose = require('mongoose');


//my app use the feature of express
const app = express();
const jsonParser = bodyParser.json();

app.use( morgan('dev'));

app.use(validateApiKey);

/*

let bookmarks = [
    {
        id: uuid.v4(),
        title: "Harry Potter and the Chamber of Secrets",
        description: "In a series of truly fantastic magical installments, Chamber of Secrets is unfortunately the least fantastic. While Sorcerer’s Stone does a solid job at effortlessly setting up Harry’s world, Chamber of Secrets does little to further readers' understanding of this world or the characters within it",
        url: "https://www.amazon.com/Harry-Potter-Chamber-Secrets-Rowling-ebook/dp/B0192CTMW8/ref=sr_1_1?ots=1&tag=portalistsite-20",
        rating: 7
    },
    {
        id: uuid.v4(),
        title: "Harry Potter and the Sorcerer's Stone",
        description: "You always remember your first, and Sorcerer’s Stone is no exception. It was the one that started it all—the one that introduced me to the boy who lived and made me fall in love with the magical world I was discovering alongside Harry. ",
        url: "https://www.amazon.com/gp/product/B0192CTMYG/ref=series_rw_dp_sw?ots=1&tag=portalistsite-20",
        rating: 8
    },
    {
        id: uuid.v4(),
        title: "Harry Potter and the Goblet of Fire",
        description: "A solid read, Goblet of Fire fits comfortably in the middle of the pack. Jumping from Azkaban’s 317 pages to a formidable 636, this installment is the first of the long, heavy Potter novels we now know and love.",
        url: "https://www.amazon.com/gp/product/B0192CTMXM/ref=series_rw_dp_sw?ots=1&tag=portalistsite-20",
        rating: 5
    },
    {
        id: uuid.v4(),
        title: "Harry Potter and the Order of the Phoenix",
        description: "Easily the most polarizing of the Potter novels, Order of the Phoenix offers the series’ highest highs and lowest lows. This lengthy book might as well be titled Harry Potter and the Struggles with Puberty, and fans of the franchise certainly know why.",
        url: "https://www.amazon.com/Harry-Potter-Chamber-Secrets-Rowling-ebook/dp/B0192CTMW8/ref=sr_1_1?ots=1&tag=portalistsite-20",
        rating: 8
    }
]

*/


//GET ALL
app.get('/bookmarks', (req,res) => {
    console.log("Getting all bookmarks.");
    //return res.status(200).json(bookmarks);

    Bookmarks
        .getAllBookmarks()
        .then( result =>{
            return res.status(200).json(result);
        })  

});


//GET BY TITLE
app.get('/bookmark', (req,res) =>{

    console.log("Getting book by title");

    //paramters are send on the url
    console.log(req.query);

    //retrieve the parameter
    let title = req.query.title;

    //also you can use !id
    if( title === undefined)
    {
        res.statusMessage = "Please send the 'title' as parameter";
        return res.status( 406 ).end();

    }

    /*

    //search in the json the id
    let result = bookmarks.find( (book) => {
        if(book.title == title)
        {
            return book;
        }
    });

    //what happend if we dont find the id
    if(!result)
    {
        res.statusMessage = `There are no title with this name `;
        return res.status( 404 ).end();
    }

    

    return res.status(200).json(result);

    */



    //Add to the database
    Bookmarks
    .getByTitleBookmark(title)
    .then( result =>{
        return res.status( 201 ).json(result);
    })
    .catch ( error =>{
        res.statusMessage = "Something went wrong with the DB. Try again later.";
        return res.status(500).end();
    });


});


//POST requests of a bookmark should go to /bookmarks
app.post('/bookmarks' , jsonParser, (req,res) => {

    console.log("Adding new book");

    console.log("Body : ", req.body);

    let id = uuid.v4();
    let title =  req.body.title;
    let description = req.body.description;
    let url = req.body.url;
    let rating = req.body.rating;

    //que el body tenga los parametros que necesitamos
    if(!title || !description ||!url ||!rating){
        res.statusMessage = `One of the parameters are missing in the request`;
        return res.status( 406 ).end();
    }

    if(typeof(rating) !== 'number')
    {
        res.statusMessage = `std: id is not a number`;
        return res.status( 406 ).end(); 
    }

    /*
    let newBook = {id,title,description,url,rating};
    bookmarks.push( newBook );
        
    return res.status(201).json(bookmarks);
    */

    //Validate if id exist
    const newBookmark = {
        id,
        title,
        description,
        url,
        rating

    };
    Bookmarks
        .createBookmark(newBookmark)
        .then( result =>{
            return res.status( 201 ).json(result);
        })
        .catch ( error =>{
            res.statusMessage = "Something went wrong with the DB. Try again later.";
            return res.status(500).end();
        });


});


//DELETE requests should go to /bookmark/:id
app.delete('/bookmark/:id' ,  (req,res) => {

    console.log("Getting book to delete");
    console.log(req.params);

    let id =  req.params.id;

    console.log(id)

    if(!id)
    {
        res.statusMessage = "Please send the 'id' as parameter";
        return res.status( 404 ).end();

    }

    /*
    //see if student exist
    let itemToRemove =  bookmarks.findIndex((book)=>{
        if(book.id === id)
        {
            return true;
        }
    })

    console.log(itemToRemove)
    //si es -1 significa que no hay
    if(itemToRemove<0)
    {
        res.statusMessage = "The 'id' was not found on the list of books";
        return res.status( 404 ).end();
    }

    //now that we have the index remove form the list with the splice
    bookmarks.splice(itemToRemove,1)

    return res.status(204).end();

    */

    //See if id exist

        Bookmarks
        .deleteBookmark(id)
        .then( result =>{
            return res.status( 201 ).json(result);
        })
        .catch ( error =>{
            res.statusMessage = "Something went wrong with the DB. Try again later.";
            return res.status(500).end();
        });


});

//PATCH requests should go to /bookmark/:id
app.patch('/bookmark/:id', jsonParser,(req,res) => {

    console.log("Getting book to patch");
    console.log(req.params);

    //parametro
    let id =  req.params.id;
    

    //body
    let idBody =  req.body.id;
    let title = req.body.title;
    let description = req.body.description;
    let url = req.body.url;
    let rating = req.body.rating;


    console.log("id " + id)
    console.log("idbody " + idBody)
    console.log(req.body)
 
    console.log("title " + title)
    console.log("description " + description)
    console.log("url " + url)
    console.log("rating " + rating)

    if(!id)
    {
        res.statusMessage = "Please send the 'id' as parameter";
        return res.status( 404 ).end();

    }

    if(!(id === idBody))
    {
        res.statusMessage = "The id in the parameter is diferent that in the body";
        return res.status( 409 ).end();

    }


    /*
    for (var i = 0; i < bookmarks.length; i++) {
        if (bookmarks[i].id === id) {

            console.log(bookmarks[i])

            if(!(bookmarks[i].title === title)  || !(title === undefined))
            {
                bookmarks[i].title = title
            }
            if(!(bookmarks[i].description === description)  || !(description === undefined))
            {
                console.log("ENTRO A DESCRIPCION")
                //bookmarks[i].description = description
            }
            if(!(bookmarks[i].url === url)  || !(url === undefined))
            {
                console.log("ENTRO A URL")
                //bookmarks[i].url = url
            }
            if(!(bookmarks[i].rating === rating)  || !(rating === undefined))
            {
                bookmarks[i].rating = rating
            }

            console.log(bookmarks[i])
        }
      }*/
    
      /*
      //search in the json the id
    let result = bookmarks.find( (book) => {
        if(book.id == id)
        {
            return book;
        }
    });*/

    
    //return res.status(202).json(result);
    
    let updaetBookmark = req.body;

    Bookmarks
        .patchBookmark(updaetBookmark, id)
        .then( result =>{
            return res.status( 201 ).json(result);
        })
        .catch ( error =>{
            res.statusMessage = "Something went wrong with the DB. Try again later.";
            return res.status(500).end();
        });
    


});

//where the server will be accesible API- Primary endpoint
//http://localhost:8080
app.listen(8080, () => {

    console.log(
        "This sever is running on port 8080"
    )

    //connection to the databse
    new Promise( (resolve, reject) => {

        mongoose.connect('mongodb://localhost/bookmarksdb' , { useNewUrlParser: true , useUnifiedTopology: true ,useCreateIndex:true}, ( error) =>{

            if(error)
            {
                reject(error);
            }
            else
            {
                console.log("bookmarks db connected succesfully")
                return resolve();
            }

        });

    })
    .catch( error => {

        mongoose.disconnect();
        console.log(error);

    })

});