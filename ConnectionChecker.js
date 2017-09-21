const fetch = require( 'node-fetch' );

class ConnectionChecker{
    constructor( debug ){
        this.debug = debug;
        this.connected = false;
        this.events = {};
    }

    register( eventName ){
        let event = new Event( eventName );
        this.events[ eventName ] = event;
    }

    dispatch( eventName, eventArgs ){
        if( this.debug ) console.log( eventName );
        this.events[ eventName ].callbacks.forEach( callback => callback( eventArgs ) );
    }

    on( eventName, callback ){
        this.events[ eventName ].registerCallback( callback );
    }

    check(){
        fetch( 'https://api.ipify.org?format=json' )
            .then( res => res.json() )
            .then( json => {
                if( !this.connected ) this.dispatch( 'connection' );
                this.connected = true;
            } )
            .catch( e => {
                if( this.connected ) this.dispatch( 'disconnection' );
                this.connected = false;
            } );
    }
}

class Event{
    constructor( name ){
        this.name = name;
        this.callbacks = [];
    }
    registerCallback( callback ){
        this.callbacks.push( callback );
    }
}

module.exports = ConnectionChecker;
