// Ajout des codes nécessaires pour la mise en place d'un server. Utilisation du CRUD

//Appel des modules interne et externe a NodeJs
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

//Initialiser l'application 
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
const port = 3000;

//connection a la base de données
mongoose.connect("mongodb://localhost/BookDB", {useNewUrlParser: true});

// Création du squelette de la collection 
const bookSchema = new mongoose.Schema({
    title: String,
    year: Number,
    mangaka: String
});
//Création de la collection 
const Book = mongoose.model('bookManga', bookSchema);


//Mettre le port ou on veut écouter (server)
app.listen(port, () => {
    console.log(`Le server est sur le port ${port}`);
});

//Instance des Books 
const onePiece = new Book({
    title: "One piece",
    year: 1997,
    mangaka: "Eichiro Oda"
})
const dbz = new Book({
    title: "Dragon Ball Z",
    year: 1993,
    mangaka: "Akira toriyama"
})
const myHero = new Book({
    title: "My hero academia",
    year: 2014,
    mangaka: "Kohei horikoshi"
})
const titan = new Book({
    title: "L'attaque des titans",
    year: 2009,
    mangaka: "Hajime isayama"
})
const naruto = new Book({
    title: "naruto",
    year: 1999,
    mangaka: "Masashi kishimoto"
})

//Insérer des éléments
// Book.insertMany([onePiece, dbz, myHero, titan, naruto], (err) => {
//     if(err){
//         console.log(err);
//     }else{
//         console.log("Insert success");
//     }
// });

// Permet de récupérer tout les documents de la collection
app.route("/books")
    .get((req, res) => {
        Book.find( {}, (err, books) => {
            if(err){
                console.log(err);
            }else{
                console.log("Find sucess");
                res.send(books);
            }
        });
    })
//Instance de nouveau livres grace a la methode post qui va les envoyer dans la bdd
    .post((req, res) => {
        const book = new Book({
            title: req.body.title,
            year: req.body.year,
            mangaka: req.body.mangaka
        });
        book.save((err) => {
            if(err){
                console.log(err);
            }else{
                console.log("Book insert succes")
            }
        })
    })
//Suppression de tout les livres
    .delete((req, res) => {
        Book.deleteMany({}, (err) => {
            if(err){
                console.log(err);
            }else{
                console.log("Les livre ont été supprimés");
            }
        })
    });


//Récupérer un livre en particulier
app.route("/books/:titleBook")
    .get((req, res) => {
        Book.findOne({title: req.params.titleBook}, (err, book) => {
            if(err){
                console.log(err);
            }else{
                console.log("Find book sucess");
                res.send(book);
            }
        })
    })
//Remplacer un livre 
//(replaceOne au lieu de update: collection.update is deprecated )
    .put((req,res) => {
        Book.replaceOne(
            {title : req.params.titleBook},
            {
            title : req.body.title, 
            year : req.body.year, 
            mangaka : req.body.mangaka
            },
            {overwrite : true},
            (err) => err ? console.log(err) : console.log("Change ok")
        );
    })
// Modifier une valeur d'un livre 
    .patch((req, res) => {
        Book.updateOne(
            {name : req.params.titleBook}, 
            {$set : req.body}, 
            (err) => err ? console.log(err) : console.log("Modified ok")        
        );
    })
//Supprimer un element 
    .delete((req, res) => {
        Book.deleteOne({name : req.params.titleBook}, 
            (err) => err ? console.log(err) : console.log("Deleted ok")
        );
});