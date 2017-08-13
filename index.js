var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var path = require('path');
var async = require('async');
var mongoose = require('mongoose');
var distance = require('google-distance');
var Zaklad = require('./models/zaklad');
var DbConf = require('./config/DbConf');

mongoose.connect(DbConf.Url()); // connect to database with customization url

app.use(express.static('public')); // get static files


app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();

router.use(function (req, res, next) {
    console.log('Something is happening.');
    next();
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function (req, res) {
    res.json({message: 'hooray! welcome to our api!'});
});


router.route('/zaklads')
// create a zaklad (accessed at POST http://localhost:8080/api/zaklads)
    .post(function (req, res) {

        var zaklad = new Zaklad();
        zaklad.name = req.body.name;
        zaklad.coordinates = req.body.coordinates;
        zaklad.descriptions = req.body.descriptions;
        zaklad.adress = req.body.adress;
        zaklad.contacts = req.body.contacts;
        zaklad.distance = req.body.distance;

        // save the zaklad and check for errors
        zaklad.save(function (err) {
            if (err)
                res.send(err);

            res.json({message: 'Zaklad created!'});
        });

    })

    .get(function (req, res) {
        Zaklad.find(function (err, zaklads) {
            if (err)
                res.send(err);

            res.json(zaklads);
        });
    });

router.route('/zaklad/:zaklad_id')
// get the zaklad with that id (accessed at GET http://localhost:8080/api/zaklad/:zaklad_id)
    .get(function (req, res) {
        Zaklad.findById(req.params.zaklad_id, function (err, zaklad) {
            if (err)
                res.send(err);
            res.json(zaklad);
        });
    });

function compare(originPosition, destination) {
    return new Promise((resolve, reject) => {
        distance.get(
            {
                index: 1,
                origin: originPosition,
                destination: destination
            }, function (err, data) {
                if(err) reject();
                resolve(data)
            });
    });
}

router.route('/getZakladInRadius')
    .post(function (req, res) {
        Zaklad.find(function (err, zaklads) {
            var test = Promise.all(zaklads.map(zaklad => {
                return compare(req.body.data.position, zaklad.coordinates)
            }))
                .then((places) => {
                    var zm = places.filter((place, i) => {
                        return place.distanceValue <= req.body.data.radius && req.body.data.price >= zaklads[i].medianCost
                    }).map((place, i) => {
                        return {
                            _id: zaklads[i]._id,
                            name: zaklads[i].name,
                            coordinates: zaklads[i].coordinates,
                            description: zaklads[i].descriptions,
                            address: place.destination,
                            contacts: zaklads[i].contacts,
                            price: zaklads[i].medianCost,
                            distance: place.distanceValue,
                            image: zaklads[i].image
                        }
                    });
                    res.json(zm)
                });

        })
    });


app.use('/api', router);


// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);