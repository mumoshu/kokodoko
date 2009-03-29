Event.observe(window, 'load', function() {
    //    jQuery("pbar").progressbar({
    //      interval: 2000
    //    });
    //    jQuery("pbar").progressbar("start");
    
    var modal = Control.Modal.open($('modal_content'),{
        closeOnClick: 'overlay',
        overlayOpacity: 0.75,
        fade: true
    });

    modal.observe('afterClose', 
		  function() {
		      new PeriodicalExecuter(
			  function() {
			      pbar2.setPercentage('+1%');
			  },
			  0.5
		      );
		  });
    
    pbar2 = new JS_BRAMUS.jsProgressBar($('progress_bar2'), 0, {
        animate: true,
        showText: false,
        boxImage: '/kokodoko/images/bramus/percentImage.png',
        barImage: Array('/kokodoko/images/bramus/percentImage_back1.png',
			'/kokodoko/images/bramus/percentImage_back2.png',
			'/kokodoko/images/bramus/percentImage_back3.png',
			'/kokodoko/images/bramus/percentImage_back4.png'
		       ),
        onTick: function(pbObj) {
            if (pbObj.getPercentage() == 100) {
		quiz.next_question();
//		$('new_score').submit();
            };
            return true;
        }
    });
});
