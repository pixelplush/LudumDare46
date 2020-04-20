// Patrik's code
// First load the images
var loaded_count = 0,
    images = [], img,
    urls = [
        "bcg", "tablet_big",
        "pose/pose1/pose1", // 2
        "pose/pose2/pose2",
        "pose/pose3/pose3",
        "pose/pose4/pose4",
        "pose/pose5/pose5",

        // blink pose1
        "pose/pose1/pose1_blink1", // 7
        "pose/pose1/pose1_blink2",
        "pose/pose1/pose1_blink3",
        "pose/pose1/pose1_blink4",
        "pose/pose1/pose1_blink5",
        // blink pose2
        "pose/pose2/pose2_blink2", // 12
        "pose/pose2/pose2_blink2",
        "pose/pose2/pose2_blink3",
        "pose/pose2/pose2_blink4",
        "pose/pose2/pose2_blink5",
        // blink pose3
        "pose/pose3/pose3_blink3", // 17
        "pose/pose3/pose3_blink3",
        "pose/pose3/pose3_blink3",
        "pose/pose3/pose3_blink4",
        "pose/pose3/pose3_blink5",
        // blink pose4
        "pose/pose4/pose4_blink4", // 22
        "pose/pose4/pose4_blink4",
        "pose/pose4/pose4_blink4",
        "pose/pose4/pose4_blink4",
        "pose/pose4/pose4_blink5",

        // brows
        "pose/pose1/pose1_brows", // 27
        "pose/pose2/pose2_brows",
        "pose/pose3/pose3_brows",
        "pose/pose4/pose4_brows",

        // pose1 eyes
        "pose/pose1/pose1_eyes1",
        "pose/pose1/pose1_eyes2",
        "pose/pose1/pose1_eyes3",
        // pose2 eyes
        "pose/pose2/pose2_eyes1",
        "pose/pose2/pose2_eyes2",
        // pose3 eyes
        "pose/pose3/pose3_eyes1",
        "pose/pose3/pose3_eyes2",
        //pose4 eyes
        "pose/pose4/pose4_eyes1",

        // mouth pose1
        "pose/pose1/pose1_mouth1", // 39
        "pose/pose1/pose1_mouth2",
        "pose/pose1/pose1_mouth3",
        "pose/pose1/pose1_mouth4",
        // mouth pose2
        "pose/pose2/pose2_mouth1", // 43
        "pose/pose2/pose2_mouth2",
        "pose/pose2/pose2_mouth3",
        "pose/pose2/pose2_mouth4",
        "pose/pose2/pose2_mouth5",
        // mouth pose3
        "pose/pose3/pose3_mouth1",
        "pose/pose3/pose3_mouth2",
        "pose/pose3/pose3_mouth3",
        "pose/pose3/pose3_mouth4",
        "pose/pose3/pose3_mouth5",
        // mouth pose4
        "pose/pose4/pose4_mouth1",
        "pose/pose4/pose4_mouth2",
        "pose/pose4/pose4_mouth3",
        "pose/pose4/pose4_mouth4",
        "pose/pose4/pose4_mouth5",
        // mouth pose5
        "pose/pose5/pose5_mouth1", // 58
        "pose/pose5/pose5_mouth2",

        // tablet for pose3
        "pose/pose3/pose3_tablet1", // 60
        "pose/pose3/pose3_tablet2",
        "pose/pose3/pose3_tablet3",
        "pose/pose3/pose3_tablet4",
        "pose/pose3/pose3_tablet5",
        "pose/pose3/pose3_tablet6",
        "pose/pose3/pose3_tablet7",
        "pose/pose3/pose3_tablet8"
    ];

function appendAll() {
    document.querySelector(".scene .background").appendChild( images[0] );
    images[1].style.opacity = "0";
    document.querySelector(".scene > .tablet").appendChild( images[1] );

    for (var i = 2; i <= 6; i++) {
        images[i].style.opacity = "0";
        document.querySelector(".scene .girl .body").appendChild( images[i] );
    }
    for (var i = 0; i <= 3; i++) {
        for (var j = 0; j <= 4; j++) {
            images[7 +(i*5)+j].dataset.pose = i;
            images[7 +(i*5)+j].dataset.state = j;
            document.querySelector(".scene .girl .blink").appendChild( images[7 +(i*5)+j] );
        }
    }
    for (var i = 27; i <= 30; i++) {
        images[i].style.opacity = "0";
        document.querySelector(".scene .girl .brows").appendChild( images[i] );
    }
    for (var i = 39; i <= 42; i++) {
        images[i].style.opacity = i == 39 ? "1" : "0";
        images[i].dataset.pose = 0;
        images[i].dataset.state = i-39;
        document.querySelector(".scene .girl .mouth").appendChild( images[i] );
    }
    for (var i = 0; i <= 3; i++) {
        for (var j = 0; j <= 5; j++) {
            images[43 +(i*5)+j].style.opacity = "0";
            images[43 +(i*5)+j].dataset.pose = i+1;
            images[43 +(i*5)+j].dataset.state = j;
            document.querySelector(".scene .girl .mouth").appendChild( images[43 +(i*5)+j] );
        }
    }
    images[58].style.opacity = "0";
    images[59].style.opacity = "0";
    images[58].dataset.pose = 4;
    images[59].dataset.pose = 4;
    images[58].dataset.state = 0;
    images[59].dataset.state = 1;
    document.querySelector(".scene .girl .mouth").appendChild( images[58] );
    document.querySelector(".scene .girl .mouth").appendChild( images[59] );

    for (var i = 60; i <= 67; i++) {
        images[i].style.opacity = "0";
        images[i].dataset.state = i-60;
        document.querySelector(".scene .girl .tablet").appendChild( images[i] );
    }

    scenes.setBodyType(0);

    document.querySelector(".scene").style.opacity = "1";
}

