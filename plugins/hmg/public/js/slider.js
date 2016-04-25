/**

This module handles slider

**/
window.slider=(function(){
	//private
	var options = {
		controls: true,
		duration: 4500,
		hideControls: false,
		showControlsHover: 2000,
		arrows: true,
		autoplay: true,
		prevArrow: '<button class="slick-prev slick-arrow">Next</button>',
		nextArrow: '<button class="slick-next slick-arrow">Next</button>',
		pauseOnHover: false,
		pause: '<div class="pausebutton"> <img src="vendor/slick/pause.ico"></img> </div>'
	};

	var instances = [];

	var interval;

	function buildElement(slider, slides){
		var i = 0;

		$(slides).each(function(){
			$(this).attr('data-index', i);
			$(this).addClass('slide');
			i++;
		});

		$(slides).first().addClass('current');

		$(slider).append(slider.options.prevArrow);
		$(slider).append(slider.options.nextArrow);
		$(slider).append(slider.options.pause);
	}

	function next(slider){
		var slides = $(slider).find('.slide');
		var totalIndex = $(slides).length;
		var prevIndex = $(slider).find('.current.slide').data('index');
		var toSlide = (prevIndex * 1) + 1;

		if(toSlide > totalIndex-1){
			toSlide = 0;
		}

		changeSlide(slider, toSlide);
	}

	function prev (slider) {
		var slides = $(slider).find('.slide');
		var totalIndex = $(slides).length;
		var prevIndex = $(slider).find('.current.slide').data('index');
		var toSlide = (prevIndex * 1) - 1;

		if(toSlide < 0){
			toSlide = totalIndex-1;
		}

		changeSlide(slider, toSlide);
	}

	function middlelign (slider, slide){
		var halfElement = $(slide).height() / 2;
		var halfParent = $(slider).height() / 2;
		console.log(halfElement, halfParent)
		console.log((halfParent - halfElement) + "px");
		$(slide).css('margin-top', + (halfParent - halfElement) + "px");
	}

	function changeSlide(slider, toSlide){
		var slides = $(slider).find('.slide');
		var $newCurrent = $(slider).find("[data-index='" + toSlide + "']");
		

		slides.removeClass('current');

		$(slider).find('.slide').addClass('notCurrent');

		$newCurrent.addClass('current').removeClass('notCurrent');
		
		if($newCurrent.hasClass('middle'))
			middlelign(slider, $newCurrent);
	}

	function pause(slider){
		$(slider).find('.pausebutton').addClass('show');
		clearInterval(interval);
	}

	function start(slider){
		$(slider).find('.pausebutton').removeClass('show');

		// next(slider);
		interval = setInterval(function(){
			next(slider);
		}, slider.options.duration);
	}

	function arrowClickEvents (slider) {
		$(slider).find('.slick-next').on('click', function(){
			next(slider);
		});

		$(slider).find('.slick-prev').on('click', function(){
			prev(slider);
		});
	}

	//public:
	return{
		init:function(slider, opt){
			var slides = $(slider).children();

			instances.push({
				slider: $(slider),
				backup: $(slider).clone()
			});

			$(slider).addClass('contentSlider');

			slider.options = JSON.parse(JSON.stringify(options));
			$.extend(slider.options, opt);

			if(slider.options.pauseOnHover){
				$(slider).mouseenter(function(){

					pause(this);
				}).mouseleave(function(){

					start(this);
					next(slider);

				});
			}

			if(slider.options.hideControls){
				$(slider).mouseleave(function(){
					$(this).find('.slick-arrow').removeClass('show');
				});
			}

			buildElement(slider, slides);


			if(slider.options.arrows)
				$(slider).find('.slick-arrow').addClass('show');
			else
				$(slider).find('.slick-arrow').hide();

			if(slider.options.hideControls){
				var timeout;
				$(slider).mousemove(function(){
					var $arrows = $(slider).find('.slick-arrow');
					if(!$arrows.hasClass('show')){
						$arrows.addClass('show');
					}
					clearTimeout(timeout);
					if($(slider).find('.slick-arrow:hover').length === 0){
						// do this if the arrows are not hovered
						timeout = setTimeout(function() {

							$arrows.removeClass('show');
						}, slider.options.showControlsHover);
					}
				});
			}
			

			
			arrowClickEvents(slider);

			changeSlide(slider, 0)

			if(slider.options.autoplay)
				start(slider);
		},

		destroy: function(slider){


			function destroySlider(instance){				
				$(instance.slider).replaceWith(instance.backup);

				console.log('destroying #' + $(instance.slider).attr('id'));
			}

			if(typeof slider == 'undefined'){
				// destroy all
				instances.forEach(destroySlider);
			}else{
				// destroy one
				destroySlider(slider);
			}
		},

		admin: function(){
			slider.destroy();
			instances.forEach(reInit);

			function reInit(instance){
				slider.init($(instance.backup), {
					arrows: true,
					autoplay: false

				});
			}
		}
	}

}());