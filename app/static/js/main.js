<script>
  document.addEventListener("DOMContentLoaded", () => {
    const btn = document.querySelector(".pc-nav__toggle");
    const menu = document.querySelector("#pcNav");
    if (!btn || !menu) return;

    btn.addEventListener("click", () => {
      menu.classList.toggle("show");
      const expanded = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", (!expanded).toString());
    });
  });
</script>