function imageLoad() {
    loaded_count++;
    if ( loaded_count == urls.length ) {
        setTimeout(appendAll, 500);
    }
}
function preloadImages( img_urls ) {
    img_urls.forEach( ( url ) => {
        img = new Image();
        img.onload = imageLoad;
        img.src = "./web/assets/" + url + ".png";
        images.push(img);
    });
    //images.push(img);
}

var scenes = {
    blinkState: 0, // 0 - 5
    bodyType: 0,
    mouthFrames: [4, 5, 5, 5, 2],
    mouthFrame: 0,
    tabletFrame: 0,

    // 0 - 4
    setBodyType: function (id) {
        var bodyImages = document.querySelectorAll(".scene .girl .body img");
        for (var i = 4; i >= 0; i--) {
            bodyImages[i].style.opacity = i == id ? "1" : "0";
        }
        scenes.bodyType = id;
        scenes.setMouthFrame(0);
        scenes.setBlinkState(scenes.blinkState);
        scenes.setTabletFrame(0);
    },
    // true, false
    setBodyRight: function ( isRight ) {
        document.querySelector(".scene .girl").className = isRight ? "girl right" : "girl";
    },
    // 0 - 5
    setBlinkState: function( state ) {
        scenes.blinkState = state;

        var blinkImages = document.querySelectorAll(".scene .girl .blink img"),
            blinkId = 0;
        if (scenes.blinkState > 0) {
            for (var i = 0; i < blinkImages.length; i++) {
                if ( blinkImages[i].dataset.pose == scenes.bodyType && blinkImages[i].dataset.state == scenes.blinkState ) {
                    blinkImages[i].style.opacity = "1";
                    blinkId = i;
                }
            }
        }
        for (var i = 0; i < blinkImages.length; i++) {
            if (blinkId != i || scenes.blinkState == 0 && blinkImages[i].style.display != "none") {
                blinkImages[i].style.opacity = "0";
            }
        }
    },

    // true, false
    setBrows: function( browsOn ) {
        var browImages = document.querySelectorAll(".scene .girl .brows img");
        for (var i = 0; i < browImages.length; i++) {
            if ( !browsOn ) {
                browImages[i].style.opacity = "0";
            } else if ( scenes.bodyType == i-1 ) {
                browImages[i].style.opacity = "1";
            } else {
                browImages[i].style.opacity = "0";
            }
        }
    },

    setMouthFrame: function( state ) {
        scenes.mouthFrame = state;
        var mouthImages = document.querySelectorAll(".scene .girl .mouth img");
        for (var i = 0; i < mouthImages.length; i++) {
            if ( scenes.bodyType == mouthImages[i].dataset.pose && scenes.mouthFrame == mouthImages[i].dataset.state) {
                mouthImages[i].style.opacity = "1";
            } else {
                mouthImages[i].style.opacity = "0";
            }
        }
    },

    nextMouthFrame: function() {
        // let's cycle through the frames
        scenes.mouthFrame = (scenes.mouthFrame + 1) % scenes.mouthFrames[scenes.bodyType];
        scenes.setMouthFrame(scenes.mouthFrame);
    },

    showTablet: function() {
        document.querySelector(".scene > .tablet img").style.opacity = "1";
        document.querySelector(".game-container > .container").style.opacity = "1";
        document.querySelector(".game-container").className = "game-container";
    },
    hideTablet: function() {
        document.querySelector(".scene > .tablet img").style.opacity = "0";
        document.querySelector(".game-container > .container").style.opacity = "0";
        document.querySelector(".game-container").className = "game-container tablethide";
    },

    // 0 - 8, 8 is off
    setTabletFrame: function( state ) {
        scenes.tabletFrame = state;
        var tabletImages = document.querySelectorAll(".scene .girl .tablet img");
        for (var i = 0; i < tabletImages.length; i++) {
            if ( scenes.bodyType == 2 && scenes.tabletFrame == tabletImages[i].dataset.state) {
                tabletImages[i].style.opacity = "1";
            } else {
                tabletImages[i].style.opacity = "0";
            }
        }
    },

    nextTabletFrame: function() {
        // let's cycle through the frames
        scenes.tabletFrame = (scenes.tabletFrame + 1) % 8;
        scenes.setTabletFrame(scenes.tabletFrame);
    }
};

function winScene() {
    var inp = document.querySelector( "#answer_field" ),
        colors = ["", "#76c442"];
    inp.style.backgroundColor = "#76c442";
    var interval_cycle = 0,
        interval = setInterval(function() {

            inp.style.backgroundColor = colors[interval_cycle % 2];
            if (interval_cycle == 4) {
                clearInterval(interval);

                // THIS IS FOR INSTA
                // ending commands
            }
            interval_cycle++;
        },400);
}

function wrongAnswer() {
    document.querySelector( ".scene > .tablet" ).className = "tablet wrong";
    document.querySelector( ".game-container > .container" ).className = "container wrong";
    setTimeout(function() {
        document.querySelector( ".scene > .tablet" ).className = "tablet";
        document.querySelector( ".game-container > .container" ).className = "container";
    }, 1000);
}

preloadImages(urls);