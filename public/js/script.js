function getUserId() {
  return new Promise(function (resolve, reject) {
    $.ajax({
      url: '/user/id',
      type: 'GET',
      success: function (response) {
        resolve(response.userId);
      },
      error: function (xhr, status, error) {
        reject(error);
      }
    });
  });
}
function getUserEmailFromSession() {
  return new Promise(function (resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/user/email', true);
    xhr.onload = function () {
      if (xhr.status === 200) {
        var response = JSON.parse(xhr.responseText);
        resolve(response.userEmail);
      } else {
        reject(new Error('Error retrieving user email'));
      }
    };
    xhr.onerror = function () {
      reject(new Error('Network error'));
    };
    xhr.send();
  });
}
function deleteArticle(id) {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: `/articles/${id}`,
      method: 'DELETE',
      success: (data) => {
        resolve(data)
      },
      error: (error) => {
        reject(error)
      }
    })
  })
}
function getComment(articleId) {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: `/comments`,
      method: 'GET',
      dataType: 'json',
      data: {
        "article": articleId,
      },
      success: function (data) {
        resolve(data);
      },
      error: function (data) {
        reject(data);
      }
    })
  })
}
function postLogin(username, password) {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: '/login',
      method: 'POST',
      data: {
        email: username,
        password: password
      },
      success: function (data) {
        resolve(data);
      },
      error: function (data) {
        reject(data);
      }
    })
  })
}
function postComment(numberId, commentContent) {
  return new Promise((resolve, reject) =>
    $.ajax({
      url: `/comments`,
      method: 'POST',
      data: {
        "contenu": commentContent,
        "email": null,
        "articleId": numberId,
      },
      beforeSend: function (xhr) {
        getUserEmailFromSession()
          .then(function (userEmail) {
            xhr.setRequestHeader('X-User-Email', userEmail);
          })
          .catch(function (error) {
            console.error('Error retrieving user email:', error);
          });
      },
      success: function (data) {
        console.log('first');
        resolve(data);
      },
      error: function (data) {
        reject(data);
      }

    }))
}
// Function to get articles
function getArticles(take = 10, skip = 0) {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: `/articles?take=${take}&skip=${skip}`,
      method: 'GET',
      success: (response) => {
        resolve(response);
      },
      error: (error) => {
        reject(error);
      }
    });
  });
}
function getArticleById(id) {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: `/articles/${id}`,
      method: 'GET',
      success: (response) => {
        resolve(response);
      },
      error: (error) => {
        reject(error);
      }
    });
  });
}
function getCategoryById(id) {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: `/categories/${id}`,
      method: 'GET',
      success: (response) => {
        resolve(response);
      },
      error: (error) => {
        reject(error);
      }
    });
  });
}

function getCategories(take = 10, skip = 0) {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: `/categories?take=${take}&&skip=${skip}`,
      method: 'GET',
      success: (response) => {
        resolve(response);
      },
      error: (error) => {
        reject(error);
      }
    });
  });
}

function showArticlesPerCat(id, tmp) {
  getCategoryById(id).then((cat) => {
    if (cat.articles && cat.articles.length > 0) {
      const categoriesContainer = document.getElementById('categoriesContainer');
      categoriesContainer.innerHTML = '';
      const categoryElement = document.createElement('div');
      categoryElement.className = 'category-element row';
      categoryElement.id = cat.id;
      categoryElement.innerHTML = `
      <h2>${cat.name}</h2>
        `
      for (let index = 0; index < tmp; index++) {
        const categoryElementDiv = document.createElement('div');
        categoryElementDiv.className = 'imgplustitle col col-3';
        categoryElementDiv.innerHTML = `
        <img src=${cat.articles[index].image} class="img-thumbnail"/>
       <div> <h4 id=${cat.articles[index].id}>${cat.articles[index].title}</h4>
      <a type="button" id="t" data-bs-toggle="modal" data-bs-target="#exampleModal" data-bs-whatever="${cat.articles[index].id} ">Read More</a><br>
      </div>
        `
        categoryElement.appendChild(categoryElementDiv);
      }
      categoriesContainer.appendChild(categoryElement);
    }
    const categorybutton = document.createElement('button');
    categorybutton.className = 'btn btn-primary w-25';
    categorybutton.innerHTML = 'Load More';
    categorybutton.addEventListener('click', () => { loadMoreArticlesperCat(id) })
    categoriesContainer.appendChild(categorybutton);
    $('.categoriesdiv').show();
    $('.homediv').hide();
    $('.articlediv').hide();

  })
}
function listCategories(take) {
  getCategories(take).then((cats) => {
    let dropTownMenu = document.querySelector('.dropdown-menu');
    cats.forEach((cat) => {
      let listItem = document.createElement('li');
      let anchor = document.createElement('a');
      anchor.classList.add('dropdown-item');
      anchor.href = '#';
      anchor.id = cat.id;
      anchor.textContent = cat.name;
      anchor.addEventListener('click', () => {
        showArticlesPerCat(cat.id, tmp);
      });
      listItem.appendChild(anchor);
      dropTownMenu.appendChild(listItem);
    });
  });
}

