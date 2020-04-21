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
		animateMouth(5, function(){
			scenes.setBrows(true);
			setCutscene(1);
		});
		break;
	case 1: // Intro
		playVoice(1);
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
	setCutscene(5);
}

preloadVoices();
