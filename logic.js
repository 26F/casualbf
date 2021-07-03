

// globals
var failcolor = "#160003";
var successcolor = " #00693b"
var coloruse = "#000000";

// char_or_num specifies whether to take an a character (0) or an integer (1)
// as input when the , instruction is hit
//
//
// target is a string if typeoft is 0
// target is a sequence of space separated integers 0 <= n <= 255
// if typeoft == 1
//
// char_limit lets you create a limit on how long the brainfuck string can be.
// 
var target; // the string which will be checked against the outout of the program. 
var typeoft; // whether the string consists of characters or numbers
var char_or_num; // whether to accept characters or integers under ,
var char_limit = 1000000; // char limit.

var casual_mode = false;

var problem_name = "";

function defineProblem(expected, solution_type, accept_char_or_num, name, limit_characters=1000000, casual=false) {
	target = expected;
	typeoft = solution_type;
	char_or_num = accept_char_or_num;
	char_limit = limit_characters;
	problem_name = name;
	casual_mode = casual;
}

function compare_strings(a, b) {
	if (a.length != b.length) {
		return false;
	}

	var c;
	for (c = 0; c < a.length; c++) {
		if (a[c] != b[c]) {
			return false;
		}
	}
	return true;
}

function strip_non_bf_chars(input_str) {
	var outputstr = "";

	var c;
	for (c = 0; c < input_str.length; c++) {
		var ch = input_str[c];

		if (ch == '+' || ch == '-') {
			outputstr += ch;
		}

		else if (ch == '<' || ch == '>') {
			outputstr += ch;
		}

		else if (ch == ',' || ch == '.') {
			outputstr += ch;
		}

		else if (ch == '[' || ch == ']') {
			outputstr += ch;
		}
	}
	return outputstr;
}

function stripnlchar(string) {
	var newstr = "";
	var c;
	for (c = 0; c < string.length; c++) {
		if (string.charAt(c) != '\n') {
			newstr += string.charAt(c);
		}
	}
	return newstr;
}

// 0 for char, 1 for num
function brainfuck_interpreter(input_str, char_or_num) {
	var input_stream = "";
	// initialize tape with 30000 cells
	var tape = new Array(30000);

	var take_chunk_input = false;

	// zero all cells
	var c;
	for (c = 0; c < tape.length; c++) {
		tape[c] = 0;
	}

	// output string returned 
	// so that numeric values can be 
	// made from it later.
	var output_str = "";

	var cur_cell = 0;
	var cur_instruction = 0;

	// check if brackets match
	var start_bracket = 0;
	var num_brackets = 0;

	for (cur_instruction = 0; cur_instruction < input_str.length; cur_instruction++) {
		if (input_str[cur_instruction] == ']') {
			if (start_bracket >= 0) {
				start_bracket--;
			}
		}
		else if (input_str[cur_instruction] == '[') {
			num_brackets++;
			start_bracket++;
		}
	}

	if (start_bracket != 0) {
		alert("Brackets do not match!");
		return undefined;
	}


	var go2   = new Array(input_str.length);
	var skip2 = new Array(input_str.length);

	 // populate skip2
	 var x, y;
	 
	 for (x = 0; x < input_str.length; x++) {
	 	if (input_str[x] == '[') {
	 		start_bracket = 1;
	 		for (y = x + 1; y < input_str.length; y++) {
	 			if (input_str[y] == '[') {
	 				start_bracket++;
	 			}
	 			else if (input_str[y] == ']') 
	 			{
	 				start_bracket--;
	 			}
	 			if (start_bracket == 0) {
	 				skip2[x] = y;
	 				break;
	 			}
	 		}
	 	}
	 }

	 // populate go2
	 start_bracket = 0;
	 for (x = input_str.length - 1; x >= 0; x--) {
	 	if (input_str[x] == ']') {
	 		start_bracket = 1;
	 		for (y = x - 1; y >= 0; y--) {
	 			if (input_str[y] == ']') {
	 				start_bracket++;
	 			}
	 			else if (input_str[y] == '[') {
	 				start_bracket--;
	 			}
	 			if (start_bracket == 0) {
	 				go2[x] = y;
	 				break;
	 			}
	 		}
	 	}
	 }

	 cur_instruction = 0;

	 // iterations limit
	 kill_after_iterations = 100000000;
	 iterations = 0;

	 while (cur_instruction < input_str.length) {
	 	if (input_str[cur_instruction] == '+') {
	 		tape[cur_cell]++;
	 		if (tape[cur_cell] >= 256) {
	 			tape[cur_cell] = 0;
	 		}
	 	}
	 	else if (input_str[cur_instruction] == '-') {
	 		tape[cur_cell]--;
	 		if (tape[cur_cell] < 0) {
	 			tape[cur_cell] = 255;
	 		}
	 	}
	 	else if (input_str[cur_instruction] == '<') {
	 		if (cur_cell - 1 < 0) {
	 			cur_cell = tape.length - 1;
	 		}
	 		else
	 		{
	 			cur_cell--;
	 		}
	 	}
	 	else if (input_str[cur_instruction] == '>') {
	 		if (cur_cell + 1 >= tape.length) {
	 			cur_cell = 0;
	 		}
	 		else
	 		{
	 			cur_cell++;
	 		}
	 	}
	 	else if (input_str[cur_instruction] == '.') {
	 		var ch = String.fromCharCode(tape[cur_cell]);
	 		output_str += ch 
	 		document.getElementById("outstr").value += ch;
	 	}
	 	else if (input_str[cur_instruction] == ',') {

	 		if (char_or_num == 1) {
	 			var inputch = prompt("Type a number between 0 and 255 inclusive");
		 		var integer = parseInt(inputch);

		 		if (integer != NaN) {
		 			if (integer > 255) {
		 				integer = 0;
		 			}
		 			else if (integer < 0) {
		 				integer = 255;
		 			}

		 			tape[cur_cell] = integer;
		 		}
		 		else
		 		{
		 			return;
		 		}
	 		}
	 		else
	 		{	

	 			if (input_stream.length == 0 && !take_chunk_input) {
	 				input_stream = prompt("type input string: ");
	 				if (input_stream.length >= 2) {
	 					input_stream += '\n';
	 					take_chunk_input = true;
	 				}
	 				else
	 				{
	 					var addnewline = confirm("append newline character?\nsome brainfuck programs may require this.");
	 					if (addnewline) {
	 						input_stream += '\n';
	 					}
	 				}
	 			}

	 			if (take_chunk_input) {
	 				var ch = input_stream.charAt(0);
	 				var valu = ch.charCodeAt(0);
	 				tape[cur_cell] = valu;
	 				input_stream = input_stream.substr(1);

	 				if (input_stream.length == 0) {
	 					take_chunk_input = false;
	 				}
	 			}
	 			else
	 			{
	 				var ch = input_stream.charAt(0);
	 				var valu = ch.charCodeAt(0);
	 				tape[cur_cell] = valu;
	 				input_stream = input_stream.substr(1);

	 				// if (input_stream === '\n') {
	 				// 	input_stream = "";
	 				// }
	 			}

	 		}

	 	}
	 	else if (input_str[cur_instruction] == '[') {
	 		if (tape[cur_cell] == 0) {
	 			cur_instruction = skip2[cur_instruction];
	 		}
	 	}
	 	else if (input_str[cur_instruction] == ']') {
	 		if (tape[cur_cell] != 0) {
	 			cur_instruction = go2[cur_instruction];
	 		}
	 	}

	 	cur_instruction++;
	 	iterations++;


	 	if (iterations >= kill_after_iterations) {
	 		alert("Iterations limit exceeded");
	 		return;
	 	}

	 }
	 return output_str;
}

