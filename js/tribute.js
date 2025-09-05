import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore, addDoc, collection, onSnapshot, query, orderBy } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { firebaseConfig } from "./firebaseConfig.js";

// Init Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const form = document.getElementById("tributeForm");
const list = document.getElementById("tributesList");

// Add Tribute
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("name").value;
  const message = document.getElementById("message").value;

  await addDoc(collection(db, "tributes"), {
    name,
    message,
    createdAt: new Date()
  });

  form.reset();
});

// Live Update Tributes
const q = query(collection(db, "tributes"), orderBy("createdAt", "desc"));
onSnapshot(q, (snapshot) => {
  list.innerHTML = "";
  snapshot.forEach((doc) => {
    const data = doc.data();
    list.innerHTML += `
      <div class="bg-white p-4 rounded-lg shadow">
        <p class="text-lg">"${data.message}"</p>
        <p class="text-sm text-gray-500">- ${data.name}</p>
      </div>
    `;
  });
});
