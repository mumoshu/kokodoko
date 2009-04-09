var map;
var spot_marker;
var timer;
var progress_bar;

Event.observe(window, "load", function() {
    $("next_button").hide();
    $("finish_button").hide();
    
    if(GBrowserIsCompatible()) {
        map = new GMap2($("map"));
        map.setMapType(G_SATELLITE_MAP);
        map.enableScrollWheelZoom();
        map.enableContinuousZoom();
        map.addControl(new GLargeMapControl());

        spot_marker = new GMarker(new GLatLng(0,0),{
        title: "Where's here?",
        autoPan: false,
        draggable: false
        });

        map.addOverlay(spot_marker);

        // setup progressbar
        progress_bar = new Control.ProgressBar('progress_bar',{
            interval: 0
        });


        // click to start!
        var modal = Control.Modal.open($('modal_content'),{
            closeOnClick: 'overlay',
            overlayOpacity: 0.75,
            width: 300,
            fade: true
        });

        modal.observe('afterClose',
              function() {
                  timer = new PeriodicalExecuter(
                      function() {
                          progress_bar.step(1);
                          if(progress_bar.progress == 100) {
                              timer.stop();
                              quiz.timeover();
                          }
                      },
                      (30.0 / 100)
                  );
              });
    } //if(GBrowserIsCompatible())
}, false);

Event.observe(window, "unload", GUnload, false);

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

//クイズ状態
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
	return this.get_current_question().title == answer;
    },
    get_current_question: function() {
	return this.get_nth_question(this.question_index);
    },
    next: function() {
        this.question_index ++;
        return this.get_current_question();
    },
    get_num_rest: function() {
	return this.num_questions - (this.question_index + 1);
    },
    get_nth_question: function(index) {
	if(index < this.num_questions) {
	    return this.questions[index % this.questions.length];
	}
	return null;
    }
};

// クイズ進行制御
function QuizController(quiz,map) {
    this.quiz  = quiz;
    this.map   = map;
    this.score = 0;
};

QuizController.prototype = {
    // What I can do
    _makes_user_unable_to_provide_an_answer: function() {
        $("test_button").hide();
        $("answer").hide();
    },
    _scores_then_train: function() {
        this.map.setMapType(G_NORMAL_MAP);
        if (this.quiz.test($("answer").value)) {
            window.alert("正解！");
            $("total").innerHTML = (this.score += 1);
        } else {
            window.alert("残念！ 答えは" + this.quiz.get_current_question().title + "でした。");
        }
    },
    // What I do when events have occurred.
    test: function() {
        timer.stop();
        this._makes_user_unable_to_provide_an_answer();
        this._scores_then_train();
        $("next_button").show();
    },
    next: function() {
        $("next_button").hide();
        this.map.setMapType(G_SATELLITE_MAP);
        if(this.quiz.next()) {
            $("test_button").show();
            $("answer").show();
            var q = this.quiz.get_current_question();
            this.map.setCenter(q.latlng, q.scale.normal);
            spot_marker.setLatLng(q.latlng);
            $("answer").focus();
            timer.registerCallback();
        } else {
            $("finish_button").show();
        }
    },
    timeover: function() {
        this._makes_user_unable_to_provide_an_answer();
        this._scores_then_train();
        $("finish_button").show();
    },
    finish: function() {
        $("score_score").value = this.score;
        $("score_submit").click();
    }
}

