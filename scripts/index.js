document.addEventListener('DOMContentLoaded', () => {
  let loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  let users = JSON.parse(localStorage.getItem("users")) || [];
  if (window.location.pathname.includes("LoginSuccess.html")) {
    if (loggedInUser) {
      document.getElementById("user-info").innerText = loggedInUser.email;
    } else {
      document.getElementById("user-info").innerText = "User information not found.";
    }
  }

  if (window.location.pathname.includes("UserList.html")) {
    let htmlContent = "";
    for (let i = 0; i < users.length; i++) {
      htmlContent += `<tr><td>  ${users[i].name}  </td><td>  ${users[i].email}  </td><td>`;
      if (loggedInUser.email !== users[i].email) {
        htmlContent += `<a href='./EditUser.html?id=  ${users[i].id}  '>Edit</a> | <a href='#' onclick='confirmDeleteUser(  ${users[i].id}  )'>Delete</a>`;
      } else {
        htmlContent += `<a href='./EditUser.html?id=  ${users[i].id}  '>Edit</a> | <a href='javascript:void(0);' style='color:grey;' >Delete</a>`;
      }
      htmlContent += `</td></tr>`;
    }
    document.getElementById("userTableBody").innerHTML = htmlContent;
  }

  if (window.location.pathname.includes("EditUser.html")) {
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('id');

    let user = users.find(user => user.id == userId);

    if (user) {
      document.getElementById("fullName").value = user.name;
      document.getElementById("editEmail").value = user.email;

      if (loggedInUser.email === user.email) {
        document.getElementById("editEmail").disabled = true;
      }
    }

    document.querySelector(".edit-form").addEventListener("submit", (event) => {
      validateEdit(event, user);
    });
  }

});

let users = JSON.parse(localStorage.getItem("users")) || [];
const validateLogin = (event) => {
  event.preventDefault();
  let loginEmail = document.getElementById("email").value;
  let loginPassword = document.getElementById("password").value;

  if (loginEmail === "" || loginPassword === "") {
    document.getElementById("login-error-msg").innerHTML = "Email id and password cannot be blank";
  } else {
    const user = users.find(
      (user) => user.email === loginEmail && user.password === loginPassword
    );

    if (user) {
      localStorage.setItem("loggedInUser", JSON.stringify(user));
      location.href = "./LoginSuccess.html";
    } else {
      document.getElementById("login-error-msg").innerHTML = "Invalid email or password";
    }
  }
}

const validateRegister = (event) => {
  event.preventDefault();
  let fullName = document.getElementById("fullName").value;
  let registerEmail = document.getElementById("registerEmail").value;
  let registerPassword = document.getElementById("registerPassword").value;
  let confirmPassword = document.getElementById("confirmPassword").value;
  let emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (fullName == "" || registerEmail == "" || registerPassword == "" || confirmPassword == "") {
    document.getElementById("error-msg").innerHTML = "Please fill all the details";
  } else if (!emailPattern.test(registerEmail)) {
    document.getElementById("error-msg").innerHTML = "Please enter a valid email address";
  } else if (registerPassword.length < 8) {
    document.getElementById("error-msg").innerHTML = "Password must be at least 8 characters";
  } else if (registerPassword != confirmPassword) {
    document.getElementById("error-msg").innerHTML = "Confirm password does not match";
  } else if (users.some(user => user.email === registerEmail)) {
    document.getElementById("error-msg").innerHTML = "This email is already registered";
  } else {
    document.getElementById("error-msg").innerHTML = "";
    let user = {
      id: Number(new Date()),
      name: fullName,
      email: registerEmail,
      password: registerPassword,
    };
    users.push(user);
    localStorage.setItem("users", JSON.stringify(users));
    location.href = "./RegisterSuccess.html";
  }
}

const validateEdit = (event, user) => {
  event.preventDefault();
  let fullName = document.getElementById("fullName").value;
  let email = document.getElementById("editEmail").value;
  let emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (fullName === "" || email === "") {
    alert("Please fill in all the details.");
    return;
  } else if (!emailPattern.test(email)) {
    alert("Please enter valid email.");
    return;
  }

  user.name = fullName;

  if (!document.getElementById("editEmail").disabled) {
    user.email = email;
  }

  let index = users.findIndex(u => u.id === user.id);
  users[index] = user;

  localStorage.setItem("users", JSON.stringify(users));
  window.location.href = "./UserList.html";
}

const confirmDeleteUser = (id) => {
  if (confirm("Are you sure you want to delete this user?")) {
    deleteUser(id);
  }
}

const deleteUser = (id) => {
  users = users.filter(user => user.id !== id);
  localStorage.setItem("users", JSON.stringify(users));
  location.reload();
}

const logout = () => {
  localStorage.removeItem("loggedInUser");
  window.location.href = "./Welcome.html";
}