  // document.addEventListener("DOMContentLoaded", () => {
  //   const btn = document.querySelector(".pc-nav__toggle");
  //   const menu = document.querySelector("#pcNav");
  //   if (!btn || !menu) return;

  //   btn.addEventListener("click", () => {
  //     menu.classList.toggle("show");
  //     const expanded = btn.getAttribute("aria-expanded") === "true";
  //     btn.setAttribute("aria-expanded", (!expanded).toString());
  //   });
  // });


// FORM MODAL JS
var modal = document.getElementById("formModal");
var btn = document.getElementById("openFormButton");
var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal
btn.onclick = function() {modal.style.display = "block";}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {modal.style.display = "none";}

// When the user clicks anywhere outside of the modal, close it
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


const editModal = document.getElementById("editFormModal");
    editModal.style.display = "block"

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




