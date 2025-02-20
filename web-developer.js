let menu = document.querySelector('#web-developer-menu-icon');
let navbar = document.querySelector('.web-developer-navbar');

menu.onclick = () => {
    menu.classList.toggle('bx-x');
    navbar.classList.toggle('active');
}

window.onscroll = () => {
    menu.classList.remove('bx-x');
    navbar.classList.remove('active');
}

const typed = new Typed('.multiple-text', {
    strings: ['Front-End Dev', 'Back-End Dev', 'Full-Stack Dev', 'Web Designer', 'Google SEO Expert'],
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

















document.addEventListener("DOMContentLoaded", () => {
    createElementsSideSlideAnimation();
});

createElementsSideSlideAnimation = function () {
    const sections = document.querySelectorAll("section");
    document.body.style.overflowX = "hidden";
    document.documentElement.style.overflowX = "hidden";

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const elements = entry.target.querySelectorAll("h1, h2, h3, h4, h5, h6, p, a, ion-icon, label");

            elements.forEach((el, index) => {
                if (entry.isIntersecting) {
                    el.style.transition = "transform 1.2s ease, color 0.4s ease, background-color 0.4s ease, border-color 0.4s ease";
                    el.style.transform = "translateX(0)";
                } else {
                    el.style.transition = "transform 1.2s ease";
                    el.style.transform = index % 2 === 0 ? "translateX(80px)" : "translateX(-80px)";
                }
            });
        });
    }, { threshold: 0.4 });

    sections.forEach(section => {
        section.style.width = "100%";
        section.style.boxSizing = "border-box";
        section.style.overflow = "hidden";

        const elements = section.querySelectorAll("h1, h2, h3, h4, h5, h6, p, a, ion-icon, label");
        elements.forEach((el, index) => {
            el.style.transform = index % 2 === 0 ? "translateX(80px)" : "translateX(-80px)";
            el.style.transition = "transform 1.2s ease";
        });

        observer.observe(section);
    });
};















/* Function for import all comments from google sheet */
document.getElementById("web-developer-comment-form").addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent page refresh

    let name = document.getElementById("web-developer-comment-username").value.trim();
    let comment = document.getElementById("web-developer-comment-text").value.trim();
    let stars = document.getElementById("web-developer-comment-stars").value;


    let formData = new URLSearchParams();
    formData.append("name", name); // Match Google Apps Script keys
    formData.append("comment", comment);
    formData.append("stars", stars);

    try {
        let response = await fetch("https://script.google.com/macros/s/AKfycbz6kKWll4Ktd1fsFPDqMs4Qsam5-u4cSAf0V27R3WvzMtnEWtylOZUFQ5F_4JAhCysW/exec", {
            method: "POST",
            body: formData,
        });

        let data = await response.text();

        if (data === "Success") {
            document.getElementById("web-developer-comment-form").reset();

            await fetchReviews(); // Wait until fetchReviews() is fully executed

            showSuccessNotification(); // Now run the notification function
        }
    } catch (error) {
    }
});

// Function to Fetch and Display Reviews
function fetchReviews() {
    fetch("https://script.google.com/macros/s/AKfycbz6kKWll4Ktd1fsFPDqMs4Qsam5-u4cSAf0V27R3WvzMtnEWtylOZUFQ5F_4JAhCysW/exec")
        .then(response => response.json())
        .then(data => {
            let web_developer_customers_comments_area = document.getElementById("web-developer-customers-comments-area");
            web_developer_customers_comments_area.innerHTML = ""; // Clear old reviews

            data.reverse().forEach(item => { // Reverse to show newest first
                let { date, name, comment, starAmount } = item;

                // Skip any row where the comment is empty
                if (!comment.trim()) return;

                let clintRateDiv = document.createElement("div");
                clintRateDiv.classList.add("web-developer-customers-comments-div");

                clintRateDiv.innerHTML = `
                <div class="web-developer-customers-comments-date-div">
                    <h3>${date}</h3>
                </div>

                <div class="web-developer-customers-comments-info-div">
                    <img src="assets/logo.webp" alt="Web Developer - Bandar Zuhair" title="Web Developer - Bandar Zuhair">
                    <h4>${name}</h4>
                </div>

                <div class="web-developer-customers-comments-comment-div">
                    <h5>${comment}</h5>
                </div>

                <div class="indoforall-client-rate-star-div">
                    ${"★".repeat(starAmount)}
                </div>
            `;

                web_developer_customers_comments_area.appendChild(clintRateDiv);
            });

            // Smooth appearance with delay
            setTimeout(() => {
                web_developer_customers_comments_area.classList.add("show");
            }, 100);


            createElementsSideSlideAnimation();
        })
        .catch(error => console.error("Error fetching reviews:", error));
}

// Function to Show Floating Success Notification
function showSuccessNotification() {
    let notification = document.getElementById("web-developer-comment-success-notification");
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
















