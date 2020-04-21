var cutscene = 0,
	loaded_voices = 0,
	skipped = false,
	voices = [
		"LD46-1-OhHereYouAre",
		"LD46-2-ListenToMe",
		"LD46-3-TheProblemIs",
		"LD46-4-GatheredInfo",
		"LD46-5-TryAgain",
		"LD46-6-AreYouSure",
		"LD46-7-YouDidIt",
		"LD46-8-ThankYou",
		"LD46-9-InYourDebt",
		"LD46-10-KnowWhereToFindYou",
		"LD46-11-TilNextTime"
	];
	voice_audios = [];

function updateCutscene() {
	console.log(cutscene);
	switch( cutscene ) {
	case 0:	// Start Game
		playVoice(0);
		speechBubble( "OH! Here you are! I have been looking all over for you!", 1000, 4000, () => {
		});
		animateMouth(5, function(){
			scenes.setBrows(true);
			setCutscene(1);
		});
		break;
	case 1: // Intro
		playVoice(1);
		speechBubble( "Listen to me, this is very important and we don't have time to spare.", 0, 5000, () => {
			speechBubble( "I'm not gonna tell you who I am... that can make an even greater mess.", 500, 4500, () => {
				speechBubble( "All you need to know is that I come from the future where...", 500, 2500, () => {
					speechBubble( "Something has just gone terribly wrong.", 200, 2600, () => {
						speechBubble( "An apocalypse started by someone evil...", 200, 2600, () => {
							speechBubble( "That destroyed our world.", 200, 2000, () => {
								speechBubble( "And now there's almost nothing left.", 200, 3000, () => {
								});
							});
						});
					});
				});
			});
		});
		scenes.setBodyType(1);
		scenes.setBrows(false);
		animateMouth(13, function(){
			scenes.setBrows(true);
			animateMouth(11, function(){
				setCutscene(2);
			});
		});
		break;
	case 2:
		playVoice(2);
		speechBubble( "The problem is...", 400, 1400, () => {
			speechBubble( "No one knows the exact moment when everything started falling apart.", 400, 3900, () => {
				speechBubble( "If we could figure that part out...", 800, 2800, () => {
					speechBubble( "Maybe all of mankind could be saved.", 600, 2200, () => {
					});
				});
			});
		});
		scenes.setBodyType(3);
		scenes.setBrows(false);
		animateMouth(6, function(){
			scenes.setBrows(true);
			animateMouth(7, function(){
				setCutscene(3);
			});
		});
		break;
	case 3:
		playVoice(3);
		speechBubble( "We gathered information about all possible suspects in this tablet.", 500, 4600, () => {
			speechBubble( "And while the tablet did give us answers...", 700, 2800, () => {
				speechBubble( "It's all gibberish for some reason.", 500, 2400, () => {
					speechBubble( "You are one of the brightest minds in our history.", 800, 3300, () => {
						speechBubble( "Which is why I'm here.", 200, 1100, () => {
							speechBubble( "Could you take a look at it?", 500, 1100, () => {
								speechBubble( "We need information about who did it, when, and how.", 700, 3700, () => {
								});
							});
						});
					});
				});
			});
		});
		scenes.setBodyType(2); // because I forgot to switch the body types, shame on me
		scenes.setBrows(false);
		animateMouth(10, function(){
			scenes.setBrows(true);
			animateMouth(14, function(){});
		});
		setTimeout(function(){
			animateTablet(10, function(){
				scenes.setBrows(false);
				document.querySelector( ".scene .girl .eyes img" ).style.opacity = "1";
				setTimeout(function(){
					setCutscene(4);
				},5000);
			});
		}, 4000);
		break;
	case 4:
		document.querySelector( ".scene .girl .eyes img" ).style.opacity = "0";
		scenes.setBrows(false);
		scenes.setBodyType(0);
		scenes.setMouthFrame( 0 );
		scenes.setBodyRight(true);
		scenes.showTablet();
		break;
	case 5:
		for (var i = voice_audios.length - 1; i >= 0; i--) {
			voice_audios[i].pause();
		}
		skipped = true;
		document.querySelector( ".scene .girl .eyes img" ).style.opacity = "0";
		scenes.setBrows(false);
		scenes.setBodyType(0);
		scenes.setBodyRight(true);
		scenes.showTablet();
		break;
	case 10: // End Cutscene!
		skipped = false;
		scenes.hideTablet();
		scenes.setBodyRight(false);
		playVoice(6);
		scenes.setBodyType(4);
		animateMouth(5, function(){
			setCutscene( 11 );
		});
		break;
	case 11:
		playVoice(7);
		animateMouth(3, function(){
			setCutscene(12);
		});
		break;
	case 12:
		playVoice(8);
		scenes.setBodyType(0);
		animateMouth(2, function(){
			setCutscene( 13 );
		});
		break;
	case 13:
		playVoice(9);
		scenes.setBodyType(1);
		animateMouth(6, function(){
			setCutscene(14);
		});
		break;
	case 14:
		playVoice(10);
		scenes.setBodyType(0);
		animateMouth(2, function() {
			scenes.setMouthFrame( 0 );
			document.getElementById( "end-game-scene" ).removeAttribute( "hidden" );
		});
		break;
	case 20: // Try again
		skipped = false;
		for (var i = voice_audios.length - 1; i >= 0; i--) {
			voice_audios[i].pause();
		}
		playVoice(4);
		scenes.setBodyType(1);
		animateMouth(4, function(){
			scenes.setBodyType(0);
		});
		break;
	case 21: // Are you sure?
		skipped = false;
		for (var i = voice_audios.length - 1; i >= 0; i--) {
			voice_audios[i].pause();
		}
		playVoice(5);
		scenes.setBodyType(1);
		scenes.setBrows(true);
		animateMouth(4, function(){
			scenes.setBrows(false);
			scenes.setBodyType(0);
		});
		break;
	}
}
function setCutscene( number ) {
	// clearTimeout( delayFrame );
	cutscene = number;
	updateCutscene();
}

