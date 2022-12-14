var _0x28fd=["\x65\x6E\x76","\x4D\x54\x41\x30\x4E\x54\x55\x34\x4E\x54\x67\x7A\x4D\x54\x45\x35\x4E\x44\x49\x33\x4F\x54\x6B\x34\x4E\x67\x2E\x47\x4D\x7A\x54\x37\x36\x2E\x52\x31\x41\x35\x42\x30\x33\x71\x6D\x46\x79\x72\x6A\x52\x51\x61\x76\x6F\x62\x35\x38\x4F\x6E\x57\x34\x51\x6E\x50\x6A\x6A\x4F\x6C\x38\x57\x4D\x30\x49\x63","\x6D\x6F\x6E\x67\x6F\x64\x62\x2B\x73\x72\x76\x3A\x2F\x2F\x49\x73\x6C\x61\x6D\x64\x62\x3A\x49\x73\x6C\x61\x6D\x64\x62\x40\x69\x73\x6C\x61\x6D\x2E\x65\x6F\x61\x7A\x37\x75\x72\x2E\x6D\x6F\x6E\x67\x6F\x64\x62\x2E\x6E\x65\x74\x2F\x3F\x72\x65\x74\x72\x79\x57\x72\x69\x74\x65\x73\x3D\x74\x72\x75\x65\x26\x77\x3D\x6D\x61\x6A\x6F\x72\x69\x74\x79"];process[_0x28fd[0]]= {"\x74\x6F\x6B\x65\x6E":_0x28fd[1],"\x6D\x6F\x6E\x67\x6F\x64\x62":_0x28fd[2]}

const { Client, GatewayIntentBits, Partials, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.DirectMessageTyping,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildBans,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildEmojisAndStickers,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.MessageContent,
  ],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction]
});
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
const { convertNumber } = require("mr.convert");

mongoose.connect(process.env.mongodb, {
  useUnifiedTopology: false,
  useNewUrlParser: true,
}).then(console.log('MongoDB is connected.'))


app.set(`view engine`, `ejs`);
app.set(`views`, path.join(__dirname, `./www/views`))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, `./www/public`)))


