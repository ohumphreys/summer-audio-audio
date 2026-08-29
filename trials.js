// Function used to avoid code repetition when creating the test and practice trials
function create_priming_trials(jsp, tvs, rand_order) {
    return {
        timeline: [
            {
                //Play prime stimulus
                type: jsPsychAudioKeyboardResponse,
                choices: "NO_KEYS",
                stimulus: jsp.timelineVariable('prime_stimulus'),
                response_allowed_while_playing: false,
                response_ends_trial: false,
                trial_ends_after_audio: true,
                prompt: ""
            },
            {
                // interstital
                type: jsPsychHtmlKeyboardResponse,
                choices: "NO_KEYS",
                stimulus: "",
                trial_duration: ISI_LENGTH - AUDIO_PRE_ONSET_TIME,
                response_ends_trial: false
            },
            {
                //target stimulus, decision
                type: jsPsychAudioKeyboardResponse,
                choices: [INPUTS.word, INPUTS.nonword],
                stimulus: jsp.timelineVariable('target_stimulus'),
                response_allowed_while_playing: true,
                trial_duration: MAX_RESPONSE_TIME,
                // prompt appears after the audio onset silence time, which is effectively included in the ISI
                on_load: () => {
                    jsp.pluginAPI.setTimeout(() => {
                        jsp.getDisplayElement().innerHTML = `<div class=\"option_container\"><div class=\"option\">PSEUDOWORD<br><br><b><kbd>${INPUTS.nonword}</kbd></b></div><div class=\"option\">WORD<br><br><b><kbd>${INPUTS.word}</kbd></b></div></div>`;
                    }, AUDIO_PRE_ONSET_TIME);
                },
                data: {
                    prime: jsp.timelineVariable('prime'),
                    target: jsp.timelineVariable('target'),
                    prime_syllables: jsp.timelineVariable('prime_syllables'),
                    target_syllables: jsp.timelineVariable('target_syllables'),
                    target_type: jsp.timelineVariable('target_type'),
                    condition: jsp.timelineVariable('condition'),
                    is_primed: jsp.timelineVariable('is_primed')
                }
            },
            {
                //pause before next trial
                type: jsPsychHtmlKeyboardResponse,
                choices: "NO_KEYS",
                stimulus: "",
                response_ends_trial: false,
                trial_duration: ITI_LENGTH
            }
        ],
        timeline_variables: tvs,
        randomize_order: rand_order
    }
};

const preload_files = [];

// This works to turn my JSONs into timeline variable things
async function create_timeline_variables(json_file, tv_array) {

    const data = await fetch(json_file).then(r => r.json())

    for (const trial of data) {
        const target_filename = trial.target.charAt(0).toUpperCase() + trial.target.toLowerCase().slice(1);
        const prime_filename = trial.prime.charAt(0).toUpperCase() + trial.prime.toLowerCase().slice(1);

        const target_stim = `audio/${VOICE_BEING_TESTED}/${target_filename}.wav`
        const prime_stim = `audio/${VOICE_BEING_TESTED}/${prime_filename}.wav`

        preload_files.push(target_stim, prime_stim)

        const obj = {
            prime: trial["prime"],
            target: trial["target"],
            prime_syllables: trial["prime syllables"],
            target_syllables: trial["target syllables"],
            target_type: trial['target_type'],
            //renamed from trial_type to condition because jsPsych uses trial_type natively so it gets overriden
            condition: trial["trial type"],
            is_primed: trial["isprimed"],
            prime_stimulus: prime_stim,
            target_stimulus: target_stim
        }

        tv_array.push(obj)
    }

};

const practice_tvs = [];
const test_tvs = [];


// experiment.js awaits this promise before building/running the jsPsych timeline,
// since fetching + parsing the trial lists above is asynchronous.
let counterbalance_number;
const timeline_variables_ready = (async () => {
    counterbalance_number = await jsPsychPipe.getCondition(EXPERIMENT_ID);
    counterbalance_number += 1;
    await create_timeline_variables("lists/Practice Trials.json", practice_tvs);
    await create_timeline_variables("lists/Identical Trials.json", test_tvs);
    await create_timeline_variables(`lists/Counterbalance ${counterbalance_number.toString()}.json`, test_tvs);
})();

// prolific ID
const prolific_id_trial = {
    type: jsPsychSurveyText,
    questions: [
        {
            prompt: "Please enter your unique Prolific ID below.",
            name: "Prolific ID"
        }
    ],
    data: {
        condition: 'prolific_id'
    },
    button_label: 'Submit'
}



// consent trial
const irb_intro = {
    type: jsPsychHtmlButtonResponse,
    stimulus: `<p><font size="3">We invite you to participate in a research study on language comprehension.
    <br>Please review the form on the next page prior to beginning the study.</font></p>`,
    choices: ['Next']
};

