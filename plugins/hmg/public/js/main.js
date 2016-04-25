
$(document).ready(function(){

	$(window).scroll(function(){
		var scroll = $(window).scrollTop();
		console.log(scroll);
		if(scroll>100){
			$('.top').addClass('notAtTop');
		}
		if(scroll<100){
			$('.top').removeClass('notAtTop');
		}
	})

	document.body.setAttribute("class","loaded");
	var options = {
		autoplay:false,
		pauseOnHover:false,
		controls:false,
		arrows:false
	}

	if($('.slider').hasClass('go')){
		options.autoplay = true;
	}

	slider.init($('.slider'), options);

	var $img = $('.imgCoverEffect');
	//$('.slider>img').addClass('smoothAppear');

	// $('.imgCoverEffect').each(function(){
	// 	imgCoverEffect(this, {
	// 		alignX: 'center',
	// 		alignY: 'middle',
	// 		watchResize: true
	// 	});
	// })

	$('.adjust-img').on('mousedown',function(e){
		var img = this;
		var startY = e.pageY;
		var already = $(img).css('top').replace('px','')
		if(already > 0 || already < 0){
			startY -= already;
		}
		$(window).on('mousemove', function(e){
			e.preventDefault();
			console.log(e.pageY-startY);
			$(img).css('top', e.pageY-startY)
		})
	});
	$(window).on('mouseup', function(){
		$(window).off('mousemove')
	});


	function alignImages(){

		$(".centerWide").each(function(i, img) {
			$(this).css({
				left: ($(img).parent().width() - $(img).width()) / 2
			});

			$(img).load(function(){
				$(this).css({
					left: ($(img).parent().width() - $(img).width()) / 2
				});
			});
		});
	}

	alignImages();

	// TODO: prevent from firing often
	$(window).on('resize', alignImages);

});
