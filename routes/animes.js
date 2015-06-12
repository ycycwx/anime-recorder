var Anime = require('../models/animes.js');

module.exports = function(app) {
  /**
   * Find and retrieves all animes
   * @param {Object} req HTTP request object.
   * @param {Object} res HTTP response object.
   */
  findAllAnimes = function(req, res) {
    console.log("GET - /animes");
    return Anime.find(function(err, animes) {
      if(!err) {
        // console.log(animes);
        return res.send(animes);
      } else {
        res.statusCode = 500;
        console.log('Internal error(%d): %s',res.statusCode,err.message);
        return res.send({ error: 'Server error' });
      }
    });
  };

  /**
   * Find and retrieves a single anime by its id 
   * @param {Object} req HTTP request object.
   * @param {Object} res HTTP response object.
   */
  findById = function(req, res) {

    console.log("GET - /animes/:id");

    console.log(req.params.id);

    return Anime.findById(req.params.id, function(err, show) {

      if(!show) {
        res.statusCode = 404;
        return res.send({ error: 'Not found' });
      }

      if(!err) {
        // console.log({status: 'OK', anime: show});
        return res.send({ status: 'OK', anime: show});
      } else {

        res.statusCode = 500;
        console.log('Internal error(%d): %s', res.statusCode, err.message);
        return res.send({ error: 'Server error' });
      }
    });
  };

  /**
   * Creates an new anime from the data request
   * @param {Object} req HTTP request object.
   * @param {Object} res HTTP response object.
   */
  addAnime = function(req, res) {

    console.log('POST - /animes');

    var anime = new Anime({
      title   : req.body.title,
      score   : req.body.score,
      episode : req.body.episode,
      note    : req.body.note,
      done    : req.body.done,
      year    : req.body.year,
    });

    anime.save(function(err) {

      if(err) {

        console.log('Error while saving anime: ' + err);
        res.send({ error:err });
        return;

      } else {

        console.log("Anime created");
        return res.send({ status: 'OK', anime:anime });

      }

    });

  };

  /**
   * Update an anime by its ID
   * @param {Object} req HTTP request object.
   * @param {Object} res HTTP response object.
   */
  updateAnime = function(req, res) {

    console.log("PUT - /anime/:id");

    return Anime.findById(req.params.id, function(err, anime) {
      if(!anime) {
        res.statusCode = 404;
        return res.send({ error: 'Not found' });
      }

      if (req.body.score != null) anime.score = req.body.score;
      if (req.body.episode != null) anime.episode = req.body.episode;
      if (req.body.note != null) anime.note = req.body.note;
      if (req.body.done != null) anime.done = req.body.done;
      if (req.body.year != null) anime.year = req.body.year;

      return anime.save(function(err) {
        if(!err) {
          console.log('Updated');
          return res.send({ status: 'OK', anime: anime });
        } else {
          if(err.name == 'ValidationError') {
            res.statusCode = 400;
            res.send({ error: 'Validation error' });
          } else {
            res.statusCode = 500;
            res.send({ error: 'Server error' });
          }
          console.log('Internal error(%d): %s',res.statusCode,err.message);
        }

        res.send(anime);

      });
    });
  };

  /**
   * Delete an anime by its ID
   * @param {Object} req HTTP request object.
   * @param {Object} res HTTP response object.
   */
  deleteAnime = function(req, res) {

    console.log("DELETE - /animes/:id");

    return Anime.findById(req.params.id, function(err, anime) {
      if(!anime) {
        res.statusCode = 404;
        return res.send({ error: 'Not found' });
      }

      return anime.remove(function(err) {
        if(!err) {
          console.log('Removed anime');

          Anime.find(function(err, animes) {
            if(err) {
              res.send({error: err});
            }
            res.send(animes);
          });

        } else {
          res.statusCode = 500;
          console.log('Internal error(%d): %s',res.statusCode,err.message);
          return res.send({ error: 'Server error' });
        }
      })
    });
  }

  //Link routes and actions
  app.get('/animes', findAllAnimes);
  app.get('/animes/:id', findById);
  app.post('/animes', addAnime);
  app.put('/animes/:id', updateAnime);
  app.delete('/animes/:id', deleteAnime);

}
