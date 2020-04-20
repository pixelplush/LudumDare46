var clueSentences = [];
var peculiarSuspects = [];
var peculiarWeapons = [];

async function SetupGame( code = "" ) {
    prandom = new alea( code );

    peculiarSuspects = await fetch( "web/data/suspects.json" ).then( r => r.json() );
    peculiarWeapons = await fetch( "web/data/weapons.json" ).then( r => r.json() );
    clueSentences = await fetch( "web/data/clues.json" ).then( r => r.json() );

    // Populate Suspects List
    peculiarSuspects.forEach( ( s, index ) => {
        let contain = document.createElement( "div" );
        contain.setAttribute( "id", `suspect-${index}` );
        contain.setAttribute( "class", "nes-container is-rounded is-dark" );
        let elem = document.createElement( "p" );
        elem.innerText = s.name;
        contain.append( elem );

        let list = document.createElement( "ul" );
        list.setAttribute( "class", "nes-list is-circle" );

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
    peculiarWeapons.forEach( ( w, index ) => {
        let contain = document.createElement( "div" );
        contain.setAttribute( "id", `weapon-${index}` );
        contain.setAttribute( "class", "nes-container is-rounded is-dark" );
        let elem = document.createElement( "p" );
        elem.innerText = w.name;
        contain.append( elem );
        let list = document.createElement( "ul" );
        list.setAttribute( "class", "nes-list is-disc" );

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

    clues = generateSuspectClues( getRandomElement( peculiarSuspects ) );
    // Only keep unique clues
    clues = clues.filter( ( c, index ) => clues.indexOf( c ) === index );
    // console.log( clues );
    const ciphers = [
        ComfyCipher.Encode.Reverse,
        ComfyCipher.Encode.Base64,
        ComfyCipher.Encode.Rot13,
        ComfyCipher.Encode.Morse,
    ];
    console.log( clues.map( c => getRandomElement( ciphers )( c ) ) );
    document.querySelector( "#clues" ).innerHTML = "";
    clues.forEach( ( c, index ) => {
        let clue = getRandomElement( ciphers )( c );
        let contain = document.createElement( "div" );
        contain.setAttribute( "id", `clue-${index}` );
        contain.setAttribute( "class", "nes-container is-rounded is-dark" );
        let elem = document.createElement( "p" );
        elem.innerText = clue;
        contain.append( elem );
        document.querySelector( "#clues" ).append( contain );
        contain.addEventListener( "click", function( ev ) {
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
    ComfyCipher.Decode.Rot13,
    ComfyCipher.Decode.Morse,
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
    if( decodeTimer ) {
        clearInterval( decodeTimer );
    }
    decodeProgress = 0;
    decodedMessage = deciphers[ decoderId ]( document.querySelector( "#decode-text" ).value );
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

function generateSuspectClues( suspect, number = 10 ) {
    let sus = [];
    for( var i = 0; i < number; i++ ) {
        let clue = getRandomElement( clueSentences );
        sus.push( replaceSuspectClue( suspect, clue ) );
    }
    return sus;
}

function replaceSuspectClue( suspect, sentence ) {
    return sentence
        .replace( /SPECIES/g, suspect.species )
        .replace( /GENDER/g, suspect.gender )
        .replace( /AGE/g, suspect.age )
        .replace( /NICKNAME/g, getRandomElement( suspect.nicknames ) )
        .replace( /CHARACTERISTIC/g, getRandomElement( suspect.characteristics ) )
        .replace( /SOUND/g, getRandomElement( suspect.sound ) )
}

function getRandomInt( max ) {
    return Math.floor( max * prandom() );
}

function getRandomElement( arr ) {
    return arr[ getRandomInt( arr.length ) ];
}
