setUp();
getUserProfileInfo();
getPost();
//get the user id query parameter
function getCurrentUserId() {
  const urlParam = new URLSearchParams(window.location.search);
  const id = urlParam.get("userId");
  return id;
}
//function to show user's profile information //
function getUserProfileInfo() {
  toggleLoader(true);
  const id = getCurrentUserId();
  axios
    .get(`https://tarmeezacademy.com/api/v1/users/${id}`)
    .then((response) => {
      console.log(response);
      const user = response.data.data;
      document.getElementById("username-head-place").innerHTML = user.username;
      document.getElementById(
        "profile-image"
      ).innerHTML = `<img id="profile-image-place"
        src="${user.profile_image}"style="width: 200px; height: 200px;" class="shadow rounded-circle border border-3" alt=""></div>`;
      document.getElementById("name-place").innerHTML = user.name;
      document.getElementById("posts-count").innerHTML = user.posts_count;
      document.getElementById("comments-count").innerHTML = user.comments_count;
      document.getElementById("username-place").innerHTML = user.username;
      document.getElementById("email-place").innerHTML = user.email;
    })
    .catch((error) => {
      const errorMassage = error.response.data.message;
      alertSuccessLogin(errorMassage, "danger");
    })
    .finally(() => {
      toggleLoader(false);
    });
}
///function to show user's profile information///

//function to show user's posts in profile page//
function getPost() {
  const id = getCurrentUserId();
  axios
    .get(`https://tarmeezacademy.com/api/v1/users/${id}/posts`)
    .then((response) => {
      console.log(response.data.data);
      let posts = response.data.data;
      document.getElementById("user-posts").innerHTML = "";

      for (post of posts) {
        let postTitle = "";
        //check my post or not by ckeck user id is = post author id//
        let user = getCurrentUser();
        let isMyPost = user != null && post.author.id == user.id;

        let editPostBtn = ``;
        let deletePost = ``;

        if (isMyPost) {
          //'${encodeURIComponent(JSON.stringify(post))}' the way to turn the response.data.data from opject mode to an string so it could be send as a parameter to the function onclick="function()" then at the function we uesd the 'JSON.parse(decodeURIComponent(postOpject))' to turn it to an opject again so we could use it
          editPostBtn = `   <button class="btn btn-info" style="float:right;"onclick="editPostBtnClicked('${encodeURIComponent(
            JSON.stringify(post)
          )}')">edit</button>`;
          deletePost = `   <button class="btn btn-danger" style="float:right; margin-left:5px"  onclick="deletePostBtnClicked('${encodeURIComponent(
            JSON.stringify(post)
          )}')">delete</button>`;
        }
        ///check my post or not by compare user id with post author id///

        if (post.title != null) {
          postTitle = post.title;
        }

        let content = `  <div class="card shadow">
              <div class="card-header">
                <img src="${post.author.profile_image}"style="width: 40px; height: 40px;" class="rounded-circle border border-3">
                <b>@${post.author.username}</b>
                  ${deletePost}
               ${editPostBtn}
               
              
              </div>
              <div class="card-body" onclick="postClicked(${post.id})" style="cursor:pointer;">
             <img src="${post.image}"alt="" class="w-100" >
             <h6 style="color: rgb(143, 137, 137); margin-top: 5px;">${post.created_at}</h6>
             <h5>${postTitle}</h5>
             <p>
              ${post.body}
             </p>
             <hr>
             <div>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen" viewBox="0 0 16 16">
                <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708z"/>
              </svg>
              <span>${post.comments_count}
                <span id="postTags${post.id}">
                  <button class="btn btn-sm rounded-5" style="background-color:gray; color:white;">
                    policy
                  </button>
                  </span>
                </span>
             </div>
              </div>
            </div>
        `;
        document.getElementById("user-posts").innerHTML += content;
        //show tags
        const currentPostTagID = `postTags${post.id}`;
        document.getElementById(currentPostTagID).innerHTML = "";
        if (posts.tags != null) {
          for (tag of post.tags) {
            let tagContent = `
                    <button class="btn btn-sm rounded-5" style="background-color:gray; color:white;">
                        ${tag}
                      </button>`;
            // console.log(tag.name)
            document.getElementById(currentPostTagID).innerHTML += tagContent;
          }
        }
      }
    });
}
//function to show user's posts in profile page//