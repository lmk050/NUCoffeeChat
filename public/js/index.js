$(document).ready(function(){
	$('.parallax').parallax();
    $('.modal-trigger').leanModal();
    $('.schedule-meet').click(function() {
		var checkedValues = [];
		$('[data-schedule-cc]').each(function(){
			var val = $(this).find('input').val();
			if (val == 'on') {
				checkedValues.push($(this).find('.card-title').html());
			}
		});
		sessionStorage.setItem('myArray', checkedValues);
        window.location.href = '/schedule';
    });
    $('[data-schedule-cc]').click(function() {
    	var val = $(this).find('input').val();
    	if (val == 'on') {
			$(this).find('input').val('off');
			$(this).find('.card').css('border', 'none').css('margin-left', '+=3px').css('margin-right', '+=3px').css('margin-top', '+=3px').css('margin-bottom', '+=3px');
                                  
    	} else {
			$(this).find('input').val('on');
			$(this).find('.card').css('border', 'solid #ff7050 3px').css('margin-left', '-=3px').css('margin-right', '-=3px').css('margin-top', '-=3px').css('margin-bottom', '-=3px').css('border-radius','3px');
    	}
    });
    $('[data-schedule-cc]').hover(function() {
        $(this).closest('.card').css('overflow', 'hidden');
        $(this).find('.card-reveal').css({ display: 'block'}).hide().fadeTo(200,0.9).css('transform','translateY(-100%)');
    },function() {
        $(this).closest('.card').css('overflow', 'hidden');
        $(this).find('.card-reveal').css({ display: 'block'}).fadeOut(200,function() {
                $(this).find('.card-reveal').css('transform','translateY(100%)');
            });
    });
});