const irb_doc = {
    type: jsPsychHtmlButtonResponse,
    choices: ['Continue'],
    stimulus: `
    <div style="text-align: right; font-size: 10px; line-height: 1.5;"><br><br>Approval Date: April 16, 2024
    <br>Expiration Date: Does Not Expire</div>
    
    <div class="irb-doc">Stanford University
    <br><b>Nonmedical Human Participants Consent Form and Waiver of Documentation</b>

    <br><br><b>STUDY TITLE:</b> Language Production and Comprehension Studies

    <br><br><b>Protocol Director:</b> Meghan Sumner

    <br><br><b>DESCRIPTION:</b> We invite you to participate in a research study on language production and comprehension.
    In this experiment, you will complete a linguistic task online such as reading sentences or words, naming
    pictures or describing scenes, making up sentences of your own, or participating in a simple language game.

    <br><br><b>RISKS AND BENEFITS:</b> There are no known risks, costs, or discomforts in this study and this judgment
    is based on a large body of experience with the same or similar procedures with people of similar ages,
    sex, origins, etc. We cannot and do not guarantee or promise that you will receive any benefits from this
    study. You will help us to understand how people recognize and perceive auditory stimuli.

    <br><br><b>TIME INVOLVEMENT:</b> Your participation in this experiment will take less than one hour.

    <br><br><b>PAYMENTS:</b> You will be paid for your participation at the posted rate, consisted with online payment
    standards. Some of the items in this experiment/survey are designed solely to check if you are paying
    attention. If you fail any of these attention checks, you will not be paid.

    <br><br><b>SUBJECT'S RIGHTS:</b> If you have read this form and have decided to participate in this project, please
    understand your participation is voluntary and you have the right to withdraw your consent or discontinue
    participation at any time without penalty or loss of benefits to which you are otherwise entitled. You have
    the right to refuse to answer particular questions. Your individual privacy will be maintained in all
    published and written data resulting from the study.

    <br><br><b>CONTACT INFORMATION:</b>
    <br>Questions, Concerns, or Complaints: If you have any questions, concerns or complaints about this
    research study, its procedures, risks and benefits, please contact Prof. Meghan Sumner at (650) 723 - 4284.

    <br><br>Independent Contact: If you are not satisfied with how this study is being conducted, or if you have any
    concerns, complaints, or general questions about the research or your rights as a participant, please
    contact the Stanford Institutional Review Board (IRB) to speak to someone independent of the research
    team at (650)-723-2480 or toll free at 1-866-680-2906. You can also write to the Stanford IRB, Stanford
    University, Stanford, CA 94305-5401 or email irbnonmed@stanford.edu.

    <br><br><b>WAIVER OF DOCUMENTATION</b>
    <br>If you agree to participate in this research, please continue to begin the study.<br><br>   </div>`
}


const irb_trial = [irb_intro, irb_doc]

const headphone_confirmation = {
    type: jsPsychHtmlButtonResponse,
    stimulus: "<p> Headphones and a quiet environment are required for this experiment . Please only continue if you are currently wearing headphones and currently in a noise-free environment. </p>",
    choices: ["Continue"]
}

// short tone used to confirm the participant's audio is working before the experiment begins
const AUDIO_TEST_STIMULUS = "audio/audio_check_tone.wav";
preload_files.push(AUDIO_TEST_STIMULUS);

const audio_test_tone = {
    type: jsPsychAudioButtonResponse,
    stimulus: AUDIO_TEST_STIMULUS,
    prompt: `<p>Please ensure you are able to clearly hear this test tone and that the volume is appropriate in your current environment.</p>
    <p>Once you hear the test tone, use the button to proceed.</p>`,
    choices: ["Replay Tone", "I heard the Tone"],
    response_allowed_while_playing: false
};

// loops the tone trial until the participant confirms they heard it
const audio_test = {
    timeline: [audio_test_tone],
    loop_function: function (data) {
        return data.values()[0].response === 0;
    }
}

// instructions trial - not able to progress for the first 4 seconds so people don't accidentally skip or rush through the instructions
const instructions_trial_pause = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `In this study, you will hear pairs of words. 
    Sometimes, the second word of the pair will be a REAL WORD (e.g., FOG). 
    Other times, the second word of the pair will NOT be a real word. We call these PSEUDOWORDS (e.g., SHISS). 
    For each pair, it is your job to tell us whether the second word of the pair is REAL or PSEUDO. 
    If it is a REAL word, press <b><kbd>${INPUTS.word}</kbd></b>. If it is PSEUDO, press <b><kbd>${INPUTS.nonword}</kbd></b>. 
    Please answer as quickly and accurately as possible.`,
    choices: [],
    trial_duration: 4000, // 4 seconds in ms,
    response_ends_trial: false
};

const instructions_trial_finish = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `In this study, you will hear pairs of words. 
    Sometimes, the second word of the pair will be a REAL WORD (e.g., FOG). 
    Other times, the second word of the pair will NOT be a real word. We call these PSEUDOWORDS (e.g., SHISS). 
    For each pair, it is your job to tell us whether the second word of the pair is REAL or PSEUDO. 
    If it is a REAL word, press <kbd>${INPUTS.word}</kbd>. If it is PSEUDO, press <kbd>${INPUTS.nonword}</kbd>. 
    Please answer as quickly and accurately as possible.
    <br><br>When you're ready to begin, press the space bar.`,
    choices: [" "],
};

