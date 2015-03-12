var _gStart, _gEnd;
var _gColors;

$(function() {
	var cstring;
	if(typeof(Storage) !== "undefined") {
		cstring = localStorage.getItem("johwanghee.papas.colors");
	}

	if(cstring != undefined && cstring.length > 0) {
		parseData(cstring);
	} else {
		$.get(url+"assets/colors.csv", function(data) {
			parseData(data);
			if(typeof(Storage) !== "undefined") {
				localStorage.setItem("johwanghee.papas.colors",data);
			}
		});
	}

	$("#searchText").keyup(function() {
		if($(this).val() == '') {
			_gTempColor = _gColors;
			displayColors(_gColors);
		} else {
			var temps = [];
			var key;
			var keys = $(this).val().split(',');
			var c;
			for(key in keys) {
				c = getColors(keys[key]);
				if(c.length > 0) {
					temps.push.apply(temps, c);
				}
			}
			displayColors(temps);
		}
	});

	$(window).scroll(function() {
		if($(window).scrollTop() + window.innerHeight == $(document).height()) {
			displayColors();
		}
	});
});

function parseData(data) {
	_global_start = performance.now();
	var results = Papa.parse(data, buildConfig());
	_gColors = results.data;
	displayColors(_gColors);
}

function getColors(key) {
	var temp = [];
	var i;
	var color;
	if(key != undefined && key.length > 0) {
		for(i in _gColors) {
			color = _gColors[i];
			switch(_gSearchType) {
				case 'NO':
					if(color[2].toUpperCase().indexOf(key.toUpperCase()) > -1) {
						temp.push(color);
					}
					break;
				case 'NM':
					if(color[5].toUpperCase().indexOf(key.toUpperCase()) > -1) {
						temp.push(color);
					}
					break;
				case 'HX':
					if(color[4].indexOf(key) > -1) {
						temp.push(color);
					}
					break;
			}
		}
	}
	return temp;
}

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
	_gEnd = performance.now();
}

var _gTempColor;
function displayColors(data) {
	if(data != undefined) {
		_gTempColor = data;
		$("#colors").empty();
	}
	if(_gTempColor == undefined || _gTempColor.length == 0) {
		return false;
	}
	var colors = _gTempColor.slice(0);
	var cel = '<div class="color" style="background:#{color};">{cnt}.&nbsp;{no}<br/>{name}&nbsp;-&nbsp;0x{hex}<br/>{type}&nbsp;:&nbsp;{matt}</div>';
	var i,len;
	var el;
	var color;
	len = colors.length;
	if(len > 50) {
		len = 50;
	}
	for(i=0;i<len;++i) {
		color = colors[i];
		el = cel;
		el = el.replace("{cnt}",color[0]);
		el = el.replace("{color}",color[4]);
		el = el.replace("{no}",color[2]);
		el = el.replace("{name}",color[5]);
		el = el.replace("{hex}",color[4]);
		el = el.replace("{type}",color[6]);
		el = el.replace("{matt}",color[7]);
		$("#colors").append(el);
		_gTempColor.splice( 0, 1 );
	}
}

var _gSearchType = 'NO';
function changeCType(type) {
	_gSearchType = type;
	$("#searchType").text(type);
}
