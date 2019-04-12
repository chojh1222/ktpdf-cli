var kt = {
	gnb_act : function(){

	
		var tit = [
			'생성'
			,'유통'
			,'보관'
		]
		var prah = [
			'생성메뉴에 관한 간단한 설명글이 들어갑니다.'
			, '유통메뉴에 관한 간단한 설명글이 들어갑니다.'
			, '보관메뉴에 관한 간단한 설명글이 들어갑니다.'
		]

		

		// 1depth hover
		$('.depth-01>li')
		.mouseenter(function(){
			$(this).addClass('hover');
			var idx = $('.depth-01>li').index($(this));
			$('.depth-02>li').eq(idx).addClass('hover');
			$('.depth-02-container .static .title').text(tit[idx]);
			$('.depth-02-container .static .title+p').text(prah[idx]);
		})
		.mouseleave(function(){
			$(this).removeClass('hover');
			var idx = $('.depth-01>li').index($(this));
			$('.depth-02>li').eq(idx).removeClass('hover');
		});
		// 2depth hover
		$('.depth-02>li')
		.mouseenter(function(){
			$(this).addClass('hover');
			var idx = $('.depth-02>li').index($(this));
			$('.depth-01>li').eq(idx).addClass('hover');
			$('.depth-02-container .static .title').text(tit[idx]);
			$('.depth-02-container .static .title+p').text(prah[idx]);
		})
		.mouseleave(function(){
			$(this).removeClass('hover');
			var idx = $('.depth-02>li').index($(this));
			$('.depth-01>li').eq(idx).removeClass('hover');
		});
		
		// 2depth 열기
		$('.depth-01 > li')
		.mouseenter(function(){
			if( $('.depth-02-wrap').hasClass('on') != true ){
				$('.depth-02-wrap').addClass('on');
			}
		});
		
		// 2depth 닫기
		$('.depth-02').mouseleave(function(){
			console.log("out");
			$('.depth-02-wrap').removeClass('on');
		});

	},
	main_banner : function(){
		var mainBanner = $('.main-banner .slider');
		mainBanner.owlCarousel({
		    loop:true,
		    margin:0,
		    nav:false,
		    responsive:{
		        0:{
		            items:1
		        },
		        600:{
		            items:1
		        },
		        1000:{
		            items:1
		        }
		    }
		});
		// 이전
		$('.main-banner .pre').click(function(){
			$('.slider').trigger('prev.owl.carousel', [300]);
		});
		// 다음
		$('.main-banner .next').click(function(){
			$('.slider').trigger('next.owl.carousel', [300]);
		});
	},
	main_tab : function(){
		var tab = $('.boards .tab-wrap li');
		var tab_con;
		var tab_idx;
		tab.click(function(e, tab, tab_con){
			e.preventDefault();
			$(this).addClass('on').siblings().removeClass('on');
			tab_idx = $(this).index(tab);
			tab_con = $('.boards .tab-cons .tab-con');

			// console.log(tab_con.eq(1));
			tab_con.eq(tab_idx).addClass('on').siblings().removeClass('on');

		});
	},
	dropdown : function(){
		// $('.dropdown .toggle').off('click');
		$('.dropdown .toggle').click(function(e){
			e.preventDefault();
			$(this).toggleClass('on');
			$(this).next('.dropdown-menu').toggle();
		})
	},
	topAnchor : function(){
		$(window).on('scroll', onScroll);
		var t, w;
		function onScroll(e){
			t = $(document).scrollTop();
			w = $('.container').outerHeight() + $('.gnb').outerHeight() - $(window).outerHeight(true);
			if( t < 100 ){
				$('.top-anchor').addClass('ontop').removeClass('pof');
			} else if( t >= 100 && t < w ) {
				$('.top-anchor').removeClass('ontop').addClass('pof');
			} else if( t >= w ){
				$('.top-anchor').removeClass('pof');
			}
			
			// console.log("t: " + t + ", w: " + w);
		}
		// 앵커를 클릭하면 top으로
		$('.top-anchor a').click(function(){
			$('html, body').animate({
				scrollTop: 0
			}, 400);
		});
	},
	quikMenu : function(){
		$('.quik-menu a').click(function(e){
			e.preventDefault();
		})
	},
	subBanner: function(){
		$('.sub-banner:not(.single)').owlCarousel({
		    loop:true,
		    margin:0,
		    nav:false,
		    responsive:{
		        0:{
		            items:1
		        },
		        1000:{
		            items:1
		        }
		    }
		});
	},
	mobileMenu: function(){
		// $(window).scroll(function(){
		// 	t = $(document).scrollTop();
		// 	console.log("t: " + t);
			
		var top = 0;
		var t;
		t = top;
		function open(){
			$('.menu-toggle').addClass('on');
			$('.dropdown-menu').hide();
			$('.gnb-mobile .header').addClass('menu-open');
			$('.menu-list').addClass('on');
			top = $(document).scrollTop();
			setTimeout(function(){
				$('html').addClass('scroll-disabled');
			},300);
			t = top;
		}
		function close(){
			$('.menu-toggle').removeClass('on');
			$('.gnb-mobile .header').removeClass('menu-open');
			$('.menu-list').removeClass('on');
			$('html').removeClass('scroll-disabled');
			// $('.main-banner .slider').trigger('refresh.owl.carousel');
			$(document).scrollTop(t);
		}
		// });
		$('.menu-toggle').click(function(e){
			e.preventDefault();
			// $(this).toggleClass('on');
			if( $(this).hasClass('on') ){
				// 닫기
				close();
				$('.login-toggle').removeClass('white');
			} else {
				// 열기
				open();
				$('.login-toggle').addClass('white');

			}
		});
		$('.menu-list a').click(function(e){
			e.preventDefault();
		});
		$('.login-toggle').click(function(){
			if( $('.header').hasClass('menu-open') ){
				// 만약 메뉴가 열려있을떄만
				close();
				$('.login-toggle').removeClass('white');
			}
		});
	},
	tooltip: function(e){
		$(e).next('.balloon').toggle();
	},
	tab: function(){
		$('.tab li a').on('click', function(e){
			e.preventDefault();
			var tabList = $(this).parents('li');
			var idx = $('.tab li').index( tabList );

			$(this).parents('li').addClass('on').siblings().removeClass('on');

			$('.tab-contents li').eq(idx).addClass('on').siblings().removeClass('on');


		})
	},

	test: function(){
		// alert('clicked');
	}
}

var accordion = {
	toggle: function(){
		$('.accordion .toggle a').click(function(e){
			e.preventDefault();
		});
		$('.accordion .toggle').click(function(){
			$(this).toggleClass('on').next().toggleClass('on');
		});
	}
}


// 회원가입 구분
var joinType = {
	select : function(){
		$('.join-type a').click(function(e){
			e.preventDefault();
			if( $(this).hasClass('join-personal') ){	
				$('.join-form .personal').show();
				$('.join-form .group').hide();
			} else if( $(this).hasClass('join-group') ){
				$('.join-form .group').show();
				$('.join-form .personal').hide();
			}

		});
	}
}



// 초기화
var init = function(){
	for( var key in kt ){
		kt[key]();
	}

	for( var key in accordion ){
		accordion[key]();
	}
}

$(document).ready(function(){
	init();
});