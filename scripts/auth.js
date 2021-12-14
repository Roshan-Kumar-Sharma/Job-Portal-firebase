const modals = document.querySelectorAll(".modal");

// document.querySelector(".modal").modal({
//     onCloseEnd: function () {
//         // Callback for Modal close
//         alert("Closed");
//     },
// });

async function signup(event) {
    event.preventDefault();

    const email = document.getElementById("signupEmail");
    const password = document.getElementById("signupPassword");
    const instance = M.Modal.getInstance(modals[1]);
    // console.log(signupEmail, signupPassword);
    // email.value = password.value = "";

    try {
        const userCredential = await auth.createUserWithEmailAndPassword(
            email.value,
            password.value
        );

        const user = await userCredential.user.updateProfile({
            displayName: "User",
        });

        console.log(userCredential);

        createUserCollection(userCredential.user);

        // const sendEmail = await userCredential.user.sendEmailVerification();

        // console.log(userCredential);
        M.toast({
            html: `Congrats! ${userCredential.user.email}, you have successfully registered.`,
            classes: "green",
        });

        instance.close();
    } catch (error) {
        console.error(error);
        M.toast({ html: error.message, classes: "red" });
    }
}

async function login(event) {
    event.preventDefault();
    const email = document.getElementById("loginEmail");
    const password = document.getElementById("loginPassword");

    const instance = M.Modal.getInstance(modals[0]);

    // email.value = password.value = "";
    // console.log(signupEmail, signupPassword);

    try {
        const userCredential = await auth.signInWithEmailAndPassword(
            email.value,
            password.value
        );

        console.log(userCredential);

        M.toast({
            html: `Welcome! ${userCredential.user.email}, you are now logged in.`,
            classes: "green",
        });

        instance.close();
    } catch (error) {
        console.error(error);
        M.toast({ html: error.message, classes: "red" });
    }
}

function logout() {
    auth.signOut().then(() => {
        document.querySelector("#profile-pic").src = "./assets/noimage.png";

        console.log("logged out");
    });
}

const unsubscribe = auth.onAuthStateChanged((user) => {
    if (user) {
        console.log(user.uid);
        document.getElementById("login").style.display = "none";
        document.getElementById("signup").style.display = "none";
        document.getElementById("logout").style.display = "block";
        getUserInfoRealtime(user.uid);
        if (user.uid == "1LnbHwRtHLTCpuNLc4T9NtW8E1C2") {
            allUserDetails();
        }
    } else {
        document.getElementById("login").style.display = "block";
        document.getElementById("signup").style.display = "block";
        document.getElementById("logout").style.display = "none";
        getUserInfoRealtime(null);
        document.getElementById("table").style.display = "none";
        // const user = firebase.auth().currenUser;
        // M.toast({ html: "You are logged out!!!", classes: "orange" });
    }
});

async function loginWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    const instance = M.Modal.getInstance(modals[0]);
    try {
        const result = await auth.signInWithPopup(provider);
        const credential = result.credential;
        const user = result.user;
        console.log(result);
        instance.close();
        M.toast({
            html: `Successfully signed in with google.`,
            classes: "green",
            displayLength: 2000,
        });
    } catch (err) {
        M.toast({ html: err.message, classes: "red" });
    }
}
