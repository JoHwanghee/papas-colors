var _gColors = {};

$(function() {
	var colorJson;
	if(typeof(Storage) !== "undefined") {
		colorJson = localStorage.getItem("johwanghee.papas.colors.v.0.0.2");
	}

	if(colorJson != undefined && colorJson.length > 0) {
		parseData(colorJson);
	} else {
		$.getJSON(url+"assets/colors.json", function(data) {
			parseData(data);
			if(typeof(Storage) !== "undefined") {
				localStorage.setItem("johwanghee.papas.colors.v.0.0.2",data);
			}
		});
	}

	$("#searchText").keyup(function() {
		search($(this).val());
	});

	$(window).scroll(function() {
		if($(window).scrollTop() + window.innerHeight == $(document).height()) {
			displayColors();
		}
	});

	$("#colors").css({"margin-top":$("#nav").outerHeight()+5});
});

function search(searchKeys) {
	if(searchKeys == '') {
		displayColors(_gColors[_gBrand]);
	} else {
		var temps = [];
		var i, key;
		var keys = searchKeys.split(',');
		var c;
		for(i in keys) {
			key = keys[i];
			if(key.length > 1) {
				c = getColors(_gColors[_gBrand], _gSearchType, key);
				if(c.length > 0) {
					temps.push.apply(temps, [[0,'▽&nbsp;&nbsp;&nbsp;" '+key+' " search result : '+c.length+'&nbsp;&nbsp;&nbsp;▽']]);
					temps.push.apply(temps, c);
				}
			}
		}
		displayColors(temps);
	}
}

function parseData(data) {
	_gColors['all'] = data;
	var i, temp, type;
	for(i in data) {
		temp = data[i];
		type = temp[1];
		if(_gColors[type] == undefined) {
			_gColors[type] = [];
		}
		_gColors[type].push(temp);
	}
	displayColors(_gColors['all']);
}

function getColors(data, type, key) {
	var temp = [];
	var i;
	var color;
	if(key != undefined && key.length > 0) {
		for(i in data) {
			color = data[i];
			switch(type) {
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
					if(color[4].toUpperCase().indexOf(key.toUpperCase()) > -1) {
						temp.push(color);
					}
					break;
			}
		}
	}
	return temp;
}

var _gTempColor;
function displayColors(data) {
	if(data != undefined) {
		_gTempColor = data.slice(0);
		$("#colors").empty();
	}
	if(_gTempColor == undefined || _gTempColor.length == 0) {
		return false;
	}
	var colors = _gTempColor.slice(0);
	var topCel = '<div class="color" style="background:#000;text-align:center;">{title}<br/></div>';
	var cel = '<div class="color" style="background:#{color};">{no}<br/>{name}&nbsp;-&nbsp;0x{hex}<br/>{type}&nbsp;:&nbsp;{matt}</div>';
	var i,len;
	var el;
	var color;
	len = colors.length;
	if(len > 50) len = 50;

	for(i=0;i<len;++i) {
		color = colors[i];
		if(color[0] == 0) {
			el = topCel;
			el = el.replace("{title}",color[1]);
		} else {
			el = cel;
			el = el.replace("{color}",color[4]);
			el = el.replace("{no}",color[2]);
			el = el.replace("{name}",color[5]);
			el = el.replace("{hex}",color[4]);
			el = el.replace("{type}",color[6]);
			el = el.replace("{matt}",color[7]);
		}
		$("#colors").append(el);
		_gTempColor.splice( 0, 1 );
	}
}

var _gSearchType = 'NO';
var _gBrand = 'all';
var _gSearchTypeLabel = {"NO":"Model No.","NM":"Color Name","HX":"Hex Code"}
function changeSearchType(type) {
	_gSearchType = type;
	var txt = "Search ( {type} )";
	txt = txt.replace("{type}",_gSearchTypeLabel[type]);
	$("#searchLabel").text(txt);
}

function changeBrand(brand) {
	_gBrand = brand;
	var txt = "Brand ( {brand} )";
	txt = txt.replace("{brand}",brand);
	$("#brandLebel").text(txt);
	search($("#searchText").val());
}
