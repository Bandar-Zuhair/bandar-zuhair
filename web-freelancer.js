// Mobile Navigation Toggle
const navToggle = document.getElementById("nav-toggle");
const navMenu = document.getElementById("nav-menu");

navToggle.addEventListener("click", () => {
    navMenu.classList.toggle("active");
    navToggle.innerHTML = navMenu.classList.contains("active") ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
});

// Close mobile menu when clicking on a nav link
document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
        navMenu.classList.remove("active");
        navToggle.innerHTML = '<i class="fas fa-bars"></i>';
    });
});

// Sticky Header
window.addEventListener("scroll", () => {
    const header = document.getElementById("header");
    header.classList.toggle("scrolled", window.scrollY > 50);
});

// Active Navigation Link on Scroll
const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll(".nav-link");

window.addEventListener("scroll", () => {
    let current = "";

    sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;

        if (pageYOffset >= sectionTop - 300) {
            current = section.getAttribute("id");
        }
    });

    navLinks.forEach((link) => {
        link.classList.remove("active");
        if (link.getAttribute("href") === `#${current}`) {
            link.classList.add("active");
        }
    });
});

// Back to Top Button
const backToTop = document.getElementById("back-to-top");

window.addEventListener("scroll", () => {
    backToTop.classList.toggle("active", window.scrollY > 500);
});

// Smooth Scrolling for All Links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
        e.preventDefault();

        const targetId = this.getAttribute("href");
        const targetElement = document.querySelector(targetId);

        window.scrollTo({
            top: targetElement.offsetTop - 80,
            behavior: "smooth",
        });
    });
});

// Animate Skill Bars on Scroll
const skillBars = document.querySelectorAll(".skill-progress");

function animateSkillBars() {
    skillBars.forEach((bar) => {
        const width = bar.style.width;
        bar.style.width = "0";

        setTimeout(() => {
            bar.style.width = width;
        }, 100);
    });
}

// Intersection Observer for Skill Bars
const aboutSection = document.getElementById("about");

const observer = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                animateSkillBars();
                observer.unobserve(entry.target);
            }
        });
    },
    { threshold: 0.2 }
);

observer.observe(aboutSection);

/* Comments */
document.getElementById("user_comment_form").addEventListener("submit", async function (event) {
    event.preventDefault();
    const button = document.querySelector("#user_comment_form button[type='submit']");
    button.disabled = true;
    button.style.background = "gray";
    button.style.color = "white";
    button.innerText = "Posting...";

    let reviewer_name = document.getElementById("user_comment_username").value.trim();
    let comment = document.getElementById("user_comment_text").value.trim();
    let stars = parseInt(document.getElementById("user_comment_stars").value);
    let review_date = new Date().toISOString().split("T")[0];

    const newComment = {
        review_date,
        reviewer_name,
        comment,
        stars,
    };

    try {
        // Target column name
        const column = "bandar-zuhair";

        // Fetch existing array in that column (assume row with id = 1)
        const { data, error: fetchError } = await supabase.from("all_customers_comments").select(column).eq("id", 1).single();

        if (fetchError) throw fetchError;

        const existingArray = data[column] || [];

        const updatedArray = [newComment, ...existingArray];

        // Update the column with the new array
        const { error: updateError } = await supabase
            .from("all_customers_comments")
            .update({ [column]: updatedArray })
            .eq("id", 1);

        if (updateError) throw updateError;

        document.getElementById("user_comment_form").reset();
        await fetchReviews(); // Optional: refresh UI
        showSuccessNotification();
    } catch (error) {
        console.error("Error inserting comment:", error.message);
    } finally {
        button.disabled = false;
        button.style.background = "#f0f0f0";
        button.style.color = "black";
        button.innerText = "Submit";
    }
});

// Function to Fetch and Display Reviews
async function fetchReviews() {
    try {
        const column = "bandar-zuhair";

        const { data, error } = await supabase.from("all_customers_comments").select(column).eq("id", 1).single();

        if (error) throw error;

        const reviews = data[column] || [];

        let user_clint_rate_area = document.getElementById("user_clint_rate_area");
        user_clint_rate_area.innerHTML = "";

        reviews.forEach((item) => {
            const { review_date, reviewer_name, comment, stars } = item;

            if (!comment.trim()) return;

            const div = document.createElement("div");
            div.classList.add("user_card_rate_div");
            div.innerHTML = `
                <div class="card_clint_rate_date_div"><h3>${review_date}</h3></div>
                <div class="card_clint_rate_info_div">
                    <img src="web-freelancer/bandar-zuhair.webp" alt="..." title="...">
                    <h4>${reviewer_name}</h4>
                </div>
                <div class="card_clint_rate_comment_div"><h5>${comment}</h5></div>
                <div class="card_clint_rate_star_div">
                    ${"★".repeat(stars)}${"☆".repeat(5 - stars)}
                </div>
            `;
            user_clint_rate_area.appendChild(div);
        });
    } catch (error) {
        console.error("Error fetching reviews:", error.message);
    }
}

// Function to Show Floating Success Notification
function showSuccessNotification() {
    let notification = document.getElementById("new_comment_success_notification");
    notification.style.display = "block";

    setTimeout(() => {
        notification.style.opacity = "1";
        notification.style.transform = "translateX(-50%) translateY(0px)";
    }, 10);

    setTimeout(() => {
        notification.style.opacity = "0";
        notification.style.transform = "translateX(-50%) translateY(10px)";
        setTimeout(() => {
            notification.style.display = "none";
        }, 400);
    }, 3000);
}

fetchReviews();

/* Elements Animation On Scroll */
const animatedElements = document.querySelectorAll(".animate-on-scroll");

function animateOnScroll() {
    const triggerPoint = window.innerHeight * 0.9;

    animatedElements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const midpoint = rect.top + rect.height / 2;

        if (midpoint < triggerPoint) {
            el.classList.add("in-view");
        }
    });
}

window.addEventListener("scroll", animateOnScroll);
window.addEventListener("resize", animateOnScroll);
document.addEventListener("DOMContentLoaded", animateOnScroll); // safer than immediate call
