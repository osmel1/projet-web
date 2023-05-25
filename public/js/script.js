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
function getUserName() {
  return new Promise(function (resolve, reject) {
    $.ajax({
      url: '/user/id',
      type: 'GET',
      success: function (response) {
        resolve(response.userName);
      },
      error: function (xhr, status, error) {
        reject(error);
      }
    });
  });
}
function getRole() {
  return new Promise(function (resolve, reject) {
    $.ajax({
      url: '/user/id',
      type: 'GET',
      success: function (response) {
        resolve(response);
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
function deleteUser(id) {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: `/users/${id}`,
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
function getUsers() {
  console.log("you will display the users");
  getRole().then(
    (response) => {
      if (response.myRole === 'ADMIN') {
        return new Promise((resolve, reject) => {
          $.ajax({
            url: '/users',
            type: 'GET',
            success: (response) => {
              $('#users').html('');
              const divUsersContainer = document.createElement('div');

              response.forEach((res) => {
                const divUsers = document.createElement('div');
                divUsers.className = 'usersContainer';
                divUsers.innerHTML = `
          <h2>${res.name}</h2>
          <a href='#'>${res.email}</a>
          `
                const buttonDel = document.createElement('button');
                buttonDel.id = res.id
                buttonDel.innerHTML = 'Delete';
                buttonDel.className = "btn btn-danger"
                buttonDel.addEventListener('click', () => {
                  alert('Are You Sure You Want to Delete? ')
                  deleteUser(res.id)
                    .then(() => {
                      getUsers();
                    })
                    .catch((error) => {
                      console.error(error);
                    });
                })
                divUsers.append(buttonDel)
                divUsersContainer.append(divUsers)
                $('#users').append(divUsersContainer)
              })
            },
            error: (error) => {
              reject(error)
            }
          })
        })
      }
    }
  )

}


function postArticle(idAuthor, contenu, title, imageUrl) {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: `/articles`,
      method: 'POST',
      data: {
        "author": parseInt(idAuthor),
        "content": contenu,
        "title": title,
        "image_url": imageUrl
      },
      success: (data) => {
        resolve(data)
      },
      error: (error) => {
        reject(error)
      }
    })
  }
  )
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
function getUserById(id) {
  return new Promise((resolve, reject) =>
    $.ajax({
      url: `/users/${id}`,
      method: 'GET',
      success: function (data) {
        resolve(data);
      },
      error: function (data) {
        reject(data);
      }
    })
  )
}
function updateUserArticles(id) {
  getUserById(id)
    .then((user) => {
      const articles = user.articles;
      let myArticles = document.getElementById('myArticles');
      myArticles.innerHTML = ` `
      let addAnotherArticle = document.createElement('div')
      addAnotherArticle.innerHTML = `
           <a role="button" id="anotherArticle" data-bs-toggle="modal" type="button" data-bs-target="#exampleModal" data-bs-whatever="${user.id}" class="btn btn-success">Add Article</a><br>
     `
      addAnotherArticle.addEventListener('click', (event) => {
        event.preventDefault();
        const modalTitle = exampleModal.querySelector('.modal-body');
        const id = event.target.dataset.whatever;
        let formAdd = document.createElement('form')
        formAdd.id = 'formAdd'
        formAdd.innerHTML = `
        <div class="mb-3">
        <label for="title" class="form-label">Title</label>
        <input type="text" class="form-control" id="title" aria-describedby="title">
        </div>
        <div class="mb-3">
        <label for="content" class="form-label">Content</label>
        <input type="text" class="form-control" id="content" aria-describedby="content">
        </div>
        <div class="mb-3">
        <label for="imageUrl" class="form-label">Image Url</label>
        <input type="text" class="form-control" id="imgurl" aria-describedby="content">
        </div>
        <button  type="submit" class="btn btn-primary">Submit</button>
        `
        modalTitle.appendChild(formAdd);
      })
      myArticles.appendChild(addAnotherArticle);
      articles.forEach((article) => {
        let div = document.createElement('div');
        div.className = 'row g-3 m-2 border border-primary';
        div.id = article.id;
        div.innerHTML = `
          <div class="col-md-8 col-sm-12 ">
          <img src=${article.image} class="imgdynamic"/>
          </div>
          <div class="col-md-4 col-sm-12 d-inline-block">
          <h5>${article.title}</h5>
          <p>${article.content}</p>
          </div>
          `
        const deleteButton = document.createElement('button');
        deleteButton.className = 'btn btn-danger d-flex justify-content-center w-25 '
        deleteButton.textContent = 'Delete'
        deleteButton.addEventListener('click', () => {
          window.alert('Are you sure you want to delete?');
          deleteArticle(article.id);
          updateUserArticles(id)
        })
        div.appendChild(deleteButton);
        myArticles.appendChild(div);
      })


    })
    .catch((err) => console.log("you have some problems", err))
}

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
function updateCommentsSection(articleId) {
  console.log(articleId)
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
        categoryElementDiv.className = 'imgplustitle col col-4';
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
    cats.forEach((cat, index) => {
      if (index < 9) {
        let listItem = document.createElement('li');
        let anchor = document.createElement('a');
        anchor.classList.add('dropdown-item');
        anchor.href = '#';
        anchor.id = cat.id;
        anchor.textContent = cat.name;
        anchor.addEventListener('click', () => {
          showArticlesPerCat(cat.id, tmp);
          $('#myArticles').hide();
          $('.articlediv').hide();
          $('.homediv').hide();
          $('.loginpage').hide();
        });
        listItem.appendChild(anchor);
        dropTownMenu.appendChild(listItem);
      }
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
      const commentContainer = document.createElement('span');
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
        commentContainer.innerHTML = `<a type="button" id="commentBtn" data-bs-toggle="modal" data-bs-target="#exampleModal" data-bs-whatever="${article.id}" >${nbrCoomments} Comments</a>`;
      }

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
        if (article.authorId === res||myRole=='ADMIN') {
          deleteButton.innerHTML = 'Delete';
          deleteButton.addEventListener('click', () => {
            window.alert('Are you sure you want to delete?');
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
function updateSectionAdmin(myRole) {
  if (myRole == 'ADMIN') {
    const divAdmin = document.createElement('div');
    divAdmin.html("<button> add User</button><button>delete User</button>")
  }
}
function updateUserName() {
  getUserName()
    .then(function (username) {
      if (username != undefined) {
        $('.welcomingName').html(`Welcome <span class="userName">${username}</span> To The Best Blog`);
      }
    })
    .catch(function (error) {
      console.error('Error retrieving user email:', error);
    });
}


let take = 4;
let takeCat = 10;
let tmp = 4;
let flag = false;
var myRole = '';
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
$('#myArticles').hide();
$('#users').hide();
$('.onlyforadmin').hide()
$.get('/protected', (data) => {
  if (data.authenticated) {
    flag = true;
    myRole = data.myRole;
    $('.login-page').hide();
    $('#submit').hide();
    $('.onlyformem').show();
    if (myRole == 'ADMIN') {
      getUsers();
      $('.onlyforadmin').show();
    }
    updateUserName();
    updateUserArticles(Number(data.userId))
  } else {
    $('.login-page').show();
    $('.onlyformem').hide();
    console.log('User is not authenticated');
  }
});



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
    $('#myArticles').hide();
  })
  $('#home-nav').on('click', () => {
    $('.articlediv').hide();
    $('.homediv').show();
    $('.categoriesdiv').hide();
    $('.loginpage').hide();
    $('#myArticles').hide();
  })
  $('#myarticlesDiv').on('click', () => {
    $('.articlediv').hide();
    $('.homediv').hide();
    $('.categoriesdiv').hide();
    $('#myArticles').show();
    $('.loginpage').hide();
    $('#users').hide();
  });
  $('#dashboard').on('click', () => {
    $('.articlediv').hide();
    $('.homediv').hide();
    $('.categoriesdiv').hide();
    $('#myArticles').hide();
    $('#users').show();
    $('.loginpage').hide();
  });
  let articleId;
  $(document).on('click', '#commentbtn', function (event) {
    event.preventDefault();
    articleId = $(this).data('bs-whatever');
    console.log(articleId)
  });

  $(document).on('submit', '#commentForm', function (event) {
    event.preventDefault();
    const commentContent = document.getElementById('comment').value;
    let numberId = parseInt(articleId);
    console.log(numberId, articleId)
    postComment(numberId, commentContent).then((response) => {
      console.log('The comment submitted from email:', response.email);
      updateCommentsSection(numberId);
    }).catch((err) => {
      console.log(err)
      if (err.status === 404) {
        alert('Please provide all required data.Note :You need To be authenticated to comment ');
      }
    })

  })
  $(document).on('submit', "#formAdd", function (event) {
    event.preventDefault();
    const title = document.getElementById('title').value;
    const content = document.getElementById("content").value;
    const imgurl = document.getElementById("imgurl").value;
    getUserId().then((res) => {
      const idAuthor = Number(res)
      console.log(idAuthor)
      postArticle(idAuthor, content, title, imgurl).then((reponse) => {
        console.log(reponse)
        updateArticles(take);
        updateUserArticles(idAuthor);
        const modal = document.getElementById('exampleModal');
        const modalInstance = bootstrap.Modal.getInstance(modal);
        modalInstance.hide();
      })
    }).catch(console.log('errrrrrrrrrrrrrrror'))
  })
  $('#ID').submit((event) => {
    event.preventDefault();
    const username = $('#ID input[name="email"]').val();
    const password = $('#ID input[name="password"]').val();
    const errorMessageElement = $('#errorMessage');

    postLogin(username, password)
      .then(function (response) {
        if (response.success) {
          flag = true
          myRole = response.Myrole;
          if (myRole === 'ADMIN') {
            getUsers();
            $('.onlyforadmin').show()
          }
          getUserName()
            .then((username) => {
              $('.welcomingName').html(`Welcome <span class="userName">${username}</span> To The Best Blog`);
            })
            .catch(err => console.log(err))
          updateArticles(take);
          getUserId().then((res) => {
            updateUserArticles(res);
          })
          $('.loginpage').hide();
          $('#submit').hide();
          $('.onlyformem').show();
          $('.homediv').show();
          $('#myArticles').show();
          console.log("you're authentciated")
          const user = response.user;
        } else {
          console.log(response.message)
          const errorMessage = response.message || 'Login failed';
          errorMessageElement.html(`<h4 class="text-danger">${errorMessage}</h4>`)
        }
      })
      .catch(
        function (error) {
          console.error('Error during login:', error);
          // Handle error case
        })
  });
  $('#logout-button').click(function (event) {
    flag = false;
    event.preventDefault();
    $.ajax({
      url: '/logout',
      method: 'DELETE',
      success: function (response) {
        console.log('Logout successful');
        $('.onlyformem').hide();
        $('#myArticles').hide();
        $('.homediv').show();
        $('.welcomingName').hide();
        $('#submit').show();
        $('.onlyforadmin').hide()
      },
      error: function (error) {
        console.error('Error during logout:', error);
      }
    });
  });
  $('.btn-close').on('click', (event) => {
    if (flag) {
      console.log("clicked btn")
      $('#myArticles').show();
      $('.onlyformem').show();
      if (myRole == 'ADMIN') {
        $('.onlyforadmin').show();
      }
    }
  })


})

$(document).on('click', (event) => {
  if (event.target.id === 't') {

    event.preventDefault();
    const button = event.target;
    const id = Number(button.getAttribute('data-bs-whatever'));
    const modalTitle = exampleModal.querySelector('.modal-body');
    modalTitle.innerHTML = ` `
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
          
        `;

      $('.onlyformem').hide();
      modalTitle.appendChild(commentaires)
    }).catch(err => console.log(err))
  } else {
    if (event.target.id === 'commentBtn') {
      event.preventDefault();
      const button = event.target;
      const id = Number(button.getAttribute('data-bs-whatever'));
      const modalTitle = exampleModal.querySelector('.modal-body');
      modalTitle.innerHTML = ` 
      <form id="commentForm"  action="/comment" method="POST">
    <div class="form-group">
      <label for="comment">Add a Comment:</label>
      <textarea class="form-control" id="comment" name="comment" rows="3" required></textarea>
    </div>
    <button type="submit" class="btn btn-primary" id="${id}">Submit</button>
  </form>
      `
      getArticleById(id).then(article => {
        if (article.comments) {
          const divComments = document.createElement('div')
          article.comments.reverse().forEach((com) => {
            const commentaires = document.createElement('div')
            commentaires.className = 'card h-25'
            commentaires.innerHTML = `
          <h2>${com.email}</h2>
          <p>${com.content}</p>
        `

            divComments.className = 'name overflow-y-scroll'
            divComments.appendChild(commentaires)
          }
          )
          modalTitle.appendChild(divComments);
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

