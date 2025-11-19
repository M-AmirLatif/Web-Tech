$(function(){
    $("#content").click(function(){
        $.get("data.txt",function(resp){
            $("#result").empty();
            $("#result").append(resp);
        })
    })
})