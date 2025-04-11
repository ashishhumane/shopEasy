// Check if user is logged in
function checkLoginStatus() {
    fetch("php/check-session.php")
      .then((response) => response.json())
      .then((data) => {
        if (data.loggedIn) {
          // 2. Create logout button with icon
          const logoutBtn = document.createElement('button');
          logoutBtn.id = 'logout-btn';
          logoutBtn.className = 'logout-btn'; // For custom styling
          logoutBtn.innerHTML = `<i class="fa-solid fa-right-from-bracket"></i> Log out`;
          
          // 3. Add click handler
          logoutBtn.addEventListener('click', () => {
            fetch('php/logout.php')
              .then(() => {
                window.location.href = 'auth.html';
              });
          });

          // 4. Add button to navbar
          const navbar = document.getElementById('navbar');
          if (navbar) {
            // Remove existing logout button if it exists
            const oldLogout = document.getElementById('logout-btn');
            if (oldLogout) oldLogout.parentElement.remove();
            
            // Create new list item for the button
            const listItem = document.createElement('li');
            listItem.appendChild(logoutBtn);
            navbar.appendChild(listItem);
          }
          // User is logged in
          //console.log("Logged in as:", data.user.fullname)
  
          // You can update the UI to show the user is logged in
          // For example, change the sign in link to show the user's name
         // const signInLinks = document.querySelectorAll('a[href="auth.html"], a[href="signin.html"]')
          //signInLinks.forEach((link) => {
           // link.textContent = `Hello, ${data.user.fullname}`

           // link.href = "#" // You could link to a profile page instead
           
         // })
  
          // Add a logout option
          const accountLinks = document.querySelector(".col:nth-child(3)")
          if (accountLinks) {
            const logoutLink = document.createElement("a")
            logoutLink.href = "php/logout.php"
            logoutLink.textContent = "Logout"
            accountLinks.appendChild(logoutLink)
          }
        } else {
          // User is not logged in
          console.log("Not logged in")
        }
      })
      .catch((error) => {
        console.error("Error checking login status:", error)
      })
  }
  
  // Call the function when the page loads
  document.addEventListener("DOMContentLoaded", () => {
    checkLoginStatus()
  })
  
  