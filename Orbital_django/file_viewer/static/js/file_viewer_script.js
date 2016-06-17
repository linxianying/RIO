var numPages = 0;

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

/**
 * every 8ms, check whether the specified img finsih being loaded, if so, call the specified callback function
 * @param  {imgDomElement} img
 * @param  {function} callback
 * @return {undefined}
 */
function imgLoad(img, callback) {
    var timer = setInterval(function() {
        if (img.complete) {
            callback(img)
            clearInterval(timer)
        }
    }, 8)
}

function startListeningSelectionBoxCreation() {
    var annotationColor = "rgba(0,0,0,0.18)";

    $("#annotation_color_buttons_div").find("button").on("click", function() {
        annotationColor = $(this).css("background-color");
    });

    $(".PageImg, .PageCanvas").on("mousedown", function(e) {
        var page = $(e.target);
        var mouse_absolut_x = e.pageX;
        var mouse_absolut_y = e.pageY;
        var page_top_left_x = page.offset().left;
        var page_top_left_y = page.offset().top;
        var top_left_relative_x = mouse_absolut_x - page_top_left_x;
        var top_left_relative_y = mouse_absolut_y - page_top_left_y;

        var new_annotation = $("<div class='Annotation'></div>");
        page.parents(".page_div, .PageDiv").append(new_annotation);
        new_annotation.css({
            "background": annotationColor,
            "position": "absolute",
            "width": "1px",
            "height": "1px",
            "left": top_left_relative_x,
            "top": top_left_relative_y,
        });

        $(".PageImg, .PageCanvas, .Annotation").on("mousemove", function(e) {
            mouse_absolut_x = e.pageX;
            mouse_absolut_y = e.pageY;
            page_top_left_x = page.offset().left;
            page_top_left_y = page.offset().top;
            var bottom_right_relative_x = mouse_absolut_x - page_top_left_x;
            var bottom_right_relative_y = mouse_absolut_y - page_top_left_y;

            new_annotation.css({
                "width": Math.abs(bottom_right_relative_x - top_left_relative_x),
                "height": Math.abs(bottom_right_relative_y - top_left_relative_y),
                "left": Math.min(top_left_relative_x, bottom_right_relative_x),
                "top": Math.min(top_left_relative_y, bottom_right_relative_y),
            });
            e.stopPropagation();
        });
        
        $("body").on("mouseup", function(e){
            if ($(e.target).hasClass("PageImg") || $(e.target).hasClass("PageCanvas") || $(e.target).hasClass("Annotation")) {
                var page_height = page.attr("height");
                var page_width = page.attr("width");
                var top_percent = new_annotation.css("top") / page_height;
                var left_percent = new_annotation.css("left") / page_width;
                var height_percent = new_annotation.css("height") / page_height;
                var width_percent = new_annotation.css("width") / page_width;

                new_annotation.draggable({ containment: "parent" }).resizable({ containment: "parent" });
                $('#annotation_modal').modal('toggle');
                
                $(".PageImg, .PageCanvas, .Annotation").off("mousemove");
                $("body").off("mouseup");
            }
            // if mouse is released outside of PageImg or PageCanvas, it is invalid
            else {
                new_annotation.remove();

                $(".PageImg, .PageCanvas, .Annotation").off("mousemove");
                $("body").off("mouseup");
            }
            e.stopPropagation();
        });

        e.stopPropagation();
    });
}

function resizeAnnotations(scaleFactor) {
    $(".Annotation").each(function() {
        $(this).css("top", parseFloat($(this).css("top")) * scaleFactor + "px");
        $(this).css("left", parseFloat($(this).css("left")) * scaleFactor + "px");
        $(this).css("width", parseFloat($(this).css("width")) * scaleFactor + "px");
        $(this).css("height", parseFloat($(this).css("height")) * scaleFactor + "px");
        $(this).css("border_radius", parseFloat($(this).css("border_radius")) * scaleFactor + "px");
    });
}

/**
 * scroll the specified page into fileViewer's visible window
 * @param {int} pageIndex - the index of the page to be scroll to 
 * @return {undefined}
 */
function scrollPageIntoView(pageIndex) {
    var pageDivId = "page_div_" + pageIndex;
    var pageDiv = $("#" + pageDivId);
    var fileViewer = $("#file_viewer");
    // "down" is the number of pixels to scroll the visible part down from the top of fileViewer
    var down = pageDiv.offset().top - fileViewer.offset().top + fileViewer.scrollTop();
    // animatedly scroll, 240 means the scrolling process take 240ms long
    fileViewer.animate({scrollTop: parseInt(down)}, 240);
}

