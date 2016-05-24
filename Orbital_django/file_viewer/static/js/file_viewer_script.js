
function markdown() {
    $(".content-markdown").each(function() {
        $(this).html(marked($(this).text()));
    });
}


$(document).ready(function() {
    markdown();
});


$(document).ready(function() {

    $("#buttonForLarger").click(function () {
        $(".Page").css("width", parseInt($(".Page").css("width")) + 80 + "px");
    });
    $("#buttonForSmaller").click(function () {
        $(".Page").css("width", parseInt($(".Page").css("width")) - 80 + "px");
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
    });
    $(window).resize(function () {
        $("#wrapper").css("height", document.body.clientHeight - 24 + "px");
        $("#fileViewer").css("height", parseInt($("#wrapper").css("height")) + "px");
        $("#fileViewer").css("width", parseInt($("#wrapper").css("width")) * 0.6 + "px");
        $("#commentsViewer").css("height", parseInt($("#wrapper").css("height")) * 0.8 + "px");
        $("#commentsViewer").css("width", parseInt($("#wrapper").css("width")) - parseInt($("#fileViewer").css("width")) - 2 + "px");
        //设置文档的大小
        $(".Page").css("width", parseInt($("#fileViewer").css("width")) - 24 + "px");
    });
});