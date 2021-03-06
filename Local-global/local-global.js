
/* ************************************ */
/* Define helper functions */
/* ************************************ */
var randomDraw = function(lst) {
    index = Math.round(Math.random()*(lst.length-1))
    return lst[index]
}

var makeTrialList = function(len, stim, data) {
	//choice array: numeric key codes for the numbers 1-4
	var choice_array = [49,50,51,52]
	// 1 is a switch trial: ensure half the trials are switch trials
	var switch_trials = jsPsych.randomization.repeat([0,1],len/2,false)
	//create test array
	output_list = {image:[],data:[]}
	//randomize first trial
	var trial_index = jsPsych.randomization.shuffle(['global','local'])[0]
	if (trial_index == 'global') {
		tmpi = Math.round(Math.random()*(stim.length/2-1))
	} else {
		tmpi = Math.round(Math.random()*(stim.length/2-1))+stim.length/2
	}
	output_list['image'].push(stim[tmpi])
	var tmp_data = $.extend({},data[tmpi])
	tmp_data["switch"] = 0 
	tmp_data["correct_response"] = choice_array[task_shapes.indexOf(data[tmpi][trial_index + '_shape'])]
	output_list['data'].push(tmp_data)

	/* randomly sample from either the global or local stimuli lists (first and half part of the stim/data arrays)
	On stay trials randomly select an additional stimulus from that array. On switch trials choose from the other list. */
	for (i=1; i<switch_trials.length;i++) {
		if (switch_trials[i] == 1) {
			if (trial_index == 'global') {trial_index = 'local'}
			else {trial_index = 'global'}
		}
		if (trial_index == 'global') {
			tmpi = Math.round(Math.random()*(stim.length/2-1))
		} else {
			tmpi = Math.round(Math.random()*(stim.length/2-1))+stim.length/2
		}
		output_list['image'].push(stim[tmpi])
		tmp_data = $.extend({},data[tmpi])
		tmp_data["switch"] = switch_trials[i]
		tmp_data["correct_response"] = choice_array[task_shapes.indexOf(data[tmpi][trial_index + '_shape'])]
		output_list['data'].push(tmp_data)
	}	
	return output_list
}

/* ************************************ */
/* Define experimental variables */
/* ************************************ */
var task_colors = jsPsych.randomization.shuffle(['blue','black'])
var task_shapes = ['circle','X','triangle','square']
var path = '../Local-global/stim/'
prefix = '<div class = centerbox><img src = "'
postfix = '"</img></div>'
stim = []
data = []
for (c=0; c<task_colors.length; c++) {
	if (c==0) {condition = 'global'} else { condition = 'local'}
	for (g=0; g<task_shapes.length; g++) {
		for (l=0; l<task_shapes.length; l++) {
			stim.push(prefix + path + task_colors[c] + '_' + task_shapes[g] + 'of' + task_shapes[l] +'s.png' + postfix)
			data.push({exp_id: 'local-global', condition: condition, global_shape: task_shapes[g], local_shape: task_shapes[l]})
		}
	}
}

//Set up experiment stimulus order
var practice_trials = makeTrialList(36,stim,data)
var practice_response_array = []
for (i=0; i<practice_trials.data.length; i++) {
	practice_response_array.push(practice_trials['data'][i].correct_response)
}
var test_trials = makeTrialList(96,stim,data)



/* ************************************ */
/* Set up jsPsych blocks */
/* ************************************ */
/* define static blocks */
var welcome_block = {
  type: 'text',
  text: '<div class = centerbox><p class = block-text>Welcome to the local-global experiment. Press <strong>enter</strong> to begin.</p></div>',
  cont_key: 13
};

var instructions_block = {
  type: 'instructions',
  pages: [
	'<div class = centerbox><p class = block-text>In this experiment you will see blue or black shapes made up of smaller shapes, like the image below. All of the smaller shapes will always be the same shape. Both the large shape and the smaller shapes can either be a circle, X, triangle or square.</p><img src = "../Local-global/stim/blue_squareofcircles.png" height = 200 width = 200></src><br><br><p class = block-text>Press <strong>enter</strong> to continue.</p></div>',
	'<div class = centerbox><p class = block-text>Your task is to respond based on how many lines either the large or small shapes have, depending on the color. If the shape is ' + task_colors[0] + ' respond based on how many lines the large shape has. If the shape is ' + task_colors[1] + ' respond based on how many lines the small shape has.</p><p class = block-text>Use the number keys to respond 1 for a circle, 2 for an X, 3 for a triangle and 4 for a square. Press <strong>enter</strong> to continue.</p></div>',
	'<div class = centerbox><p class = block-text>For instance, for the shape below you would press 3 because it is ' + task_colors[1] + ' which means you should respond based on the smaller shapes. If the shape was instead ' + task_colors[0] + ' you would press 2.</p><img src = "../Local-global/stim/' + task_colors[1] + '_Xoftriangles.png" height = 200 width = 200></img><br><br><p class = "block-text">Press <strong>enter</strong> to continue.</p></div>'
	],
  key_forward: 13
};

var start_practice_block = {
  type: 'text',
  text: '<div class = centerbox><p class = block-text>We will start with some practice. Press <strong>enter</strong> to begin.</p></div>',
  cont_key: 13
};

var start_test_block = {
  type: 'text',
  text: '<div class = centerbox><p class = block-text>We will now start the test. Press <strong>enter</strong> to begin.</p></div>',
  cont_key: 13
};

/* define practice block */
var practice_block = {
  type: 'categorize',
  stimuli: practice_trials.image,
  is_html: true,
  key_answer: practice_response_array,
  correct_text: '<div class = centerbox><p class = center-text>Correct</p></div>',
  incorrect_text: '<div class = centerbox><p class = center-text>Incorrect</p></div>',
  timeout_message: '<div class = centerbox><p class = center-text>Response faster!</p></div>',
  choices: [49,50,51,52],
  data: practice_trials.data,
  timing_feedback_duration: 1000,
  show_stim_with_feedback: false,
  timing_post_trial: 500
}

/* define test block */
var test_block = {
  type: 'single-stim',
  stimuli: test_trials.image,
  is_html: true,
  data: test_trials.data,
  choices: [49,50,51,52],
  timing_post_trial: 500
};

/* create experiment definition array */
var local_global_experiment = [];
local_global_experiment.push(welcome_block);
local_global_experiment.push(instructions_block);
local_global_experiment.push(start_practice_block);
local_global_experiment.push(practice_block);
local_global_experiment.push(start_test_block);
local_global_experiment.push(test_block);


