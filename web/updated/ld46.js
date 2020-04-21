const soundDB = {
	cancel: {
		src: "web/assets/sfx/cancel.mp3",
		volume: 1.0,
		rate: 1.0,
	},
	answer: {
		src: "web/assets/sfx/confirm1.mp3",
		volume: 1.0,
		rate: 1.0,
	},
	button: {
		src: "web/assets/sfx/confirm2.mp3",
		volume: 1.0,
		rate: 1.0,
		// rate: 4.0,
	},
	decode: {
		src: "web/assets/sfx/decodephaser.mp3",
		volume: 1.0,
		// rate: 1.0,
		rate: 1.0,
	},
};

var sounds = {};
Object.keys( soundDB ).map( s => {
	sounds[ s ] = new Howl({
		src: [ soundDB[ s ].src ],
		rate: soundDB[ s ].rate
	});
});
Howler.volume( 0 ); // Default to muted
let music = new Howl( {
	src: [ "web/assets/music/LD46_BG.mp3" ],
    loop: true,
});
music.volume( 0.5 ); // Set music volume to be 0.5
music.play();

var clueSentences = [];
var peculiarSuspects = [];
var peculiarWeapons = [];
var peculiarLocations = [];
var suspect;
var weapon;
var answerLocation;
var answerDate;

