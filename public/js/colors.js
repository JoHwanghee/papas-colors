var start, end;
var colors;

$(function() {
	console.log("Synchronous parse start");
	$.get('assets/colors.csv', function(data) {
		start = performance.now();
		var results = Papa.parse(data, buildConfig());
		//console.log("Synchronous parse results:", results);
		colors = results.data;
		displayColors(colors);
	});

	$("#searchText").change(function() {
		if($(this).val() == '') {
			displayColors(colors);
		} else {
			var temp = [];
			
		}
	});
});

function buildConfig() {
	return {
		delimiter: "",
		newline: "",
		header: false,
		dynamicTyping: false,
		preview: 0,
		step: undefined,
		encoding: "",
		worker: false,
		comments: "#",
		complete: completeFn,
		error: errorFn,
		download: false,
		fastMode: false,
		skipEmptyLines: true,
		chunk: undefined
	};
}

function errorFn(error, file) {
	console.log("ERROR:", error, file);
}

function completeFn() {
	end = performance.now();
}

var colorEliment = '<div class="color" style="background:#{color};">{no}<br/>{name}&nbsp;-&nbsp;0x{hex}<br/>{type}&nbsp;:&nbsp;{matt}</div>';
function displayColors(colors) {
	var i,len;
	var el;
	var color;
	len = colors.length;
	for(i=0;i<len;++i) {
		color = colors[i];
		el = colorEliment;
		el = el.replace("{color}",color[4]);
		el = el.replace("{no}",color[2]);
		el = el.replace("{name}",color[5]);
		el = el.replace("{hex}",color[4]);
		el = el.replace("{type}",color[6]);
		el = el.replace("{matt}",color[7]);
		$("#colors").append(el);
	}
}

var type;
function changeCType(t) {
	type = t;
	$("#searchType").text(t);
}
