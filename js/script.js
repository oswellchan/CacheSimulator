$( document ).ready(function() {
	//Initialising default variables
	//For instructions
	var i_start = 1;
	var i_end =8;
	var i_increment = 1;
	var numRow = 1;

	var firstInstr = {
    			type: READ,
    			expr: 'i + 2',
    			base: '2'
    		};

	instr_array.push(firstInstr);

	//For memory variables
	var mem_size = 1600;
	var block_size = 4;
	var cache_size = 64;
	var n_way = 2;
	var isDirectMap = true;
	var isNway = false;
	var isFullAssoc = false;
	var isLRU = true;
	var isSecondChoice = false;


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

	$(document).on('click', '#conf-mem-btn', function() {
		$("#mem-size").val(mem_size);
    	$("#mem-block-size").val(block_size);
    	$("#cache-size").val(cache_size);
    	$("#n-way-size").val(n_way);

    	if (isDirectMap) {
    		$("#direct-map").prop("checked", true);
    	}

    	if (isNway) {
    		$("#n-way").prop("checked", true);
    	}

    	if (isFullAssoc) {
    		$("#full-assoc").prop("checked", true);
    	}
    	
    	if (isLRU) {
    		$("#lru").prop("checked", true);
    	}

    	if (isSecondChoice) {
    		$("#second-choice").prop("checked", true);
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

 	$(document).on('click', '#btn-save-mem-conf', function() {
		mem_size = $("#mem-size").val();
    	block_size = $("#mem-block-size").val();
    	cache_size = $("#cache-size").val();
    	n_way = $("#n-way-size").val();

    	if ($("#direct-map").prop("checked")) {
    		isDirectMap = true;
    		isNway = false;
    		isFullAssoc = false;
    	}

    	if ($("#n-way").prop("checked")) {
    		isNway = true;
    		isDirectMap = false;
    		isFullAssoc = false;
    	}

    	if ($("#full-assoc").prop("checked")) {
    		isFullAssoc = true;
    		isNway = false;
    		isDirectMap = false;
    	}

    	if ($("#lru").prop("checked")) {
    		isLRU = true;
    		isSecondChoice = false;
    	}

    	if ($("#second-choice").prop("checked")) {
    		isSecondChoice = true;
    		isLRU = false;
    	}
	});

 	$(document).on('click', '.btn-run-instr', function() {
    	var compiled_instr_array = new Array();
    	for (i = 0; i< instr_array.length; i++) {
            var instr = instr_array[i];
    		var eq = math.compile("(" + instr.expr + ") * 4 + (" + instr.base + " * 4)");
    		var compiled_instr = {
    			type: instr.type,
    			compiledEq: eq
    		};
    		compiled_instr_array.push(compiled_instr);
    	}

        var count = 0;
        for (i = i_start; i <= i_end; i += i_increment) {
            var loop = new Array();
            for (j = 0; j < compiled_instr_array.length; j++) {
                var compiled_instr = compiled_instr_array[j];
                var scope = {i: i};
                var eval_instr = {
                    type: compiled_instr.type,
                    address: compiled_instr.compiledEq.eval(scope)
                };
                loop.push(eval_instr);
            }
            processed_instr_array[count] = loop;
            count++;
        }

        $('#display').html('<svg class="center" width="1000" height="740"></svg>');
        environment = createEnvironment(mem_size, block_size, cache_size, n_way, isDirectMap, isNway, isFullAssoc, isLRU, isSecondChoice, processed_instr_array);
        environment.intialise();
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