const ISI_LENGTH = 500
const ITI_LENGTH = 2000
const MAX_RESPONSE_TIME = 3000

const INPUTS = Object.freeze({
    word: 'k',
    nonword: 'd'
});


// dynamically choose the voice to be tested based on the URL
// for GA go to index.html?key=GZ9wgyFShkUvRW1k9zUDp9khx0Q8q7
// for Southern go to index.html?key=Sc3V0X5Ex7VpbHTDrHuYnB491miEyE

const VOICE_BEING_TESTED = ( () => {
    const params = new URLSearchParams(window.location.search);
    const key = params.get('key')

    // These strings are totally random besides the first letter, they are just this long to insure no one accidentally navigates from one to the other
    if (key == 'GZ9wgyFShkUvRW1k9zUDp9khx0Q8q7') return 'GA';
    else if (key == 'Sc3V0X5Ex7VpbHTDrHuYnB491miEyE') return 'Southern';
    else {
        //something has gone wrong
        window.location.href = 'error.html';
        return null;
    }   
})()


// get experiment id based on voice_being_tested so that datapipe gives a condition from the right set
const EXPERIMENT_ID = ( () => {
    if (VOICE_BEING_TESTED == 'GA') return 'A902rKEXAULc'
    else if (VOICE_BEING_TESTED == 'Southern') return 'fjHxRtiCY8RF'
    else {
        // something has gone *very* wrong
        window.location.href = 'error.html';
        return null;
    }
})()

