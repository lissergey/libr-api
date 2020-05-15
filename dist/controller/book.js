const mongoose = require('mongoose');
const { Router } = require('express');
const Book = require('../model/book');


module.exports = ({config, db}) => {
    let api = Router();

    api.post('/add', (req, res) => {
       
        let newBook = new Book();
        newBook.name = req.body.name;
        newBook.author = req.body.author;
        newBook.year = req.body.year;

        newBook.save(err => {
            if(err) {
                res.send(err);
            }
            res.json({ book: 'Message saved successfully'});
        });
    });

    api.get('/all/', (req, res) => {

        Book.find({}, (err, books) => {
            if(err) {
                res.send(err);
            }
            res.json(books);
        });
    });

    api.get('/search', (req, res) => {
        var author = req.query.author;
        var year = req.query.year;
        
        if (req.query.author && req.query.year ) {
             Book.find({
                 'author': author,
                 'year': year
             }, function(err, result) {
                if(err) {
                    res.send(err);
                }
                if (result) {
                     res.json(result)
                }
             })
         } else if (req.query.year) {
             Book.find({
                 'year': year
             }, function(err, result) {
                if(err) {
                    res.send(err);
                }
                if (result) {
                     res.json(result)
                }
             })
         }  else if (req.query.author) {
             Book.find({
                 'author': author
             }, function(err, result) {
                if(err) {
                    res.send(err);
                }
                if (result) {
                     res.json(result)
                }
             })
         }
 
     });


    api.get('/id/:id', (req, res) => {
        Book.findById(req.params.id, (err, book) => {
            if (err) {
                res.send(err);
            }
            res.json(book);
        });
    });

    api.put('/:id', (req, res) => {
        Book.findById(req.params.id, (err, book) => {
            if (err) {
                res.send(err);
            }
            book.name = req.body.name;
            book.save(err =>  {
                if (err) {
                    res.send(err);
                }
                res.json({ book: "Book updated!"});
            });
        });
    });

    api.delete('/:id', (req, res) => {
        Book.remove({
            _id: req.params.id 
        }, (err, book) => {
            if (err) {
                res.send(err);
            }
            res.json({ book: "Message Successfully Removed!"});
        });
    });

    return api;
}