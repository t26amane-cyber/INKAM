/* =================================
   INKAM - MAIN JAVASCRIPT
   ================================= */

const tg = window.Telegram?.WebApp;

if (tg) {
    tg.ready();
    tg.expand();
}

/* ================================
   USER DATA
   ================================ */

let userData = JSON.parse(
    localStorage.getItem("inkamUser")
) || {
    balance: 0,
    coins: 0,
    referrals: 0,
    dailyBonus: false,
    tasksCompleted: 0,
    history: []
};

function saveData() {
    localStorage.setItem(
        "inkamUser",
        JSON.stringify(userData)
    );
}

/* ================================
   BALANCE UPDATE
   ================================ */

function updateBalance() {
    const balanceElements =
        document.querySelectorAll(".balance");

    balanceElements.forEach(el => {
        el.textContent =
            "৳ " + Number(userData.balance).toFixed(2);
    });
}

/* ================================
   TELEGRAM USER
   ================================ */

function loadTelegramUser() {

    if (!tg?.initDataUnsafe?.user) return;

    const user = tg.initDataUnsafe.user;

    const name =
        user.first_name ||
        user.username ||
        "User";

    const userNameElements =
        document.querySelectorAll(".user-name");

    userNameElements.forEach(el => {
        el.textContent = name;
    });
}

loadTelegramUser();
updateBalance();

/* ================================
   NAVIGATION
   ================================ */

document.querySelectorAll(".bottom-nav a")
.forEach(link => {

    link.addEventListener("click", function(e) {

        e.preventDefault();

        document.querySelectorAll(
            ".bottom-nav a"
        ).forEach(item => {
            item.classList.remove("active");
        });

        this.classList.add("active");

        const target =
            this.getAttribute("href");

        if (
            target &&
            target !== "#" &&
            target.startsWith("#")
        ) {

            const section =
                document.querySelector(target);

            if (section) {
                section.scrollIntoView({
                    behavior: "smooth"
                });
            }
        }
    });

});

/* ================================
   QUICK ACTIONS
   ================================ */

document.querySelectorAll(".quick-action")
.forEach(card => {

    card.addEventListener("click", function() {

        const title =
            this.querySelector("strong")
            ?.textContent
            ?.toLowerCase();

        if (!title) return;

        if (title.includes("earn")) {
            scrollToSection("tasks");
        }

        else if (title.includes("bonus")) {
            scrollToSection("bonus");
        }

        else if (title.includes("refer")) {
            scrollToSection("referral");
        }

        else if (title.includes("withdraw")) {
            scrollToSection("withdraw");
        }

        else if (title.includes("history")) {
            scrollToSection("history");
        }

        else if (title.includes("profile")) {
            scrollToSection("profile");
        }
    });

});

/* ================================
   SECTION SCROLL
   ================================ */

function scrollToSection(id) {

    const section =
        document.getElementById(id);

    if (section) {

        section.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    }
}

/* ================================
   DAILY BONUS
   ================================ */

function claimDailyBonus() {

    if (userData.dailyBonus) {

        showMessage(
            "Daily Bonus already claimed!"
        );

        return;
    }

    const reward = 10;

    userData.coins += reward;
    userData.balance += reward / 100;

    userData.dailyBonus = true;

    userData.history.unshift({
        type: "Daily Bonus",
        amount: reward / 100,
        time: new Date().toLocaleString()
    });

    saveData();
    updateBalance();

    showMessage(
        `🎁 Daily Bonus +${reward} coins`
    );
}

/* ================================
   TASK REWARD
   ================================ */

function completeTask(reward = 5) {

    userData.coins += reward;
    userData.balance += reward / 100;

    userData.tasksCompleted++;

    userData.history.unshift({
        type: "Task Completed",
        amount: reward / 100,
        time: new Date().toLocaleString()
    });

    saveData();
    updateBalance();

    showMessage(
        `✅ Task completed +${reward} coins`
    );
}

/* ================================
   REFERRAL
   ================================ */

function copyReferralLink() {

    const userId =
        tg?.initDataUnsafe?.user?.id ||
        "USER";

    const referralLink =
        "https://t.me/INKAM_BOT?start=" +
        userId;

    navigator.clipboard
        ?.writeText(referralLink)
        .then(() => {

            showMessage(
                "🔗 Referral link copied!"
            );

        })
        .catch(() => {

            showMessage(
                referralLink
            );

        });
}

/* ================================
   WITHDRAW
   ================================ */

function requestWithdraw() {

    if (userData.balance <= 0) {

        showMessage(
            "Your balance is not enough."
        );

        return;
    }

    showMessage(
        "💸 Withdraw request feature will be connected in the next step."
    );
}

/* ================================
   HISTORY
   ================================ */

function getHistory() {

    return userData.history || [];
}

/* ================================
   MESSAGE
   ================================ */

function showMessage(message) {

    let box =
        document.getElementById(
            "inkam-message"
        );

    if (!box) {

        box = document.createElement("div");

        box.id = "inkam-message";

        box.style.position = "fixed";
        box.style.left = "50%";
        box.style.bottom = "85px";
        box.style.transform =
            "translateX(-50%)";
        box.style.zIndex = "9999";
        box.style.padding = "12px 18px";
        box.style.borderRadius = "12px";
        box.style.background = "#111a2b";
        box.style.border =
            "1px solid rgba(32,214,199,.3)";
        box.style.color = "#fff";
        box.style.fontSize = "13px";
        box.style.textAlign = "center";
        box.style.maxWidth = "90%";
        box.style.boxShadow =
            "0 10px 30px rgba(0,0,0,.4)";

        document.body.appendChild(box);
    }

    box.textContent = message;
    box.style.display = "block";

    clearTimeout(window.inkamMessageTimer);

    window.inkamMessageTimer =
        setTimeout(() => {

            box.style.display = "none";

        }, 2500);
}

/* ================================
   TELEGRAM MAIN BUTTON
   ================================ */

if (tg?.MainButton) {

    tg.MainButton.setText(
        "START EARNING"
    );

    tg.MainButton.show();

    tg.MainButton.onClick(() => {

        scrollToSection("tasks");

    });
}

/* ================================
   PAGE READY
   ================================ */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        updateBalance();

        console.log(
            "INKAM App Loaded Successfully"
        );

    }
);
