const userDetails = document.querySelector(".userDetails");
const editProfile = document.querySelector("#editProfile");

// let stopSnapshot;

async function createUserCollection(user) {
    firebase.firestore().collection("users").doc(user.uid).set({
        uid: user.uid,
        name: user.displayName,
        email: user.email,
        // password: user.password,
        phone: "",
        speciality: "",
        portfolioURL: "",
        experience: "",
    });
}

async function getUserInfoRealtime(userID) {
    if (userID) {
        const userDocRef = await db.collection("users").doc(userID);

        userDocRef.onSnapshot((doc) => {
            if (doc.exists) {
                const userInfo = doc.data();
                if (userInfo) {
                    userDetails.innerHTML = `
                    <ul class="collection">
                        <li class="collection-item">
                            <h4>${userInfo.name || ""}</h4>
                        </li>
                        <li class="collection-item">${userInfo.email || ""}</li>
                        <li class="collection-item">Phone - ${
                            userInfo.phone || ""
                        }</li>
                        <li class="collection-item">Specialization in - ${
                            userInfo.speciality || ""
                        }</li>
                        <li class="collection-item">Experience - ${
                            userInfo.experience || ""
                        }</li>
                        <li class="collection-item">Portfolio Link - <a href='${
                            userInfo.portfolioURL || ""
                        }' target="_blank">${
                        userInfo.portfolioURL || ""
                    }</a></li>
                    </ul>
                     <button class="modal-trigger btn waves-effect #fb8c00 orange darken-1" type="submit" href="#modal3">Edit Profile</button>
                     `;

                    editProfile["name"].value = userInfo.name || "";
                    editProfile["email"].value = userInfo.email || "";
                    editProfile["phone"].value = userInfo.phone || "";
                    editProfile["portfolio"].value =
                        userInfo.portfolioURL || "";
                    editProfile["speciality"].value = userInfo.speciality || "";
                    editProfile["experience"].value = userInfo.experience || "";

                    if (auth.currentUser.photoURL) {
                        document.querySelector("#profile-pic").src =
                            auth.currentUser.photoURL;
                    }
                }
            }
            // location.reload();
        });
    } else {
        userDetails.innerHTML = "<h3>Please Signin...!!!</h3>";
    }
}

async function updateUserProfile(e) {
    e.preventDefault();
    const userDocRef = await db.collection("users").doc(auth.currentUser.uid);

    userDocRef.update({
        name: editProfile["name"].value,
        email: editProfile["email"].value,
        phone: editProfile["phone"].value,
        portfolioURL: editProfile["portfolio"].value,
        speciality: editProfile["speciality"].value,
        experience: editProfile["experience"].value,
    });

    const instance = M.Modal.getInstance(modals[2]);
    instance.close();
}

function uploadImage(e) {
    console.log(e.target.files[0]);

    const uid = auth.currentUser.uid;

    const fileRef = storageRef.child(`/users/${uid}/${e.target.files[0].name}`);
    const uploadTask = fileRef.put(e.target.files[0]);

    uploadTask.on(
        "state_changed",
        (snapshot) => {
            var progress =
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is " + progress + "% done");
            // switch (snapshot.state) {
            //     case firebase.storage.TaskState.PAUSED: // or 'paused'
            //         console.log("Upload is paused");
            //         break;
            //     case firebase.storage.TaskState.RUNNING: // or 'running'
            //         console.log("Upload is running");
            //         break;
            // }
        },
        (error) => {
            M.toast({
                html: `Your file was failed to upload`,
                classes: "red",
                displayLength: 2000,
            });
        },
        async () => {
            try {
                const downloadURL =
                    await uploadTask.snapshot.ref.getDownloadURL();

                console.log("File available at", downloadURL);

                M.toast({
                    html: `Your file has been successfully uploaded...!!!`,
                    classes: "green",
                    displayLength: 2000,
                });

                document.querySelector("#profile-pic").src = downloadURL;

                await auth.currentUser.updateProfile({
                    photoURL: downloadURL,
                });
            } catch (err) {
                M.toast({
                    html: err,
                    classes: "red",
                    displayLength: 2000,
                });
            }
        }
    );
}

async function allUserDetails() {
    document.getElementById("table").style.display = "table";
    const tableBody = document.getElementById("table-body");
    tableBody.innerHTML = "";

    const userRef = await db.collection("users").get();

    let temp = document.createElement("template");

    // return temp.content.firstChild;

    userRef.docs.forEach((doc) => {
        const info = doc.data();
        const userData = `<tr>
                <td>${info.name}</td>
                <td>${info.email}</td>
                <td>${info.phone}</td>
                <td>${info.speciality}</td>
                <td>${info.experience}</td>
                <td><a href="${info.portfolioURL}">view</a></td>
            </tr>`;

        temp.innerHTML = userData;
        const tableData = temp.content.firstChild;

        tableBody.append(tableData);
    });
}
