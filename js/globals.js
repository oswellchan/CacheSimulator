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

var VALID = 0;
var TAG = 1;
var WORD_OFFSET = 2;

var instr_array = new Array();
var processed_instr_array = new Array();
var environment;
