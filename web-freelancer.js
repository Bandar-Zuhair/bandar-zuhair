let menu = document.querySelector('#web-freelancer-menu-icon');
let navbar = document.querySelector('.web-freelancer-navbar');

menu.onclick = () => {
    let isMenuOpen = menu.getAttribute("name") === "menu-sharp";

    menu.setAttribute("name", isMenuOpen ? "close-sharp" : "menu-sharp");
    navbar.classList.toggle('active');
};

// Close menu when scrolling
window.onscroll = () => {
    menu.setAttribute("name", "menu-sharp");
    navbar.classList.remove('active');
};


const typed = new Typed('.multiple-text', {
    strings: ['Web Freelancer', 'Front-End Dev', 'Back-End Dev', 'Full-Stack Dev', 'Web Designer', 'Google SEO Expert'],
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








let sections = document.querySelectorAll("section");
let isScrolling = false;
const DEBOUNCE_TIME = 500; // Time before allowing another scroll
const SWIPE_THRESHOLD = 30; // Minimum swipe distance to trigger scrolling

// Function to find the closest section to scroll to
function getClosestSectionIndex() {
    let scrollPosition = window.scrollY + window.innerHeight / 2; // Get middle viewport position
    let closestIndex = 0;
    let closestDistance = Infinity;

    sections.forEach((section, index) => {
        let sectionMiddle = section.offsetTop + section.offsetHeight / 2;
        let distance = Math.abs(scrollPosition - sectionMiddle);
        if (distance < closestDistance) {
            closestDistance = distance;
            closestIndex = index;
        }
    });

    return closestIndex;
}

// Function to scroll to a section smoothly
function scrollToClosestSection(scrollDirection) {
    if (isScrolling) return;

    let currentIndex = getClosestSectionIndex();
    let targetIndex = scrollDirection > 0 ? currentIndex + 1 : currentIndex - 1;

    if (targetIndex < 0 || targetIndex >= sections.length) return; // Prevent out-of-bounds scrolling

    let targetSection = sections[targetIndex];
    window.scrollTo({
        top: targetSection.offsetTop,
        behavior: "smooth",
    });

    isScrolling = true;
    setTimeout(() => (isScrolling = false), DEBOUNCE_TIME);
}

// Mouse Wheel Event
function handleWheel(event) {
    scrollToClosestSection(event.deltaY);
}

// Touch Events (Fix: Only Scroll on Swipe, Not Tap)
let startY = 0;

function handleTouchStart(event) {
    startY = event.touches[0].clientY;
}

function handleTouchEnd(event) {
    if (isScrolling) return;

    let endY = event.changedTouches[0].clientY;
    let distance = Math.abs(startY - endY);

    if (distance > SWIPE_THRESHOLD) {
        scrollToClosestSection(startY - endY);
    }
}

// Attach event listeners
window.addEventListener("wheel", handleWheel);
window.addEventListener("touchstart", handleTouchStart);
window.addEventListener("touchend", handleTouchEnd);

// Function to assign alternating slide animations
function assignSlideDirections() {
    document.querySelectorAll(".animated-element").forEach((el, index) => {
        el.classList.add(index % 2 === 0 ? "slide-left" : "slide-right");
    });
}

// Function to reset and restart animations
function applyAnimations(section) {
    let elements = section.querySelectorAll(".animated-element");

    elements.forEach((el) => {
        el.classList.remove("animate"); // Remove animation class
        void el.offsetWidth; // Force reflow (restart animation)
        setTimeout(() => el.classList.add("animate"), 50); // Re-add after a delay
        console.log(`Animation applied to: ${el.innerText || "Element"}`);
    });
}

/* Function to handle intersection and animations */
function createElementsSideSlideAnimation() {
    document.body.style.overflowX = "hidden";
    document.documentElement.style.overflowX = "hidden";

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const innerElements = entry.target.querySelectorAll("*:not(video)"); // Select all elements except videos

            if (entry.isIntersecting) {
                // Reveal elements and trigger animation
                innerElements.forEach(el => el.style.opacity = "1");
                applyAnimations(entry.target);
            } else {
                // Hide elements and reset animation
                innerElements.forEach(el => {
                    el.style.opacity = "0";
                    el.classList.remove("animate"); // Ensure animation resets
                });
            }
        });
    }, { threshold: 0.4 });

    sections.forEach(section => {
        observer.observe(section);
    });
}

