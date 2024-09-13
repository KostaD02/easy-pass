const generate = document.querySelector("#generateBtn");
const count = document.querySelector("#count");
const tbody = document.querySelector("tbody");
const addBtn = document.querySelector("#addBtn");
const deleteAllBtn = document.querySelector("#deleteBtn");
const toggleAllBtn = document.querySelector("#toggleAllBtn");

const config = {
  headers: {
    secret: "x-secret",
  },
};

count.addEventListener("keyup", (event) => {
  if (event.key === "Enter") {
    getRandomPassword();
  }
});

generate.addEventListener("click", () => {
  getRandomPassword();
});

toggleAllBtn.addEventListener("click", function () {
  const isShow = this.textContent === "Show all";
  const pass = document.querySelectorAll(".pass");
  pass.forEach((item) => {
    item.innerHTML = isShow
      ? item.getAttribute("data-pass")
      : item.textContent
          .split("")
          .map(() => "•")
          .join("");
  });
  this.textContent = isShow ? "Hide all" : "Show all";
});

addBtn.addEventListener("click", async () => {
  const { value: formValues } = await Swal.fire({
    title: "Create new password",
    html: `
      <div class="mb-3">
        <label for="swal-input1" class="form-label">Title (required)</label>
        <input type="text" id="swal-input1" placeholder="Enter title of password" class="form-control">
      </div>
      <div class="mb-3">
        <label for="swal-input2" class="form-label">Url (optional)</label>
        <input type="url" id="swal-input2" placeholder="Enter url of password" class="form-control">
      </div>
    `,
    focusConfirm: false,
    preConfirm: () => {
      return [
        document.getElementById("swal-input1").value,
        document.getElementById("swal-input2").value,
      ];
    },
  });
  if (formValues) {
    const [title, url] = formValues;

    if (!title) {
      displayToast("Title is required", "error", "red");
      return;
    }

    const body = { title };

    if (url) {
      body.url = url;
    }

    xhrRequest("POST", "password/create", body)
      .then((response) => {
        tbody.innerHTML += getTrVisual(response, tbody.children.length);
      })
      .catch((error) => {
        Swal.fire({
          title: "Error!",
          text: error.error,
          icon: "error",
        });
      });
  }
});

deleteAllBtn.addEventListener("click", () => {
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete all!",
  }).then((result) => {
    if (result.isConfirmed) {
      xhrRequest("DELETE", "password/all")
        .then((response) => {
          Swal.fire({
            title: "Deleted!",
            text: response.info,
            icon: "success",
          });
          tbody.innerHTML = "";
        })
        .catch((error) => {
          Swal.fire({
            title: "Error!",
            text: error.error,
            icon: "error",
          });
        });
    }
  });
});

function getRandomPassword() {
  if (!getSecret()) {
    init();
    return;
  }

  const count = Number(document.querySelector("#count").value);

  if (!count || count < 16 || count > 32) {
    displayToast("Count should be between 16-32", "error", "red");
    return;
  }

  xhrRequest("GET", "password/random", {}, { "x-password-length": count })
    .then((response) => {
      displayAlert(
        "Password generated",
        "success",
        `Random password: ${response.password}`
      );
    })
    .catch((err) => {
      if (err.error === "Invalid secret key") {
        sessionStorage.removeItem(config.headers.secret);
        init();
      }
    });
}

function init() {
  const secret = getSecret();

  if (!secret) {
    inputSecret();
    return;
  }

  showPassowrds();
}

function getSecret() {
  return sessionStorage.getItem(config.headers.secret);
}

async function inputSecret() {
  const { value: secret } = await Swal.fire({
    title: "Input secret key",
    input: "password",
    inputLabel: "Your SECRET_KEY",
    inputPlaceholder: "Enter your secret key from env",
  });

  if (!secret) {
    init();
    return;
  }

  sessionStorage.setItem(config.headers.secret, secret);
  testSecret();
}

function xhrRequest(method, endpoint, body = {}, headers = {}) {
  const xhr = new XMLHttpRequest();
  xhr.open(method, `${location.origin}/${endpoint}`, true);
  // xhr.open(method, `http://localhost:3000/${endpoint}`, true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.setRequestHeader(
    "x-secret",
    sessionStorage.getItem(config.headers.secret)
  );
  for (const key in headers) {
    xhr.setRequestHeader(key, headers[key]);
  }
  xhr.send(JSON.stringify(body));
  return new Promise((resolve, reject) => {
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(JSON.parse(xhr.response));
      }
      reject(JSON.parse(xhr.response));
    };
  });
}

function testSecret() {
  xhrRequest("GET", "password/random")
    .then(showPassowrds)
    .catch((err) => {
      if (err.error === "Invalid secret key") {
        sessionStorage.removeItem(config.headers.secret);
        alert("Invalid secret key, check your SECRET_KEY");
        tbody.innerHTML = "";
        init();
      }
    });
}

