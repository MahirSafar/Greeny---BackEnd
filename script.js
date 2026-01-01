const { execFileSync } = require("child_process");
const fs = require("fs");

// ==========================================
// SETTINGS
// ==========================================

const COMMIT_MESSAGE_LENGTH = 8;

// Dayanacağı dəqiq tarix: 11 Avqust 2026
// (JavaScript-də August = 7)
const STOP_YEAR = 2026;
const STOP_MONTH = 7;
const STOP_DAY = 11;


// ==========================================
// RUN GIT COMMAND
// ==========================================

function git(args) {
    try {
        execFileSync("git", args, {
            stdio: "inherit"
        });
    } catch (error) {
        console.error("\nGit əməliyyatı uğursuz oldu.");
        process.exit(1);
    }
}


// ==========================================
// RANDOM COMMIT MESSAGE
// ==========================================

function randomCommitMessage(length) {
    const chars =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    let result = "";

    for (let i = 0; i < length; i++) {
        result += chars[Math.floor(Math.random() * chars.length)];
    }

    return result;
}


// ==========================================
// ADVANCE SYSTEM DATE BY 1 DAY
// ==========================================

function advanceSystemDate() {
    console.log("\nSistem tarixi 1 gün irəli çəkilir...");
    try {
        const psCommand = "(Get-Date).AddDays(1) | Set-Date";
        execFileSync("powershell", ["-Command", psCommand], {
            stdio: "inherit"
        });
        console.log("Sistem tarixi uğurla yeniləndi.");
    } catch (error) {
        console.error("\nXəta: Sistem tarixini dəyişmək mümkün olmadı.");
        console.error("Zəhmət olmasa skripti Administrator hüquqları ilə işlətdiyinizdən əmin olun.");
        process.exit(1);
    }
}


// ==========================================
// MAIN LOOP (AVTOMATİK DÖVRÜ İŞləmə)
// ==========================================

while (true) {
    const now = new Date();
    const stopDate = new Date(STOP_YEAR, STOP_MONTH, STOP_DAY);

    // Stop tarixini yoxla
    if (now >= stopDate) {
        console.log("\n================================");
        console.log("11 avqust 2026 və ya daha sonradır.");
        console.log("Proqram uğurla dayandırıldı.");
        console.log("================================");
        process.exit(0);
    }

    console.log("\n--------------------------------------------------");
    console.log("Cari tarix:", now.toDateString());
    console.log("--------------------------------------------------");

    // 1. Random mətn əlavə et
    const randomText = randomCommitMessage(COMMIT_MESSAGE_LENGTH);
    fs.writeFileSync("note.txt", "Update: " + randomText + "\n", { flag: "a" });
    console.log("note.txt faylına yeni mətn əlavə olundu.");

    // 2. Git status yoxla
    try {
        execFileSync("git", ["rev-parse", "--is-inside-work-tree"], { stdio: "ignore" });
    } catch {
        console.error("Xəta: Bu qovluq Git repository deyil.");
        process.exit(1);
    }

    // 3. Add files
    console.log("Dəyişikliklər əlavə olunur...");
    git(["add", "."]);

    // 4. Commit
    console.log("Commit yaradılır...");
    git(["commit", "-m", randomText]);

    // 5. Push
    console.log("GitHub-a push edilir...");
    git(["push"]);

    console.log("================================");
    console.log("Uğurla push edildi! Commit:", randomText);
    console.log("================================");

    // 6. Tarixi 1 gün irəli çək və dövr yenidən başlayacaq
    advanceSystemDate();
}