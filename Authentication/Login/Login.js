import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyASz0n7VecKKKZaDT38szp5QE-dHVTKd0s",
  authDomain: "expensetracker-f9b7d.firebaseapp.com",
  projectId: "expensetracker-f9b7d",
  storageBucket: "expensetracker-f9b7d.firebasestorage.app",
  messagingSenderId: "852954230472",
  appId: "1:852954230472:web:0d5750f0433a878f723ffd"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const LoginPage = document.getElementById("LoginPage");
const logo = document.getElementById("logo");

logo.addEventListener("click", function () {
  window.location.href = "./../NavBar/NavBar.html";
});

LoginPage.addEventListener("submit", async (x) => {
  x.preventDefault();

  let Email = document.getElementById("Email").value.trim();
  let Password = document.getElementById("Password").value.trim();

  try {
    await signInWithEmailAndPassword(auth, Email, Password);

    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      }
    });

    Toast.fire({
      icon: "success",
      title: "Signed in successfully"
    });

    setTimeout(() => {
      window.location.href = "./../../DashBoard/DashBoard/DashBoard.html";
    }, 3000);

  } catch (err) {
    Swal.fire({
      title: "Login Failed",
      text: "Email or Password Incorrect",
      icon: "error",
      confirmButtonText: "Okay"
    });
  }

});