function displayToast(title, icon, color, time = 1500) {
  const Toast = Swal.mixin({
    toast: true,
    position: "top-right",
    iconColor: color,
    customClass: {
      popup: "colored-toast",
    },
    showConfirmButton: false,
    timer: time,
    timerProgressBar: true,
  });
  Toast.fire({
    icon,
    title,
  });
}

function displayAlert(title, icon, text = "") {
  Swal.fire({ title, icon, text });
}

function showPassowrds() {
  xhrRequest("GET", "password/all")
    .then((response) => {
      response.forEach((item, index) => {
        tbody.innerHTML += getTrVisual(item, index);
      });
    })
    .catch((err) => {
      if (err.error === "Invalid secret key") {
        sessionStorage.removeItem(config.headers.secret);
        init();
      }
    });
}

function getTrVisual(data, index) {
  // prettier-ignore
  return `
    <tr>
      <th scope="col">${index + 1}</th>
      <td class="title">${data.title}</td>
      <td class="url">${data.url ? `<a target="_blank" href="${data.url}">${data.url}</a>`: "nothing"}</td>
      <td class="pass" data-pass="${data.password}">
        ${data.password
          .split("")
          .map(() => "•")
          .join("")
        }
      </td>
      <td>
        <div class="d-flex justify-contetn-center align-items-center gap-3">
          <button class="btn btn-primary" onclick="toggleEye(this, '${data.password}')">Show</button>
          <button class="btn btn-success" onclick="copy('${data.password}')">Copy</button>
          <button class="btn btn-warning" onclick="refershPassword('${data._id}', this)">Refresh</button>
          <button class="btn btn-warning" onclick="edit('${data._id}', this)">Edit</button>
          <button class="btn btn-danger" onclick="deletePassword('${data._id}', this)">Delete</button>
        </div>
      </td>
    </tr>
  `;
}

function toggleEye(target, password) {
  const tr = target.closest("tr");
  const td = tr.querySelector(".pass");
  if (target.textContent === "Show") {
    td.innerHTML = password;
    target.textContent = "Hide";
  } else {
    td.innerHTML = password
      .split("")
      .map(() => "•")
      .join("");
    target.textContent = "Show";
  }
}

function copy(text) {
  navigator.clipboard.writeText(text);
  displayToast("Password copied", "success", "green");
}

async function edit(id, target) {
  const tr = target.closest("tr");
  const { value: formValues } = await Swal.fire({
    title: "Create new password",
    html: `
      <div class="mb-3">
        <label for="swal-input1" class="form-label">Title (required)</label>
        <input type="text" value="${
          tr.querySelector(".title").textContent
        }" id="swal-input1" placeholder="Enter title of password" class="form-control">
      </div>
      <div class="mb-3">
        <label for="swal-input2" class="form-label">Url (optional)</label>
        <input type="url" value="${
          tr.querySelector(".url").textContent !== "nothing"
            ? tr.querySelector(".url").textContent
            : ""
        }" id="swal-input2" placeholder="Enter url of password" class="form-control">
      </div>
    `,
    focusConfirm: false,
    preConfirm: () => {
      return [
        document.getElementById("swal-input1").value,
        document.getElementById("swal-input2").value,
      ];
    },
  });
  if (formValues) {
    const [title, url] = formValues;

    if (!title) {
      displayToast("Title is required", "error", "red");
      return;
    }

    const body = {};

    if (title !== tr.querySelector(".title").textContent) {
      body.title = title;
    }

    if (url) {
      body.url = url;
    }

    xhrRequest("PATCH", `password/id/${id}`, body)
      .then((response) => {
        tr.innerHTML = getTrVisual(
          response,
          Number(tr.querySelector("th").textContent) - 1
        );
      })
      .catch((error) => {
        if (error.error !== "Nothing to update") {
          Swal.fire({
            title: "Error!",
            text: error.error,
            icon: "error",
          });
        }
      });
  }
}

function refershPassword(id, target) {
  Swal.fire({
    title: "Are you sure to generate new password?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, generate it!",
  }).then((result) => {
    if (result.isConfirmed) {
      xhrRequest("PATCH", `password/id/${id}`, { updatePassword: true })
        .then((response) => {
          const tr = target.closest("tr");
          tr.innerHTML = getTrVisual(
            response,
            Number(tr.querySelector("th").textContent) - 1
          );
        })
        .catch((error) => {
          Swal.fire({
            title: "Error!",
            text: error.error,
            icon: "error",
          });
        });
    }
  });
}

function deletePassword(id, target) {
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  }).then((result) => {
    if (result.isConfirmed) {
      xhrRequest("DELETE", `password/id/${id}`)
        .then((response) => {
          Swal.fire({
            title: "Deleted!",
            text: response.info,
            icon: "success",
          });
          target.closest("tr").remove();
        })
        .catch((error) => {
          Swal.fire({
            title: "Error!",
            text: error.error,
            icon: "error",
          });
        });
    }
  });
}

init();