// Assign slide directions before animations start
assignSlideDirections();

/* Run animation logic */
createElementsSideSlideAnimation();














/* Function for import all comments from google sheet */
document.getElementById("web-freelancer-comment-form").addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent page refresh

    let name = document.getElementById("web-freelancer-comment-username").value.trim();
    let comment = document.getElementById("web-freelancer-comment-text").value.trim();
    let stars = document.getElementById("web-freelancer-comment-stars").value;


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
            document.getElementById("web-freelancer-comment-form").reset();

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
            let web_freelancer_customers_comments_area = document.getElementById("web-freelancer-customers-comments-area");
            web_freelancer_customers_comments_area.innerHTML = ""; // Clear old reviews

            data.reverse().forEach(item => { // Reverse to show newest first
                let { date, name, comment, starAmount } = item;

                // Skip any row where the comment is empty
                if (!comment.trim()) return;

                let clintRateDiv = document.createElement("div");
                clintRateDiv.classList.add("web-freelancer-customers-comments-div");

                clintRateDiv.innerHTML = `
                <div class="web-freelancer-customers-comments-date-div animated-element">
                    <h3>${date}</h3>
                </div>

                <div class="web-freelancer-customers-comments-info-div animated-element">
                    <img src="web-freelancer/web-freelancer-logo.webp" alt="Web Freelancer - Bandar Zuhair" title="Web Freelancer - Bandar Zuhair">
                    <h4>${name}</h4>
                </div>

                <div class="web-freelancer-customers-comments-comment-div animated-element">
                    <h5>${comment}</h5>
                </div>

                <div class="indoforall-client-rate-star-div animated-element">
                    ${"★".repeat(starAmount)}
                </div>
            `;

                web_freelancer_customers_comments_area.appendChild(clintRateDiv);
            });

            // Smooth appearance with delay
            setTimeout(() => {
                web_freelancer_customers_comments_area.classList.add("show");
            }, 100);
            

            assignSlideDirections();
            createElementsSideSlideAnimation();
        })
        .catch(error => console.error("Error fetching reviews:", error));
}

