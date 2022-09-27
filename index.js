process.env = {
  "webhookId": "978536528806576148",
  "webhookToken": "I-6PdAOJ2E16pNANisN9mI5X6_kR7FmNE1_Q-xyoTMftcl1vl-hx3choDv8eO5PGK1Be",
  "mongodb": "mongodb+srv://Islamdb:Islamdb@islam.eoaz7ur.mongodb.net/?retryWrites=true&w=majority"
};

const { EmbedBuilder, WebhookClient } = require('discord.js');
const mongoose = require("mongoose");
const express = require('express');
const app = express();
const path = require('path');
const passport = require("passport");
const Strategy = require("passport-discord").Strategy;
const session = require("express-session");
const MemoryStore = require("memorystore")(session);
const bodyParser = require("body-parser");
const fs = require(`fs`);
const fetch = require(`node-fetch`);


mongoose.connect(process.env.mongodb, {
  useUnifiedTopology: false,
  useNewUrlParser: true,
}).then(console.log('MongoDB is connected.'))


app.set(`view engine`, `ejs`);
app.set(`views`, path.join(__dirname, `./www/views`))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, `./www/public`)))


app.get(`/`, async function (req, res) {
  let Updates = await require('./models/Updates').find({})
  if (Updates[0].Updates.length == 0) Updates[0].Updates = [`لا يوجد تحديثات`]
  let Comments = await require('./models/Comments').find({})
  fetch('https://api.ipify.org/?format=json')
    .then((response) => response.json())
    .then(async (data) => {
      let Users_Count_Fetch = await require('./models/Users_Count').find({})
      if (Users_Count_Fetch[0].Users.includes(data.ip)) {
        res.render(`index`, {
          usernew: false,
          users_count: Users_Count_Fetch[0].Users.length,
          updates: Updates[0].Updates,
          comments: Comments[0].Comments,
        })
      } else {
        require('./models/Users_Count').updateOne({ ID: `1` }, { $push: { Users: data.ip } }, function (err) { })
        res.render(`index`, {
          usernew: true,
          users_count: Users_Count_Fetch[0].Users.length,
          updates: Updates[0].Updates,
          comments: Comments[0].Comments,
        })
      }
    });
})
app.get(`/facebook`, async function (req, res) {
  res.redirect(`https://web.facebook.com/profile.php?id=100086027746081`)
})
app.get(`/comments`, async function (req, res) {
  let Comments = await require('./models/Comments').find({})
  res.render(`comments`, {
    comments: Comments[0].Comments,
    done: false,
    err: false
  })
})
app.get(`/masba7a`, async function (req, res) {
  res.render(`masba7a`)
})
app.get(`/prophets-stories`, async function (req, res) {
  res.render(`prophets-stories`)
})
app.get(`/prayer-timings`, async function (req, res) {
  res.render(`prayer-timings`)
})
app.get(`/pillars-islam`, async function (req, res) {
  res.render(`pillars-islam`)
})
app.get(`/pillars-faith`, async function (req, res) {
  res.render(`pillars-faith`)
})
app.get(`/ahadeth`, async function (req, res) {
  let Ahadeth = await require('./models/Ahadeth').find({})
  res.render(`ahadeth`, {
    ahadeth: Ahadeth[0].Ahadeth,
  })
})
app.get(`/holy-quran`, async function (req, res) {
  let Quran = await require('./models/Quran').find({})
  res.render(`holy-quran`, {
    quran: Quran[0].Quran,
  })
})


app.post(`/comments`, async function (req, res) {
  let Comments = await require('./models/Comments').find({})
  const webhookClient = new WebhookClient({ id: process.env.webhookId, token: process.env.webhookToken });
  require('./models/Comments').updateOne({ ID: `1` }, { $push: { Comments: { user: req.body.name, email: req.body.email, comment: req.body.comment } } }, function (err) {
    if (err) {
      res.render(`comments`, {
        comments: Comments[0].Comments,
        done: false,
        err: true
      })
      webhookClient.send({
        embeds: [new EmbedBuilder()
          .setTitle(`Log Sending Comments To Islam Site`)
          .setURL(`https://www.islam.ml/comments`)
          .setColor(`#b56400`)
          .setDescription(`حالة الإرسال : لم يتم الإرسال\nالإسم :\n${req.body.name}\nالبريد الإلكتروني :\n${req.body.email}\nالتعليق :\n${req.body.comment}\n\nError :\n\`\`\`${err}\`\`\``)
        ]
      });
    }
    Comments[0].Comments.push({ user: req.body.name, comment: req.body.comment })
    res.render(`comments`, {
      comments: Comments[0].Comments,
      done: true,
      err: false
    })
    webhookClient.send({
      embeds: [new EmbedBuilder()
        .setTitle(`Log Sending Comments To Islam Site`)
        .setURL(`https://www.islam.ml/comments`)
        .setColor(`#b56400`)
        .setDescription(`حالة الإرسال : تم الإرسال\nالإسم :\n${req.body.name}\nالبريد الإلكتروني :\n${req.body.email}\nالتعليق :\n${req.body.comment}`)
      ]
    });
  })
})



app.listen(8080, () => {
  console.log(`Islam site is ready!`)
})