function updateArticles(take) {
  getArticles(take).then((articles) => {
    const articlesContainer = document.getElementById('articlesContainer');
    articlesContainer.innerHTML = ''; // Clear the container
    articlesContainer.className = 'row row-cols-1 row-cols-md-2 row-cols-lg-4 justify-content-md-center list'
    articles.forEach((article) => {

      const articleElement = document.createElement('div');
      const articleBody = document.createElement('div');
      const tagsTitle = document.createElement('div');
      const tagsELements = document.createElement('div');
      const tagsContainer = document.createElement('div');
      const commentContainer = document.createElement('a');
      const deleteButton = document.createElement('button');
      deleteButton.className = 'btn btn-danger'
      articleElement.className = ' col background-fancy';
      tagsTitle.className = 'tags-title';
      tagsContainer.appendChild(tagsTitle);
      tagsELements.className = 'tagsElements';
      tagsContainer.appendChild(tagsELements);
      tagsTitle.innerHTML = `<p>Categories</p>`
      if (article.categories) {
        article.categories.forEach((cat) => {
          const tags = document.createElement('p');
          tags.className = 'tags';
          tags.innerHTML = cat.name;
          tagsELements.appendChild(tags);
        });
      }
      if (article.comments) {
        let nbrCoomments = article.comments.length;
        commentContainer.innerHTML = `${nbrCoomments} Comments`;
      }
      commentContainer.href = "#"
      articleBody.innerHTML = `
          <img src=${article.image} class="card-img-top" ></img>
        <h2>${article.title}</h2>
        <a type="button" id="t" data-bs-toggle="modal" data-bs-target="#exampleModal" data-bs-whatever="${article.id}">Read More</a><br>
      `;
      articleBody.className = 'card-body '
      articleElement.appendChild(articleBody);
      articlesContainer.appendChild(articleElement);
      articleBody.appendChild(tagsContainer)
      articleBody.appendChild(commentContainer);

      getUserId().then((res) => {
        if (article.authorId === res) {
          deleteButton.innerHTML = 'Delete';
          deleteButton.addEventListener('click', () => {
            deleteArticle(article.id)
              .then(() => {
                console.log('Article deleted successfully');
                updateArticles(take);
              })
              .catch((error) => {
                console.error('Error deleting article:', error);
              });
          });
          articleBody.appendChild(deleteButton);
        }
      }).catch(err => console.log(err))

      const showLessButton = document.getElementById('loadLessButton');
      showLessButton.style.display = articles.length > 4 ? '' : 'none';

    });
  }).catch((error) => {
    console.error('Error fetching articles:', error);
  });
}

let take = 4;
let takeCat = 10;
let tmp = 4;
function loadMoreArticles() {
  take += 4;
  updateArticles(take);
}
function loadLessArticles() {
  take = Math.max(take - 4, 4);
  updateArticles(take);
}
function loadMoreArticlesperCat(id) {
  tmp += 2;
  showArticlesPerCat(id, tmp);
}


$('.categoriesdiv').hide();
$('.articlediv').hide();
$(".onlyformem").hide();
$('.loginpage').hide();



