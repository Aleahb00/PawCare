// FORM MODAL JS
var modal = document.getElementById("formModal");
var btn = document.getElementById("openFormButton");
var span = document.getElementsByClassName("close")[0];

btn.onclick = function() {modal.style.display = "block";}
span.onclick = function() {modal.style.display = "none";}
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

// EDIT MODAL JS
var editModal = document.getElementById("editFormModal");
var editBtn = document.getElementById("editButton"); 
var editSpan = editModal.getElementsByClassName("close")[0];

editBtn.onclick = function() {
  editModal.style.display = "block";
}

editSpan.onclick = function() {
  editModal.style.display = "none";
}


// HAMBURGER MENU JS
document.addEventListener("DOMContentLoaded", function() {
    const hamburger = document.querySelector(".navbar-wrapper .hamburger");
    const navBar = document.querySelector(".navbar-wrapper .nav-bar");

    hamburger.addEventListener("click", () => {
        navBar.classList.toggle("open");
    });
});




// document.addEventListener("DOMContentLoaded", function () {
//     const nav = document.querySelector(".navbar-wrapper .nav-bar");

//     // This is the middle links container
//     const menu = nav.children[1];

//     const btn = document.createElement("button");
//     btn.textContent = "☰";
//     btn.style.fontSize = "1.8rem";
//     btn.style.background = "none";
//     btn.style.border = "none";
//     btn.style.cursor = "pointer";

//     nav.insertBefore(btn, menu);

//     btn.addEventListener("click", () => {
//         menu.classList.toggle("open");
//     });
// });




