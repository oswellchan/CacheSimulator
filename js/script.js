var READ = "Read ";
var WRITE = "Write ";
var DEL_BUTTON = '<div class="col-xs-1 btn-del-instr">'
					+'<button type="button" class="btn btn-danger">'
						+'<span class="glyphicon glyphicon-remove" aria-hidden="true"></span>'
					+'</button>'
				+'</div>';

var INSTRUCTION_ROW_HTML_1 = '<div class="row form-group instruction-entry">'
								+'<div class="col-xs-6">'
							   		+'<div class="input-group">'
							      		+'<div class="input-group-btn">'
								        	+'<button type="button" class="btn ';

var INSTRUCTION_ROW_HTML_2 = ' dropdown-toggle action" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">';

var INSTRUCTION_ROW_HTML_3 = '<span class="caret"></span></button>'
					        	+'<ul class="dropdown-menu">'
					       			+'<li><a href="#" onclick="return false;">' + READ + '</a></li>'
				        			+'<li><a href="#" onclick="return false;">' + WRITE + '</a></li>'
					       		+'</ul>'
				     		+'</div>'
				     		+'<input type="text" class="form-control instr-eq" name="instruction-eq" placeholder="e.g. i + 2"';

var INSTRUCTION_ROW_HTML_4 = '>'
			      			+'<span class="input-group-addon">* 4</span>'
				    	+'</div>'
					+'</div>'
					+'<div class="col-xs-4">'
						+'<div class="input-group">'
								+'<span class="input-group-addon">+</span>'
								+'<input type="number" class="form-control instr-base" placeholder="Base"';

var INSTRUCTION_ROW_HTML_5 = '>'
							+'<span class="input-group-addon">* 4</span>'
						+'</div>'
					+'</div>';

var INSTRUCTION_ROW_HTML_6 = '</div>';

var instr_array = new Array();

$( document ).ready(function() {

	//Variables
	var i_start = 1;
	var i_end = 5;
	var i_increment = 1;

	var numRow = 1;

	var firstInstr = {
    			type: READ,
    			expr: '',
    			base: ''
    		};

	instr_array.push(firstInstr);

	$(document).on('click', '#instr-modal-btn', function() {
		$("#i-start").val(i_start);
    	$("#i-end").val(i_end);
    	$("#i-increment").val(i_increment);

		$("#instructions-input").html('');
		numRow = instr_array.length;
		var target = $("#instructions-input");
		var isAddDel = numRow > 1;
		for (i = 0; i < numRow; i++) {
			var instr = instr_array[i];
			addInstructionRow(target, instr.type, instr.expr, instr.base, isAddDel);
		}
	});

	$(document).on('click', '.dropdown-menu li a', function() {
		if ($(this).text() === READ) {
			$(this).parents(".input-group-btn").children(".action").removeClass("btn-warning");
			$(this).parents(".input-group-btn").children(".action").addClass("btn-primary");
		}

		if ($(this).text() === WRITE) {
			$(this).parents(".input-group-btn").children(".action").removeClass("btn-primary");
			$(this).parents(".input-group-btn").children(".action").addClass("btn-warning");
		}
		$(this).parents(".input-group-btn").children(".action").html($(this).text()+'<span class="caret"></span>');
	});

 	$(document).on('click', '.btn-add-instr', function() {
 		if (numRow === 1) {
 			$('.instruction-entry').append(DEL_BUTTON);
 		}
 		var target = $("#instructions-input");
        addInstructionRow(target, READ, "", "", true);
        numRow++;
 	});

 	$(document).on('click', '.btn-del-instr', function() {
        $(this).parents(".instruction-entry").remove();
        if (--numRow < 2) {
        	var delButton = $('.btn-del-instr');
        	for (i=0; i < delButton.length; i++) {
        		delButton[i].remove();
        	}
        }
 	});

 	$(document).on('click', '.btn-save-instr', function() {
    	i_start = parseInt($("#i-start").val());
    	i_end = parseInt($("#i-end").val());
    	i_increment = parseInt($("#i-increment").val());

    	var instructions = $(".instruction-entry");

    	instr_array = new Array();
    	for (j = 0; j < instructions.length; j++) {
    		var instrType = $(instructions[j]).find(".action").text();
    		var eq = $(instructions[j]).find(".instr-eq").val();
    		var base = $(instructions[j]).find(".instr-base").val();
    		var instr = {
    			type: instrType,
    			expr: eq,
    			base: base
    		};
    		instr_array.push(instr);
    	}
 	});

 	$(document).on('click', '.btn-run-instr', function() {
    	i_start = parseInt($("#i-start").val());
    	i_end = parseInt($("#i-end").val());
    	i_increment = parseInt($("#i-increment").val());

    	var instructions = $(".instruction-entry");
    	instr_array = new Array();
    	for (j = 0; j < instructions.length; j++) {
    		var instrType = $(instructions[j]).find(".action").text();
    		var base = $(instructions[j]).find(".instr-base").val();
    		console.log("(" + $(instructions[j]).find(".instr-eq").val() + ") * 4 + " + base + " * 4");
    		var eq = math.compile("(" + $(instructions[j]).find(".instr-eq").val() + ") * 4 + " + base + " * 4");
    		var instr = {
    			type: instrType,
    			expr: eq
    		};
    		instr_array.push(instr);
    	}

    	for (k = i_start; k < i_end; k += i_increment) {
    		var output = "i = " + k + "<br>";
    		var scope = {
    			i: k
    		}
    		for (j = 0; j < instr_array.length; j++) {
    			var instr = instr_array[j];
    			output += (j + ": " + instr.type + " " + instr.expr.eval(scope) + "<br>");
    		}
    		output += "<br>";
    		$("#output").append(output);
    	}
 	});
});

function addInstructionRow(target, instrType, eq, base, isAddDel) {
	var htmlString = INSTRUCTION_ROW_HTML_1 
				+ getButtonType(instrType) 
				+ INSTRUCTION_ROW_HTML_2
				+ instrType
				+ INSTRUCTION_ROW_HTML_3
				+ getEq(eq)
				+ INSTRUCTION_ROW_HTML_4
				+ getBase(base)
				+ INSTRUCTION_ROW_HTML_5;

	if (isAddDel) {
		htmlString += DEL_BUTTON;
	}

	htmlString += INSTRUCTION_ROW_HTML_6;

	target.append(htmlString);
}

function getButtonType(instrType) {
	if (instrType === READ) {
		return 'btn-primary';
	}

	if (instrType === WRITE) {
		return 'btn-warning';
	}
}

function getEq(eq) {
	if (eq === '' || eq === undefined || eq === null) {
		return '';
	}

	return ' value="' + eq + '"';
}

function getBase(base) {
	if (base === '' || base === undefined || base === null) {
		return '';
	}

	return ' value="' + base + '"';
}