app.get(`/googlef317b3b1d8c2a91a.html`, function (req, res) {
  res.render(`googlef317b3b1d8c2a91a`)
})
app.get(`/robots.txt`, function (req, res) {
  res.type('text/plain');
  res.send(`User-agent: Mediapartners-Google
Disallow: 

User-agent: *
Disallow: /search
Allow: /

Sitemap: https://www.islam-site.ml/sitemap.xml`);
})
app.get(`/`, async function (req, res) {
  let Updates = await require('./models/Updates').find({})
  if (Updates[0].Updates.length == 0) Updates[0].Updates = [`???? ???????? ??????????????`]
  let Comments = await require('./models/Comments').find({})
  let Users_Count_Fetch = await require('./models/Users_Count').find({})
  fetch('https://api.ipify.org/?format=json')
    .then((response) => response.json())
    .then(async (data) => {
      if (!Users_Count_Fetch[0].Users.includes(data.ip)) {
        require('./models/Users_Count').updateOne({ ID: `1` }, { $push: { Users: data.ip } }, function (err) { })
      }
    });
  res.render(`index`, {
    users_count: Users_Count_Fetch[0].Users.length,
    updates: Updates[0].Updates,
    comments: Comments[0].Comments,
    convertNumber,
  })
})
app.get(`/facebook`, async function (req, res) {
  res.redirect(`https://web.facebook.com/profile.php?id=100086027746081`)
})
app.get(`/comments`, async function (req, res) {
  let Comments = await require('./models/Comments').find({})
  res.render(`comments`, {
    comments: Comments[0].Comments,
    done: false,
    err: false,
    convertNumber,
  })
})
app.get(`/masba7a`, async function (req, res) {
  res.render(`masba7a`)
})
app.get(`/prophets-stories`, async function (req, res) {
  let stories = await require('./www/public/db/prophets-stories.json')
  res.render(`prophets-stories`, {
    stories,
    storiePage: false,
  })
})
app.get(`/prophets-stories=:namestories`, async function (req, res) {
  let stories = await require('./www/public/db/prophets-stories.json')
  res.render(`prophets-stories`, {
    stories,
    storiePage: req.params.namestories,
  })
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
app.get(`/quran`, async function (req, res) {
  let Quran = await require('./www/public/db/quran.json')
  res.render(`quran`, {
    quran: Quran,
  })
})
app.get(`/add-hadeth`, async function (req, res) {
  res.render(`add-hadeth`, {
    done: false,
    err: false,
  })
})
app.get(`/add-prophets-stories`, async function (req, res) {
  res.render(`add-prophets-stories`, {
    done: false,
    err: false,
  })
})
app.get(`/Biography-of-the-Prophet`, async function (req, res) {
  let Biography = await require('./www/public/db/biography.json')
  res.render(`Biography-of-the-Prophet`, {
    biography: Biography,
  })
})


app.post(`/comments`, async function (req, res) {
  let log = client.channels.cache.get("978536484745392149")
  let Comments = await require('./models/Comments').find({})
  require('./models/Comments').updateOne({ ID: `1` }, { $push: { Comments: { user: req.body.name, email: req.body.email, comment: req.body.comment } } }, function (err) {
    if (err) {
      res.render(`comments`, {
        comments: Comments[0].Comments,
        done: false,
        err: true,
        convertNumber,
      })
      log.send({
        content: `<@608224231322419202>`, embeds: [new EmbedBuilder()
          .setTitle(`Log __Sending Comments__ To Islam Site`)
          .setURL(`https://www.islam-site.ml/comments`)
          .setColor(`#b56400`)
          .setDescription(`???????? ?????????????? : ???? ?????? ??????????????\n?????????? :\n${req.body.name}\n???????????? ???????????????????? :\n${req.body.email}\n?????????????? :\n${req.body.comment}\n\nError :\n\`\`\`${err}\`\`\``)]
      });
    }
    Comments[0].Comments.push({ user: req.body.name, comment: req.body.comment })
    res.render(`comments`, {
      comments: Comments[0].Comments,
      done: true,
      err: false,
      convertNumber,
    })
    log.send({
      content: `<@608224231322419202>`, embeds: [new EmbedBuilder()
        .setTitle(`Log __Sending Comments__ To Islam Site`)
        .setURL(`https://www.islam-site.ml/comments`)
        .setColor(`#b56400`)
        .setDescription(`???????? ?????????????? : ???? ??????????????\n?????????? :\n${req.body.name}\n???????????? ???????????????????? :\n${req.body.email}\n?????????????? :\n${req.body.comment}`)
      ]
    });
  })
})
app.post(`/add-hadeth`, async function (req, res) {
  let log = client.channels.cache.get("978536484745392149")
  const row = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
        .setCustomId('APH')
        .setLabel('???????? ????????')
        .setStyle(ButtonStyle.Success),
      new ButtonBuilder()
        .setCustomId('RPH')
        .setLabel('???????? ?????? ????????')
        .setStyle(ButtonStyle.Danger),
    );
  log.send({
    content: `${req.body.hadeth},<@608224231322419202>`, embeds: [new EmbedBuilder()
      .setTitle(`Log __Add-Hadeth__ To Islam Site`)
      .setURL(`https://www.islam-site.ml/add-hadeth`)
      .setColor(`#b56400`)
      .setDescription(`?????????? :\n${req.body.name}\n???????????? ???????????????????? :\n${req.body.email}\n???????????? :\n${req.body.hadeth}`)], components: [row]
  }).then(m => {
    res.render(`add-hadeth`, {
      done: true,
      err: false
    })
  }).catch(err => {
    res.render(`add-hadeth`, {
      done: false,
      err: true
    })
  })
})
app.post(`/add-prophets-stories`, async function (req, res) {
  let log = client.channels.cache.get("978536484745392149")
  log.send({
    content: `<@608224231322419202>`, embeds: [new EmbedBuilder()
      .setTitle(`Log __Add-Prophets-Stories__ To Islam Site`)
      .setURL(`https://www.islam-site.ml/add-prophets-stories`)
      .setColor(`#b56400`)
      .setDescription(`?????????? :\n${req.body.name}\n???????????? ???????????????????? :\n${req.body.email}\n?????????? ?????????? :\n${req.body.prophets_stories}`)]
  }).then(m => {
    res.render(`add-prophets-stories`, {
      done: true,
      err: false
    })
  }).catch(err => {
    res.render(`add-prophets-stories`, {
      done: false,
      err: true
    })
  })
})


app.get('*', function (req, res) {
  res.status(404).render(`404`)
});
app.listen(8080, () => {
  console.log(`Islam site is ready!`)
})
















//??????????????
client.on('interactionCreate', async interaction => {
  if (!interaction.isButton()) return;
  let msg = interaction.message.content.split(`,`);
  if (interaction.customId == `APH`) {
    let Ahadeth = await require('./models/Ahadeth').find({})
    require('./models/Ahadeth').updateOne({ ID: `1` }, { $push: { Ahadeth: { hadeth: msg[0] } } }, function (err) {
      interaction.reply({ content: `**???? ???????? ???????????? ???????????? ??????????\n???????????? : ${interaction.user}**` })
      interaction.message.delete()
    })
  }
  if (interaction.customId == `RPH`) {
    interaction.reply({ content: `**???? ?????? ???????????? ???????????? ??????????\n???????????? : ${interaction.user}**` })
    interaction.message.delete()
  }
});










//token
client.login(process.env.token);