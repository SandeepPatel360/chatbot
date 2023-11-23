const express = require('express');
const bodyParser = require('body-parser')
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const mongoose = require('mongoose');
const dbconnect = require('./config/database');
require("dotenv").config();
const Message = require('./models/Message');
const  { Configuration, OpenAIApi } = require("openai");
const axios = require('axios');


app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));



const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);


app.get('/messages', (req, res) => {

    try {
        Message.find({}, (err, messages) => {
            if (err) {
                console.log('error', err);
            }
            console.log('getting All message....', messages);
            res.send(messages);
        })
    } catch (error) {
        res.sendStatus(500);
        return console.log('error', error);
    }
})


// app.get('/messages/:user', (req, res) => {
//     var user = req.params.user
//     Message.find({ name: user }, (err, messages) => {
//         res.send(messages);
//     })
// })


app.post('/messages', async (req, res) => {
    try {
        var message = new Message(req.body);
        console.log('Sending Message....', message);

        var savedMessage = await message.save()
        console.log('saved');

        var censored = await Message.findOne({ message: 'badword' });
        if (censored)
            await Message.remove({ _id: censored.id })
        else
            io.emit('message', req.body);
        res.sendStatus(200);
    }
    catch (error) {
        res.sendStatus(500);
        return console.log('error', error);
    }
    finally {
        console.log('Message Posted')
    }

})

app.get('/openai-key', (req, res) => {
    
    res.json({ apiKey: process.env.OPENAI_API_KEY });
});


app.post('/chat', async (req, res) => {
    try {
        const prompt = req.body.prompt;

        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: `${prompt}`,
            temperature: 0,
            max_tokens: 3000,
            top_p: 1,
            frequency_penalty: 0.5,
            presence_penalty: 0,
        });
        console.log(data.choices[0].message.content);
        res.status(200).send({
            bot: response.data.choices[0].text
        });
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
})


io.on('connectio  n', () => {
    console.log('a user is connected')
})

dbconnect();


var server = http.listen(3000, () => {
    console.log('server is running on port', server.address().port);
});