$(document).ready(function () {

  updateArticles(take);
  listCategories(takeCat);
  const loadMoreButton = document.getElementById('loadMoreButton');
  const loadLessButton = document.getElementById('loadLessButton');
  loadMoreButton.addEventListener('click', loadMoreArticles);
  loadLessButton.addEventListener('click', loadLessArticles);
  $("#articles-nav").on('click', () => {
    $('.categoriesdiv').hide();
    $('.homediv').hide();
    $('.articlediv').show();
    $('.loginpage').hide();
  })
  $("#category-nav").on('click', () => {
    $('.articlediv').hide();
    $('.homediv').hide();
    $('.categoriesdiv').show();
    $('.loginpage').hide();
  })
  $('#home-nav').on('click', () => {
    $('.articlediv').hide();
    $('.homediv').show();
    $('.categoriesdiv').hide();
    $('.loginpage').hide();
  })
  let articleId;
  $(document).on('click', '#t', function (event) {
    event.preventDefault();
    articleId = $(this).data('bs-whatever');
  });

  $(document).on('submit', '#commentForm', function (event) {
    event.preventDefault();
    const commentContent = document.getElementById('comment').value;
    let numberId = parseInt(articleId);
    postComment(numberId, commentContent).then((response) => {
      console.log('The comment submitted from email:', response.email);
      updateCommentsSection(numberId);
    }).catch((err) => {
      console.log(err)
      if (err.status === 404) {
        alert('Please provide all required data.Note :You need To be authenticated to comment ');
      }
    })
    // Function to update the comments section
    function updateCommentsSection(articleId) {
      getComment(articleId)
        .then((comments) => {
          const commentsContainer = document.querySelector('.commentaire-section');
          commentsContainer.innerHTML = '';
          comments.forEach((comment) => {
            const commentElement = document.createElement('div');
            commentElement.innerHTML = `
            <h2>${comment.email}</h2>
          <p>${comment.content}</p>
            `
            commentsContainer.appendChild(commentElement);
          });
        })
        .catch((error) => {
          console.error('Error fetching comments:', error);
        })
    }
  })
  $('#ID').submit((event) => {
    event.preventDefault();
    const username = $('#ID input[name="email"]').val();
    const password = $('#ID input[name="password"]').val();
    const errorMessageElement = $('#errorMessage');
    postLogin(username, password)
      .then(function (response) {
        if (response.success) {
          updateArticles(take);
          $('.loginpage').hide();
          $('#submit').hide();
          $('.onlyformem').show();
          $('.homediv').show();
          console.log("you're authentciated")
          const user = response.user;
        } else {
          const errorMessage = data.message || 'Login failed';
          errorMessageElement.textContent = errorMessage;
        }
      })
      .catch(
        function (error) {
          console.error('Error during login:', error);
          // Handle error case
        })
  });
  $('#logout-button').click(function (event) {
    event.preventDefault();
    $.ajax({
      url: '/logout',
      method: 'DELETE',
      success: function (response) {
        console.log('Logout successful');
        $('#submit').show();
        $('.onlyformem').hide();
      },
      error: function (error) {
        console.error('Error during logout:', error);
      }
    });
  });

  $.get('/protected', (data) => {
    if (data.authenticated) {
      $('.login-page').hide();
      $('#submit').hide();
      $('.onlyformem').show();
    } else {
      $('.login-page').show();
      $('.onlyformem').hide();
      console.log('User is not authenticated');
    }
  });

})
$(document).on('click', (event) => {
  if (event.target.id === 't') {

    event.preventDefault();
    const button = event.target;
    const id = Number(button.getAttribute('data-bs-whatever'));
    const modalTitle = exampleModal.querySelector('.modal-body');
    getArticleById(id).then(article => {
      const commentaires = document.createElement('div')

      commentaires.className = 'commentaire-section'
      if (article.comments) {
        commentaires.innerHTML = `<h5>Comments : </h5>`
        article.comments.reverse().forEach(comment => {
          const commentEmail = document.createElement('a')
          commentEmail.href = '#';
          const commentText = document.createElement('p')
          commentEmail.innerHTML = `${comment.email}`
          commentText.innerHTML = `${comment.content}`
          commentaires.appendChild(commentEmail)
          commentaires.appendChild(commentText)
        })
      }
      modalTitle.innerHTML = `
          <h2>${article.title}</h2>
          <img  src=${article.image} class="card-img" ></img>
          <p>${article.content}</p>
          <form id="commentForm"  action="/comment" method="POST">
    <div class="form-group">
      <label for="comment">Add a Comment:</label>
      <textarea class="form-control" id="comment" name="comment" rows="3" required></textarea>
    </div>
    <button type="submit" class="btn btn-primary" id="${article.id}">Submit</button>
  </form>
        `;

      $('.onlyformem').hide();
      modalTitle.appendChild(commentaires)
    }).catch(err => console.log(err))
  } else {
    if (event.target.id === 'c') {
      event.preventDefault();
      const button = event.target;
      const id = Number(button.getAttribute('data-bs-whatever'));
      const modalTitle = exampleModal.querySelector('.modal-body');
      getArticleById(id).then(article => {
        if (article.comments) {
          console.log(article.comments.reverse())
          article.comments.reverse().forEach((com) => {
            modalTitle.innerHTML = `
          <h2>${com.email}</h2>
          <p>${com.content}</p>
        `
          }
          )
        }
      }).catch(err => console.log(err))
    }
    else {
      if (event.target.id == 'submit') {
        $('.articlediv').hide();
        $('.homediv').hide();
        $('.categoriesdiv').hide();
        $('.loginpage').show();
      }
    }
  }
})
