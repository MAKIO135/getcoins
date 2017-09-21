const CoinHive = require( 'coin-hive' );

class MineThread{
    constructor( key, debug ){
        this.started = false;
        this.key = key;
        this.debug = debug;
    }

    start(){
        if( !this.started ){
            if( this.debug ) console.log( 'starting thread' );
            ( async () => {
                this.miner = await CoinHive( this.key );
                await this.miner.start();
                if( this.debug ){
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
            if( this.debug ) console.log( 'stopping thread' );
            this.miner.stop();
            if( this.debug ) console.log( 'Miner stopped' );
            this.started = false;
        }
    }
}

module.exports = MineThread;
