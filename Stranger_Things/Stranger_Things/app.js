const API_URL = 'https://strangers-things.herokuapp.com/api/2006-CPU-RM-WEB-PT';

const state = {
  token: '',
  posts: [],
  messages: [],
  searchTerm: '',
  responseObj: {},
  userData: ''
}

const signUp = async (username, password) => {
  try {
    const response = await fetch(`${API_URL}/users/register`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user: {
          username,
          password
        }
      })
    })
    const responseObj = await response.json();
    state.responseObj = responseObj
    state.token = responseObj.data && responseObj.data.token;
    if(state.token){
    localStorage.setItem('user-token', responseObj.data.token)
    }
  } catch (error) {
    console.error(error)
  }
}

const logIn = async (username, password) => {
  try {
    const response = await fetch(`${API_URL}/users/login`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user: {
          username: username,
          password: password
        }
      })
    })
    const responseObj = await response.json();
    state.responseObj = responseObj
    state.token = responseObj.data && responseObj.data.token
    
    if(state.token){
      localStorage.setItem('user-token', state.token)
    }
  } catch (error) {
    console.error(error)
  }
}

const logOut = () => {
  localStorage.removeItem('user-token', state.token)
}

const fetchUserData = async () => {
  try {
    const response = await fetch(`${API_URL}/users/me`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${state.token}`
      },
    });
    const responseObj = await response.json();
    state.userData = responseObj
  } catch (error) {
    console.error(error)
  }
}

function render () {
  const app = $('#app');
  app.empty();
  if(state && state.token) app.append('you are logged in')
  app.append($(`<header>
    <div class="topnav">
    <div class="login-container">
    <form>
    <input id = 'username'type="text" placeholder="Username" name="username">
    <input id = 'password'type="text" placeholder="Password" name="psw">
    <button id="open-register">Register</button>
    <button id="submit-button" type="submit">Login</button>
    </form>
    </div>
  </div>
</header>`))
app.append(renderNav())
const main = $('<main>')
 const columns = $(`<div id='all-posts'> </div>
 <div id='create-post'> </div>`)
 main.append(columns)
app.append(main)
state.token = localStorage.getItem('user-token')
if(state.token){
    $('.login-container').css('display', 'none')
    $('#open-register').css('display', 'none')
    renderYourPost()
  }
}

function renderPost(post){
  const {author:{username}, createdAt, title, description, price, location, willDeliver} = post
    return $(`
    <div class="card" style="width: 20rem;">
      <div class="card-body">
      <h5 class="card-user"> User: ${username}</h5>
      <p class="card-text"> Created: ${createdAt}</p>
        <h5 class="card-title"> Title: ${title}</h5>
        <p class="card-text"> Description: ${description}</p>
        <p class="card-text"> Price:${price}</p>
        <p class="card-text"> Location: ${location}</p>
        <p class="card-text"> Delivery: ${willDeliver}</p>
        </div>
        </div>
        `).data('post', post)
      };

function renderPostAfterLogin(post){
  const {author:{username}, createdAt, title, description, price, location, willDeliver, isAuthor, messages} = post

    const postElem = $(`
    <div class="card" style="width: 20rem;">
      <div class="card-body">
      <h5 class="card-user"> User: ${username}</h5>
      <p class="card-text"> Created: ${createdAt}</p>
        <h5 class="card-title"> Title: ${title}</h5>
        <p class="card-text"> Description: ${description}</p>
        <p class="card-text"> Price: ${price}</p>
        <p class="card-text"> Location: ${location}</p>
        <p class="card-text"> Delivery: ${willDeliver}</p>
        ${isAuthor ? ` <button id="delete-btn" type="submit">Delete</button>  <button id="edit-btn" type="submit">Edit</button> <div id="msg-on-post"> Messages: </div>` : ` <button id="message-btn" type="submit">Message</button>`}
        <div id="message-form-container">
        <form id="make-message" class="inactive">
    <div class="create-title">
      <label for="formGroupExampleInput">Send A Message:</label>
      <input type="text" class="form-control" id="create-message" placeholder="Create Message Here">
    </div>
      <button class="new-message-btn" type="submit">Send Message</button>
    </form>
    </div>
        </div>
        </div>
        `).data('post', post)
        if(isAuthor){
        postElem.find('#msg-on-post').append(renderMessageOnCard(messages))
        }
        return postElem
      }

function renderNav(){
  return $(`
  <nav id="nav-filter"class="navbar navbar-light bg-light">
  <a class="navbar-brand">Stranger Things</a>
  <form class="search-form">
    <input id="search-form" type="search" placeholder="Search" aria-label="Search">
    <button class="filter-search" type="submit">Search</button>
    ${localStorage.getItem('user-token')? `<button id="log-out" type="submit">Sign Out</button>` : ''}
    </form>
    </nav>
    ${localStorage.getItem('user-token')? `<ul class="nav">
    <li class="nav-item">
       <button class="home-btn" type="submit">Home</button>
       <button class="open-messages" type="submit">Inbox</button>
    </li>
  </ul>`: ''}
    `)
  }
  

function makePost(){
  return $(`<form id="make-post">
  <h3 class="create-post-title">Create A Post</h3>
  <div class="create-title">
    <label for="formGroupExampleInput">Title:</label>
    <input type="text" class="form-control" id="create-title" placeholder="Title">
  </div>
  <div class="create-description">
    <label for="formGroupExampleInput2">Description:</label>
    <input type="text" class="form-control" id="create-description" placeholder="Description">
  </div>
  <div class="create-price">
    <label for="formGroupExampleInput2">Price:</label>
    <input type="text" class="form-control" id="create-price" placeholder="Price">
  </div>
  <div class="create-location">
  <label for="formGroupExampleInput2">Location:</label>
  <input type="text" class="form-control" id="formGroupExampleInput2" placeholder="Location">
  <div class="create-deliver">
    <label for="formGroupExampleInput2">Will Deliver:</label>
    <input type="text" class="form-control" id="formGroupExampleInput2" placeholder="">
  </div>
  </div>
  <button class="submit-search" type="submit">Create Post</button>
  </form>`)
}

function registerForm(){
  return $(`<form>
      <input id = 'register-user'type="text" placeholder="Username" name="username">
      <input id = 'register-password'type="text" placeholder="Password" name="psw">
      <button id="register-button" type="submit">Register</button>
    </form>`)
}


function renderPostsMessage(message){
      return $(`
      <p class="my-messages">${message.fromUser.username}</p>
      <p class="my-messages">${message.content}</p>
      `)
    }

function renderMessageOnCard(messages){
  return messages.map(function (msg){ 
    return renderPostsMessage(msg)
  })
}


function renderRegisterForm(){
  const registerElem = $('#app').find('#create-post')
  registerElem.append(registerForm())
}


function renderYourPost(){
    const makePostElem = $('#app').find('#create-post')
    makePostElem.append(makePost())
}

function renderAllPosts(){
  try {
    const postListElem = $('#all-posts');
    state.posts.forEach(post => {
      postListElem.prepend(renderPost(post))
    })
  } catch (error) {
    console.error(error)
  }
}

function renderUserPosts(){
  state.userData.posts.forEach(function (post){
    if(post.messages.length > 0 ){
      post.author = {username: state.userData.username}
      post.isAuthor = true
      $('#app').find('#all-posts').append(renderPostAfterLogin(post))
    }
  })
}


function renderAllPostsAfterLogin(){
  try {
    const postListElem = $('#all-posts');
    state.posts.forEach(post => {
      postListElem.prepend(renderPostAfterLogin(post))
    })
  } catch (error) {
    console.error(error)
  }
}

async function fetchPost(){
  try{
    const response = await fetch (`${API_URL}/posts/`,{
      headers: {
        'Content-Type': 'Application/JSON',
        'Authorization': `Bearer ${state.token}`
      }
    })
    const responseObj = await response.json()
    state.posts = responseObj.data.posts
  } catch (error){
    console.error(error)
  }
}

const createPost = async post => {
  try{
    const response = await fetch (`${API_URL}/posts/`,{
      method:"POST",
      headers: {
        'Content-Type': 'Application/JSON',
        'Authorization': `Bearer ${state.token}`
      },
      body:JSON.stringify({post})
    })
     await response.json();
    state.posts.push(post)
  }
catch(error){
  console.error(error)
  }
}

const createMessage = async (postId, content) => {
  try{
    const response = await fetch (`${API_URL}/posts/${postId}/messages`,{
      method:"POST",
      headers: {
        'Content-Type': 'Application/JSON',
        'Authorization': `Bearer ${state.token}`
      },
      body:JSON.stringify({
        message: {
          content,
        }
      })
    })
    await response.json()
    state.messages.push({postId, content})
    } 
  catch(error){
    console.error(error)
  }
}


async function deletePost(postId){
  try{
    const responseObj = await fetch (`${API_URL}/posts/${postId}`,{
      method: "DELETE",
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${state.token}`
  }
    })
     await responseObj.json();
  }
