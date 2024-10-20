//static//
const baseUrl = "https://tarmeezacademy.com/api/v1";
//ststic//

//**set up ui**//
//function setUp(personalInfo,profileImage)
function setUp() {
  let divLogin = document.getElementById("login-div");

  let divLogout = document.getElementById("logout-div");
  //add post btn
  let addPostBtn = document.getElementById("addPost");
  //add comment div
  let divComment = document.getElementById("commentPlace");

  let token = localStorage.getItem("token");
  if (token == null) {
    //user not login
    divLogin.style.setProperty("display", "flex", "important");
    divLogout.style.setProperty("display", "none", "important");

    if (addPostBtn != null) {
      addPostBtn.style.setProperty("display", "none", "important");
    }
    if (divComment != null) {
      divComment.style.setProperty("display", "none", "important");
    }
  } else {
    divLogin.style.setProperty("display", "none", "important");
    divLogout.style.setProperty("display", "flex", "important");
    if (addPostBtn != null) {
      addPostBtn.style.setProperty("display", "flex", "important");
    }
    if (divComment != null) {
      divComment.style.setProperty("display", "flex", "important");
    }
    //if user auth is right
    const user = getCurrentUser();

    document.getElementById("spanPersonal").innerHTML = "";
    let spanPersonalContent = `<span id="spanPersonal"><img src="${user.profile_image}"
                    style="width: 40px; height: 40px"
                    class="rounded-circle border border-3"><span> <b>@${user.username}</b></span></span>`;
    document.getElementById("spanPersonal").innerHTML = spanPersonalContent;
  }
}
//***set up ui ***//

//==========================================================auth functions===================================================================================//
//**login request**//
function loginBtnClicked() {
  toggleLoader((show = true));
  let username = document.getElementById("usernameInput").value;
  let password = document.getElementById("passwordInput").value;
  let bodyParam = {
    username: username,
    password: password,
  };
  axios
    .post("https://tarmeezacademy.com/api/v1/login", bodyParam)
    .then((response) => {
      console.log(response.data);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      const modal = document.getElementById("loginModal");
      const modalGetInstance = bootstrap.Modal.getInstance(modal);
      modalGetInstance.hide(); // modal close after successful login
      //setUp(username,user.profile_image);
      alertSuccessLogin("login success, welcome", "success");
      setUp();
    })
    .catch((error) => {
      alertSuccessLogin(error.response.message, "danger");
    })
    .finally(() => {
      toggleLoader(false);
    });
}

//***login request***//

//**register request**//
function regBtnClicked() {
  // alertSuccessReg();
  toggleLoader(true);
  let newUsername = document.getElementById("newUsernameInput").value;
  let newPassword = document.getElementById("newPasswordInput").value;
  let newName = document.getElementById("newNameInput").value;
  let newImage = document.getElementById("newImageInput").files[0];
  let newEmail = document.getElementById("newEmailInput").value;
  console.log(newName, newEmail, newUsername, newPassword);

  let formData = new FormData();
  formData.append("username", newUsername);
  formData.append("password", newPassword);
  formData.append("image", newImage);
  formData.append("name", newName);
  formData.append("email", newEmail);

  axios
    .post(`${baseUrl}/register`, formData)
    .then((response) => {
      console.log(response.data);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      const modal = document.getElementById("regModal");
      const modalGetInstance = bootstrap.Modal.getInstance(modal);
      modalGetInstance.hide(); // modal close after successful register

      alertSuccessLogin("login success, welcome", "success");
      setUp();
      // setUp(newUsername,user.profile_image);
    })
    .catch((error) => {
      const errorMassage = error.response.data.message;
      alertSuccessLogin(errorMassage, "danger");
    })
    .finally(() => {
      toggleLoader(false);
    });
}

//***register request***//

///////////////todo///////////////
//**alert of successful login**//
function alertSuccessLogin(customMassage, type) {
  // setTimeout(()=>{const alert = bootstrap.Alert.getOrCreateInstance('#successAlerts')
  //alert.close()
  //},2000)
  const alertPlaceholder = document.getElementById("successAlerts");
  const appendAlert = (massege, type) => {
    const wrapper = document.createElement("div");
    wrapper.innerHTML = [
      `<div class="alert alert-${type} alert-dismissible" role="alert">`,
      `   <div>${massege}</div>`,
      '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
      "</div>",
    ].join("");

    alertPlaceholder.append(wrapper);
  };

  appendAlert(customMassage, type);
}

//***alert of successful login***//

//log out function//
function logOut() {
  window.location = "home.html";
  localStorage.removeItem("token");
  localStorage.removeItem("user");

  alertSuccessLogin("logout success", "success");

  setUp();
  //setUp('');
}

///log out function///

//get current user information to display it if user auth is success by sending it to function set up() //
function getCurrentUser() {
  let user = null;
  const storageUser = localStorage.getItem("user");
  if (storageUser != null) {
    user = JSON.parse(storageUser);
    return user;
  } else {
    return user;
  }
}
///get current user information///

