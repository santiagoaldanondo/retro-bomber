// Declare global variables to avoid no-undef errors from Eslint:
/*global ion :true*/

//Initialize ion library, include sounds and set multiplay to true (so it can play multiple sounds at the same time)
ion.sound({
    sounds: [{
        name: "bomb-explode",
        volume: 0.3
    },
    {
        name: "base-explode",
        volume: 0.5
    },
    {
        name: "bullet-shot",
        volume: 0.2
    },
    {
        name: "missile-shot",
        volume: 0.2
    },
    ],
    path: "audios/",
    multiplay: true,
    preload: true
});
