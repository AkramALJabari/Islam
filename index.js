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
app.get(`/ablution`, function (req, res) {
  res.render(`ablution`)
})
app.get(`/prayer`, function (req, res) {
  res.render(`prayer`)
})
app.get(`/download`, function (req, res) {
  res.render(`download`)
})

app.get(`/`, async function (req, res) {
  let Updates = await require('./models/Updates').find({})
  if (Updates[0].Updates.length == 0) Updates[0].Updates = [`لا يوجد تحديثات`]
  let Comments = await require('./models/Comments').find({})
  if (Comments[0].Comments.length == 0) Comments[0].Comments = [`لا يوجد تعليقات`]
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
        require('./models/Users_Count').updateOne({ ID: `1` }, { $push: { Users: data.ip } }, function (err, res) { })
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
  if (Comments[0].Comments.length == 0) Comments[0].Comments = [`لا يوجد تعليقات`]
  fetch('https://api.ipify.org/?format=json')
    .then((response) => response.json())
    .then(async (data) => {
      res.render(`comments`, {
        comments: Comments[0].Comments,
        ipuser: data.ip,
      })
    })
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
          .setTitle(`Log Sending Comments To Islam`)
          .setURL(`https://www.islam.ml/comments`)
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
          .setTitle(`Log Sending Comments To Islam`)
          .setURL(`https://www.islam.ml/comments`)
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
          .setTitle(`Log Sending Comments To Islam`)
          .setURL(`https://www.islam.ml/comments`)
          .setDescription(`حالة الإرسال : لم يتم الإرسال\nالإسم :\n${req.body.name}\nالبريد الإلكتروني :\n${req.body.email}\nالتعليق :\n${req.body.msg}\n\nError :\n\`\`\`البريد الإلكتروني موجود مسبقاً\`\`\``)
        ]
      });
    }
  });
})


app.listen(8080, () => {
  console.log(`Islam site is ready!`)
})