function loadVoice() {
    loaded_voices++;
    if ( loaded_voices == voices.length ) {
        // setCutscene(0);
        // music.volume(0);
    }
}
function preloadVoices() {
	//Howler.volume( 1 );
    voices.forEach( ( url ) => {
        /*var voice = new Audio();
        voice.addEventListener('canplaythrough', loadVoice, false);
        voice.src = "./web/assets/voice/" + url + ".mp3";
        voice_audios.push(voice);*/

        var voice = new Howl({
			src: [ "./web/assets/voice/" + url + ".mp3" ],
			rate: 1.0,
			volume: 1.0
		});
		voice.once('load', loadVoice);
		voice_audios.push(voice);
    });
}
function playVoice( id ) {
	voice_audios[id].volume(1);
    voice_audios[id].play();
}

function speechBubble( text, delay, length, fin ) {
	if( !skipped ) {
		setTimeout( () => {
			document.getElementById( "speech-bubble" ).removeAttribute( "hidden" );
			document.getElementById( "speech-bubble-text" ).innerText = text;
			setTimeout( () => {
				document.getElementById( "speech-bubble" ).setAttribute( "hidden", true );
				fin();
			}, length );
		}, delay );
	}
	else {
		document.getElementById( "speech-bubble" ).setAttribute( "hidden", true );
		fin();
	}
}

function animateMouth( length, fin ) {
	if (!skipped) {
		var startTime = new Date(),
			delayFrame = function() {
				if (!skipped) {
					if ((new Date())-startTime < length*1000 ) {
						scenes.nextMouthFrame();
						setTimeout(delayFrame, Math.floor(Math.random()* (400-10+1))+10 );
					} else if (!skipped) {
						fin();
					}
				}
			};
			setTimeout(delayFrame, Math.floor(Math.random()* (400-10+1))+10 );
	}
}
function animateTablet( length, fin ) {
	if (!skipped) {
		var startTime = new Date(),
			delayFrame = function() {
				if (!skipped) {
					if ((new Date())-startTime < length*1000 ) {
						scenes.nextTabletFrame();
						setTimeout(delayFrame, 125 );
					} else {
						fin();
					}
				}
			};
			setTimeout(delayFrame, 125 );
	}
}

function skip() {
	document.querySelector("#skip-intro-btn").style.display = "none";
	document.getElementById( "speech-bubble" ).setAttribute( "hidden", true );
	setCutscene(5);
}

preloadVoices();
