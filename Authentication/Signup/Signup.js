import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyASz0n7VecKKKZaDT38szp5QE-dHVTKd0s",
  authDomain: "expensetracker-f9b7d.firebaseapp.com",
  projectId: "expensetracker-f9b7d",
  storageBucket: "expensetracker-f9b7d.firebasestorage.app",
  messagingSenderId: "852954230472",
  appId: "1:852954230472:web:0d5750f0433a878f723ffd"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const SignUp = document.getElementById("SignUp");
const logo = document.getElementById("logo");

logo.addEventListener("click", function () {
    window.location.href = "./../NavBar/NavBar.html";
});

SignUp.addEventListener("submit", async (e) => {
    e.preventDefault();

    let Name = document.getElementById("Name").value.trim();
    let Email = document.getElementById("Email").value.trim();
    let Password = document.getElementById("Password").value.trim();
    let C_Password = document.getElementById("C_Password").value.trim();

    let isValid = true;

    const E_pattern = /^[a-zA-Z0-9]+@[a-zA-Z]+\.[a-zA-Z]{2,}$/;
    const P_pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#!*$]).{8,13}$/;

    if (Name === "") {
        document.getElementById("N_Error").innerText = "Name required";
        isValid = false;
    } else if (Name.length < 3) {
        document.getElementById("N_Error").innerText = "Enter a name with min 3 letters";
        isValid = false;
    } else {
        document.getElementById("N_Error").innerText = "";
    }

    if (Email === "") {
        document.getElementById("E_Error").innerText = "Email required";
        isValid = false;
    } else if (!E_pattern.test(Email)) {
        document.getElementById("E_Error").innerText = "Email is not valid";
        isValid = false;
    } else {
        document.getElementById("E_Error").innerText = "";
    }

    if (Password === "") {
        document.getElementById("P_Error").innerText = "Password required";
        isValid = false;
    } else if (Password.length < 8 || Password.length > 13) {
        document.getElementById("P_Error").innerText = "Password must be between 8 to 13 characters";
        isValid = false;
    } else if (!P_pattern.test(Password)) {
        document.getElementById("P_Error").innerText = "Password must include upper case, lower case, number, and special character (@#!*$)";
        isValid = false;
    } else {
        document.getElementById("P_Error").innerText = "";
    }

    if (Password !== C_Password) {
        document.getElementById("CP_Error").innerText = "Passwords do not match";
        isValid = false;
    } else {
        document.getElementById("CP_Error").innerText = "";
    }
    
    if (isValid) {
        try {
            document.getElementById("Name").value = "";
            document.getElementById("Email").value = "";
            document.getElementById("Password").value = "";
            document.getElementById("C_Password").value = "";
    
            await createUserWithEmailAndPassword(auth, Email, Password);

            Swal.fire({
                title: "Registration Successful!",
                text: "You can now log in to your account.",
                icon: "success",
                confirmButtonText: "Go to Login",
                showClass: {
                    popup: "animate__animated animate__fadeInUp animate__faster",
                },
                hideClass: {
                    popup: "animate__animated animate__fadeOutDown animate__faster",
                },
            }).then((result) => {
                if (result.isConfirmed) {
                    window.location.href = "./../Login/Login.html";
                }
            });
        } catch (err) {
            console.log(err);
            Swal.fire({
                title: "Error",
                text: err.message || "Something went wrong. Please try again.",
                icon: "error",
                confirmButtonText: "Okay"
            });
        }
    }
});