//close creat or update modal on click the "close" label
function closeModal() {
  const modal = document.getElementById("creatPost");
  const modalGetInstance = bootstrap.Modal.getInstance(modal);
  modalGetInstance.hide();
}
// show delete post modal on click delete btn
function deletePostBtnClicked(postOpject) {
  let post = JSON.parse(decodeURIComponent(postOpject));
  document.getElementById("ckeck-post-id").value = post.id;
  document.getElementById("postTitleDelete").innerHTML = post.title;
  let postModal = new bootstrap.Modal(
    document.getElementById("deletePostModal"),
    {}
  );
  postModal.toggle();
}
//confirm deleting the post on click the delete btn of delete modal
function deletePostRequest() {
  toggleLoader(true);

  const token = localStorage.getItem("token");

  let headers = {
    authorization: `Bearer ${token}`,
  };
  let postId = document.getElementById("ckeck-post-id").value;
  axios
    .delete(`https://tarmeezacademy.com/api/v1/posts/${postId}`, {
      headers: headers,
    })
    .then((response) => {
      console.log(response);
      const modal = document.getElementById("deletePostModal");
      const modalGetInstance = bootstrap.Modal.getInstance(modal);
      modalGetInstance.hide(); // modal close after successful post delete
      alertSuccessLogin("the post has been deleted", "info");
      // Refresh the page
      getPost(); //home posts
      getPost(); //profile posts
    })
    .catch((error) => {
      const errorMassage = error.response.data.message;
      alertSuccessLogin(errorMassage, "danger");
    })
    .finally(() => {
      toggleLoader(false);
    });
}

//edit post function in case update my post ...edit post modal ui//
function editPostBtnClicked(postOpject) {
  let post = JSON.parse(decodeURIComponent(postOpject));
  document.getElementById("post-id-input").value = post.id;
  console.log(post);
  document.getElementById("creat-post").innerHTML = "Update Post";
  document.getElementById("postContent").value = post.body;
  document.getElementById("postTitle").value = post.title;
  document.getElementById("post-submit-btn").innerHTML = "update";
  let postModal = new bootstrap.Modal(document.getElementById("creatPost"), {});
  postModal.toggle();
}

//show post image//
var loadFile = function (event) {
  var reader = new FileReader();
  reader.onload = function () {
    var output = document.getElementById("blah");
    output.src = reader.result;
  };
  reader.readAsDataURL(event.target.files[0]);
};

///show post image///

//show clicked post//
function postClicked(postId) {
  toggleLoader(true);
  window.location = `postDetails.html?postId=${postId}`;

  ///////////////////// editPost(postOpject)
}
///show clicked post///

//**add post request**//
function addPost() {
  toggleLoader(true);
  let postId = document.getElementById("post-id-input").value;
  let isCreat = postId == null || postId == "";

  const title = document.getElementById("postTitle").value;
  const image = document.getElementById("postImage").files[0];
  const body = document.getElementById("postContent").value;
  let formData = new FormData();
  formData.append("title", title);
  formData.append("image", image);
  formData.append("body", body);
  const token = localStorage.getItem("token");

  let headers = {
    authorization: `Bearer ${token}`,
  };

  if (isCreat) {
    axios
      .post(`${baseUrl}/posts`, formData, {
        headers: headers,
      })
      .then((response) => {
        console.log(response);

        const modal = document.getElementById("creatPost");
        const modalGetInstance = bootstrap.Modal.getInstance(modal);
        modalGetInstance.hide(); // modal close after successful login
        alertSuccessLogin("new post has been created", "success");
        // Refresh the page
        getPost();
      })
      .catch((error) => {
        const errorMassage = error.response.data.message;
        alertSuccessLogin(errorMassage, "danger");
      });
  } else {
    formData.append("_method", "put");

    axios
      .post(`https://tarmeezacademy.com/api/v1/posts/${postId}`, formData, {
        headers: headers,
      })
      .then((response) => {
        console.log(response);

        const modal = document.getElementById("creatPost");
        const modalGetInstance = bootstrap.Modal.getInstance(modal);
        modalGetInstance.hide(); // modal close after successful login
        alertSuccessLogin("new post has been updated", "success");
        // Refresh the page
        getPost();
      })
      .catch((error) => {
        const errorMassage = error.response.data.message;
        alertSuccessLogin(errorMassage, "danger");
      })
      .finally(() => {
        toggleLoader(false);
      });
  }
}

//**add post request**//

//move to the post creator profile page on click the post creator name//
function postCreatorClicked(userId) {
  window.location = `profilePage.html?userId=${userId}`;
}
//move to the post creator profile page on click the post creator name//

//go to profile page //
function profileLinkClicked() {
  let user = getCurrentUser();
  window.location = `profilePage.html?userId=${user.id}`;
}
///go to profile page///
//==================================================================loader======================================================================//
function toggleLoader(show = true) {
  if (show) {
    document.getElementById("loader").style.visibility = "visible";
  } else {
    document.getElementById("loader").style.visibility = "hidden";
  }
}
//==================================================================loader======================================================================//