async function SetupGame( code = "" ) {
    prandom = new alea( code );

    peculiarSuspects = await fetch( "web/data/suspects.json" ).then( r => r.json() );
    peculiarWeapons = await fetch( "web/data/weapons.json" ).then( r => r.json() );
	peculiarLocations = await fetch( "web/data/locations.json" ).then( r => r.json() );
    clueSentences = await fetch( "web/data/clues.json" ).then( r => r.json() );

    // Populate Suspects List
	document.querySelector( "#content-suspects" ).innerHTML = "";
    peculiarSuspects.forEach( ( s, index ) => {
        let contain = document.createElement( "div" );
        contain.setAttribute( "id", `suspect-${index}` );
        contain.setAttribute( "class", "nes-container is-rounded is-dark with-title" );
        let elem = document.createElement( "p" );
        elem.setAttribute( "class", "title" );
        elem.innerText = s.name;
        contain.append( elem );

        let mugshot = document.createElement( "div" );
        mugshot.setAttribute( "class", "mugshot" );
        mugshot.setAttribute( "data-id", index );
        contain.append( mugshot );

        let list = document.createElement( "ul" );
        list.setAttribute( "class", "nes-list is-circle nes-text is-warning" );

        let basic = document.createElement( "li" );
        basic.innerText = `Gender: ${s.gender}`;
        list.append( basic );

        let age = document.createElement( "li" );
        age.innerText = `Age: ${s.age}`;
        list.append( age );

        let species = document.createElement( "li" );
        species.innerText = `Species: ${s.species}`;
        list.append( species );

        let characteristics = document.createElement( "li" );
        characteristics.innerText = `Traits: ${s.characteristics.join( ", " ) || "Unknown"}`;
        list.append( characteristics );

        let nicknames = document.createElement( "li" );
        nicknames.innerText = `Nicknames: ${s.nicknames.join( ", " ) || "None"}`;
        list.append( nicknames );

        let personality = document.createElement( "li" );
        personality.innerText = `Personality: ${s.sound.join( ", " ) || "None"}`;
        list.append( personality );

        contain.append( list );
        document.querySelector( "#content-suspects" ).append( contain );
    });

    // Populate Weapons List
	document.querySelector( "#content-weapons" ).innerHTML = "";
    peculiarWeapons.forEach( ( w, index ) => {
        let contain = document.createElement( "div" );
        contain.setAttribute( "id", `weapon-${index}` );
        contain.setAttribute( "class", "nes-container is-rounded is-dark with-title" );
        let elem = document.createElement( "p" );
        elem.setAttribute( "class", "title" );
        elem.innerText = w.name;
        contain.append( elem );

        let mugshot = document.createElement( "div" );
        mugshot.setAttribute( "class", "mugshot" );
        mugshot.setAttribute( "data-id", index );
        contain.append( mugshot );

        let list = document.createElement( "ul" );
        list.setAttribute( "class", "nes-list is-disc nes-text is-error" );

        let type = document.createElement( "li" );
        type.innerText = `Type: ${w.type}`;
        list.append( type );

        let effect = document.createElement( "li" );
        effect.innerText = `Effect: ${w.effect}`;
        list.append( effect );

        let sharpness = document.createElement( "li" );
        sharpness.innerText = `Sharpness: ${w.sharpness}`;
        list.append( sharpness );

        let color = document.createElement( "li" );
        color.innerText = `Color: ${w.color}`;
        list.append( color );

        let size = document.createElement( "li" );
        size.innerText = `Size: ${w.size}`;
        list.append( size );

        contain.append( list );
        document.querySelector( "#content-weapons" ).append( contain );
    });

    suspect = getRandomElement( peculiarSuspects );
    weapon = getRandomElement( peculiarWeapons );
	answerLocation = getRandomElement( peculiarLocations );
	answerDate = getRandomInt( 203 ) + 2020;

    clues = generateClues( suspect, weapon, answerLocation, answerDate );
    // Only keep unique clues
    clues = clues.filter( ( c, index ) => clues.indexOf( c ) === index );
    // console.log( clues );
    const ciphers = [
        ComfyCipher.Encode.Reverse,
        ComfyCipher.Encode.Base64,
        ComfyCipher.Encode.Hexadecimal,
        ComfyCipher.Encode.Rot13,
        function( text ) {
            return ComfyCipher.Encode.Rot13( ComfyCipher.Encode.Reverse( text ) );
        },
        function( text ) {
            return ComfyCipher.Encode.Rot13( ComfyCipher.Encode.Reverse( ComfyCipher.Encode.Base64( text ) ) );
        },
        ComfyCipher.Encode.Binary,
        function( text ) {
            return ComfyCipher.Encode.Binary( ComfyCipher.Encode.Base64( text ) );
        },
        function( text ) {
            return ComfyCipher.Encode.Binary( ComfyCipher.Encode.Base64( ComfyCipher.Encode.Base64( text ) ) );
        },
        ComfyCipher.Encode.Morse,
        function( text ) {
            return ComfyCipher.Encode.Morse( ComfyCipher.Encode.Hexadecimal( text ) );
        },
        function( text ) {
            return ComfyCipher.Encode.Morse( ComfyCipher.Encode.Hexadecimal( ComfyCipher.Encode.Base64( text ) ) );
        },
    ];
    // console.log( ComfyCipher );
    // console.log( clues.map( c => getRandomElement( ciphers )( c ) ) );
    document.querySelector( "#clues" ).innerHTML = "";
    clues.forEach( ( c, index ) => {
        let clue = getRandomElement( ciphers )( c );
        let contain = document.createElement( "div" );
        contain.setAttribute( "id", `clue-${index}` );
        contain.setAttribute( "class", "nes-container is-rounded is-dark with-title" );
        let title = document.createElement( "p" );
        title.setAttribute( "class", "title" );
        title.innerText = `Secret Memo #${index+1}`;
        contain.append( title );

        let elem = document.createElement( "p" );
		elem.setAttribute( "id", `clue-${index}-text` );
        elem.setAttribute( "class", "nes-text is-success" );
        elem.innerText = clue;
        contain.append( elem );
        document.querySelector( "#clues" ).append( contain );
        contain.addEventListener( "click", function( ev ) {
			sounds[ "button" ].play();
            document.querySelector( "#decode-text" ).value = clue;
            clueIndex = index;
            originalText = clue;
            document.querySelector( ".modal-container" ).removeAttribute( "hidden" );
        });
    });
}

var prandom = new alea(" ");
var clues = [];

const deciphers = [
    ComfyCipher.Decode.Reverse,
    ComfyCipher.Decode.Base64,
    ComfyCipher.Decode.Hexadecimal,
    ComfyCipher.Decode.Rot13,
    function( text ) {
        return ComfyCipher.Decode.Reverse( ComfyCipher.Decode.Rot13( text ) );
    },
    function( text ) {
        return ComfyCipher.Decode.Base64( ComfyCipher.Decode.Reverse( ComfyCipher.Decode.Rot13( text ) ) );
    },
    ComfyCipher.Decode.Binary,
    function( text ) {
        return ComfyCipher.Decode.Base64( ComfyCipher.Decode.Binary( text ) );
    },
    function( text ) {
        return ComfyCipher.Decode.Base64( ComfyCipher.Decode.Base64( ComfyCipher.Decode.Binary( text ) ) );
    },
    ComfyCipher.Decode.Morse,
    function( text ) {
        return ComfyCipher.Decode.Hexadecimal( ComfyCipher.Decode.Morse( text ) );
    },
    function( text ) {
        return ComfyCipher.Decode.Base64( ComfyCipher.Decode.Hexadecimal( ComfyCipher.Decode.Morse( text ) ) );
    },
];
var clueIndex = -1;
var originalText = "";
var decodeTimer = null;
var decodeProgress = 0;
var decodedMessage = "";
// Text Decipher Effect by Sadmoody (https://twitch.tv/sadmoody)
String.prototype.replaceAt=function(index, replacement) {
    return this.substr(0, index) + replacement+ this.substr(index + replacement.length);
}

