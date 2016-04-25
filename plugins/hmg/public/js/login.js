
function tryLogin(username, password){
	console.log('trying to log in');
	$('#loginWoman').html('<p>Godkjenner...</p>');
	$('.login').removeClass('error');
	$('.login').addClass('authenticating');

	$.post( "/logg-inn", {username:username, password:password})
	.done(function(response) {
		console.log(response);
		loggedIn();
	})
	.fail(function(err) {
		failLogin(err);
		console.log(err);
	});
}

function failLogin(error){
	if(error.status === 401 || error.status === 403)
		$('#loginWoman').html('<p>Feil brukernavn eller passord.</p>');
	else{
		$('#loginWoman').html('<p>Noko gjekk gale. Sjekk brukernavn og passord</p>')
	}

	$('.login').removeClass('loading');
	$('.login').addClass('error');
}

function loggedIn(){

	$('.login').addClass('loading');
	$('#loginWoman').html('<p>Innlogging vellykket.</p>');

	window.location.replace("/admin");
}

$(function(){
    $('#loginform').submit(function(e){
    	e.preventDefault();

    	var username = $('#loginform').find('#username').val();
    	var password = $('#loginform').find('#password').val();

        tryLogin(username, password);
    });
})
