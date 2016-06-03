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


function markdown() {
    $(".content-markdown").each(function() {
        $(this).html(marked($(this).text()));
    });
}

function imgLoad(img, callback) {
    var timer = setInterval(function() {
        if (img.complete) {
            callback(img)
            clearInterval(timer)
        }
    }, 18)
}

scale_factor = 1.08;

$(document).ready(function() {
    markdown();

    $("#refresh_comment_button").click(function () {
        $.ajax({
            type: "POST",
            url: "",
            data: {
                csrfmiddlewaretoken: getCookie('csrftoken'),
                operation: "refresh",
                document_id: $("button[name='document_id']").val(),
            },
            success: function (data) {
                $("#comment_update_div").html(data);
                markdown();
            },
        })
    });

    $("#buttonForLarger").click(function () {
        $(".Page").css("width", parseFloat($(".Page").css("width")) * scale_factor + "px");
        $(".PageDiv").each(function() {
            var div = $(this);
            div.css("height", (parseFloat(div.css("height")) - 6) * scale_factor + 6 + "px");
            div.css("width", (parseFloat(div.css("width")) - 6) * scale_factor + 6 + "px");
        });
        $(".Annotation").each(function() {
            $(this).css("top", parseFloat($(this).css("top")) * scale_factor + "px");
            $(this).css("left", parseFloat($(this).css("left")) * scale_factor + "px");
            $(this).css("width", parseFloat($(this).css("width")) * scale_factor + "px");
            $(this).css("height", parseFloat($(this).css("height")) * scale_factor + "px");
            $(this).css("border_radius", parseFloat($(this).css("border_radius")) * scale_factor + "px");
        });
    });
    $("#buttonForSmaller").click(function () {
        $(".Page").css("width", parseFloat($(".Page").css("width")) / scale_factor + "px");
        $(".PageDiv").each(function() {
            var div = $(this);
            div.css("height", (parseFloat(div.css("height")) - 6) / scale_factor + 6 + "px");
            div.css("width", (parseFloat(div.css("width")) - 6) / scale_factor + 6 + "px");
        });
        $(".Annotation").each(function() {
            $(this).css("top", parseFloat($(this).css("top")) / scale_factor + "px");
            $(this).css("left", parseFloat($(this).css("left")) / scale_factor + "px");
            $(this).css("width", parseFloat($(this).css("width")) / scale_factor + "px");
            $(this).css("height", parseFloat($(this).css("height")) / scale_factor + "px");
            $(this).css("border_radius", parseFloat($(this).css("border_radius")) / scale_factor + "px");
        });
    });

    $(document).ready(function () {
        //设置wrapper的高度
        $("#wrapper").css("height", document.body.clientHeight - 24 + "px"); //jquery的css方法既可以设置css内容又可以获取css内容
        //设置fileViewer的高度和宽度
        $("#fileViewer").css("height", parseInt($("#wrapper").css("height")) + "px");
        $("#fileViewer").css("width", parseInt($("#wrapper").css("width")) * 0.6 + "px"); //jquery的css方法获得的是字符串，用js的parseInt获取数值
        //设置commentsViewer的高度和宽度
        $("#commentsViewer").css("height", parseInt($("#wrapper").css("height")) * 0.8 + "px");
        $("#commentsViewer").css("width", parseInt($("#wrapper").css("width")) - parseInt($("#fileViewer").css("width")) - 2 + "px");
        //设置文档的大小
        $(".Page").css("width", parseInt($("#fileViewer").css("width")) - 24 + "px");
        $(".PageDiv").each(function() {
            var div = $(this);
            var img = div.children(".Page");
            imgLoad(img[0], function() {
                div.css("height", img.height() + 6 + "px");
                div.css("width", img.width() + 6 + "px");
            });
            /* this is not correct when images are gotten from cache rather than loaded from url
               "complete" is true when the image is shown
               "load" is triggered when the image is loaded from url
            img.load(function() {
                div.css("height", img.height() + 6 + "px");
            });
            */
        });


    });
    $(window).resize(function () {
        $("#wrapper").css("height", document.body.clientHeight - 24 + "px");
        $("#fileViewer").css("height", parseInt($("#wrapper").css("height")) + "px");
        $("#fileViewer").css("width", parseInt($("#wrapper").css("width")) * 0.6 + "px");
        $("#commentsViewer").css("height", parseInt($("#wrapper").css("height")) * 0.8 + "px");
        $("#commentsViewer").css("width", parseInt($("#wrapper").css("width")) - parseInt($("#fileViewer").css("width")) - 2 + "px");
        //设置文档的大小
        var original_width = parseFloat($(".Page").css("width"));
        $(".Page").css("width", parseInt($("#fileViewer").css("width")) - 24 + "px");
        var new_width = parseFloat($(".Page").css("width"));
        var scale_factor = new_width / original_width;
        $(".PageDiv").each(function() {
            var div = $(this);
            var img = div.children(".Page");
            imgLoad(img[0], function() {
                div.css("height", img.height() + 6 + "px");
                div.css("width", img.width() + 6 + "px");
            });
        });
        $(".Annotation").each(function() {
            $(this).css("top", parseFloat($(this).css("top")) * scale_factor + "px");
            $(this).css("left", parseFloat($(this).css("left")) * scale_factor + "px");
            $(this).css("width", parseFloat($(this).css("width")) * scale_factor + "px");
            $(this).css("height", parseFloat($(this).css("height")) * scale_factor + "px");
            $(this).css("border_radius", parseFloat($(this).css("border_radius")) * scale_factor + "px");
        });
    });
});