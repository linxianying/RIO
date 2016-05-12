/*
children() 返回所有下一级匹配的子元素 immediate children
find() 返回所有匹配的子元素 descendants
*/

jQuery(document).ready(function() {
	
    /*
        Fullscreen background
    */
    $.backstretch("https://1co1va.dm2301.livefilestore.com/y3mAfgVmNYki1nA-PAkefY4f2cSDitfyL8BijVD8knmQG7e7ZPbUISBupMXLiGD-PXIkQkLgd7ob-Pojf8aB_SqSiX3znQURMJAvbtjVoKr8v7YdtsfeO5U9jd5rFUhrFkfziwrfCPzPikZ-VQi2_1CijgLj7s82C8-NKDWRrhrkzU?width=1680&height=1050&cropmode=none");
    /*
        原本是用本地的图片，但是本地地址在前面会被自动添加一个app的url，将原本的assets/img/backgrounds/1.jpg变成/home/assets/img/backgrounds/1.jpg，即使是加/static/也会变成/home/assets/img/backgrounds/1.jpg
        而这个地址在django静态文件地址系统中是错误的，会报404错误找不到图片文件。正确的地址/static/assets/img/backgrounds/1.jpg或者/static/home/assets/img/backgrounds/1.jpg（取决于图片是放在static文件夹还是static文件夹的子文件夹下）
        所以这里直接传到onedrive上，然后直接用绝对url引用
        $.backstretch("assets/img/backgrounds/1.jpg");
     */
    "https://1co1va.dm2301.livefilestore.com/y3mAfgVmNYki1nA-PAkefY4f2cSDitfyL8BijVD8knmQG7e7ZPbUISBupMXLiGD-PXIkQkLgd7ob-Pojf8aB_SqSiX3znQURMJAvbtjVoKr8v7YdtsfeO5U9jd5rFUhrFkfziwrfCPzPikZ-VQi2_1CijgLj7s82C8-NKDWRrhrkzU?width=1680&height=1050&cropmode=none"
    $('#top-navbar-1').on('shown.bs.collapse', function(){
    	$.backstretch("resize");
    });
    $('#top-navbar-1').on('hidden.bs.collapse', function(){
    	$.backstretch("resize");
    });
    
    /*
        Form
    */
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

    // next step
    $('.registration-form .btn-next').click(function() {
    	var parentRegistrationForm = $(this).parents('.registration-form');
    	var nextStep = false;
    	
        $(this).parents(".registration-form").find("iframe").load(function() {
        //$("iframe").load(function() {
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
        		parentRegistrationForm.children('fieldset').fadeOut(400, function() {
    	    		parentRegistrationForm.next().children("fieldset").fadeIn();
    	    	});
        	}
    	});

    });
    
    // previous step
    $('.registration-form .btn-previous').click(function() {
        var parentRegistrationForm = $(this).parents('.registration-form');
    	parentRegistrationForm.children('fieldset').fadeOut(400, function() {
            parentRegistrationForm.prev().children("fieldset").fadeIn();
        });
    });

    //clear
    $('.registration-form .btn-clear').click(function() {
        $(this).parents('.form-bottom').find('input').val("");
    });
   
});