catch(error){
  console.error(error)
  }
}

const editPost = async (post) => {
  post._id
  try {
   const response = await fetch (`${API_URL}/posts/${post._id}/messages`,{
     
    method: 'PATCH',
     headers:  {
      'Content-Type': 'application/json',
    'Authorization': `Bearer ${state.token}`
     },
     body: JSON.stringify({post})
   })
   await response.json()
  }
  catch(error){
    console.error(erro)
  }
}

$('#app').on('click', '.home-btn', function (event){
  event.preventDefault();
  bootstrap()
})

$('#app').on('click', '.open-messages', function (event){
  event.preventDefault()
  $('#all-posts').empty()
  renderUserPosts()
})

$('#app').on('submit', '.search-form', function(event){
  event.preventDefault();
  const searchResult = $(this).find('input').val()
  const filteredResult = state.posts.filter(function(post){ 
   return post.description.toLowerCase().includes(searchResult.toLowerCase())||
    post.title.toLowerCase().includes(searchResult.toLowerCase())||
    post.price.toLowerCase().includes(searchResult.toLowerCase())||
    post.author.username.toLowerCase().includes(searchResult.toLowerCase())
  });
    $('#app').find('#all-posts').empty()
    if(state.token){
      $('#app').find('#all-posts').append(filteredResult.map(renderPostAfterLogin))
    }
    else {
      $('#app').find('#all-posts').append(filteredResult.map(renderPost))
    }
  });

