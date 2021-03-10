$(document).ready(function () {
  /* pc  */
  $('#pcHeader').on({
    'mouseenter focusin': function () {
      $(this).addClass('on');
    },
    'mouseleave focusout': function () {
      //#pcHeader.active 를 가지지 않을 경우(본문1번이 보일 경우)와 검색창이 열려져 있지 않을 경우만 헤더에서 마우스가 나가면 .on 제거
      if (!$(this).is('.active') &&  !$(this).find('.search .btn_open').is('.on')) $(this).removeClass('on');
    }
  });

  // fullpage를 사용하지 않는 pc가 아닌 경우만 해당됨 
  $(window).on('scroll', function () {
    //console.log($(this).scrollTop());
    if ($(this).scrollTop() > 0) {
      $('#mHeader').addClass('on');
    } else {
      $('#mHeader').removeClass('on');
    }
  });

  //언어선택
  $('#pcHeader .lang button').on('mouseenter click', function () {
    //검색어가 열려 있는 채로 언어선택을 선택하면 자동 닫아주기
    if ($('#pcHeader .search .btn_open').is('.on')) $('#pcHeader .util .search_wrap').stop().slideUp('fast');

    $(this).next().stop().slideDown().parent().addClass('active');

    $('#pcHeader .lang').on('mouseleave', function () {
      $(this).find('ul').stop().slideUp().parent().removeClass('active');
    });
  });
  $('#pcHeader .lang button, #pcHeader .lang a:last').on('blur', function () {
    setTimeout(function () {
        if ( !$('#pcHeader .lang a').is(':focus') ) $('#pcHeader .lang').trigger('mouseleave');
    }, 10);
  });

  // 검색어 열기 버튼 클릭시
  $('.header .search .btn_open').on('click', function () {
    //닫겨진 경우 -> 열기
    if ( !$(this).hasClass('on') ) {
      if ( $(window).width() > 1080 ){  //pc
        $(this).addClass('on').next().stop().slideDown('fast', function () {
          $(this).prev().children().text('검색 닫기');
        });
        if ( !$('.header').hasClass('active') ) $('.header').addClass('on'); //본문1인 경우
      } else {  //모바일
        $('#mHeader .search_wrap').stop().slideDown('fast');
      }
    }
    //열려진 경우 -> 닫기
    else {
      if ( $(window).width() > 1080 ){  //pc
        $(this).removeClass('on').next('.search_wrap').stop().slideUp('fast', function () {
          $(this).prev().children().text('검색 열기');
        });
      } 
    }
  });

  //검색어 닫기 버튼 클릭시
  $('.header .search .btn_close').on('click', function () {
    if ( $(window).width() > 1080 ){  //pc
      $(this).closest('.search_wrap').stop().slideUp('fast', function () {
        if ( !$('.header').is('.active') ) $('.header').removeClass('on');
        $(this).prev().removeClass('on').focus();
      });
    } else { //모바일
      $(this).closest('.search_wrap').stop().slideUp('fast', function () {
        $(this).prev().focus();
      });
    }
  });

  $('#pcHeader .search .btn_open').on('blur', function (e) {
    if ($(this).hasClass('on')) {
      setTimeout(function () {
        if ($('.header .lang button').is(':focus')) {
          $('#pcHeader .search_wrap').stop().slideUp('fast', function () {
            if ( !$('.header').is('.active') ) $('.header').removeClass('on');
            $(this).prev().removeClass('on');
          });
        }
      }, 10);
    }
  });

  var _pcGnb = $('#pcGnb > ul');

  //1)로딩 완료시 초기 설정 : depth2 .dep2을 숨기기
  _pcGnb.find('li .dep2').hide();

  //2) 영역으로 진입(depth1 a) : 마우스-mouseenter, 키보드-focus => 활성화되어 있는 메뉴는 초기화, 현재 진입한 메뉴만 활성화
  _pcGnb.find('> li > a').on('mouseenter focus', function () {
      //초기화
      _pcGnb.find('>li.on').removeClass('on').children('.dep2').stop().fadeOut('fast');
      if ($('.header .search .search_wrap').is(':visible')) $('.header .search .search_wrap').hide();

      //현재 활성화
      $(this).next().stop().fadeIn('fast').parent().addClass('on');

      //검색창 열기가 열려진 경우라면 닫아주기
      if ( $('#pcHeader .search .btn_open').is('.on') )  $('#pcHeader .search_wrap').stop().slideUp(function () {
        $('#pcHeader .search .btn_open').removeClass('on');
      });
  });

  //3) 메뉴에서 이탈(depth1 ul) : 마우스-mouseleave
  _pcGnb.on('mouseleave', function () {
      //활성화된 메뉴를 초기화
      $(this).find('>li.on').removeClass('on').children('.dep2').stop().fadeOut('fast');
  });

  //4) 메뉴에서 이탈(첫번째와 마지막 a) : 키보드-blur
  _pcGnb.find('a:first, a:last').on('blur', function () {
      //이탈된 포커스를 누군가 받아줄 대기 시간을 지정 - setTimeout
      setTimeout(function () {
          if ( !$('#pcGnb a').is(':focus') ) _pcGnb.mouseleave();
      }, 10);
  });

  // 태블릿, 모바일 gnb
  var _mgnb = $('.mgnb_wrap');
  _mgnb.find('.dep2, .dep3').hide();

  // 전체 메뉴 여닫기
  $('.btn_gnb_open').on('click', function () {
    var _first = _mgnb.find('[data-link="first"]');
    var _last = _mgnb.find('[data-link="last"]');
    var _openbtn = $(this);

    $(this).after('<div id="mgnbDim"></div>').next().stop().fadeIn('fast');
    _mgnb.css({display: 'block'}).stop().animate({left: 0}, 300, function () {
      _first.focus();
      $('html').css({overflowY: 'hidden', height: '100%'});
    });

    _first.on('keydown', function (e) {
      if (e.shiftKey && e.keyCode == 9) {
        e.preventDefault();
        _last.focus();
      }
    });
    _last.on('keydown', function (e) {
      if (!e.shiftKey && e.keyCode == 9) {
        e.preventDefault();
        _first.focus();
      }
    });

    _mgnb.find('.btn_gnb_close').on('click', function () {
      $('html').removeAttr('style');
      $('#mgnbDim').stop().fadeOut('fast', function () {
        $(this).remove();
      });
      _mgnb.stop().animate({left: '-100%'}, 300, function () {
        $(this).css({display: 'none'}).find('#mGnb ul li').removeClass('on').children('ul').stop().slideUp();
        _openbtn.focus();  
      });
    });
  });

  // 모바일 gnb depth 열리고 닫기 : .linkgo -> .go로 클래스명 변경하기
  _mgnb.find('#mGnb > ul > li > a, #mGnb .dep2 > li > a:not(.go)').on('click', function () {

	//현재 닫겨진 경우라면 => 열어주기
    if ( !$(this).parent().hasClass('on') ) {  

      // depth1 a를 클릭한 경우
      if ($(this).next().hasClass('dep2')) {
        // depth1, depth2 모두 초기화
        $('#mGnb > ul > li.on').removeClass('on').children('ul').stop().slideUp('fast');
        $('#mGnb .dep2 > li.on').removeClass('on').children('ul').stop().slideUp('fast');
      }
      // depth2 a를 클릭한 경우
      else {
        // depth2 만초기화
        $('#mGnb .dep2 > li.on').removeClass('on').children('ul').stop().slideUp('fast');
      }
      
      //현재 활성화
      $(this).next().stop().slideDown('fast').parent().addClass('on');
    } 

	//현재 열려진 경우라면 => 닫아주기	
	else { 
      $(this).next().stop().slideUp('fast').parent().removeClass('on');
    }

    return false;
  });
  
  /* pc 패밀리사이트 */
	var _family=$('#footer .family');
	var _btn = _family.find('button');		//FAMILY SITE라는 텍스트가 담긴 버튼
	var _btnGo =	_family.find('.btn_go');		//확인(새창열기 버튼)
	var tgHref;
	
	//1-1) _btn을 클릭해서 ul 태그 열어주기
	_btn.on('click',function () {
		$(this).next().stop().slideDown().parent().addClass('on');

		//1-2) ul 태그에서 마우스가 떠나면 닫아주기
		$(this).next().on('mouseleave',function  () {
			$(this).stop().slideUp().parent().removeClass('on');
		});

		//1-3) focus가 family 내부에 있지 않을 경우 닫아주기
    _btn.on('keydown', function (e) {
      console.log(e.keyCode);
      if (e.shiftKey && e.keyCode === 9) _family.find('>ul').stop().slideUp().parent().removeClass('on');
    });
    _btnGo.on('keydown', function (e) {
      if (!e.shiftKey && e.keyCode === 9) _family.find('>ul').stop().slideUp().parent().removeClass('on');
    });

		//2) ul li a를 클릭하면 자신의 텍스트와 href를 변수에 담아 _btn에 글자를 강제로 바꾼다=> ul 태그 닫아주기
		_family.find('>ul>li>a').on('click',function  (e) {
			e.preventDefault();
			var tgTxt=$(this).text();
			tgHref=$(this).attr('href');
			//console.log(tgTxt, tgHref);

			//_btn.text(tgTxt).focus().next().stop().slideDown();
			_btn.text(tgTxt).focus();
		});
	});

	//3) 확인버튼 눌러 페이지 이동시키기
	_btnGo.on('click',function  (e) {
		e.preventDefault();
		if (_btn.text() === 'FAMILY SITE') return false;

		//window.open('열려질 새창의 경로명','팝업창 이름','옵션');
		window.open(tgHref, 'popup');
  });

  /* 태블릿, 모바일 패밀리사이트 */
	//1-1) _btn을 클릭해서 ul 태그 열어주기
	$('.select_box button').on('click',function () {
    $(this).parent().siblings().children('button').removeClass('on').next().stop().slideUp('fast');
    $(this).toggleClass('on').next().stop().slideToggle('fast');
        
    //키보드 제어 접근성 - keydown
    //button에서 shift+tab 눌러 이전으로 나가는 경우 ul 닫아주기
    $(this).on('keydown', function (e) {
      //console.log(e.keyCode);  //tab => 9
      if ( e.shiftKey && e.keyCode === 9 ) {
        $(this).removeClass('on').next().stop().slideUp('fast');
      }
    })
  
    //ul 마지막 li a에서 (shift는 누르면 안됨)tab만 눌러 다음으로 나가는 경우 ul 닫아주기
    $(this).next().find('li:last a').on('keydown', function (e) {
      if (!e.shiftKey && e.keyCode === 9) {
        $(this).closest('ul').stop().slideUp('fast').prev().removeClass('on');
      }
    });
  });  
  //.select_box말고 다른 클래스명이 있으면 안된다
    $(document).on('click', function (e) {
    var _clickTarget = $(e.target);
    // 현재 .select_box가 열려 있고 select_box > ul을 클릭하지 않고 다른 태그를 클릭했다면 닫아주어라
    if ( $(".select_box button").is(".on") && _clickTarget.parent().attr("class") != "select_box" ){
			$(".select_box button").removeClass("on");
			$(".select_box ul").stop().slideUp("fast");
		}
  });

});