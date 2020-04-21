const params = new URLSearchParams( location.search );
var channel = params.get( "channel" );
ComfyJS.onCommand = ( user, command, message, flags, extra ) => {
	if( ( flags.broadcaster || flags.mod ) && command === "reload" ) {
		location.reload();
	}
};

ComfyJS.onChat = ( user, message, flags, self, extra ) => {
	let win = checkAnswer( message );
	if( win ) {
		winScene();
	}
	else {
		wrongAnswer();
	}
};