function populate_ints_output(output) {
	var c;
	var instr = ""

	for (c = 0; c < output.length; c++) {
		var add = " "
		if (c == output.length - 1) {
			add = ""
		}
		instr += output.charCodeAt(c) + add;
	}
	return instr;
}


function attempt() {
		var inputstr = document.getElementById("bfinput").value;
		document.getElementById("outstr").value = "";

		var success = false;

		// string non brainfuck characters
		inputstr = strip_non_bf_chars(inputstr);

		// char limit exceeded
		var char_limit_exceeded = inputstr.length > char_limit;

		var output = undefined;

		if (!char_limit_exceeded && !casual_mode) {

			output = brainfuck_interpreter(inputstr, char_or_num);

			// if (output != undefined) {
			// 	document.getElementById("outputtext").innerHTML = output;	
			// }

			instr = populate_ints_output(output);
			
		}
		else if (!casual_mode)
		{	
			alert("You have exceeded the character limit for this problem.")
			instr = "";
		}
		else
		{
			// casual mode
			output = brainfuck_interpreter(inputstr, char_or_num);
			if (output != undefined) {
				document.getElementById("outstr").innerHTML = output;
				instr = populate_ints_output(output);
			}
			
		}
		

		if (typeoft == 0 && !casual_mode) {
			if (compare_strings(output, target) && !char_limit_exceeded) {
				coloruse = successcolor;
				document.body.style.backgroundImage = "url('bg_win.jpg')";
				success = true;
			}
			else
			{
				coloruse = failcolor;
				document.body.style.backgroundImage = "url('bg_dark.jpg')";
			}
		}
		else if (!casual_mode)
		{
			if (instr == target && !char_limit_exceeded) {
				coloruse = successcolor;
				document.body.style.backgroundImage = "url('bg_win.jpg')";
				success = true;	
			}
			else {
				coloruse = failcolor;
				document.body.style.backgroundImage = "url('bg_dark.jpg')";
			}
		}

		document.getElementById("intsout").value = instr;
		document.getElementById("intsout").style.backgroundColor = coloruse;
		document.getElementById("outstr").style.backgroundColor = coloruse;

		// if (success) {
		// 	document.getElementById("bfinput").value += "\n\nNext challenge: 12389102839101920e1";
		// }
}