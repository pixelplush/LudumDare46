var cutscene = 0;

function updateCutscene() {
	switch( cutscene ) {
	case 0:	// Start Game
		//scenes.showTablet();
		break;
	case 1: // Intro
		break;
	}
}

setInterval( () => {
	updateCutscene();
}, 1000 );