function scrambleCharacters( messageOld, messageNew, progress ) {
    if( messageOld.length > messageNew.length ) {
        let lengthDiff = messageOld.length - messageNew.length;
        let numCharToRemove = Math.floor( lengthDiff * progress );
        messageOld = messageOld.substr( 0, messageOld.length - numCharToRemove );
    }
    if( messageOld.length < messageNew.length ) {
        messageOld += " ".repeat( messageNew.length - messageOld.length );
    }
    let numCharToReplace = Math.floor( messageNew.length * progress );
    for( let i = 0; i < numCharToReplace; i++ ) {
        var index = Math.floor( Math.random() * messageNew.length );
        messageOld = messageOld.replaceAt( index, messageNew.substr( index, 1 ) );
    }
    return messageOld;
}

function decode( decoderId ) {
	try {

	    if( decodeTimer ) {
	        clearInterval( decodeTimer );
	    }
		sounds[ "decode" ].play();
	    decodeProgress = 0;
	    document.querySelector( "#decode-text" ).value = originalText;
	    decodedMessage = deciphers[ decoderId ]( originalText );// document.querySelector( "#decode-text" ).value );
	    decodeTimer = setInterval( () => {
	        decodeProgress += 1;
	        document.querySelector( "#decode-progress" ).value = decodeProgress;
	        document.querySelector( "#decode-text" ).value = scrambleCharacters( document.querySelector( "#decode-text" ).value, decodedMessage, Math.pow( decodeProgress / 100, 2 ) );
	        if( decodeProgress >= 100 ) {
	            clearInterval( decodeTimer );
	            decodeTimer = null;
	            document.querySelector( "#decode-text" ).value = decodedMessage;
	            document.querySelector( "#decode-progress" ).value = 0;
	        }
	    }, 30 );
	}
	catch( err ) {
		sounds[ "decode" ].stop();
		sounds[ "cancel" ].play();
		document.querySelector( "#decode-text" ).value = "ERROR DECODING: \n" + originalText;
	}
}

function generateClues( suspect, weapon, loc, date, number = 100 ) {
    let sus = [];
    for( var i = 0; i < number; i++ ) {
        let clue = getRandomElement( clueSentences );
        sus.push( replaceClue( suspect, weapon, loc, date, clue ) );
    }
    return sus;
}

function checkAnswer( text ) {
	let answer = `${suspect.name} with a ${weapon.name} at ${answerLocation.name} in ${answerDate}`;
	// console.log( answer );
	return text.toLowerCase().trim() === answer.toLowerCase();
}

function replaceClue( suspect, weapon, loc, date, sentence ) {
    return sentence
        .replace( /SPECIES/g, suspect.species )
        .replace( /GENDER/g, suspect.gender )
        .replace( /AGE/g, suspect.age )
        .replace( /NICKNAME/g, getRandomElement( suspect.nicknames ) )
        .replace( /CHARACTERISTIC/g, getRandomElement( suspect.characteristics ) )
        .replace( /SOUND/g, getRandomElement( suspect.sound ) )
        .replace( /WEAPON/g, weapon.name )
        .replace( /EFFECT/g, weapon.effect )
        .replace( /SHARPNESS/g, weapon.sharpness < 1 ? "dull" : ( weapon.sharpness < 5 ? "tough" : "sharp" ) )
        .replace( /COLOR/g, weapon.color )
        .replace( /SIZE/g, weapon.size === "small" ? "small" : ( weapon.size === "medium" ? "big" : ( weapon.size === "large" ? "huge" : "mysterious in size" ) ) )
        .replace( /TYPE/g, weapon.type )
		.replace( /W3W/g, loc.what3words )
		.replace( /LAT/g, loc.lat )
		.replace( /LON/g, loc.long )
		.replace( /LANDMARK/g, getRandomElement( loc.landmarks ) )
		.replace( /FOOD/g, getRandomElement( loc.food ) )
		.replace( /YEAR/g, date )
}

function getRandomInt( max ) {
    return Math.floor( max * prandom() );
}

function getRandomElement( arr ) {
    return arr[ getRandomInt( arr.length ) ];
}
