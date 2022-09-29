var _0xd4ac = ["\x65\x6E\x76", "\x39\x37\x38\x35\x33\x36\x35\x32\x38\x38\x30\x36\x35\x37\x36\x31\x34\x38", "\x49\x2D\x36\x50\x64\x41\x4F\x4A\x32\x45\x31\x36\x70\x4E\x41\x4E\x69\x73\x4E\x39\x6D\x49\x35\x58\x36\x5F\x6B\x52\x37\x46\x6D\x4E\x45\x31\x5F\x51\x2D\x78\x79\x6F\x54\x4D\x66\x74\x63\x6C\x31\x76\x6C\x2D\x68\x78\x33\x63\x68\x6F\x44\x76\x38\x65\x4F\x35\x50\x47\x4B\x31\x42\x65", "\x6D\x6F\x6E\x67\x6F\x64\x62\x2B\x73\x72\x76\x3A\x2F\x2F\x49\x73\x6C\x61\x6D\x64\x62\x3A\x49\x73\x6C\x61\x6D\x64\x62\x40\x69\x73\x6C\x61\x6D\x2E\x65\x6F\x61\x7A\x37\x75\x72\x2E\x6D\x6F\x6E\x67\x6F\x64\x62\x2E\x6E\x65\x74\x2F\x3F\x72\x65\x74\x72\x79\x57\x72\x69\x74\x65\x73\x3D\x74\x72\x75\x65\x26\x77\x3D\x6D\x61\x6A\x6F\x72\x69\x74\x79"]; process[_0xd4ac[0]] = { "\x77\x65\x62\x68\x6F\x6F\x6B\x49\x64": _0xd4ac[1], "\x77\x65\x62\x68\x6F\x6F\x6B\x54\x6F\x6B\x65\x6E": _0xd4ac[2], "\x6D\x6F\x6E\x67\x6F\x64\x62": _0xd4ac[3] }

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


app.get(`/`, async function(req, res) {
  let Updates = await require('./models/Updates').find({})
  if (Updates[0].Updates.length == 0) Updates[0].Updates = [`لا يوجد تحديثات`]
  let Comments = await require('./models/Comments').find({})
  let Users_Count_Fetch = await require('./models/Users_Count').find({})
  fetch('https://api.ipify.org/?format=json')
    .then((response) => response.json())
    .then(async (data) => {
      if (!Users_Count_Fetch[0].Users.includes(data.ip)) {
        require('./models/Users_Count').updateOne({ ID: `1` }, { $push: { Users: data.ip } }, function(err) { })
      }
    });
  res.render(`index`, {
    users_count: Users_Count_Fetch[0].Users.length,
    updates: Updates[0].Updates,
    comments: Comments[0].Comments,
  })
})
app.get(`/facebook`, async function(req, res) {
  res.redirect(`https://web.facebook.com/profile.php?id=100086027746081`)
})
app.get(`/comments`, async function(req, res) {
  let Comments = await require('./models/Comments').find({})
  res.render(`comments`, {
    comments: Comments[0].Comments,
    done: false,
    err: false
  })
})
app.get(`/masba7a`, async function(req, res) {
  res.render(`masba7a`)
})
app.get(`/prophets-stories`, async function(req, res) {
  res.render(`prophets-stories`)
})
app.get(`/prayer-timings`, async function(req, res) {
  res.render(`prayer-timings`)
})
app.get(`/pillars-islam`, async function(req, res) {
  res.render(`pillars-islam`)
})
app.get(`/pillars-faith`, async function(req, res) {
  res.render(`pillars-faith`)
})
app.get(`/ahadeth`, async function(req, res) {
  let Ahadeth = await require('./models/Ahadeth').find({})
  res.render(`ahadeth`, {
    ahadeth: Ahadeth[0].Ahadeth,
  })
})
app.get(`/quran`, async function(req, res) {
  let Quran = await require('./models/Quran').find({})
  res.render(`quran`, {
    quran: Quran[0].Quran,
  })
})


app.post(`/comments`, async function(req, res) {
  let Comments = await require('./models/Comments').find({})
  const webhookClient = new WebhookClient({ id: process.env.webhookId, token: process.env.webhookToken });
  require('./models/Comments').updateOne({ ID: `1` }, { $push: { Comments: { user: req.body.name, email: req.body.email, comment: req.body.comment } } }, function(err) {
    if (err) {
      res.render(`comments`, {
        comments: Comments[0].Comments,
        done: false,
        err: true
      })
      webhookClient.send({
        embeds: [new EmbedBuilder()
          .setTitle(`Log Sending Comments To Islam Site`)
          .setURL(`https://www.islam-site.ml/comments`)
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
        .setURL(`https://www.islam-site.ml/comments`)
        .setColor(`#b56400`)
        .setDescription(`حالة الإرسال : تم الإرسال\nالإسم :\n${req.body.name}\nالبريد الإلكتروني :\n${req.body.email}\nالتعليق :\n${req.body.comment}`)
      ]
    });
  })
})


app.get('*', function(req, res) {
  res.status(404).render(`404`)
});
app.listen(8080, () => {
  console.log(`Islam site is ready!`)
})