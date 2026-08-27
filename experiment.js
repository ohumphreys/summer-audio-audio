
const jsPsych = initJsPsych({
    show_progress_bar: true,
    on_finish: function(data) {
      // jsPsych.data.displayData('csv');
      window.location.href = 'finish.html';
    }
});

//all of the trials were created in trials.js, this now populates the timeline
//practice_tvs/test_tvs are filled asynchronously (see trials.js), so we wait for timeline_variables_ready before building/running the timeline.
timeline_variables_ready.then(() => {
    const timeline = [];

    timeline.push(prolific_id_trial)
    timeline.push(irb_trial);
    // preload stimulus trial
    const preload_trial = {
        type: jsPsychPreload,
        audio: preload_files,
        message: "Loading files . . .",
    };
    timeline.push(headphone_confirmation);
    timeline.push(audio_test);
    timeline.push(preload_trial);
    timeline.push(instructions_trial);

    const practice_timeline = create_priming_trials(jsPsych, practice_tvs, false);
    timeline.push(practice_timeline);

    const test_timeline = create_priming_trials(jsPsych, test_tvs, true);
    timeline.push(test_timeline);
    timeline.push(exit_survey);


    const subject_id = jsPsych.randomization.randomID(10);
    const filename = `${subject_id}.csv`;

    const save_data = {
      type: jsPsychPipe,
      action: "save",
      experiment_id: EXPERIMENT_ID,
      filename: filename,
      data_string: ()=>jsPsych.data.get().csv()
    };

    timeline.push(save_data);

    // adds these to every trial
    jsPsych.data.addProperties({
      counterbalance: counterbalance_number,
      voice_used: VOICE_BEING_TESTED,
      subject_id: subject_id
    });


    jsPsych.run(timeline);
});