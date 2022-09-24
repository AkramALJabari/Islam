process.env = {
    "webhookId": "978536528806576148",
    "webhookToken": "I-6PdAOJ2E16pNANisN9mI5X6_kR7FmNE1_Q-xyoTMftcl1vl-hx3choDv8eO5PGK1Be"
};

const { EmbedBuilder, WebhookClient } = require('discord.js');
const express = require('express');
const app = express();
const path = require('path');
const passport = require("passport");
const Strategy = require("passport-discord").Strategy;
const session = require("express-session");
const MemoryStore = require("memorystore")(session);
const bodyParser = require("body-parser");
const fs = require(`fs`);


app.set(`view engine`, `ejs`);
app.set(`views`, path.join(__dirname, `./www/views`))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, `./www/public`)))


app.get(`/`, function (req, res) {
    res.render(`index`)
})
app.get(`/alquran`, function (req, res) {
    res.render(`alquran`)
})
app.get(`/arkan-aleman`, function (req, res) {
    res.render(`arkan-aleman`)
})
app.get(`/arkan-aleslam`, function (req, res) {
    res.render(`arkan-aleslam`)
})
app.get(`/ahadeth`, function (req, res) {
    res.render(`ahadeth`)
})
app.get(`/stories`, function (req, res) {
    res.render(`stories`)
})
app.get(`/masba7a`, function (req, res) {
    res.render(`masba7a`)
})
app.get(`/news`, function (req, res) {
    res.render(`news`)
})
app.get(`/comments`, function (req, res) {
    const data = fs.readFileSync("comments.json");
    const comments = JSON.parse(data);
    res.render(`comments`, {
        comments,
        done: false,
        err: false
    })
})
app.get(`/ablution`, function (req, res) {
    res.render(`ablution`)
})
app.get(`/prayer`, function (req, res) {
    res.render(`prayer`)
})
app.get(`/download`, function (req, res) {
    res.render(`download`)
})


app.post(`/comments`, async function (req, res) {
    const webhookClient = new WebhookClient({ id: process.env.webhookId, token: process.env.webhookToken });
    fs.readFile('comments.json', 'utf8', (err, data) => {
        const comments = JSON.parse(data);
        if (err) {
            res.render(`comments`, {
                comments,
                done: false,
                err: true
            })
            webhookClient.send({
                embeds: [new EmbedBuilder()
                    .setTitle(`Log Sending Comments To Al-Eslam`)
                    .setURL(`https://www.aleslam.ml/comments`)
                    .setDescription(`حالة الإرسال : لم يتم الإرسال\nالإسم :\n${req.body.name}\nالبريد الإلكتروني :\n${req.body.email}\nالتعليق :\n${req.body.msg}\n\nError :\n\`\`\`${err}\`\`\``)
                ]
            });
        }
        let commentse = comments.map(m => m.email)
        if (!commentse.includes(req.body.email)) {
            comments.push({
                username: req.body.name,
                email: req.body.email,
                msg: req.body.msg
            });
            var new_json = JSON.stringify(comments);
            fs.writeFileSync('comments.json', new_json, 'utf8');
            const data2 = fs.readFileSync("comments.json");
            res.render(`comments`, {
                comments,
                done: true,
                err: false
            })
            webhookClient.send({
                embeds: [new EmbedBuilder()
                    .setTitle(`Log Sending Comments To Al-Eslam`)
                    .setURL(`https://www.aleslam.ml/comments`)
                    .setDescription(`حالة الإرسال : تم الإرسال\nالإسم :\n${req.body.name}\nالبريد الإلكتروني :\n${req.body.email}\nالتعليق :\n${req.body.msg}`)
                ]
            });
        } else {
            res.render(`comments`, {
                comments,
                done: false,
                err: true
            })
            webhookClient.send({
                embeds: [new EmbedBuilder()
                    .setTitle(`Log Sending Comments To Al-Eslam`)
                    .setURL(`https://www.aleslam.ml/comments`)
                    .setDescription(`حالة الإرسال : لم يتم الإرسال\nالإسم :\n${req.body.name}\nالبريد الإلكتروني :\n${req.body.email}\nالتعليق :\n${req.body.msg}\n\nError :\n\`\`\`البريد الإلكتروني موجود مسبقاً\`\`\``)
                ]
            });
        }
    });
})


app.listen(8080, () => {
    console.log(`Al Eslam web is ready!`)
})