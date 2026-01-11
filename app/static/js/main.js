let allPosts = document.getElementById('allposts');
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


  // Get the modal element
var modal = document.getElementById("formModal");

// Get the button that opens the modal
var btn = document.getElementById("openFormButton");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal
btn.onclick = function() {
  modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}



document.addEventListener("DOMContentLoaded", function() {

});

function searchPosts() {
  document.getElementById("searchbtn").addEventListener("click", function() {
      if (allPosts.style.display = 'block'){  
      allPosts.style.display = 'none';
      }
    });
}