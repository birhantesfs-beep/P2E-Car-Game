document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       SCREENS
    ===================================================== */

    const loadingScreen = document.getElementById("loadingScreen");
    const authChoiceScreen = document.getElementById("authChoiceScreen");
    const signupScreen = document.getElementById("signupScreen");
    const loginScreen = document.getElementById("loginScreen");
    const verificationScreen = document.getElementById("verificationScreen");
    const homeScreen = document.getElementById("homeScreen");


    /* =====================================================
       LOADING
    ===================================================== */

    const loadingProgress =
        document.getElementById("loadingProgress");

    const loadingPercent =
        document.getElementById("loadingPercent");

    let loadingValue = 0;

    const loadingTimer = setInterval(() => {

        loadingValue += 2;

        if (loadingValue > 100) {
            loadingValue = 100;
        }

        loadingProgress.style.width =
            loadingValue + "%";

        loadingPercent.textContent =
            loadingValue + "%";

        if (loadingValue >= 100) {

            clearInterval(loadingTimer);

            setTimeout(() => {

                hideAllScreens();

                authChoiceScreen.classList.remove("hidden");

            }, 400);
        }

    }, 40);


    /* =====================================================
       SCREEN HELPERS
    ===================================================== */

    function hideAllScreens() {

        loadingScreen.classList.add("hidden");
        authChoiceScreen.classList.add("hidden");
        signupScreen.classList.add("hidden");
        loginScreen.classList.add("hidden");
        verificationScreen.classList.add("hidden");
        homeScreen.classList.add("hidden");

    }


    function showScreen(screen) {

        hideAllScreens();

        screen.classList.remove("hidden");

    }


    /* =====================================================
       AUTH BUTTONS
    ===================================================== */

    document
        .getElementById("loginButton")
        .addEventListener("click", () => {

            showScreen(loginScreen);

        });


    document
        .getElementById("signupButton")
        .addEventListener("click", () => {

            showScreen(signupScreen);

        });


    document
        .getElementById("guestButton")
        .addEventListener("click", () => {

            showScreen(homeScreen);

            updateHomeUI();

        });


    document
        .getElementById("goLogin")
        .addEventListener("click", () => {

            showScreen(loginScreen);

        });


    document
        .getElementById("goSignup")
        .addEventListener("click", () => {

            showScreen(signupScreen);

        });


    /* =====================================================
       VERIFICATION VARIABLES
    ===================================================== */

    let verificationCode = "";
    let userEmail = "";
    let verificationPurpose = "";
    let returnScreen = null;


    /* =====================================================
       GENERATE VERIFICATION CODE
    ===================================================== */

    function generateVerificationCode() {

        return Math.floor(
            100000 + Math.random() * 900000
        ).toString();

    }


    /* =====================================================
       SHOW VERIFICATION
    ===================================================== */

    function showVerification(
        email,
        purpose,
        previousScreen
    ) {

        userEmail = email;
        verificationPurpose = purpose;
        returnScreen = previousScreen;

        verificationCode =
            generateVerificationCode();

        document.getElementById(
            "verificationEmail"
        ).textContent = email;

        document.getElementById(
            "demoCode"
        ).textContent = verificationCode;

        document.getElementById(
            "verificationMessage"
        ).textContent = "";

        document
            .querySelectorAll(".code-inputs input")
            .forEach(input => {
                input.value = "";
            });

        showScreen(verificationScreen);

        console.log(
            "Demo verification code:",
            verificationCode
        );

        setTimeout(() => {

            const firstInput =
                document.querySelector(
                    ".code-inputs input"
                );

            if (firstInput) {
                firstInput.focus();
            }

        }, 100);

    }


    /* =====================================================
       SIGNUP
    ===================================================== */

    document
        .getElementById("signupForm")
        .addEventListener("submit", (event) => {

            event.preventDefault();

            const firstName =
                document.getElementById("firstName").value.trim();

            const lastName =
                document.getElementById("lastName").value.trim();

            const email =
                document.getElementById("signupEmail").value.trim();

            const password =
                document.getElementById("signupPassword").value;

            const confirmPassword =
                document.getElementById("confirmPassword").value;


            if (!firstName || !lastName) {

                alert("Please enter your name.");

                return;
            }


            if (!email.includes("@")) {

                alert("Please enter a valid email.");

                return;
            }


            if (password.length < 6) {

                alert(
                    "Password must be at least 6 characters."
                );

                return;
            }


            if (password !== confirmPassword) {

                alert("Passwords do not match.");

                return;
            }


            showVerification(
                email,
                "signup",
                signupScreen
            );

        });


    /* =====================================================
       LOGIN
    ===================================================== */

    document
        .getElementById("loginForm")
        .addEventListener("submit", (event) => {

            event.preventDefault();

            const email =
                document.getElementById("loginEmail").value.trim();

            const password =
                document.getElementById("loginPassword").value;


            if (!email.includes("@")) {

                alert("Please enter a valid email.");

                return;
            }


            if (!password) {

                alert("Please enter your password.");

                return;
            }


            showVerification(
                email,
                "login",
                loginScreen
            );

        });


    /* =====================================================
       CODE INPUTS
    ===================================================== */

    const codeInputs =
        document.querySelectorAll(
            ".code-inputs input"
        );


    codeInputs.forEach((input, index) => {

        input.addEventListener("input", () => {

            input.value =
                input.value.replace(/\D/g, "");

            if (
                input.value &&
                index < codeInputs.length - 1
            ) {

                codeInputs[index + 1].focus();

            }

        });


        input.addEventListener("keydown", (event) => {

            if (
                event.key === "Backspace" &&
                !input.value &&
                index > 0
            ) {

                codeInputs[index - 1].focus();

            }


            if (
                event.key === "ArrowLeft" &&
                index > 0
            ) {

                codeInputs[index - 1].focus();

            }


            if (
                event.key === "ArrowRight" &&
                index < codeInputs.length - 1
            ) {

                codeInputs[index + 1].focus();

            }

        });


        input.addEventListener("paste", (event) => {

            event.preventDefault();

            const pasted =
                event.clipboardData
                    .getData("text")
                    .replace(/\D/g, "")
                    .slice(0, 6);


            pasted.split("").forEach(
                (number, pasteIndex) => {

                    if (codeInputs[pasteIndex]) {

                        codeInputs[pasteIndex].value =
                            number;

                    }

                }
            );


            if (pasted.length === 6) {

                codeInputs[5].focus();

            }

        });

    });


    /* =====================================================
       VERIFY
    ===================================================== */

    document
        .getElementById("verifyButton")
        .addEventListener("click", () => {

            const enteredCode =
                Array.from(codeInputs)
                    .map(input => input.value)
                    .join("");


            const message =
                document.getElementById(
                    "verificationMessage"
                );


            if (enteredCode.length !== 6) {

                message.textContent =
                    "Please enter all 6 digits.";

                message.style.color = "red";

                return;
            }


            if (enteredCode !== verificationCode) {

                message.textContent =
                    "Incorrect verification code.";

                message.style.color = "red";

                return;
            }


            message.textContent =
                "Verification successful!";

            message.style.color = "green";


            setTimeout(() => {

                if (
                    verificationPurpose ===
                    "forgot-password"
                ) {

                    showScreen(loginScreen);

                    return;
                }


                showScreen(homeScreen);

                updateHomeUI();

            }, 700);

        });


    /* =====================================================
       RESEND CODE
    ===================================================== */

    document
        .getElementById("resendCode")
        .addEventListener("click", () => {

            verificationCode =
                generateVerificationCode();

            document.getElementById(
                "demoCode"
            ).textContent = verificationCode;

            codeInputs.forEach(input => {
                input.value = "";
            });


            document.getElementById(
                "verificationMessage"
            ).textContent =
                "A new code has been generated.";

            document.getElementById(
                "verificationMessage"
            ).style.color = "#0066cc";


            console.log(
                "New demo verification code:",
                verificationCode
            );


            codeInputs[0].focus();

        });


    /* =====================================================
       BACK FROM VERIFICATION
    ===================================================== */

    document
        .getElementById("backToAuth")
        .addEventListener("click", () => {

            if (returnScreen) {

                showScreen(returnScreen);

            } else {

                showScreen(authChoiceScreen);

            }

        });


    /* =====================================================
       FORGOT PASSWORD
    ===================================================== */

    document
        .getElementById("forgotPassword")
        .addEventListener("click", () => {

            const email =
                document.getElementById(
                    "loginEmail"
                ).value.trim();


            if (!email) {

                alert(
                    "Please enter your email first."
                );

                return;
            }


            if (!email.includes("@")) {

                alert(
                    "Please enter a valid email."
                );

                return;
            }


            showVerification(
                email,
                "forgot-password",
                loginScreen
            );

        });


    /* =====================================================
       HOME GAME STATE
    ===================================================== */

    let energy = 20;
    const maxEnergy = 20;

    let level = 1;
    let cash = 0;
    let coins = 0;


    /* =====================================================
       HOME UI
    ===================================================== */

    function updateHomeUI() {

        document.getElementById(
            "energyValue"
        ).textContent =
            `${energy}/${maxEnergy}`;


        document.getElementById(
            "levelValue"
        ).textContent =
            level;


        document.getElementById(
            "cashValue"
        ).textContent =
            `$${cash.toFixed(2)}`;


        document.getElementById(
            "coinValue"
        ).textContent =
            coins.toFixed(2);


        document.getElementById(
            "startEnergyCost"
        ).textContent =
            "1";

    }


    /* =====================================================
       START GAME
    ===================================================== */

    const startGameButton =
        document.getElementById(
            "startGameButton"
        );

    const gameCar =
        document.getElementById("gameCar");

    const gameMessage =
        document.getElementById("gameMessage");


    startGameButton.addEventListener(
        "click",
        () => {

            if (energy <= 0) {

                gameMessage.textContent =
                    "NO ENERGY!";

                setTimeout(() => {

                    gameMessage.textContent = "";

                }, 1500);

                return;
            }


            /* Spend one energy */

            energy--;

            updateHomeUI();


            /*
                The car is now an independent overlay.
                home-car.jpg remains ONLY the background.
            */

            gameCar.classList.remove("hidden");

            gameCar.classList.add("running");


            gameMessage.textContent =
                "RACING...";


            startGameButton.disabled = true;


            /* =========================
               RACE
            ========================== */

            setTimeout(() => {

                gameCar.classList.remove(
                    "running"
                );


                gameMessage.textContent =
                    "LEVEL COMPLETE!";


                /*
                    Demo reward only.
                    Later this must be handled
                    by a secure backend.
                */

                coins += 0.10;

                level++;


                updateHomeUI();


                setTimeout(() => {

                    gameMessage.textContent = "";

                    gameCar.classList.add("hidden");

                    startGameButton.disabled =
                        false;

                }, 1000);

            }, 2500);

        }
    );


    /* =====================================================
       MODAL
    ===================================================== */

    const homeModal =
        document.getElementById("homeModal");

    const closeModal =
        document.getElementById("closeModal");

    const modalTitle =
        document.getElementById("modalTitle");

    const modalText =
        document.getElementById("modalText");


    function openModal(title, text) {

        modalTitle.textContent = title;
        modalText.textContent = text;

        homeModal.classList.remove("hidden");

    }


    function closeHomeModal() {

        homeModal.classList.add("hidden");

    }


    closeModal.addEventListener(
        "click",
        closeHomeModal
    );


    homeModal.addEventListener(
        "click",
        (event) => {

            if (event.target === homeModal) {

                closeHomeModal();

            }

        }
    );


    /* =====================================================
       WALLET
    ===================================================== */

    document
        .getElementById("cashWallet")
        .addEventListener("click", () => {

            openModal(
                "Cash Wallet",
                `Your cash balance is $${cash.toFixed(2)}.`
            );

        });


    document
        .getElementById("coinWallet")
        .addEventListener("click", () => {

            openModal(
                "Coin Wallet",
                `Your coin balance is ${coins.toFixed(2)}.`
            );

        });


    document
        .getElementById("cashActionButton")
        .addEventListener("click", () => {

            openModal(
                "Cash Wallet",
                "Cash wallet actions will be added later."
            );

        });


    document
        .getElementById("coinActionButton")
        .addEventListener("click", () => {

            openModal(
                "Coin Wallet",
                "Coin wallet actions will be added later."
            );

        });


    /* =====================================================
       INBOX
    ===================================================== */

    document
        .getElementById("inboxButton")
        .addEventListener("click", () => {

            openModal(
                "Inbox",
                "You currently have no new messages."
            );

        });


    /* =====================================================
       SKIN
    ===================================================== */

    document
        .getElementById("skinButton")
        .addEventListener("click", () => {

            openModal(
                "Skin",
                "Your current car skin is selected."
            );

        });


    /* =====================================================
       CAR PROFILE
    ===================================================== */

    document
        .getElementById("carProfileButton")
        .addEventListener("click", () => {

            openModal(
                "Car Profile",
                "Your car profile will be available here."
            );

        });


    /* =====================================================
       GRAND PRIZE
    ===================================================== */

    document
        .getElementById("grandPrizeButton")
        .addEventListener("click", () => {

            openModal(
                "Grand Prize",
                "Grand Prize system will be added here."
            );

        });


    /* =====================================================
       MISSION
    ===================================================== */

    document
        .getElementById("missionButton")
        .addEventListener("click", () => {

            openModal(
                "Mission",
                "Complete races to increase your level."
            );

        });


    /* =====================================================
       INVITE
    ===================================================== */

    document
        .getElementById("inviteButton")
        .addEventListener("click", () => {

            openModal(
                "Invite",
                "Invite friends and earn rewards."
            );

        });


    /* =====================================================
       PROFILE
    ===================================================== */

    document
        .getElementById("profileButton")
        .addEventListener("click", () => {

            openModal(
                "Profile",
                "Your player profile will be available here."
            );

        });


    /* =====================================================
       INITIAL UI
    ===================================================== */

    updateHomeUI();

});