const express = require('express')
const fs = require('fs')
const util = require("util")
const app = express()
const server = require('http').createServer(app)
const io = require('./mes_modules/chat_socket').listen(server)
const bodyParser= require('body-parser')
const MongoClient = require('mongodb').MongoClient
const ObjectID = require('mongodb').ObjectID
const i18n = require("i18n")
const cookieParser = require('cookie-parser')
const Peupler = require('./public/data/peupler')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static('public'));

i18n.configure({ 
   locales : ['fr', 'en'],
   cookie : 'langueChoisie', 
   directory : __dirname + '/locales' 
})

app.use(cookieParser())
app.use(i18n.init)

let db

MongoClient.connect('mongodb://127.0.0.1:27017', (err, database) => {
 if (err) return console.log(err)
 db = database.db('carnet_adresse')

console.log('connexion à la BD')

 server.listen(8081, (err) => {
 	if (err) console.log(err)
 console.log('connexion à la BD et on écoute sur le port 8081')
 })
})

app.set('view engine', 'ejs')

app.get("/:locale(en|fr)", (req,res)=>{

	res.cookie('langueChoisie' , req.params.locale)
	res.setLocale(req.params.locale)
	console.log(res.__('bonjour'))
	console.log(res.__("maison"))
	res.render('accueil.ejs')

})


/*------------------------------------Accueil-----------------------------*/
app.get('/', function (req, res) {

 console.log("req.cookies.langueChoisie = " + req.cookies.langueChoisie)
 console.log(res.__("courriel"))	
 res.render('accueil.ejs')  
 
  });


/*------------------------------------Modifier-----------------------------*/
app.post('/ajax_modifier', (req,res) => {
   console.log("La route = /ajax_modifier")
   req.body._id = ObjectID(req.body._id)

   db.collection('adresse').save(req.body, (err, result) => {
   if (err) return console.log(err)
       console.log('sauvegarder dans la BD')
   res.send(JSON.stringify(req.body));
   // res.status(204)
   })
})


/*------------------------------------Détruire-----------------------------*/
app.post('/ajax_detruire', (req, res) => {
	let id = req.body._id
  db.collection('adresse').findOneAndDelete({_id: ObjectID(id)}, (err, resultat) => {
  	if (err) return console.log(err)
  	console.log(id)
  	res.send("éléement détruit");
  })
})


/*------------------------------------Adresse-----------------------------*/
app.get('/adresse', function (req, res) {
   var cursor = db.collection('adresse')
                .find().toArray(function(err, resultat){
 if (err) return console.log(err)        
 res.render('adresse.ejs', {adresses: resultat})   
  });
})


/*------------------------------------Rechercher-----------------------------*/
app.post('/rechercher',  (req, res) => {})

/*------------------------------------Ajouter-----------------------------*/
app.post('/ajouter', (req, res) => {
console.log('route /ajouter')	
 db.collection('adresse').save(req.body, (err, result) => {
 if (err) return console.log(err)	
 console.log('sauvegarder dans la BD')
 res.redirect('/adresse')
 })
})


/*------------------------------------Modifier-----------------------------*/
app.post('/modifier', (req, res) => {
console.log('route /modifier')
req.body._id = 	ObjectID(req.body._id)
 db.collection('adresse').save(req.body, (err, result) => {
	 if (err) return console.log(err)
	 console.log('sauvegarder dans la BD')
	 res.redirect('/adresse')
	 })
})

app.get('/detruire/:id', (req, res) => {
 console.log('route /detruire')
 var id = req.params.id
 console.log(id)
 db.collection('adresse')
 .findOneAndDelete({"_id": ObjectID(req.params.id)}, (err, resultat) => {

if (err) return console.log(err)
 res.redirect('/adresse')
 })
})


/*------------------------------------Trier-----------------------------*/
app.get('/trier/:cle/:ordre', (req, res) => {
 let cle = req.params.cle
 let ordre = (req.params.ordre == 'asc' ? 1 : -1)
 let cursor = db.collection('adresse').find().sort(cle,ordre).toArray(function(err, resultat){
  ordre = (req.params.ordre == 'asc' ? 'desc' : 'asc')  
 res.render('adresse.ejs', {adresses: resultat, cle, ordre })	
})

}) 


/*------------------------------------Vider-----------------------------*/
app.get('/vider', (req, res) => {
	let cursor = db.collection('adresse').drop((err, res)=>{
		if(err) console.error(err)
			console.log('ok')
			
		})
	res.redirect('/adresse')
})


/*----------------------------------Peupler-----------------------------*/
app.get('/peupler', (req, res) => {
	let resultat = Peupler();
	db.collection('adresse').insert(resultat, (err, result) => {
		if (err) return console.log(err);
		res.redirect('/adresse')
	})
})


/*------------------------------------Chat-----------------------------*/
app.get('/chat', (req, res) => {
	res.render('socket_vue.ejs')
})

