var instr_array;

$( document ).ready(function() {

	//Variables
	var i_start;
	var i_end;
	var i_increment;

	var numRow = 1;
	var READ = "Read ";
	var WRITE = "Write ";
	var DEL_BUTTON = '<div class="col-xs-1 btn-del-instr">'
						+'<button type="button" class="btn btn-danger">'
							+'<span class="glyphicon glyphicon-remove" aria-hidden="true"></span>'
						+'</button>'
					+'</div>';
	var INSTRUCTION_ROW_HTML = '<div class="row form-group instruction-entry">'
									+'<div class="col-xs-10">'
								   		+'<div class="input-group">'
								      		+'<div class="input-group-btn">'
									        	+'<button type="button" class="btn btn-primary dropdown-toggle action" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Read <span class="caret"></span></button>'
									        	+'<ul class="dropdown-menu">'
									       			+'<li><a href="#" onclick="return false;">Read </a></li>'
								        			+'<li><a href="#" onclick="return false;">Write </a></li>'
									       		+'</ul>'
								     		+'</div>'
								     		+'<input type="text" id="instr-eq" class="form-control" name="instruction-eq" placeholder="e.g. i + 2">'
							      			+'<span class="input-group-addon">* 4</span>'
								    	+'</div>'
									+'</div>'
									+ DEL_BUTTON
								+'</div>';

	$(document).on('click', '.dropdown-menu li a', function() {
		if ($(this).text() === READ) {
			$(this).parents(".input-group-btn").children(".action").removeClass("btn-warning");
			$(this).parents(".input-group-btn").children(".action").addClass("btn-primary");
		}

		if ($(this).text() === WRITE) {
			$(this).parents(".input-group-btn").children(".action").removeClass("btn-primary");
			$(this).parents(".input-group-btn").children(".action").addClass("btn-warning");
		}
		$(this).parents(".input-group-btn").children(".action").html($(this).text()+' <span class="caret"></span>');
	});

 	$(document).on('click', '.btn-add-instr', function() {
 		if (numRow === 1) {
 			$('.instruction-entry').append(DEL_BUTTON);
 		}
        $("#instructions-input").append(INSTRUCTION_ROW_HTML);
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

 	$(document).on('click', '.btn-run-instr', function() {
    	i_start = parseInt($("#i-start").val());
    	i_end = parseInt($("#i-end").val());
    	i_increment = parseInt($("#i-increment").val());

    	var instructions = $(".instruction-entry");
    	instr_array = new Array();
    	for (j = 0; j < instructions.length; j++) {
    		var instrType = $(instructions[j]).find(".action").text();
    		console.log("(" + $(instructions[j]).find("#instr-eq").val() + ") * 4");
    		var eq = math.compile("(" + $(instructions[j]).find("#instr-eq").val() + ") * 4");
    		var scope = {
    			i: 1
    		}
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