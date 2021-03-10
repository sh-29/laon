$(document).ready(function () {
  // https://swiperjs.com => #cnt1 .swiper-container의 스크립트 작성하기
  var mySwiper1 = new Swiper('#cnt1 .swiper-container', {
    pagination: {
      el: '.swiper-pagination',
      type: 'fraction', //bullets(원형아이콘), fraction(숫자)
    },
    navigation: { //이전과 다음버튼
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    autoplay: { //자동실행
      delay: 3000, //1초 1000
    },
    loop: true, //무한반복
    a11y: { //접근성
      prevSlideMessage: '이전 슬라이드 보기',
      nextSlideMessage: '다음 슬라이드 보기',
      firstSlideMessage: '첫번째 슬라이드',
      lastSlideMessage: '마지막 슬라이드',
    },
    // .swiper-slide.black => 제어스크립트 추가
    on:{
      init:function () {  //로딩 완료시 초기설정 상태
        /* if($('#cnt1 .swiper-slide-active').is('.black')){
          $('#cnt1 .controller').addClass('.black');
        } */
        if($('#cnt1 .swiper-slide-active').hasClass('black')){
          $('#cnt1 .controller').addClass('black');
        }
      },
      slideChangeTransitionStart:function () {  //애니메이션이 시작되어 다른 슬라이더로 바뀌기 시작할 때
        if($('#cnt1 .swiper-slide-active').hasClass('black')){
          $('#cnt1 .controller').addClass('black');
        }else{
          $('#cnt1 .controller').removeClass('black');
        }
      }
    }
  });


  //★ 자동실행, 일시정지 컨트롤 버튼 추가
  $('#cnt1 .pause').on('click', function () {
    $(this).hide().siblings('button').show();
    mySwiper1.autoplay.stop();
    return false;
  });
  $('#cnt1 .play').on('click', function () {
    $(this).hide().siblings('button').show();
    mySwiper1.autoplay.start();
    return false;
  });

  /* 본문2 배경색 변경 : 더보기 버튼은 불투명도로 제어해야 포커스가 갈수 있다(display: none; 안된다) */
  var boxTimer = 0;
  $(window).on('resize', function () {
    clearTimeout(boxTimer);

    boxTimer = setTimeout(function() {
      var winWid = $(this).width();
      if (winWid > 1080) {
        //초기설정:var boxHei = .txtbox높이 - .btn_more의 높이
        var boxHei = $('#cnt2 .txtbox').height() - $('#cnt2 .btn_more').outerHeight(true);
        $('#cnt2 .txtbox').css('height', boxHei);

        //마우스, 키보드 제어
        $('#cnt2 ul li').attr('tabIndex', 0);
        $('#cnt2 ul li').on({
          'mouseenter focusin': function () {
            $(this).addClass('active').children('.txtbox').css('height', 'auto');
            console.log($(window).width());
          },
          'mouseleave focusout': function () {
            $(this).removeClass('active').children('.txtbox').css('height', boxHei);
          }
        });
      } 
      else { //태블릿 모바일 제어
        // li - tabIndex, class 속성 제거 => 자식.txtbox - style 속성 제거
        $('#cnt2 ul li').removeAttr('tabIndex class').children();
        $('#cnt2 ul li .txtbox').removeAttr('style');
        
        // $(document).on('이벤트명','대상선택자',function () {})
      }
      
      /* else{ //태블릿모바일제어
        $('#cnt2 ul li').removeAttr('tabIndex class');
        $('#cnt2 ul li').off('mouseenter');
        $('#cnt2 .txtbox').css('height', 100%);
        $(document).on('이벤트명','대상선택자',function () {})
      } */
    }, 50);
  });

  /* 본문4 비디오 모달 처리 */
    $('.btn_img_wrap').on('click', function () {
      var _openBtn = $(this);   //모달 닫기를 클릭시 열어준 버튼에 포커스 강제 이동
      var _mdCnt = $( $(this).data('href') ); //$()로 감싸서 선택자로 변경
      var _closeBtn = _mdCnt.find('.close_btn'); //열려진 모달 내부의 닫기버튼
      var _first = _mdCnt.find('[data-link="first"]'); //열려진 모달 내부의 첫번째 포커스가 갈 대상
      var _last = _mdCnt.find('[data-link="last"]'); //열려진 모달 내부의 마지막 포커스가 갈 대상
      console.log(_mdCnt, typeof _mdCnt);
      var timer = 0; //누적되는 resize 이벤트를 제어 => 성능 향상

      //1) 스크린리더에서는 열려진 모달 말고는 접근하지 못하도록 제어
      _mdCnt.siblings().attr({'aria-hidden': true, inert: ''});

      //2) #dim 동적 생성
      _mdCnt.before('<div id="dim"></div>');
      var _dim = $('#dim');

      //3) resize 이벤트로 열려질 모달의 위치 제어
      $(window).on('resize', function () {
          clearTimeout(timer);

          timer = setTimeout(function () {
              //문서가운데 위치(가로) : (윈도창의 너비-열려질모달의가로) / 2
              var xpos = ($(this).width() - _mdCnt.outerWidth()) / 2;
              var ypos = ($(this).height() - _mdCnt.outerHeight()) / 2;
              console.log(xpos, ypos);
              _mdCnt.css({left: xpos, top: ypos});
          }, 50);
      });
      $(window).trigger('resize');

      //4) #dim, 모달 컨텐츠를 보여지게 처리, 첫번째 링크에 포커스 강제 이동
      _dim.stop().fadeIn().next().css('visibility', 'visible');
      _first.focus();

      //비디오 제어 : 비디오 자동실행
      /* DOM 요소의 함수호출 
	  
      .get() 선택한 요소를 배열(Array)로 가져옵니다
      .get( index ) 선택한 요소 중 특정한 것만 가져옵니다.

      $('#videoId').get(0).play();
      $('#videoId').get(0).pause();  */
      $('#infoVideo').get(0).play();

      //5-1) 접근성 추가 : 첫번째 링크에서 shift+tab을 누르면 가장 마지막으로 포커스 강제이동
      _first.on('keydown', function (e) {
          console.log( e.keyCode ); //tab => 9
          if (e.shiftKey && e.keyCode == 9) {
              e.preventDefault();
              _last.focus();
          }
      });

      //5-2) 접근성 추가 : 마지막 링크에서 shift(X)+tab을 누르면 가장 처음으로 포커스 강제이동
      _last.on('keydown', function (e) {
          console.log( e.keyCode ); //tab => 9
          if ( !e.shiftKey && e.keyCode == 9 ) {
              e.preventDefault();
              _first.focus();
          }
      });

      //닫기 버튼 클릭시
      _closeBtn.on('click', function () {
          //1) _dim 투명도 0으로 사라지기(완료함수로 remove()로 제거), 
          _dim.stop().fadeOut('fast', function () {
              $(this).remove();
          });

          //2) 모달컨텐츠 숨기기(visibility)
          //모달상세컨텐츠의 나머지 형제들을 스크린리더에서 접근할수 있도록 되돌리기(제거 - aria-hidden, inert)
          _mdCnt.css('visibility', 'hidden').siblings().removeAttr('aria-hidden inert');

          //3) 열기 버튼으로 포커스 강제 이동
          _openBtn.focus();

          //4)비디오 제어 : play중인 비디오 끄고 첫번째 프레임으로 이동시키기?
          $('#infoVideo').get(0).pause();
          $('#infoVideo').get(0).currentTime = 0;
      });

      //#dim을 클릭해도 모달 닫기기
      _dim.on('click', function () {
          _closeBtn.click();
      });

      //esc 키보드를 클릭하면 모달 닫기기
      $(window).on('keydown', function (e) {
          console.log(e.keyCode);  //27
          if (e.keyCode == 27) _closeBtn.click();
      });
  });

  //본문5 글자수 제한
  function textLimit(_txt, size) {
    var txt = $(_txt).text();
    var limit = txt.slice(0, size);
    console.log(_txt, size, txt, limit);
    
    txt = txt.replace(txt, limit + '...');
    $(_txt).text(txt);
  }
});