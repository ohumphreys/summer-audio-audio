const ISI_LENGTH = 500
const ITI_LENGTH = 2000
const MAX_RESPONSE_TIME = 3000

const INPUTS = Object.freeze({
    word: 'k',
    nonword: 'd'
});


// dynamically choose the voice to be tested based on the URL
// also the experiment id, so that it takes a counterbalance condition from the correct talker's datapipe page
// for GA go to index.html?key=GZ9wgyFShkUvRW1k9zUDp9khx0Q8q7
// for Southern go to index.html?key=Sc3V0X5Ex7VpbHTDrHuYnB491miEyE

const params = new URLSearchParams(window.location.search);
const key = params.get('key')

let VOICE_BEING_TESTED, EXPERIMENT_ID;

if (key == 'GZ9wgyFShkUvRW1k9zUDp9khx0Q8q7') {
    VOICE_BEING_TESTED = 'GA'
    EXPERIMENT_ID = 'A902rKEXAULc'
} else if (key == 'Sc3V0X5Ex7VpbHTDrHuYnB491miEyE') {
    VOICE_BEING_TESTED = 'Southern'
    EXPERIMENT_ID = 'fjHxRtiCY8RF'
} else {
    //something has gone wrong
    window.location.href = 'error.html';
}


