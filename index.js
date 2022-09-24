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