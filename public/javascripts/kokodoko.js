var map;
var ansmap;
var pano;
var hint;
var street;
var streetview_client;
var ovewview;
var marker;
var spot_marker;

Event.observe(window, "load", load, false);
Event.observe(window, "unload", GUnload, false);

function load() {
    if (GBrowserIsCompatible()) {
        quiz_init();
    }
}

function shuffle(a) {
    var i = a.length;
    while (--i >= 0) {
        var j = Math.floor(Math.random() * (i + 1));
        if (i == j) continue;
        var k = a[i];
        a[i] = a[j];
        a[j] = k;
    }
    return a;
}

function set_hint_latlng(point) {
    streetview_client.getNearestPanoramaLatLng(point,function(point) {
	marker.setLatLng(point);
	open_hint_window(point);
    });
}

function open_hint_window(point) {
    var hint2;
    var hint_div;
    
    var event = GEvent.addListener(marker,'infowindowopen', function() {
	hint2 = new GStreetviewPanorama($('hint2'));
	hint2.setLocationAndPOV(point,null);
	GEvent.removeListener(event);
    });
    marker.openInfoWindowHtml("<div id='hint2' style='width:240px;height:200px;'>loading...</div>");
}

function quiz_init() {
    var ids = new Array("map","ansmap","pano","answer","point","total","q_rest","hint");
    ids.each(function (id) {
	quiz[id] = document.getElementById(id);
    });

    map = new GMap2(quiz.map);
    map.setMapType(G_SATELLITE_MAP);
    map.enableScrollWheelZoom();
    map.enableContinuousZoom();
    map.addControl(new GLargeMapControl()); 

    var set_icon_up = function(icon) {
	icon.iconSize = new GSize(24,24);
	icon.iconAnchor = new GPoint(12,12);
	icon.infoWindowAnchor = new GPoint(12,4);
    };
    var spot_icon = new GIcon(null,"/kokodoko/images/fam/icons/exclamation.png");
    var zoom_icon = new GIcon(null,"/kokodoko/images/fam/icons/zoom.png");
    set_icon_up(spot_icon);
    set_icon_up(zoom_icon);

    street = new GStreetviewOverlay();

    ansmap = new GMap2(quiz.ansmap);
    pano = new GStreetviewPanorama(quiz.pano);

    if (quiz.view_type == "street") quiz.map.style.display = "none";
    if (quiz.view_type == "satellite") quiz.pano.style.display = "none";
    quiz.ansmap.style.display = "none";
    quiz.hint.style.display = "none";

    marker = new GMarker(new GLatLng(0,0),{
	title: "ヒント位置",
	autoPan: false,
	draggable: true,
	icon: zoom_icon
    });
    spot_marker = new GMarker(new GLatLng(0,0),{
	title: "ここどこ?",
	autoPan: false,
	draggable: false,
	icon: spot_icon
    });

    quiz.next_question();

    GEvent.addListener(marker,'dragend',function() {
	set_hint_latlng(marker.getLatLng());
    });

    map.addOverlay(marker);
    map.addOverlay(spot_marker);

    streetview_client = new GStreetviewClient();
    GEvent.addListener(map,'click',function(overlay,point) {
	set_hint_latlng(point);
//	map.showMapBlowup(point, { "mapType": G_SATELLITE_MAP, "zoomLevel": 18})
    });

//    GEvent.addListener(hint,'initialized',function(location) {
//	marker.setLatLng(location.latlng);
//    });
}
    
// 得点計算用
var score = {
    total: 0,
    magnified: false,
    demagnified: false,
    num_errors: 0,
    reset: function() {
	this.magnified = false;
	this.demagnified = false;
	this.num_errors = 0;
    },
    get_point: function() {
	var point = 5;
	if (this.magnified) point--;
	if (this.demagnified) point--;
	point -= this.num_errors;
	if (point < 0) point = 0;
	return point;
    }
};

//クイズ進行制御
function Quiz(questions, opts) {
    this.questions = questions;
    for(var key in opts) {
	if(opts[key]) {
	    this[key] = opts[key];
	}
    }
};

Quiz.prototype = {
    question_index: 0, //出題番号
    questions: null, //問題集
    num_questions: null, //出題数。必ずしもthis.questions.lengthと同じではない

    test: function(answer) {
	return this._get_current_question().title == answer;
    },
    get_current_question: function() {
	return get_nth_question(this.question_index);
    },
    next: function() {
	this.question_index ++;
    },
    get_num_rest: function() {
	return this.num_questions - (this.question_index + 1);
    },
    _get_nth_question: function(index) {
	if(this.question_index < this.num_quesions) {
	    return this.questions[index % this.questions.length];
	}
	return null;
    }
};

// class: MapController
function MapController() {

};

MapController.prototype = {
    show_message: function(str) {
	window.alert(str);
    },
    message: function(id,msg) {
	document.getElementById(id).innerHTML = msg;
    },
    magnify: function() {
	score.magnified = true;
	$("point").innerHTML = score.get_point();
	map.setZoom(this.current_question.scale.magnify);
    },
    demagnify: function() {
	score.demagnified = true;
	$("point").innerHTML = score.get_point();
	map.setZoom(this.current_question.scale.demagnify);
    },
    normal_scale: function() {
	map.setZoom(this.current_question.scale.normal);
    },
    test: function() {
	this.point.innerHTML = score.get_point();
	if (this.answer.value == this.current_question.title) {
            window.alert("( ´∀｀) < 正解!");
            this.message("total",score.total += score.get_point());
            this.next_question();
	} else {
            score.num_errors ++;
            this.point.innerHTML = score.get_point();
            window.alert("残念!違います。");
	    this.answer.focus();
	}
    },
    give_up: function() {
	$("ansmap").show();
	window.alert(this.current_question.title + " でした。");
	this.next_question();
	$("ansmap").hide();
    },
    next_question: function() {
	$("hint").hide();
	map.removeOverlay(street);

	$("q_rest").innerHTML = "残り " + this.quiz.get_num_rest();

	score.reset();
	this.current_question = this.questions[(this.current_count++) % this.questions.length];
	if (this.view_type == "satellite") map.setCenter(this.current_question.latlng,16);
	ansmap.setCenter(this.current_question.latlng,16);
	spot_marker.setLatLng(this.current_question.latlng);
	if (this.view_type == "street") pano.setLocationAndPOV(this.current_question.latlng,{});

        this.point.innerHTML = score.get_point();
	if (num_rest == 0) this.finish();

	this.answer.focus();
    },
    finish: function() {
	window.alert("finish!");
	$("score_score").value = score.total;
	$("score_submit").click();
    },
    show_hint: function() {
	$("hint").show();
	set_hint_latlng(this.current_question.latlng);
	map.addOverlay(street);
    }
}

