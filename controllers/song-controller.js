const express = require('express');
const request = require('request')
const config = require('../config.js');
const access_token = config.API_KEY

const app = express();

const Song = require('../models/song');

let respuesta = {
    status: 200,
    mensaje: '',
    data: ''
};

app.post('/songs', function getSongByArtist(req, res) {
    try {
        const busqueda = encodeURI(req.body.buscarArtista)
        const options = {
            url: `https://api.spotify.com/v1/search?q=${busqueda}&type=artist`,
            headers: { 'Authorization': 'Bearer ' + access_token },
            json: true
        };

        request.get(options, function(error, response, body) {
        if (response.statusCode !== 200) {
            respuesta = {
                status: 401,
                mensaje: 'The access token expired',
            };
            res.send(respuesta);
        }
        if(body.artists.total === 0){
            respuesta = {
                status: 404,
                mensaje: 'Artist Not Found',
            };
            res.send(respuesta);
        }

        const { id, name } = body.artists['items'][0]    
        const nameOriginal = name.toLowerCase()
        const nameSearch = req.body.buscarArtista.toLowerCase()

        if(nameOriginal == nameSearch) {
            const options = {
                url: `https://api.spotify.com/v1/artists/${id}/top-tracks?country=ar`,
                headers: { 'Authorization': 'Bearer ' + access_token },
                json: true
            };
    
            request.get(options, function(error, response, body) {
                const arraySongs = []
                for(const item in body.tracks) {
                    const { id, name } = body.tracks[item]
                    const songs = { songId: id, songTitle: name };
                    arraySongs.push(songs)
                }
                respuesta = {
                    status: 200,
                    mensaje: 'OK',
                    data: body
                };
                res.send(arraySongs);    
                Song.insertMany(arraySongs);
            });
        } else {
            respuesta = {
                status: 400,
                mensaje: 'Bad Request- error in the artist name ',
            };
            res.send(respuesta);
        }
    }); 
} catch (error) {
    respuesta = {
        status: 500,
        mensaje: error,
    };
    res.send(respuesta);
}   
});
    
app.post('/songs/id', function getSong(req, res){
    try {
        if(!req.body.buscarCancion){
            respuesta = {
                status: 400,
                mensaje: 'Bad Request',
            };
            res.send(respuesta);
        }
        const busqueda = encodeURI(req.body.buscarCancion)
    
        const options = {
            url: `https://api.spotify.com/v1/search?q=${busqueda}&type=track&limit=1`,
            headers: { 'Authorization': 'Bearer ' + access_token },
            json: true
        };
    
        request.get(options, function(error, response, body) {
            if (body.error.status === 400) {
                respuesta = {
                    status: 401,
                    mensaje: 'The access token expired',
                };
                res.send(respuesta);
            }
            if(body.tracks.total === 0){
                respuesta = {
                    status: 404,
                    mensaje: 'Song Not Found',
                };
                res.send(respuesta);
            }
            respuesta = {
                status: 200,
                mensaje: 'OK',
                data: body
            };
            res.send(respuesta);
        }); 
    } catch (error) {
        respuesta = {
            status: 500,
            mensaje: error,
        };
        res.send(respuesta);
    }
})
    
app.get('/*', function (req, res) {
        res.redirect('/');
    });
    
module.exports = app



    
