// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBD1rD4CQmcy5o8nhK1lxc5KJo2DNTmes8",
  authDomain: "petiprojekat-468de.firebaseapp.com",
  projectId: "petiprojekat-468de",
  storageBucket: "petiprojekat-468de.appspot.com",
  messagingSenderId: "342839943075",
  appId: "1:342839943075:web:2c46c2e031c48d1122c416",
  measurementId: "G-EYXT8CD6SL",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const db = getFirestore();
const tabela = collection(db, "Users");

const submitBtn = document.querySelector("#submit");
submitBtn.addEventListener("click", testInput);

const addBtn = document.querySelector("#add");
addBtn.addEventListener("click", addUser);

function testInput() {
  const uName = document.querySelector("#uInput").value;
  const uPass = document.querySelector("#pInput").value;

  getDocs(tabela).then((docs) => {
    var isAuth = false;
    var isAdmin;
    docs.forEach((doc) => {
      if (doc.data().username === uName && doc.data().password === uPass) {
        isAuth = true;
        isAdmin = doc.data().isAdmin;
        if (isAdmin) {
          document.querySelector("#m").innerHTML += "<b>(Admin)</b> ";
        }
      }
    });
    if (isAuth) {
      document.querySelector("#m").innerHTML += "Pozdrav " + uName;
      document.querySelector("form").style.display = "none";

      var checked;
      docs.forEach((doc) => {
        if (doc.data().isAdmin) {
          checked = "checked";
        } else {
          checked = "";
        }
        document.querySelector("#users").innerHTML +=
          "<div class='user' id='" +
          doc.id +
          "'>" +
          doc.data().username +
          "<input type='checkbox' class='X' disabled " +
          checked +
          "/> <input type='button' value='delete' class='dlt'></div>";
      });

      const dBtns = document.querySelectorAll(".dlt");
      dBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
          deleteDoc(doc(db, "Users", btn.parentElement.id));
          btn.parentElement.remove();
        });
      });

      if (isAdmin) {
        dBtns.forEach((btn) => {
          btn.style.display = "block";
        });
        document.querySelector("#addUser").style.visibility = "visible";
      }
    } else {
      alert("Pogresno ime ili lozinka!");
    }
  });
}

function addUser() {
  const uName = document.querySelector("#uInput2").value;
  const uPass = document.querySelector("#pInput2").value;
  const uAdmin = document.querySelector("#ckc").checked;

  if (uName != "") {
    var id;
    addDoc(tabela, {
      username: uName,
      password: uPass,
      isAdmin: uAdmin,
    }).then((doco) => {
      id = doco.id;
    });

    var checked;
    if (uAdmin) {
      checked = "checked";
    } else {
      checked = "";
    }
    document.querySelector("#users").innerHTML +=
      "<div class='user' id='" +
      id +
      "'>" +
      uName +
      "<input type='checkbox' class='X' disabled " +
      checked +
      "/> <input type='button' value='delete' class='dlt' style='display: block;'></div>";

    const btn = document.querySelector("#" + id);
    btn.addEventListener("click", () => {
      deleteDoc(doc(db, "Users", id));
      btn.remove();
    });
  } else {
    alert("Name cannot be blank!");
    document.querySelector("#pInput2").value = "";
  }
}
