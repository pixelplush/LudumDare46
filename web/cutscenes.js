var cutscene = 0,
	loaded_voices = 0,
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
				setTimeout(function(){
					setCutscene(4);
				},5000);
			});
		}, 4000);
		break;
	case 4:
		scenes.setBrows(false);
		scenes.setBodyType(0);
		scenes.setBodyRight(true);
		scenes.showTablet();
		break;
	}
}
function setCutscene( number ) {
	cutscene = number;
	updateCutscene();
}

function loadVoice() {
    loaded_voices++;
    if ( loaded_voices == voices.length ) {
        setCutscene(0);
        music.volume(0);
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
	var startTime = new Date(),
		delayFrame = function() {
			if ((new Date())-startTime < length*1000 ) {
				scenes.nextMouthFrame();
				setTimeout(delayFrame, Math.floor(Math.random()* (400-10+1))+10 );
			} else {
				fin();
			}
		};
		setTimeout(delayFrame, Math.floor(Math.random()* (400-10+1))+10 );
}
function animateTablet( length, fin ) {
	var startTime = new Date(),
		delayFrame = function() {
			if ((new Date())-startTime < length*1000 ) {
				scenes.nextTabletFrame();
				setTimeout(delayFrame, 125 );
			} else {
				fin();
			}
		};
		setTimeout(delayFrame, 125 );
}

setTimeout( () => {
	Howler.volume(1);
}, 1000 );
preloadVoices();