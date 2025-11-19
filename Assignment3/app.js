$(function(){

  loadStories();
  $("#stories").on("click", ".btn-danger", handeldelete);
  $("#stories").on("click", ".btn-success", handleEdit);
  $("#mybtn").click(addStory);


});

function addStory() {
  let title = prompt("Enter story title:");
  let content = prompt("Enter story content:");

  if (!title || !content) return; 

  $.ajax({
      url: "https://usmanlive.com/wp-json/api/stories",
      method: "POST",
      data: {
          title: title,
          content: content
      },
      success: function () {
          loadStories();
      }
  });
}

function handleEdit(){
  let myid = $(this);
  let closeest = myid.closest("#story");
  let myidd = closeest.attr("data-id");

  let oldtitle = closeest.find("h5").contents().first().text();
  let oldbody = closeest.find("p").contents().first().text();


  let newTitle = prompt("Enter new title:", oldtitle);
  let newContent = prompt("Enter new content:", oldbody);

  $.ajax({
    url: "https://usmanlive.com/wp-json/api/stories/" + myidd,
    method: "PUT",
    data: {
        title: newTitle,
        content: newContent
    },
    success: function () {
        loadStories();
    }
  });

}

function handeldelete(){
  let myid = $(this);
  let closeest = myid.closest("#story");
  let myidd = closeest.attr("data-id");

  $.ajax({
    url: "https://usmanlive.com/wp-json/api/stories/" + myidd,
    method: "DELETE",
    success: function(){
      loadStories();
    }
  });
}

function loadStories(){
  $.ajax({
    url:"https://usmanlive.com/wp-json/api/stories",
    method:"GET",
    success: function(resp){
      let stories = $("#stories");
      stories.empty();
      
      for(let story of resp){
        stories.append(`
          <div id="story" data-id="${story.id}">
            <h5>
              ${story.title}
              <button type="button" class="btn btn-danger btn-sm float-right">delete</button>
            </h5>
            <p>
              ${story.content}
              <button type="button" class="btn btn-success btn-sm float-right">edit</button>
            </p>
          </div>
        `);
      }
    }
  });
}
