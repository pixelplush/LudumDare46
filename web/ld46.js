    const suspectClueSentences = [
        "I didn't know this SPECIES could be described as CHARACTERISTIC",
        "People were calling this SPECIES the NICKNAME",
        "I heard they're AGE years old!",
        "The SPECIES was GENDER",
    ];
    const peculiarSuspects = [
        {
            name: "Captain of Catastrophe",
            characteristics: [ "Pointy Ears", "Purrrfect Whiskers" ],
            nicknames: [ "Catastrophe", "C-A-T", "Captain" ],
            gender: "male",
            species: "cat",
            sound: [ "meow", "a-mews-ed" ],
            age: "?"
        },
        {
            name: "Sergeant Mayo",
            characteristics: [ "Uniform", "Angry", "Cop", "Sarcastic" ],
            nicknames: [ "Sergeant", "sarge" ],
            gender: "male",
            species: "condiment",
            sound: [ "angry", "yelling" ],
            age: 54
        },
        {
            name: "Dr. D Dawson",
            characteristics: [ "Meticulous", "Proper", "Clean", "Calculating", "Smart" ],
            nicknames: [ "Doctor", "doc", "daws", "Deedeedee" ],
            gender: "female",
            species: "human",
            sound: [ "calm", "alluring" ],
            age: 26
        },
        {
            name: "Jay Son",
            characteristics: [ "Organized", "Clean-Shaven", "Hacker", "Computer-Geek", "Techie" ],
            nicknames: [ "json", "jayjay" ],
            gender: "male",
            species: "artificial intelligence",
            sound: [ "mumbling" ],
            age: 2
        },
        {
            name: "Melia Azedarach",
            characteristics: [ "Smells Good", "Femme Fatale", "Stoic", "Doesn't Speak" ],
            nicknames: [ "Killer Flower", "poison", "danger" ],
            gender: "female",
            species: "tree",
            sound: [ "quiet" ],
            age: 267
        }
    ];

function SetupGame( code = "" ) {
    prandom = new alea( code );

    clues = generateSuspectClues( getRandomElement( peculiarSuspects ) );
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
        let clue = getRandomElement( suspectClueSentences );
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
