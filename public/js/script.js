// Function to get articles
function getArticles(take = 10, skip = 0) {
  return new Promise((resolve, reject) => {
    // Make an AJAX request to the backend route for fetching articles
    $.ajax({
      url: `/articles?take=${take}&skip=${skip}`,
      method: 'GET',
      success: (response) => {
        resolve(response); // Resolve the Promise with the retrieved data
      },
      error: (error) => {
        reject(error); // Reject the Promise with the error
      }
    });
  });
}
function getArticleById(id) {
  return new Promise((resolve, reject) => {
    // Make an AJAX request to the backend route for fetching articles
    $.ajax({
      url: `/articles/${id}`,
      method: 'GET',
      success: (response) => {
        resolve(response); // Resolve the Promise with the retrieved data
      },
      error: (error) => {
        reject(error); // Reject the Promise with the error
      }
    });
  });
}

// Function to get categories
function getCategories(take=10,skip=0) {
  return new Promise((resolve, reject) => {
    // Make an AJAX request to the backend route for fetching categories
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

// Other functions for different backend routes can be added similarly



document.addEventListener('click', event => {
  if (event.target.matches('.read-more-link')) {
    event.preventDefault();
    const button = event.target;
    const id = Number(button.getAttribute('data-bs-whatever'));
    const modalTitle = exampleModal.querySelector('.modal-body');
    console.log(modalTitle)
    getArticleById(id).then(article => {
      modalTitle.innerHTML = `
        <h2>${article.title}</h2>
        <img  src=${article.image} class="card-img" ></img>
        <p>${article.content}</p>
      `;
    }).catch(err=>console.log(err))
  }else{
    console.log("clicked")
  }
});
