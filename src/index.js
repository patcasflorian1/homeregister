let allTeams = [];
let editId;

fetch("http://localhost:3000/teams-json", {
  method: "GET",
  headers: {
    "Content-Type": "application/json"
  }
})
  .then(r => r.json())
  .then(teams => {
    //window.teams = teams;
    allTeams = teams;
   // console.info(teams);
    displayTeams(teams);
  });

function createTeamRequest(team) {
  return fetch("http://localhost:3000/teams-json/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(team)
  }).then(r => r.json());
}

function updateTeamRequest(team) {
  return fetch("http://localhost:3000/teams-json/update", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(team)
  }).then(r => r.json());
}
function deleteTeamRequest(id) {
  return fetch("http://localhost:3000/teams-json/delete", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ id })
  }).then(r => r.json());
}
function readTeam() {
  return {
    useremail: document.getElementById("useremail").value,
    password: document.getElementById("password").value,
    role: document.getElementById("role").value,
    statut: document.getElementById("statut").value
  };
}

function getTeamsHTML(teams) {
  return teams
    .map(
      team => `
      <tr>
        <td>${team.useremail}</td>
        <td>${team.password}</td>
        <td>${team.role}</td>
        <td>${team.statut}</td>
        <td>
          <a data-id="${team.id}" class="remove-btn">✖</a>
          <a data-id="${team.id}" class="edit-btn">&#9998;</a>
        </td>
      </tr>`
    )
    .join("");
}
function displayTeams(teams) {
  document.querySelector("#teams tbody").innerHTML = getTeamsHTML(teams);
}
function onSubmit(e) {
  e.preventDefault();
  const team = readTeam();
  if (editId) {
    team.id = editId;
   
    updateTeamRequest(team).then(status => {
      if (status.success) {
        window.location.reload();
      }
    });
  } else {
    console.warn("save");
    createTeamRequest(team).then(status => {
      if (status.success) {
        window.location.reload();
      }
    });
  }
}

// TODO - rerole
function prepareEdit(id) {
  const team = allTeams.find(team => team.id === id);
  console.warn("edit", id, typeof team);
  editId = id;
  document.getElementById("useremail").value = team.useremail;
  document.getElementById("password").value = team.password;
  document.getElementById("role").value = team.role;
  document.getElementById("statut").value = team.statut;
}

function initEvents() {
  const form = document.getElementById("editForm");
  form.addEventListener("submit", onSubmit);

  document.querySelector("#teams tbody").addEventListener("click", e => {
    if (e.target.matches("a.remove-btn")) {
      const id = e.target.dataset.id;
      deleteTeamRequest(id).then(status => {
        if (status.success) {
          window.location.reload();
        }
      });
    } else if (e.target.matches("a.edit-btn")) {
      const id = e.target.dataset.id;
      prepareEdit(id);
    }
  });
}

let activePage = "skills";

(function () {
  const hash = window.location.hash.substring(1);

  if (hash) {
    page = document.querySelector("#" + hash);
    if (page && page.classList.contains("page")) {
      activePage = hash;
    }
  }
})();

function hide(id) {
  const el = document.getElementById(id);
  if (el) {
    el.style.display = "none";
  } else {
    console.error(
      "element you are searching does not exist... check your selector"
    );
  }
}
function hidePreviousPage() {
  hide(activePage);
  const link = document.querySelector(
    `#top-menu-bar a[data-page="${activePage}"]`
  );
  link.classList.remove("active");
}

function showPage(pageId) {
  hidePreviousPage();
  document.getElementById(pageId).style.display = "";
  const link = document.querySelector(`#top-menu-bar a[data-page="${pageId}"]`);
  link.classList.add("active");
  activePage = pageId;
}

function initMenu() {
  document.addEventListener("click", (e) => {
    const link = e.target;
    if (link.matches("#top-menu-bar a")) {
      const id = link.getAttribute("data-page");
      showPage(id);
    }
  });

  document.querySelector("#colorblind").addEventListener("click", () => {
    document.body.classList.toggle("grayscale");
  });
}

initMenu();

showPage(activePage);

initEvents();
