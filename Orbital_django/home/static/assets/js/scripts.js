var email_address;

jQuery(document).ready(function() {

    // Fullscreen background
    $.backstretch("/static/assets/img/backgrounds/1.jpg");

    $('#top-navbar-1').on('shown.bs.collapse', function(){
    	$.backstretch("resize");
    });
    $('#top-navbar-1').on('hidden.bs.collapse', function(){
    	$.backstretch("resize");
    });
    

    // Form
    $('.registration-form:first-child fieldset').fadeIn('slow');
    
    $('.registration-form input[type="text"], .registration-form input[type="password"], .registration-form input[type="email"]').on('focus', function() {
    	$(this).removeClass('input-error');
    });

    // submit
    $('.registration-form').on('submit', function(e) {
        $(this).find('input[type="text"], input[type="password"], input[type="email"]').each(function() {
            if( $(this).val() == "" ) {
                e.preventDefault();
                $(this).addClass('input-error');
            }
            else {
                $(this).removeClass('input-error');
            }
        });
    });

    // first step's next step
    $('.registration-form .btn-next').click(function() {
    	var parentRegistrationForm = $(this).parents('.registration-form');
    	var nextStep = false;
    	
        $(this).parents(".registration-form").find("iframe").load(function() {
            nextStep = true;
    
        	parentRegistrationForm.find('input[type="text"], input[type="password"], input[type="email"]').each(function() {
        		if( $(this).val() == "" ) {
        			$(this).addClass('input-error');
        			nextStep = false;
        		}
        		else {
        			$(this).removeClass('input-error');
        		}
        	});

        	if(nextStep) {
                email_address = parentRegistrationForm.find('input[type="email"]').val();

        		parentRegistrationForm.children('fieldset').fadeOut(400, function() {
    	    		parentRegistrationForm.next().children("fieldset").fadeIn();
    	    	});
        	}
    	});

    });

    // second step
    $('#sign_me_up_button').on('click', function(e) {
        var parentRegistrationForm = $(this).parents('.registration-form');
        parentRegistrationForm.find('input[type="text"], input[type="password"], input[type="email"]').each(function() {
            if( $(this).val() == "" ) {
                $(this).addClass('input-error');
            }
            else {
                $(this).removeClass('input-error');
                $.ajax({
                    type: "POST",
                    url: "/handle_sign_up",
                    data: {
                        csrfmiddlewaretoken: getCookie('csrftoken'),
                        verification_code: $("input[name='verification_code']").val(),
                        email_address: email_address,
                    },
                    success: function (data) {
                        if (data == "wrong") {
                            document.getElementById("message2").innerHTML="<font color='red'>verification code is incorrect</font>";
                        }
                        else {
                            window.location.href = "/";  // return to home page
                        }
                    },
                })
            }
        });
    });

    // when leave sign_up_page, send information to the server to delete the information for this signing up
    $(window).unload(function(){
        $.ajax({
            type: "POST",
            url: "/handle_sign_up",
            data: {
                csrfmiddlewaretoken: getCookie('csrftoken'),
                leave: "yes",
                email_address: email_address,
            },
        })
    });

    // clear
    $('.registration-form .btn-clear').click(function() {
        $(this).parents('.form-bottom').find('input').val("");
    });

    // password validate
    $(".registration-form[target='for_submit_refresh']").find("input[name='password_confirm']").keyup(function () {
        var pw1 = document.getElementsByName("password")[0].value;
        var pw2 = document.getElementsByName("password_confirm")[0].value;
        if(pw2.length < 6){
            document.getElementById("message").innerHTML="<font color='red'>Password must be longer than or equal to 6 digts.</font>";
            document.getElementById("next_button").disabled = true;
        }
        else if(! /^(?=.*[a-z])[a-z0-9]+/ig.test(pw2)){
            document.getElementById("message").innerHTML="<font color='red'>Password may contain only letters or numbers.</font>";
            document.getElementById("next_button").disabled = true;
        }
        else if(pw1 == pw2) {
            document.getElementById("message").innerHTML="<font color='green'>Password confirmed.</font>";
            document.getElementById("next_button").disabled = false;
        } 
        else {
            document.getElementById("message").innerHTML="<font color='red'>Passwords mismatch.</font>";
            document.getElementById("next_button").disabled = true;
        }
    });
    
});

function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie != '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) == (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
