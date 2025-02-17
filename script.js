let menu = document.querySelector('#menu-icon');
let navbar = document.querySelector('.navbar');

menu.onclick = () => {
    menu.classList.toggle('bx-x');
    navbar.classList.toggle('active');
}

window.onscroll = () => {
    menu.classList.remove('bx-x');
    navbar.classList.remove('active');
}

const typed = new Typed('.multiple-text', {
    strings: ['Frontend Developer', 'Backend Developer', 'Full Stack Developer', 'Web Designer', 'Google Ranking Improver (SEO)'],
    typeSpeed: 80,
    backSpeed: 80,
    backDelay: 1200,
    loop: true,
});





/* Function to scroll to the middle of the element */
scrollToElement = function (elementIdName) {
    const targetDiv = document.getElementById(elementIdName);
    if (targetDiv) {
        const targetPosition = targetDiv.getBoundingClientRect().top + window.scrollY;
        const windowHeight = window.innerHeight;
        const scrollToPosition = targetPosition - (windowHeight / 2) + (targetDiv.clientHeight / 2);

        window.scrollTo({
            top: scrollToPosition,
            behavior: "smooth"
        });
    }
}















document.addEventListener("DOMContentLoaded", function () {
    const sections = document.querySelectorAll("section");
    let isScrolling = false;

    function scrollToSection(index) {
        if (index >= 0 && index < sections.length) {
            isScrolling = true;
            sections[index].scrollIntoView({
                behavior: "smooth",
                block: "center"
            });
            setTimeout(() => (isScrolling = false), 1000); // Prevent rapid scrolling
        }
    }

    let currentSectionIndex = 0;

    window.addEventListener("wheel", function (event) {
        if (isScrolling) return;

        if (event.deltaY > 0) {
            // Scroll Down
            currentSectionIndex = Math.min(currentSectionIndex + 1, sections.length - 1);
        } else {
            // Scroll Up
            currentSectionIndex = Math.max(currentSectionIndex - 1, 0);
        }
        scrollToSection(currentSectionIndex);
    });

    window.addEventListener("touchstart", function (event) {
        startY = event.touches[0].clientY;
    });

    window.addEventListener("touchend", function (event) {
        if (isScrolling) return;

        let endY = event.changedTouches[0].clientY;
        if (startY - endY > 50) {
            // Swipe Up (Scroll Down)
            currentSectionIndex = Math.min(currentSectionIndex + 1, sections.length - 1);
        } else if (endY - startY > 50) {
            // Swipe Down (Scroll Up)
            currentSectionIndex = Math.max(currentSectionIndex - 1, 0);
        }
        scrollToSection(currentSectionIndex);
    });
});









/* Function for import all comments from google sheet */
document.getElementById("indoforall_comment_form").addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent page refresh

    let name = document.getElementById("indoforall_comment_username").value.trim();
    let comment = document.getElementById("indoforall_comment_text").value.trim();
    let stars = document.getElementById("indoforall_comment_stars").value;


    let formData = new URLSearchParams();
    formData.append("name", name); // Match Google Apps Script keys
    formData.append("comment", comment);
    formData.append("stars", stars);

    try {
        let response = await fetch("https://script.google.com/macros/s/AKfycbyBAJQhhVA5Uhxe2rrEZ4rjB0Ttn4SrYBptwjx47VZlxtgi3dENPfmNyAmrfL-QZpdEnQ/exec", {
            method: "POST",
            body: formData,
        });

        let data = await response.text();

        if (data === "Success") {
            document.getElementById("indoforall_comment_form").reset();

            await fetchReviews(); // Wait until fetchReviews() is fully executed

            showSuccessNotification(); // Now run the notification function
        }
    } catch (error) {
    }
});

// Function to Fetch and Display Reviews
function fetchReviews() {
    fetch("https://script.google.com/macros/s/AKfycbyBAJQhhVA5Uhxe2rrEZ4rjB0Ttn4SrYBptwjx47VZlxtgi3dENPfmNyAmrfL-QZpdEnQ/exec")
        .then(response => response.json())
        .then(data => {
            let indoforall_clint_rate_area = document.getElementById("indoforall_clint_rate_area");
            indoforall_clint_rate_area.innerHTML = ""; // Clear old reviews

            data.reverse().forEach(item => { // Reverse to show newest first
                let { date, name, comment, starAmount } = item;

                // Skip any row where the comment is empty
                if (!comment.trim()) return;

                let clintRateDiv = document.createElement("div");
                clintRateDiv.classList.add("indoforall_rate_div");

                clintRateDiv.innerHTML = `
                <div class="indoforall_clint_rate_date_div indoforall_animate_on_scroll">
                    <h3 class="indoforall_animate_on_scroll">${date}</h3>
                </div>

                <div class="indoforall_clint_rate_info_div indoforall_animate_on_scroll">
                    <img src="assets/logo.webp" alt="سهم للسفر والسياحة - مكتب سياحي" title="سهم للسفر والسياحة - مكتب سياحي">
                    <h4>${name}</h4>
                </div>

                <div class="indoforall_clint_rate_comment_div">
                    <h5>${comment}</h5>
                </div>

                <div class="indoforall_clint_rate_star_div">
                    ${"★".repeat(starAmount)}
                </div>
            `;

                indoforall_clint_rate_area.appendChild(clintRateDiv);
            });

            // Smooth appearance with delay
            setTimeout(() => {
                indoforall_clint_rate_area.classList.add("show");
            }, 100);
        })
        .catch(error => console.error("Error fetching reviews:", error));
}

// Function to Show Floating Success Notification
function showSuccessNotification() {
    let notification = document.getElementById("indoforall_success_notification");
    notification.style.display = "block";

    setTimeout(() => {
        notification.style.opacity = "1";
        notification.style.transform = "translateX(-50%) translateY(0px)"; // Move slightly up
    }, 10);

    setTimeout(() => {
        notification.style.opacity = "0";
        notification.style.transform = "translateX(-50%) translateY(10px)"; // Move down slightly while fading out
        setTimeout(() => {
            notification.style.display = "none";
        }, 400);
    }, 3000);
}

// Fetch Reviews on Page Load
fetchReviews();

















/* Header show or hide based on scrolling */
const header = document.getElementById('header');
let lastScrollPosition = 0;

window.addEventListener('scroll', () => {
    const currentScrollPosition = window.scrollY;

    if (currentScrollPosition > lastScrollPosition) {
        // Scrolling down
        header.classList.add('hidden');
    } else {
        // Scrolling up
        header.classList.remove('hidden');
    }

    lastScrollPosition = currentScrollPosition;
});
