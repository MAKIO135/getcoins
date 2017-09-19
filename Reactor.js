class Reactor{
    constructor(){
        this.events = {};
    }
    register( eventName ){
        let event = new Event( eventName );
        this.events[ eventName ] = event;
    }
    dispatch( eventName, eventArgs ){
        this.events[ eventName ].callbacks.forEach( callback => callback( eventArgs ) );
    }
    on( eventName, callback ){
        this.events[ eventName ].registerCallback( callback );
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

module.exports = Reactor;