// Function to Show Floating Success Notification
function showSuccessNotification() {
    let notification = document.getElementById("web-freelancer-comment-success-notification");
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













/* Function to run a video in the background of a section */
function addBackgroundVideo(sectionId, videoSrc) {
    const video = document.createElement("video");
    Object.assign(video, {
        src: videoSrc,
        autoplay: true,
        loop: true,
        muted: true,
        playsInline: true
    });

    Object.assign(video.style, {
        position: "absolute",
        top: "0",
        left: "0",
        width: "100%",
        height: "100%",
        objectFit: "cover",
        zIndex: "-1",
        opacity: "0.1"
    });

    const section = document.getElementById(sectionId);
    if (section) {
        section.style.position = "relative";
        section.prepend(video);
    }
}

// Add videos to sections
addBackgroundVideo("web-freelancer-home-section", "web-freelancer-bandar-zuhair.mp4");
addBackgroundVideo("web-freelancer-about", "web-freelancer-about-bandar-zuhair.mp4");
addBackgroundVideo("web-freelancer-services", "web-freelancer-services.mp4");
addBackgroundVideo("web-freelancer-customers-comments-section", "web-freelancer-comment.mp4");
addBackgroundVideo("web-freelancer-projects", "web-freelancer-projects.mp4");
























const serviceBoxes = document.querySelectorAll(".web-freelancer-services-box");
const popup = document.getElementById("web-freelancer-service-popup");
const overlay = document.getElementById("web-freelancer-popup-overlay");
const popupImg = document.getElementById("web-freelancer-popup-img");
const popupTitle = document.getElementById("web-freelancer-popup-title");
const popupDesc = document.getElementById("web-freelancer-popup-desc");
const popupLink = document.getElementById("web-freelancer-popup-link");
const closeBtn = document.querySelector(".web-freelancer-close-service-details-box-btn");

// Descriptions for each service
const descriptions = {
    /* Services */
    "High-Quality Web Development": "Bring any idea of yours to the market in a special way using AI.",
    "Google Search Ranking (SEO)": "Boost your online visibility and attract more potential customers with our expert SEO strategies. I optimize your website for higher rankings on Google, increasing organic traffic and ensuring that your business stands out in search results.",
    "Business System Automation": "Simply I help you do what you do in a better, faster and easier way, streamline your operations, save time, and enhance efficiency with customized automation solutions. From lead management to customer engagement, I help you implement smart systems that reduce manual work and allow your business to scale effortlessly.",

    /* Projects */
    "Affiliate Marketing Website Templates": "A collection of ready-to-use e-commerce website templates designed for affiliate marketing. Users can browse, select, and launch their own affiliate store with ease. Perfect for beginners and entrepreneurs looking to start their online business quickly and efficiently.",
    "Koktel Indonesia All in One Place": "A one-stop website for everything you need! Order food, groceries, medicine, or book a villa—all in one place. Fast, easy, and works on any device. Safe payments, smooth browsing, and hassle-free service for businesses and customers.",
    "Home Service Worker Recruitment Platform": "A simple website that helps families find and hire home workers easily. Users can choose a worker, contact us, and get help with the hiring process. We make sure all workers are trusted and ready to help with household tasks.",
};

// WhatsApp links for each service
const serviceLinks = {
    /* Services */
    "High-Quality Web Development": "https://wa.me/+966569446280?text=Hello%20Bandar,%20I'm%20interested%20in%20your%20High-Quality%20Web%20Development%20service",
    "Google Search Ranking (SEO)": "https://wa.me/+966569446280?text=Hello%20Bandar,%20I'm%20interested%20in%20your%20Google%20Search%20Ranking%20(SEO)%20service",
    "Business System Automation": "https://wa.me/+966569446280?text=Hello%20Bandar,%20I'm%20interested%20in%20your%20Business%20Automation%20service",

    /* Projects */
    "Affiliate Marketing Website Templates": "https://richegoo.com",
    "Koktel Indonesia All in One Place": "https://koktel-indo.com",
    "Home Service Worker Recruitment Platform": "https://indoforall.com",
};

serviceBoxes.forEach(box => {
    box.addEventListener("click", function () {
        const imgSrc = box.querySelector("img").src;
        const title = box.querySelector("h3").innerText;

        popupImg.src = imgSrc;
        popupTitle.innerText = title;
        popupDesc.innerText = descriptions[title] || "Learn more about our services.";
        popupLink.href = serviceLinks[title] || "#"; // Set correct link

        // Determine whether the title belongs to "Services" or "Projects"
        if (descriptions[title]) {
            if (serviceLinks[title].includes("wa.me")) {
                popupLink.innerText = "Request This Service";
            } else {
                popupLink.innerText = "Visit The Website";
            }
        } else {
            popupLink.innerText = "Learn More";
        }

        // Show pop-up & overlay smoothly
        popup.classList.add("active");
        overlay.classList.add("active");
    });
});

// Function to close pop-up & overlay smoothly
function closePopup() {
    popup.classList.remove("active");
    overlay.classList.remove("active");
}

// Close pop-up when clicking the close button
closeBtn.addEventListener("click", closePopup);

// Close pop-up when clicking on the overlay
overlay.addEventListener("click", closePopup);


