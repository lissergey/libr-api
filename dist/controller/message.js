const mongoose = require('mongoose');
const { Router } = require('express');
const Message = require('../model/message');
const paginate = require('express-paginate');

function formatDate(date) {

    var dd = date.getDate();
    if (dd < 10) dd = '0' + dd;
  
    var mm = date.getMonth() + 1;
    if (mm < 10) mm = '0' + mm;
  
    var yy = date.getFullYear() % 100;
    if (yy < 10) yy = '0' + yy;
  
    return dd + '.' + mm + '.' + yy;
  }

function checkTextLength(text) {
    let regExpText = /^.{1,100}/;
    if(regExpText.test(text) != false) {
        return true;
    }
} 

function checkVerifyEmail(email) {
    let regExpEmail = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+(?:[A-Z]{2}|com|org|net|gov|mil|biz|info|mobi|name|aero|jobs|museum)\b/;
    if(regExpEmail.test(email) != false) {
        return true;
    }
}

module.exports = ({config, db}) => {
    let api = Router();

    api.post('/add', (req, res) => {
       
        if (checkTextLength(req.body.text) == true)
        {
            if (checkVerifyEmail(req.body.email) == true)
            {
                let newDate = formatDate(new Date());
                let newMess = new Message();
                newMess.name = req.body.name;
                newMess.email = req.body.email;
                newMess.text = req.body.text;
                newMess.createDate = newDate;
                newMess.updateDate = newDate;

                newMess.save(err => {
                    if(err) {
                        res.setEncoding(err);
                    }
                    res.json({ message: 'Message saved successfully'});
                });
            } else {
                res.status(400).send('Enter a valid email address.');
            }
        } else {
            res.status(400).send('Message empty or length > 100.');
        }
    });

////
    api.get('/', (req, res) => {

        Message.find({}, (err, messages) => {
            const pageCount = Math.ceil(messages.length / 10);
            let page = parseInt(req.query.p);
    
            if (!page) { page = 1; }
            if (page > pageCount) {
                page = pageCount;
            }
            if(err) {
                res.send(err);
            }
            res.json({
                "page": page,
                "pageCount": pageCount,
                "messages": messages.slice(page * 10 - 10, page * 10)
            });
        });
    });

    api.get('/all/', (req, res) => {

        Message.find({}, (err, messages) => {
            if(err) {
                res.send(err);
            }
            res.json(messages);
        });
    });

    api.get('/single/:id', (req, res) => {
        Message.findById(req.params.id, (err, message) => {
            if (err) {
                res.send(err);
            }
            res.json(message);
        });
    });

    api.put('/:id', (req, res) => {
        Message.findById(req.params.id, (err, message) => {
            if (err) {
                res.send(err);
            }
            message.name = req.body.name;
            message.save(err =>  {
                if (err) {
                    res.send(err);
                }
                res.json({ message: "Message updated!"});
            });
        });
    });

    api.delete('/:id', (req, res) => {
        Message.remove({
            _id: req.params.id 
        }, (err, message) => {
            if (err) {
                res.send(err);
            }
            res.json({ message: "Message Successfully Removed!"});
        });
    });

    return api;
}