const instructions_trial = [instructions_trial_pause, instructions_trial_finish];

// Attaches a live readout of the current value to an html-slider-response trial's on_load
function show_slider_value(suffix = '') {
    const slider = document.querySelector('input[type="range"]');
    const display = document.createElement('div');
    display.style.marginTop = '10px';
    display.style.fontWeight = 'bold';
    display.textContent = slider.value + suffix;
    slider.parentElement.appendChild(display);
    slider.addEventListener('input', function () {
        display.textContent = this.value + suffix;
    });
}

const survey_intro = {
    type: jsPsychHtmlButtonResponse,
    stimulus: `You have completed audio portion of this study. To finish, fill out a brief (~3 minutes) series of questions.`,
    choices: ['Continue']
}

const demographics_A = {
    type: jsPsychSurveyMultiChoice,
    button_label: "Next",
    questions: [
        {
            prompt: 'Which of the following best describes how you perceive the gender of the voice you heard during this study?',
            name: 'Gender',
            horizontal: false,
            required: true,
            options: ['Male', 'Female']
        },
        {
            prompt: 'Which of the following best describes how you perceive the race of the voice you heard during this study?',
            name: 'Race',
            horizontal: false,
            required: true,
            options: ['White', 'Black or African American', 'Asian', 'American Indian or Alaska Native', 'Native Hawaiian or Other Pacific Islander', 'Another race or mixed race']
        },
        {
            prompt: 'Which of the following best describes how you perceive the American region of the voice you heard during this study?',
            name: 'Region',
            horizontal: false,
            required: true,
            options: ['Non-Southern', 'Southern']
        }
    ],
    data: {condition: 'exit_survey_demographics'}

}

const demographics_B = {
    type: jsPsychHtmlSliderResponse,
    stimulus: `<p>What age most closely matches how you perceive the voice you heard during this study?</p>`,
    labels: ['0', '100'],
    min: 0,
    max: 100,
    slider_start: 50,
    step: 1,
    require_movement: true,
    button_label: 'Next',
    on_load: () => show_slider_value(),
    data: {
        condition: 'exit_survey_age'
    }
}

const attributes = {
    type: jsPsychSurveyLikert,
    preamble: '<b>Rate the extent to which you perceive the voice you heard during the study to match the following descriptions:</b>',
    button_label: 'Next',
    questions: [
        {
            prompt: "Trustworthy",
            labels: [
                'Very Untrustworthy',
                'Untrustworthy',
                'Neutral',
                'Trustworthy',
                'Very Trustworthy'
            ],
            required: true
        },
        {
            prompt: "Mature",
            labels: [
                'Very Immature',
                'Immature',
                'Neutral',
                'Mature',
                'Very Mature'
            ],
            required: true
        },
        {
            prompt: "Friendly",
            labels: [
                'Very Unfriendly',
                'Unfriendly',
                'Neutral',
                'Friendly',
                'Very Friendly'
            ],
            required: true
        },
        {
            prompt: "Intelligent",
            labels: [
                'Very Unintelligent',
                'Unintelligent',
                'Neutral',
                'Intelligent',
                'Very Intelligent'
            ],
            required: true
        },
        {
            prompt: "Competent",
            labels: [
                'Very Incompetent',
                'Incompetent',
                'Neutral',
                'Competent',
                'Very Competent'
            ],
            required: true
        }
    ],
    data: {condition: 'exit_survey_attributes'}
}

const naturalness = {
    type: jsPsychHtmlSliderResponse,
    stimulus: `<p>How natural-sounding did you perceive the voice you heard during this study to be?</p>`,
    labels: ['0%', '100%'],
    min: 0,
    max: 100,
    slider_start: 50,
    step: 1,
    require_movement: true,
    button_label: 'Next',
    on_load: () => show_slider_value('%'),
    data: {
        condition: 'exit_survey_naturalness'
    }
}

const humanness = {
    type: jsPsychHtmlSliderResponse,
    stimulus: `<p>How human-sounding did you perceive the voice you heard during this study to be?</p>`,
    labels: ['0%', '100%'],
    min: 0,
    max: 100,
    slider_start: 50,
    step: 1,
    require_movement: true,
    button_label: 'Next',
    on_load: () => show_slider_value('%'),
    data: {
        condition: 'exit_survey_humanness'
    }
}

const ai_sentiment = {
    type: jsPsychSurveyLikert,
    button_label: 'Finish',
    questions: [
        {
            prompt: "To what extent do you support the development and usage of AI tools?",
            labels: [
                'Strongly Disapprove',
                'Disapprove',
                'Neutral',
                'Approve',
                'Strongly Approve'
            ],
            required: true
        },
        {
            prompt: "To what extent do you support the use of artificially generated voices?",
            labels: [
                'Strongly Disapprove',
                'Disapprove',
                'Neutral',
                'Approve',
                'Strongly Approve'
            ],
            required: true
        }
    ],
    data: {condition: 'exit_survey_sentiment'}
}

const exit_survey = [survey_intro, demographics_A, demographics_B, attributes, naturalness, humanness, ai_sentiment]
