var map;
var ansmap;
var pano;
var hint;
var street;
var streetview_client;
var ovewview;
var marker;

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
//	hint.setLocationAndPOV(point,{});
	marker.setLatLng(point);
	open_hint_window(point);
    });
}

function open_hint_window(point) {
    var hint2;
    var hint_div;

    marker.openInfoWindowHtml("<div id='hint2' style='width:240px;height:200px;'>loading...</div>");
    hint2 = new GStreetviewPanorama($('hint2'));
    hint2.setLocationAndPOV(point,null);
}

function quiz_init() {
    ids = new Array("map","ansmap","pano","answer","point","total","q_rest","hint");
    while (id = ids.pop()) {
	quiz[id] = document.getElementById(id);
    }

    map = new GMap2(quiz.map);
    map.disableDragging();
    map.setMapType(G_SATELLITE_MAP);
    street = new GStreetviewOverlay();

    ansmap = new GMap2(quiz.ansmap);
    pano = new GStreetviewPanorama(quiz.pano);
//    hint = new GStreetviewPanorama(quiz.hint);

    if (quiz.view_type == "street") quiz.map.style.display = "none";
    if (quiz.view_type == "satellite") quiz.pano.style.display = "none";
    quiz.ansmap.style.display = "none";
    quiz.hint.style.display = "none";

    marker_opt = {};
    marker_opt.title = "ヒント位置";
    marker_opt.autoPan = true;
    marker_opt.draggable = true;
   
    marker = new GMarker(new GLatLng(0,0),marker_opt);

    quiz.next_question();
    

    GEvent.addListener(marker,'dragend',function() {
	set_hint_latlng(marker.getLatLng());
    });

    map.addOverlay(marker);
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
var quiz = {
    current_count: 0, //出題番号
    current_question: null, //現在の問題
    questions: null, //問題集
    num_questions: null, //出題数。必ずしもthis.questions.lengthと同じではない
    view_type: null, // "satellite" or "street"
    show_message: function(str) {
        window.alert(str);
    },
    message: function(id,msg) {
	document.getElementById(id).innerHTML = msg;
    },
    magnify: function() {
	score.magnified = true;
	this.point.innerHTML = score.get_point();
	map.setZoom(this.current_question.scale.magnify);
    },
    demagnify: function() {
	score.demagnified = true;
	this.point.innerHTML = score.get_point();
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
	this.ansmap.style.display = "block";
	window.alert(this.current_question.title + " でした。");
	this.next_question();
	this.ansmap.style.display = "none";
    },
    next_question: function() {
	this.hide_hint();
	map.removeOverlay(street);

	num_rest = this.num_questions - this.current_count;
	this.q_rest.innerHTML = "残り " + num_rest;

	score.reset();
	this.current_question = this.questions[(this.current_count++) % this.questions.length];
	if (this.view_type == "satellite") map.setCenter(this.current_question.latlng,16);
	ansmap.setCenter(this.current_question.latlng,16);
	marker.setLatLng(this.current_question.latlng);
	if (this.view_type == "street") pano.setLocationAndPOV(this.current_question.latlng,{});

        this.point.innerHTML = score.get_point();
	if (num_rest == 0) this.finish();

	this.answer.focus();
    },
    finish: function() {
	window.alert("finish!");
	document.getElementById("score_score").value = score.total
	document.getElementById("score_submit").click()
    },
    hide_hint: function() {
	this.hint.style.display = "none";
    },
    show_hint: function() {
	this.hint.style.display = "block";
	set_hint_latlng(this.current_question.latlng);
	map.addOverlay(street);
    }
}

