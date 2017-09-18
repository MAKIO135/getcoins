const config = require( './config' ),
    express = require( 'express' ),
    app = express(),
    http = require( 'http' ).Server( app );

const env = {
    port: process.env.PORT || config.server.port,
    coinHive: {
        key: process.env.coinHive_key || config.coinHive.key
    }
};

// Create the HTTP Server
http.listen( env.port, () => {
    console.log( 'listening on', env.port );
} );


// Tell the app where the files are and what page to serve
app.use( express.static( __dirname + '/public' ) );
app.get( '/', function( req, res ){
    res.sendFile( 'index.html' );
} );