function prepareScrollPageIntoView() {
    var input = $("#scroll_page_into_view_div").children("input");
    var button = $("#scroll_page_into_view_div").children("button");
    input.attr("min", "1");
    input.attr("max", numPages.toString());
    button.on("click", function() {
        var pageIndex = input.val();
        scrollPageIntoView(pageIndex);
    });
}

scaleFactor = 1.08;

$(document).ready(function() {
    markdown();

    $("#refresh_comment_button").on('click', function () {
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

    // img resize
    $("#buttonForLarger").on('click', function () {
        if ($("canvas").length == 0) {
            var oldScrollHeight = $("#file_viewer")[0].scrollHeight;
            
            $('.PageImg').css("width", parseFloat($('.PageImg').css("width")) * scaleFactor + "px");
            $(".PageDiv").each(function() {
                var div = $(this);
                var img = div.children(".PageImg");
                div.css("width", img.width() + 6 + "px");
                div.css("height", img.height() + 6 + "px");              
            });
            resizeAnnotations(scaleFactor);

            var factor = $("#file_viewer")[0].scrollHeight / oldScrollHeight
            $("#file_viewer").scrollTop(parseFloat($("#file_viewer").scrollTop()) * factor);
        }
    });
    $("#buttonForSmaller").on('click', function () {
        if ($("canvas").length == 0) {
            var oldScrollHeight = $("#file_viewer")[0].scrollHeight;
          
            $(".PageImg").css("width", parseFloat($('.PageImg').css("width")) / scaleFactor + "px");
            $(".PageDiv").each(function() {
                var div = $(this);
                var img = div.children(".PageImg");
                div.css("width", img.width() + 6 + "px");
                div.css("height", img.height() + 6 + "px");               
            });
            resizeAnnotations(1 / scaleFactor);

            var factor = $("#file_viewer")[0].scrollHeight / oldScrollHeight
            $("#file_viewer").scrollTop(parseFloat($("#file_viewer").scrollTop()) * factor);
        }
    });

    $(document).ready(function () {
        var wrapper = $("#wrapper");
        var fileViewer = $("#file_viewer");
        //设置wrapper的高度
        wrapper.css("height", document.body.clientHeight - 24 + "px"); //jquery的css方法既可以设置css内容又可以获取css内容
        //设置fileViewer的高度和宽度
        fileViewer.css("height", wrapper.height() + "px");
        fileViewer.css("width", parseInt(wrapper.css("width")) * 0.6 + "px"); //jquery的css方法获得的是字符串，用js的parseInt获取数值
        //设置comments_viewer的高度和宽度
        $("#comments_viewer").css("height", wrapper.height() * 0.8 + "px");
        $("#comments_viewer").css("width", wrapper.width() - fileViewer.width() - 2 + "px");
        //设置文档的大小
        $(".PageImg").css("width", fileViewer.width() - 24 + "px");
        $(".PageDiv").each(function() {
            var div = $(this);
            var img = div.children(".PageImg");
            imgLoad(img[0], function() {
                div.css("width", img.width() + 6 + "px");
                div.css("height", img.height() + 6 + "px");
            });
            /* this is not correct when images are gotten from cache rather than loaded from url
               "complete" is true when the image is shown
               "load" is triggered when the image is loaded from url
            img.load(function() {
                div.css("height", img.height() + 6 + "px");
            });*/
        });
    });
    $(window).resize(function () {
        var wrapper = $("#wrapper");
        var fileViewer = $("#file_viewer");
        wrapper.css("height", document.body.clientHeight - 24 + "px");
        fileViewer.css("height", wrapper.height() + "px");
        fileViewer.css("width", wrapper.width() * 0.6 + "px");
        $("#comments_viewer").css("height", wrapper.height() * 0.8 + "px");
        $("#comments_viewer").css("width", wrapper.width() - fileViewer.width() - 2 + "px");
        //设置文档的大小
        var originalWidth = parseFloat($(".PageImg").css("width"));

        $(".PageImg").css("width", fileViewer.width() - 24 + "px");

        $(".PageDiv").each(function() {
            var div = $(this);
            var img = div.children(".PageImg");
            imgLoad(img[0], function() {
                div.css("width", img.width() + 6 + "px");
                div.css("height", img.height() + 6 + "px");
            });
        });

        var newWidth = parseFloat($(".PageImg").css("width"));
        var scaleFactor = newWidth / originalWidth;
        resizeAnnotations(scaleFactor)
    });

    $("#show_annotation_frame_button").on('click', function() {
        $(".Annotation").each(function() {
            $(this).slideDown(180);
        });
    });
    $("#hide_annotation_frame_button").on('click', function() {
        $(".Annotation").each(function() {
            $(this).slideUp(180);
        });
    });
});