$(document).ready(function(){
	var myArray = sessionStorage.getItem('myArray');
	$('.times').each(function(){
		var name = $(this).find('.card-title').html();
		if (myArray.indexOf(name) == -1)
		{
			$(this).closest('.times').hide();
		}
	});
	$('.orange-toggle').click(function() {
    	var color = $(this).css('background');
		console.log(color);
    	if (color == 'rgb(255, 112, 80) none repeat scroll 0% 0% / auto padding-box border-box') {
			this.style.setProperty('background', '#bf360c', 'important');
			console.log('yyy');
    	} else {
			this.closest('.orange-toggle').style.setProperty('background', '#ff7050', 'important');
		}
	});
	$('.submit').click(function() {
        window.location.href = '/';
    });
});