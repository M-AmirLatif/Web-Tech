$(function(){
    $("#submitBtn").click(onclickhandle);
    $(document).on("click", ".deleteBtn", ondelete);

})

function ondelete(){
    $(this).closest("tr").remove();
}

function onclickhandle(){

    var newName = $("#name").val();
    var newEmail = $("#email").val();

    if(!newName || !newEmail){
        $("#name").addClass("error");
        $("#email").addClass("error");
        return;
    }
    $("#name").removeClass("error");
    $("#email").removeClass("error");

    $("#name").val("");
    $("#email").val("");

    $("#datatable").append(`
        <tr>
            <td>${newName}</td>
            <td>${newEmail}</td>
            <td>
                <button class="deleteBtn">Delete</button>
            </td>
        </tr>
    `);
}