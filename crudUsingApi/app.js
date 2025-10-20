// Step 3: Fetch and display posts

const API_URL = 'https://jsonplaceholder.typicode.com/posts';

$(function() {
  // when page loads, fetch posts
  fetchPosts();
});

function fetchPosts() {
  // get first 5 posts to keep it short
  $.get(API_URL + '?_limit=5')
    .done(function(data) {
      renderPosts(data);
    })
    .fail(function() {
      alert('Failed to fetch posts');
    });
}

function renderPosts(posts) {
  const tbody = $('#postsTable tbody');
  tbody.empty(); // clear old rows
  posts.forEach(post => {
    const row = `
      <tr data-id="${post.id}">
        <td>${post.id}</td>
        <td class="title">${escapeHtml(post.title)}</td>
        <td class="body">${escapeHtml(post.body)}</td>
        <td>
          <button class="editBtn">Edit</button>
          <button class="deleteBtn">Delete</button>
        </td>
      </tr>
    `;
    tbody.append(row);
  });
}

// helper: prevent HTML injection
function escapeHtml(s) {
  if (!s) return '';
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
// Step 4: Create a new post when form is submitted
$(function() {
  // form submit event
  $('#postForm').on('submit', function(e) {
    e.preventDefault(); // stop page reload

    const payload = {
      title: $('#title').val().trim(),
      body: $('#body').val().trim(),
      userId: 1
    };

    if (!payload.title || !payload.body) {
      alert('Please fill both fields');
      return;
    }

    // send POST request
    $.ajax({
      url: API_URL,
      method: 'POST',
      contentType: 'application/json; charset=UTF-8',
      data: JSON.stringify(payload)
    })
    .done(function(created) {
      alert('Post created (fake) with id ' + created.id);
      
      // add new row on top of table
      const newRow = `
        <tr data-id="${created.id}">
          <td>${created.id}</td>
          <td class="title">${escapeHtml(created.title)}</td>
          <td class="body">${escapeHtml(created.body)}</td>
          <td>
            <button class="editBtn">Edit</button>
            <button class="deleteBtn">Delete</button>
          </td>
        </tr>
      `;
      $('#postsTable tbody').prepend(newRow);

      // clear form
      $('#postId').val('');
      $('#title').val('');
      $('#body').val('');
    })
    .fail(function() {
      alert('Failed to create post');
    });
  });
});
// Step 5: Edit and Update a post

// When edit button is clicked, load post data into the form
$(document).on('click', '.editBtn', function() {
  const row = $(this).closest('tr');
  const id = row.data('id');
  const title = row.find('.title').text();
  const body = row.find('.body').text();

  // put values into form
  $('#postId').val(id);
  $('#title').val(title);
  $('#body').val(body);
});

// Modify form submit (create OR update)
$('#postForm').off('submit').on('submit', function(e) {
  e.preventDefault();

  const id = $('#postId').val();
  const payload = {
    title: $('#title').val().trim(),
    body: $('#body').val().trim(),
    userId: 1
  };

  if (!payload.title || !payload.body) {
    alert('Please fill both fields');
    return;
  }

  if (id) {
    // 🔹 Update existing post
    $.ajax({
      url: API_URL + '/' + id,
      method: 'PUT',
      contentType: 'application/json; charset=UTF-8',
      data: JSON.stringify(payload)
    })
    .done(function(updated) {
      alert('Post updated (fake) with id ' + updated.id);

      // update row in table
      const row = $(`#postsTable tr[data-id="${id}"]`);
      row.find('.title').text(updated.title);
      row.find('.body').text(updated.body);

      // clear form
      $('#postId').val('');
      $('#title').val('');
      $('#body').val('');
    })
    .fail(function() {
      alert('Failed to update post');
    });
  } else {
    // 🔹 Create new (same as before)
    $.ajax({
      url: API_URL,
      method: 'POST',
      contentType: 'application/json; charset=UTF-8',
      data: JSON.stringify(payload)
    })
    .done(function(created) {
      alert('Post created (fake) with id ' + created.id);
      const newRow = `
        <tr data-id="${created.id}">
          <td>${created.id}</td>
          <td class="title">${escapeHtml(created.title)}</td>
          <td class="body">${escapeHtml(created.body)}</td>
          <td>
            <button class="editBtn">Edit</button>
            <button class="deleteBtn">Delete</button>
          </td>
        </tr>
      `;
      $('#postsTable tbody').prepend(newRow);
      $('#postId').val('');
      $('#title').val('');
      $('#body').val('');
    })
    .fail(function() {
      alert('Failed to create post');
    });
  }
});
// Step 6: Delete a post
$(document).on('click', '.deleteBtn', function() {
  const row = $(this).closest('tr');
  const id = row.data('id');

  if (confirm('Are you sure you want to delete this post?')) {
    $.ajax({
      url: API_URL + '/' + id,
      method: 'DELETE'
    })
    .done(function() {
      alert('Post deleted (fake)');
      row.remove(); // remove row from table
    })
    .fail(function() {
      alert('Failed to delete post');
    });
  }
});
