var numPages = 0;
var new_annotation_id;

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

    // 可以在已经完成的annotation selection frame上新建一个selection frame
    $(".PageDiv, .page_div").on("mousedown", function(e) {
        // 如果是新建尚未上传的annotation，则不能在其selection frame上新建一个selection frame，因为点击这个事件要用来给这个尚未上传的annotation的frame做drag或者resize
        if ($(e.target).hasClass('ui-draggable'))
            return ;
        var page = $(this).find(".PageImg, .PageCanvas");
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
                var page_height = page.height();
                var page_width = page.width();
                var top_percent = parseFloat(new_annotation.css("top")) / page_height;
                var left_percent = parseFloat(new_annotation.css("left")) / page_width;
                var height_percent = parseFloat(new_annotation.css("height")) / page_height;
                var width_percent = parseFloat(new_annotation.css("width")) / page_width;

                new_annotation.draggable({ containment: "parent" }).resizable({ containment: "parent" });
                
                // show post-annotation window
                // "annotationWindow" is a number (start from 1), which is the index of this annotatation window
                var annotationWindow = layer.open({
                    type: 1,
                    title: "Post Annotation",
                    shadeClose: true,
                    shade: false,
                    maxmin: true, //开启最大化最小化按钮
                    area: ['380px', '280px'],
                    content:    '<form id="annotation_form">\
                                    <textarea name="annotation_content" class="form-control" rows="8" style="resize: vertical"></textarea>\
                                    <!--i use ajax to submit instead of using submit button-->\
                                    <button id="post_annotation_button" type="button" class="btn btn-info" name="document_id" value="{{ document.id }}"\ style="margin-top: 8px; float: right;">post annotation</button>\
                                </form>',
                    cancel: function() { //窗口被关闭的回调函数：当窗口被关闭，annotation选定框也一并删除
                        new_annotation.remove();
                    }
                }); 

                // annotationWindowJqueryObject will return the jquery object of the annotation window
                // this is to deal with the case when the user create more than one annotation windows.
                var annotationWindowJqueryObject = $("div.layui-layer[times=" + annotationWindow + "]");
                annotationWindowJqueryObject.find("#post_annotation_button").on("click", function () {
                    $.ajax({
                        type: "POST",
                        url: "",
                        data: {
                            csrfmiddlewaretoken: getCookie('csrftoken'),
                            operation: "annotate",
                            annotation_content: annotationWindowJqueryObject. find("textarea[name='annotation_content']").val(),
                            page_id: page.attr("id"),
                            top_percent: top_percent,
                            left_percent: left_percent,
                            height_percent: height_percent,
                            width_percent: width_percent,
                            frame_color: annotationColor,
                            document_id: $("button[name='document_id']").val(),
                        },
                        success: function (data) {
                            // after uploading the annotation, 选择框将不再可以调整大小和拖动
                            new_annotation.draggable("destroy").resizable("destroy");
                            $("#annotation_update_div").html(data);

                            new_annotation.attr("annotation_id", new_annotation_id)

        
                            // after uploading the annotation, close the window
                            layer.close(annotationWindow);
                        },
                    })
                    // 在ajax上传的过程中，禁用上传annotation的按钮防止用户在ajax上传过程中（需要一小段时间）又重复点击了post_annotation_button
                    annotationWindowJqueryObject.find("#post_annotation_button").attr("disabled", true);
                });
                
                $(".PageImg, .PageCanvas, .Annotation").off("mousemove");
                $("body").off("mouseup");
                // 重新启用上传annotation的按钮
                annotationWindowJqueryObject.find("#post_annotation_button").attr("disabled", false);
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
    });
}

/**
 * scroll the specified page into fileViewer's visible window
 * @param {int} pageIndex - the index of the page to be scroll to 
 * @return {undefined}
 */
function scrollPageDivIntoView(pageDiv) {
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
        var pageDivId = "page_div_" + pageIndex;
        var pageDiv = $("#" + pageDivId);
        scrollPageDivIntoView(pageDiv);
    });
}

function addCommentRelatedListener() {
    $(".likeCommentButton").on("click", function () {
        $this = $(this);
        $.ajax({
            type: "POST",
            url: "",
            data: {
                csrfmiddlewaretoken: getCookie('csrftoken'),
                operation: "like_comment",
                comment_id: $this.attr("comment_id"),
            },
            success: function () {
                var new_num = parseInt($this.next().text()) + 1;
                $this.next().text(new_num.toString())                
                $this.off("click");
                $this.css("color", "#6495ED");
                $this.on("click", function() {
                    layer.msg('already liked', {
                        icon: 6,
                    });
                });
            },
        });
    });
    $(".reply_comment_button").on("click", function() {
        $(this).next(".reply_comment_form").slideToggle(180);
    })
    $(".post_comment_reply_button").on("click", function() {
        var $thisButton = $(this);
        var index = layer.load(0, {shade: 0.18}); //0代表加载的风格，支持0-2
        $.ajax({
            type: "POST",
            url: "",
            data: {
                csrfmiddlewaretoken: getCookie('csrftoken'),
                operation: "comment",
                comment_content: $thisButton.prev("textarea[name='comment_content']").val(),
                document_id: $("button[name='document_id']").val(),
                reply_to_comment_id: $thisButton.val(),
            },
            success: function (data) {
                $("#comment_update_div").html(data);
                // 修改html内容后，有关的事件监听会被自动删除，因此需要重新添加事件监听
                addCommentRelatedListener();
                layer.close(index);
            }
        })
    })
}

scaleFactor = 1.08;

$(document).ready(function() {

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
        //设置annotation_update_div的高度和宽度
        $("#annotation_update_div").css("height", wrapper.height() * 0.8 + "px");
        $("#annotation_update_div").css("width", wrapper.width() - fileViewer.width() - 2 + "px");
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
        $("#annotation_update_div").css("height", wrapper.height() * 0.8 + "px");
        $("#annotation_update_div").css("width", wrapper.width() - fileViewer.width() - 2 + "px");
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

    $("#post_comment_button").click(function () {
        $thisButton = $(this);
        var index = layer.load(0, {shade: 0.18}); //0代表加载的风格，支持0-2
        $.ajax({
            type: "POST",
            url: "",
            data: {
                csrfmiddlewaretoken: getCookie('csrftoken'),
                operation: "comment",
                comment_content: $("textarea[name='comment_content']").val(),
                document_id: $("button[name='document_id']").val(),
            },
            success: function (data) {
                $("#comment_update_div").html(data);
                // 修改html内容后，有关的事件监听会被自动删除，因此需要重新添加事件监听
                addCommentRelatedListener();
                $("textarea[name='comment_content']").val("");
                layer.close(index);
            }
        })
    });
    addCommentRelatedListener()
});