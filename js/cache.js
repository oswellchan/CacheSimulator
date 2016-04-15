$( document ).ready(function() {
	initialiseFirstElementMouseOver();
	initialiseFirstElementClick();
	initialiseCacheRowMouseOver();
});

function createEnvironment(mem_size, block_size, cache_size, n_way, isDirectMap, isNway, isFullAssoc, isLRU, isSecondChoice, processed_instr_array) {

	var cache = createCache(block_size, cache_size, n_way, isDirectMap, isNway, isFullAssoc, isLRU, isSecondChoice);

	var env = {
		memory: parseInt(mem_size),
		blockSize: parseInt(block_size),
		cache: cache,
		instructions: processed_instr_array,
		instr_index: 0,
		isExecuting: false,
		longestLength: dec2bin(parseInt(mem_size)).length,
		intialise: function () {
			showInstructionsQueue(this.instructions, this.instr_index);
			showCache(cache);
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
		var moreThanSevenLeft = instructions.length - index - 1 > 6;

		for (j = 0; j < loop.length; j++) {
			dataType.push(instructions[i][j].type + "");
			dataAddress.push(instructions[i][j].address);
			count++;

			if (count >= 6 && moreThanSevenLeft) {
				dataType.push("-");
				dataAddress.push("...");
				break;
			}
		}

		if (count >= 6 && moreThanSevenLeft) {
			break;
		}
	}

	var offsetX = width - (dataType.length * cellWidth + padding);
	var offsetY = height - (cellHeight*2 + padding);

	// create a selection for the container with a static 1-element array
	var queueContainer = d3.select("svg").selectAll("#instructions-queue")
    				.data([0]); 

	// now add it if it doesn't exist
	var instructionsQueue = queueContainer.enter().append('g')
							.attr('id', 'instructions-queue')
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
	      .text( function(d) { return d; } )
	      .attr("id", function(d, i) { return "instr-header-text-" + i; } );

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
	      .text( function(d) { return d; } )
	      .attr("id", function(d, i) { return "instr-address-text-" + i; } );

	cellContent.exit().remove();
}

function showCache(cache) {
	var svg = $('svg');
	var height = svg.height();
	var width = svg.width();
	var padding = 20;

	var cellHeight = 32;
	var cellWidth = 50;
	var cacheHeaders = ["Index"];

	var cols = cache.nWay === -1 ? 1 : cache.nWay

	for (i = 0; i < cols; i++) {
		cacheHeaders.push("Valid", "Tag");
		for (j = 0; j < cache.blockSize / 4; j++) {
			cacheHeaders.push("Word" + j);
		}
	}

	var data = new Array();
	var indexCol = new Array();
	var cacheRepresentation = cache.cache;

	//is n-way
	if (cache.nWay > 0) {
		for (i = 0; i < cacheRepresentation.length; i++) {
			var dataRow = [];
			for (j = 0; j < cacheRepresentation[i].length; j++) {
				for (k = 0; k < cacheRepresentation[i][j].length; k++) {
					dataRow.push(cacheRepresentation[i][j][k]);
				}
			}
			data.push(dataRow);
			indexCol.push(i);
		}
	} else {
		for (i = 0; i < cacheRepresentation.length; i++) {
			var dataRow = [];
			for (j = 0; j < cacheRepresentation[i].length; j++) {
				dataRow.push(cacheRepresentation[i][j]);
			}
			data.push(dataRow);
			indexCol.push(i);
		}
	}

	var offsetX = width - (cacheHeaders.length * cellWidth + padding);
	var offsetY = padding;

	// create a selection for the container with a static 1-element array
	var cacheContainer = d3.select("svg").selectAll("#cache")
    				.data([0]);

	// now add it if it doesn't exist
	var cacheTable = cacheContainer.enter().append('g')
							.attr('id', 'cache')
							.attr('transform', "translate(" + offsetX  + "," + offsetY + ")");

	var headerOffset = 0;
	if (cache.nWay > 1) {
		var blockData = new Array();
		for (i = 0; i < cache.nWay; i++) {
			blockData.push("Block " + i);
		}

		var blockHeaders = cacheTable.selectAll("block-header")
		      .data(blockData);

		var headerEntered = blockHeaders.enter();

		headerEntered.append("rect")
		      .attr("x", function(d, i) { return (i * (2 + cache.blockSize / 4) * cellWidth) + cellWidth; })
		      .attr("y", (headerOffset) * cellHeight)
		      .attr("width", cellWidth* (2 + cache.blockSize / 4))
		      .attr("height", cellHeight)
		      .attr("class", "block-header");

		headerEntered.append("text")
		      .attr("x", function(d, i) { return ((2 + cache.blockSize / 4) *  (i + 0.5) * cellWidth) + cellWidth })
		      .attr("y", cellHeight * (headerOffset + 0.5))
		      .attr("dy", ".35em")
		      .text( function(d) { return d; } )
		      .attr("class", "block-header-text");

		blockHeaders.exit().remove();
		headerOffset++;
	}	

	var cHeaders = cacheTable.selectAll("cache-header")
	      .data(cacheHeaders);

	var headerEntered = cHeaders.enter();

	headerEntered.append("rect")
	      .attr("x", function(d, i) { return (i * cellWidth); })
	      .attr("y", cellHeight * (headerOffset))
	      .attr("width", cellWidth)
	      .attr("height", cellHeight)
	      .attr("class", function(d) { return "cache-header"; } );

	headerEntered.append("text")
	      .attr("x", function(d, i) { return ((i + 0.5) * cellWidth) })
	      .attr("y", cellHeight * (headerOffset + 0.5))
	      .attr("dy", ".35em")
	      .text( function(d) { return d; } )
	      .attr("class", function(d, i) { return "cache-header-text-" + i; } );

	cHeaders.exit().remove();

	headerOffset++;

	var indices = cacheTable.selectAll("cache-index")
	      .data(indexCol);

	var indicesEntered = indices.enter();

	indicesEntered.append("rect")
	      .attr("x", 0)
	      .attr("y", function(d, i) { return (i + headerOffset) * cellHeight; })
	      .attr("width", cellWidth)
	      .attr("height", cellHeight)
	      .attr("class", function(d, i) { return "cache-data cache-data-" + i; });

	indicesEntered.append("text")
	      .attr("x", 0.5 * cellWidth)
	      .attr("y", function(d, i) { return (i + headerOffset + 0.5) * cellHeight; })
	      .attr("dy", ".35em")
	      .attr("class", function(d, i) { return "cache-data-text cache-data-text-" + i; })
	      .text( function(d) { return d; } );

	indices.exit().remove();
 
 	for(j = 0; j < data.length; j++) {
 		var dataRow = cacheTable.selectAll("cache-data-" + j)
		      .data(data[j]);

		var dataRowEntered = dataRow.enter();

		dataRowEntered.append("rect")
		      .attr("x", function(d, i) { return ((i + 1) * cellWidth); })
		      .attr("y", (j + headerOffset) * cellHeight)
		      .attr("width", cellWidth)
		      .attr("height", cellHeight)
		      .attr("class", function(d, i) { return "cache-data cache-data-" + j; } );

		dataRowEntered.append("text")
		      .attr("x", function(d, i) { return ((i + 1.5) * cellWidth) })
		      .attr("y", (j + headerOffset + 1/2)  * cellHeight)
		      .attr("dy", ".35em")
		      .text( function(d) { return d; } )
		      .attr("class", function(d, i) { return "cache-data-text cache-data-text-" + j; } );

		dataRow.exit().remove();
 	}
}

function initialiseFirstElementMouseOver(){
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

	$("body").on("mouseenter", "#instr-address-text-0", function() {
		$("#instr-address-0").addClass("highlight");
		$("#instr-header-0").addClass("highlight");
	});

	$("body").on("mouseleave", "#instr-address-text-0", function() {
		$("#instr-address-0").removeClass("highlight");
		$("#instr-header-0").removeClass("highlight");
	});

	$("body").on("mouseenter", "#instr-header-text-0", function() {
		$("#instr-address-0").addClass("highlight");
		$("#instr-header-0").addClass("highlight");
	});

	$("body").on("mouseleave", "#instr-header-text-0", function() {
		$("#instr-address-0").removeClass("highlight");
		$("#instr-header-0").removeClass("highlight");
	});
}

function initialiseFirstElementClick(){
	$("body").on("click", "#instr-header-0", function() {
		if (environment.isExecuting) {
			return;
		}
		triggerInstructionExecution();	
	});

	$("body").on("click", "#instr-address-0", function() {
		if (environment.isExecuting) {
			return;
		}
		triggerInstructionExecution();
	});

	$("body").on("click", "#instr-address-text-0", function() {
		if (environment.isExecuting) {
			return;
		}
		triggerInstructionExecution();
	});

	$("body").on("click", "#instr-header-text-0", function() {
		if (environment.isExecuting) {
			return;
		}
		triggerInstructionExecution();
	});
}

function initialiseCacheRowMouseOver() {
	$("body").on("mouseenter", ".cache-data", function() {
		var classString = $(this).attr("class");
		var classArray = classString.split(" ");
		var targetClass = "";

		for (i = 0; i < classArray.length; i++) {
			if (classArray[i] !== "cache-data") {
				targetClass = classArray[i];
			}
		}

		if (targetClass === "") {
			return;
		}

		var row = $("." + targetClass);

		for (i = 0; i < row.length; i++) {
			$(row[i]).addClass("highlight");
		}
	});

	$("body").on("mouseleave", ".cache-data", function() {
		var classString = $(this).attr("class");
		var classArray = classString.split(" ");
		var targetClass = "";

		for (i = 0; i < classArray.length; i++) {
			if (classArray[i] !== "cache-data") {
				targetClass = classArray[i];
			}
		}

		if (targetClass === "") {
			return;
		}

		var row = $("." + targetClass);

		for (i = 0; i < row.length; i++) {
			$(row[i]).removeClass("highlight");
		}
	});

	$("body").on("mouseenter", ".cache-data-text", function() {
		var classString = $(this).attr("class");
		var classArray = classString.split(" ");
		var targetClass = "";

		for (i = 0; i < classArray.length; i++) {
			if (classArray[i] !== "cache-data-text") {
				var array = classArray[i].split("-");
				if (array.length > 1) {
					targetClass = "cache-data-" + array[array.length - 1];
				}
			}
		}

		if (targetClass === "") {
			return;
		}

		var row = $("." + targetClass);

		for (i = 0; i < row.length; i++) {
			$(row[i]).addClass("highlight");
		}
	});

	$("body").on("mouseleave", ".cache-data-text", function() {
		var classString = $(this).attr("class");
		var classArray = classString.split(" ");
		var targetClass = "";

		for (i = 0; i < classArray.length; i++) {
			if (classArray[i] !== "cache-data-text") {
				var array = classArray[i].split("-");
				if (array.length > 1) {
					targetClass = "cache-data-" + array[array.length - 1];
				}
			}
		}

		if (targetClass === "") {
			return;
		}

		var row = $("." + targetClass);

		for (i = 0; i < row.length; i++) {
			$(row[i]).removeClass("highlight");
		}
	});
}

function triggerInstructionExecution() {
	environment.isExecuting = true;
	var type = $("#instr-header-text-0").text();
	var address = $("#instr-address-text-0").text();

	executeInstruction(type, parseInt(address));
	$("#instructions-queue").remove();
	environment.isExecuting = false;
	environment.instr_index++;
	showInstructionsQueue(environment.instructions, environment.instr_index);
}	

function executeInstruction(type, address) {
	var binAddress = dec2binWithPadding(address, environment.longestLength);
	
	var offsetIndex = getPowerOf2(environment.blockSize);
	var indexIndex = getPowerOf2(environment.cache.size / environment.blockSize);
	var tagIndex = environment.longestLength - offsetIndex - indexIndex;

	var tag = binAddress.substring(0, tagIndex);
	var index = binAddress.substring(tagIndex, tagIndex + indexIndex);
	var offset = binAddress.substring(tagIndex + indexIndex, environment.longestLength);

	var addressInBin = [tag, index, offset];

	displayInstruction(binAddress, addressInBin);
	animateInstruction();
	activateInstruction();
}

function displayInstruction(binAddress, addressInBin) {
	var svg = $('svg');
	var height = svg.height();
	var width = svg.width();
	var padding = 20;

	var cellHeight = 32;
	var cellWidth = 30;

	var offsetX = padding;
	var offsetY = 148 + 250;

	var data = binAddress.split('');

	// create a selection for the container with a static 1-element array
	var instrContainer = d3.select("svg").selectAll("#instruction")
    				.data([0]);

	// now add it if it doesn't exist
	var instruction = instrContainer.enter().append('g')
							.attr('id', 'instruction')
							.attr('transform', "translate(" + offsetX  + "," + offsetY + ")");

	var instructionCells = instruction.selectAll(".instruction-cell")
	      .data(data);

	var instrEntered = instructionCells.enter();

	instrEntered.append("rect")
	      .attr("x", function(d, i) { return i * cellWidth; })
	      .attr("y", 50 + cellHeight)
	      .attr("width", cellWidth)
	      .attr("height", cellHeight)
	      .attr("class", "instr-cell")
	      .attr("opacity", 0);

	instrEntered.append("text")
	      .attr("x", function(d, i) { return (i +  0.5) * cellWidth})
	      .attr("y", 50 + 1.5 * cellHeight)
	      .attr("dy", ".35em")
	      .text( function(d) { return d; } )
	      .attr("class", "instr-cell-text")
	      .attr("opacity", 0);

	 var offsetHeaderX = 0;

	instruction.append("rect")
	      .attr("x", offsetHeaderX)
	      .attr("y", 50)
	      .attr("width", addressInBin[0].length * cellWidth)
	      .attr("height", cellHeight)
	      .attr("class", "instr-cell-header")
	      .attr("opacity", 0);

	instruction.append("text")
		.attr("x", (addressInBin[0].length * cellWidth) / 2)
		.attr("y", 50 + 0.5 * cellHeight)
		.attr("dy", ".35em")
		.text("Tag")
		.attr("class", "instr-cell-header-text")
		.attr("opacity", 0);

	instruction.append("rect")
	      .attr("x", offsetHeaderX)
	      .attr("y", 50 + cellHeight * 2)
	      .attr("width", addressInBin[0].length * cellWidth)
	      .attr("height", cellHeight)
	      .attr("class", "instr-value")
	      .attr("id", "instr-tag")
	      .attr("opacity", 0);

	instruction.append("text")
		.attr("x", (addressInBin[0].length * cellWidth) / 2)
		.attr("y", 50 + 2.5 * cellHeight)
		.attr("dy", ".35em")
		.text(bin2dec(addressInBin[0]))
		.attr("class", "instr-value-text")
		.attr("opacity", 0);

	offsetHeaderX += addressInBin[0].length * cellWidth;

	instruction.append("rect")
	      .attr("x", offsetHeaderX)
	      .attr("y", 50)
	      .attr("width", addressInBin[1].length * cellWidth)
	      .attr("height", cellHeight)
	      .attr("class", "instr-cell-header")
	      .attr("opacity", 0);

	instruction.append("text")
		.attr("x", offsetHeaderX + (addressInBin[1].length * cellWidth) / 2)
		.attr("y", 50 + 0.5 * cellHeight)
		.attr("dy", ".35em")
		.text("Index")
		.attr("class", "instr-cell-header-text")
		.attr("opacity", 0);

	instruction.append("rect")
	      .attr("x", offsetHeaderX)
	      .attr("y", 50 + cellHeight * 2)
	      .attr("width", addressInBin[1].length * cellWidth)
	      .attr("height", cellHeight)
	      .attr("class", "instr-value")
	      .attr("opacity", 0);

	instruction.append("text")
		.attr("x", offsetHeaderX + (addressInBin[1].length * cellWidth) / 2)
		.attr("y", 50 + 2.5 * cellHeight)
		.attr("dy", ".35em")
		.text(bin2dec(addressInBin[1]))
		.attr("class", "instr-value-text")
		.attr("id", "instr-index")
		.attr("opacity", 0);

	offsetHeaderX += addressInBin[1].length * cellWidth;

	instruction.append("rect")
	      .attr("x", offsetHeaderX)
	      .attr("y", 50)
	      .attr("width", addressInBin[2].length * cellWidth)
	      .attr("height", cellHeight)
	      .attr("class", "instr-cell-header")
	      .attr("opacity", 0);

	instruction.append("text")
		.attr("x", offsetHeaderX + (addressInBin[2].length * cellWidth) / 2)
		.attr("y", 50 + 0.5 * cellHeight)
		.attr("dy", ".35em")
		.text("Offset")
		.attr("class", "instr-cell-header-text")
		.attr("opacity", 0);

	instruction.append("rect")
	      .attr("x", offsetHeaderX)
	      .attr("y", 50 + cellHeight * 2)
	      .attr("width", addressInBin[2].length * cellWidth)
	      .attr("height", cellHeight)
	      .attr("class", "instr-value")
	      .attr("opacity", 0);

	instruction.append("text")
		.attr("x", offsetHeaderX + (addressInBin[2].length * cellWidth) / 2)
		.attr("y", 50 + 2.5 * cellHeight)
		.attr("dy", ".35em")
		.text(bin2dec(addressInBin[2]))
		.attr("class", "instr-value-text")
		.attr("id", "instr-offset")
		.attr("opacity", 0);

	var textOffset = "Offset = log2(Block Size) = log2(" + environment.blockSize + ") = log2(2^" + addressInBin[2].length + ") = " + addressInBin[2].length;
	var textIndex = "Index = log2(Cache Size / Block Size) = log2(" + environment.cache.size + " / " + environment.blockSize + ") = log2(2^" + addressInBin[1].length + ") = " + addressInBin[1].length;
	var textTag = "Tag = log2(Memory Size) - Offset - Index = log2(" + environment.memory +") - " + addressInBin[2].length + " - " + addressInBin[1].length + " = " + addressInBin[0].length;

	instruction.append("text")
		.attr("x", 0)
		.attr("y", 0)
		.text(textOffset)
		.attr("class", "working")
		.attr("opacity", 0);

	instruction.append("text")
		.attr("x", 0)
		.attr("y", 20)
		.text(textIndex)
		.attr("class", "working")
		.attr("opacity", 0);

	instruction.append("text")
		.attr("x", 0)
		.attr("y", 40)
		.text(textTag)
		.attr("class", "working")
		.attr("opacity", 0);

	instructionCells.exit().remove();
}

function animateInstruction() {
	d3.select("svg").select("#instruction").selectAll(".instr-cell")
		.transition()
		.attr("opacity", 1);

	d3.select("svg").select("#instruction").selectAll(".instr-cell-text")
		.transition()
		.attr("opacity", 1);

	d3.select("svg").select("#instruction").selectAll(".working")
		.transition()
		.attr("opacity", 1);

	d3.select("svg").select("#instruction").selectAll(".instr-cell-header")
		.transition()
		.attr("opacity", 1)
		.delay(500);

	d3.select("svg").select("#instruction").selectAll(".instr-cell-header-text")
		.transition()
		.attr("opacity", 1)
		.delay(500);

	d3.select("svg").select("#instruction").selectAll(".instr-value")
		.transition()
		.attr("opacity", 1)
		.delay(1000);

	d3.select("svg").select("#instruction").selectAll(".instr-value-text")
		.transition()
		.attr("opacity", 1)
		.delay(1000);
}

function activateInstruction() {
	var index = parseInt($("#instr-index").text());
	var tag = parseInt($("#instr-tag").text());
	var offset = parseInt($("#instr-offset").text());
	var cache = environment.cache.cache;
	var set = cache[index];

	var cacheTag;
	var cacheValid;

	if (cache.nWay < 1) {
		cacheValid = set[VALID];
		cacheTag = set[TAG];
	}

	//highlight index

	//highlight valid

	//highlight tag
	if (cacheTag === tag) {
		
	}

	//highlight word
}

function dec2bin(dec){
    return (dec >>> 0).toString(2);
}

function dec2binWithPadding(dec, length) {
	var parsed = dec2bin(dec);
	while (parsed.length < length) {
		parsed = "0" + parsed;
	}

	return parsed;
}

function getPowerOf2(num) {
	return Math.log(num, 2);
}

function bin2dec(bin) {
	var array = bin.split("");
	var power = array.length - 1;
	var result = 0;
	for (i = 0; i < array.length; i++) {
		var value = parseInt(array[i]);
		result += (value * Math.pow(2, power));
		power--;
	}

	return result;
}