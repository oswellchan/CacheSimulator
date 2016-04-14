var VALID = 0;
var TAG = 1;
var WORD_OFFSET = 2;

$( document ).ready(function() {
	$("body").on("mouseenter", "#instr-header-0", function() {
		$(this).addClass("highlight");
		$("#instr-address-0").addClass("highlight");
	});

	$("body").on("mouseleave", "#instr-header-0", function() {
		$(this).removeClass("highlight");
		$("#instr-address-0").removeClass("highlight");
	});

	$("body").on("mouseenter", "#instr-address-0", function() {
		$(this).addClass("highlight");
		$("#instr-header-0").addClass("highlight");
	});

	$("body").on("mouseleave", "#instr-address-0", function() {
		$(this).removeClass("highlight");
		$("#instr-header-0").removeClass("highlight");
	});

	$("svg").on("click", "#instr-header-0", function(obj) {

	});
});

function createEnvironment(mem_size, block_size, cache_size, n_way, isDirectMap, isNway, isFullAssoc, isLRU, isSecondChoice, processed_instr_array) {

	var cache = createCache(block_size, cache_size, n_way, isDirectMap, isNway, isFullAssoc, isLRU, isSecondChoice);

	var env = {
		memory: mem_size,
		blockSize: block_size,
		cache: cache,
		instructions: processed_instr_array,
		instr_index: 0,
		intialise: function () {
			showInstructionsQueue(this.instructions, this.instr_index);
		}
	}

	return env;
}

function createCache(block_size, cache_size, n_way, isDirectMap, isNway, isFullAssoc, isLRU, isSecondChoice) {
	var way = n_way;
	var slots = cache_size / (block_size);
	var wordPerSlot = block_size / 4;
	var cacheRepresentation = new Array();

	if (isNway) {
		var numSets = slots/n_way;
		for (i = 0; i < numSets; i++) {
			var set = new Array();
			for (j = 0; j < n_way; j++) {
				var row = new Array();
				for (k = 0; k < wordPerSlot + 2; k++) {
					row.push(0);
				}
				set.push(row);
			}
			cacheRepresentation[i] = set;
		}
	} else {
		way = -1;
		for (i = 0; i < slots; i++) {
			var row = new Array();
			for (j = 0; j < wordPerSlot + 2; j++) {
				row.push(0);
			}
			cacheRepresentation[i] = row;
		}
	}

	var cache = {
		blockSize: block_size,
		size: cache_size,
		nWay: way, //flag to check if nWay
		isDirectMap: isDirectMap, //flag to check if direct or fullassoc
		isLRU: isLRU,
		cache: cacheRepresentation
	}

	return cache;
}

function showInstructionsQueue(instructions, index) {
	var svg = $('svg');
	var height = svg.height();
	var width = svg.width();
	var padding = 20;

	var cellHeight = 32;
	var cellWidth = 80;

	var dataType = new Array();
	var dataAddress = new Array();
	var count = 0;

	for (i = index; i < instructions.length; i++) {

		var loop = instructions[i];

		for (j = 0; j < loop.length; j++) {
			dataType.push(instructions[i][j].type + "");
			dataAddress.push(instructions[i][j].address);
			count++;

			if (count >= 6) {
				dataType.push("-");
				dataAddress.push("...");
				break;
			}
		}

		if (count >= 6) {
			break;
		}
	}

	var offsetX = width - (dataType.length * cellWidth + padding);
	var offsetY = height - (cellHeight*2 + padding);

	// create a selection for the container with a static 1-element array
	var queueContainer = d3.select("svg").selectAll(".instructions")
    				.data([0]); 

	// now add it if it doesn't exist
	var instructionsQueue = queueContainer.enter().append('g')
							.attr('class', 'instructions')
							.attr('transform', "translate(" + offsetX  + "," + offsetY + ")");

	var cellHeader = instructionsQueue.selectAll("instr-header")
	      .data(dataType);

	var headerEntered = cellHeader.enter();

	headerEntered.append("rect")
	      .attr("x", function(d, i) { return (i * cellWidth); })
	      .attr("y", 0)
	      .attr("width", cellWidth)
	      .attr("height", cellHeight)
	      .attr("class", function(d) { return d === "-" ?  "instr-header" : "instr-" + d; } )
	      .attr("id", function(d, i) { return "instr-header-" + i; } );

	headerEntered.append("text")
	      .attr("x", function(d, i) { return ((i + 0.5) * cellWidth) })
	      .attr("y", cellHeight / 2)
	      .attr("dy", ".35em")
	      .text( function(d) { return d; } );

	cellHeader.exit().remove();

	var cellContent= instructionsQueue.selectAll("instr-address")
	      .data(dataAddress);

	var contentEntered = cellContent.enter();

	contentEntered.append("rect")
	      .attr("x", function(d, i) { return (i * cellWidth); })
	      .attr("y", cellHeight)
	      .attr("width", cellWidth)
	      .attr("height", cellHeight)
	      .classed("instr-address", true)
	      .attr("id", function(d, i) { return "instr-address-" + i; } );

	contentEntered.append("text")
	      .attr("x", function(d, i) { return ((i + 0.5) * cellWidth) })
	      .attr("y", cellHeight * 3/ 2)
	      .attr("dy", ".35em")
	      .text( function(d) { return d; } );

	cellContent.exit().remove();
}