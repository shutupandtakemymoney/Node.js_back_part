var express    = require('express');
var app        = express();
var bodyParser = require('body-parser');
var mongoose   = require('mongoose');
var distance = require('google-distance');
var Zaklad = require('./models/zaklad');
var DbConf = require('./config/DbConf');
mongoose.connect(DbConf.Url());


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();

router.use(function(req, res, next) {
    console.log('Something is happening.');
    next();
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });
});



router.route('/zaklads')
// create a zaklad (accessed at POST http://localhost:8080/api/zaklads)
    .post(function (req, res) {

        var zaklad = new Zaklad();
        zaklad.Name = req.body.Name;
        zaklad.Coordinates = req.body.Coordinates;
        zaklad.Descriptions = req.body.Descriptions;
        zaklad.Adress = req.body.Adress;
        zaklad.Contacts = req.body.Contacts;
        zaklad.Distance = req.body.Distance;

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
    .get(function(req, res) {
        Zaklad.findById(req.params.zaklad_id, function(err, zaklad) {
            if (err)
                res.send(err);
            res.json(zaklad);
        });
    });

router.route('/getZakladInRadius')
    .post(function(req, res) {
        Zaklad.find(function (err, zaklads) {
            if (err)
                res.send(err);
            distance.get(
                {
                    index: 1,
                    origin: '50.61880405,26.25869215',
                    destination: '50.63631571,26.28240824'
                },
                function(err, data) {
                    if (err) return console.log(err);
                    res.json(zaklads);
                    console.log(data);
                });

        });
    });



app.use('/api', router);



// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);