$('#app').on('click', '#submit-button', async function (event) {
  event.preventDefault()
  const postObj = {
    user: $('#username').val(),
    password: $('#password').val()
  }

  await logIn(postObj.user, postObj.password);
  if (state.responseObj.success){
    $('#log-out').css('display', 'inline')
    $('.login-container').slideUp()
    $('#app').empty()
    await fetchUserData()
    await fetchPost()
    render()
    renderAllPostsAfterLogin()
  }
});

$('#app').on('click', '#register-button', async function (event) {
  event.preventDefault()
  const postObj = {
    user: $('#register-user').val(),
    password: $('#register-password').val()
  }
    if(postObj.user.length > 12 || postObj.user.length < 6){
    const column = $('#app').find('#create-post')
    column.empty()
    renderRegisterForm()  
    column.append($(`<p>Username does not meet required length, username must be between 6 - 12 characters</p>`))
    return
    }
    else if(postObj.password.length > 12 || postObj.password.length < 5){
      const column = $('#app').find('#create-post')
      column.empty()
      renderRegisterForm()  
      column.append($(`<p>Password does not meet required length, username must be between 5 - 12 characters</p>`))
      return
    }
    await signUp(postObj.user, postObj.password);
      if (state.responseObj && state.responseObj.success){
      $('#log-out').css('display', 'inline')
      $('.login-container').slideUp()
      $('#app').empty()
      await fetchUserData();
      await fetchPost();
      render()
      renderAllPostsAfterLogin()
      
    }
});

$('#app').on('click', '#open-register', async function (event) {
  event.preventDefault();
  $('#app').empty()
  render();
  renderAllPosts();
  renderRegisterForm();
})

$('#app').on('click', '#log-out', function(event){
  event.preventDefault();
  localStorage.removeItem('user-token', state.token);
  render();
  renderAllPosts();
  $('#app').prepend('you are logged out');
})

$('#app').on('click', '#message-btn', async function (event){
  const card = $(this).closest('.card-body')
  const findContainer = card.find('#message-form-container form')
  findContainer.toggleClass('inactive')
})

$('#app').on('click', '.new-message-btn', async function(event){
  event.preventDefault()
  const card = $(this).closest('.card');
  const postData = card.data('post');
  const content = $('#create-message').val() 
  await createMessage(postData._id, content)
  card.find('#create-message').val('')
})

$('#app').on('submit', '#make-post', async function(event){
  event.preventDefault()
    const post = {}
    post.title = $('#create-title').val()
    post.description = $('#create-description').val()
    post.price = $('#create-price').val()
    try {
    await createPost(post)
    $('#app').empty()
    await fetchUserData()
    await fetchPost()
    render()
    renderAllPostsAfterLogin()
   
    }catch(error){
      console.error(error)
    }
})


$('#app').on('click', '#delete-btn',  async function(){
  const card = $(this).closest('.card');
  const postData = card.data('post')._id;
try {
  await deletePost(postData)
  card.slideUp();
  $('#all-posts').empty()
  await fetchPost();
  render()
  renderAllPostsAfterLogin()
  }
  catch(error){
    console.error(error)
  }
});

const bootstrap = async () => {
if(state.token){
  await fetchUserData()
}
try{
  render()
if(state.token){
  await fetchUserData()
  await fetchPost()
  renderAllPostsAfterLogin();
}
else {
  await fetchPost()
  renderAllPosts();
  }
} catch(error){
  console.error(error)
  }
}
bootstrap()
