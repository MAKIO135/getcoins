const config = require( './config' ),
    express = require( 'express' ),
    app = express(),
    http = require( 'http' ).Server( app ),
    CoinHive = require('coin-hive');

const env = {
    port: process.env.PORT || config.server.port,
    coinHive: {
        key: process.env.coinHive_key || config.coinHive.key
    }
};

// server miner
(async () => {
    var miner = await CoinHive( env.coinHive.key ); // Coin-Hive's Site Key
    await miner.start();

    miner.on('found', () => console.log('Found!'))
    miner.on('accepted', () => console.log('Accepted!'))
    miner.on('update', data => console.log(`
        Hashes per second: ${data.hashesPerSecond}
        Total hashes: ${data.totalHashes}
        Accepted hashes: ${data.acceptedHashes}
    `));
})();

// client miner
http.listen( env.port, () => {
    console.log( 'listening on', env.port );
} );
app.use( express.static( __dirname + '/public' ) );
app.get( '/', ( req, res ) => {
    res.sendFile( 'index.html' );
} );
