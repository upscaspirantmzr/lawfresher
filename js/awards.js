import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore, addDoc, collection, onSnapshot } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { firebaseConfig } from "./firebaseConfig.js";

// Init Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const form = document.getElementById("awardsForm");
const resultsList = document.getElementById("resultsList");

// Check if already voted
if (localStorage.getItem("hasVoted") === "true") {
  form.innerHTML = `<p class="text-red-600 font-bold">✅ You have already voted from this device.</p>`;
}

// Submit Vote
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (localStorage.getItem("hasVoted") === "true") {
    alert("You have already voted from this device.");
    return;
  }

  const inspiring = document.getElementById("inspiring").value.trim();
  const mentor = document.getElementById("mentor").value.trim();
  const knowledgeable = document.getElementById("knowledgeable").value.trim();
  const friendly = document.getElementById("friendly").value.trim();

  if (!inspiring || !mentor || !knowledgeable || !friendly) {
    alert("Please fill all fields before voting.");
    return;
  }

  await addDoc(collection(db, "votes"), {
    inspiring, mentor, knowledgeable, friendly,
    createdAt: new Date().toISOString()
  });

  // Lock device (localStorage)
  localStorage.setItem("hasVoted", "true");

  alert("✅ Your vote has been submitted!");
  form.innerHTML = `<p class="text-green-600 font-bold">Thank you for voting! 🎉</p>`;
});

// Live Results (basic count)
onSnapshot(collection(db, "votes"), (snapshot) => {
  let results = { inspiring: {}, mentor: {}, knowledgeable: {}, friendly: {} };

  snapshot.forEach((doc) => {
    let data = doc.data();
    if (data.inspiring) results.inspiring[data.inspiring] = (results.inspiring[data.inspiring] || 0) + 1;
    if (data.mentor) results.mentor[data.mentor] = (results.mentor[data.mentor] || 0) + 1;
    if (data.knowledgeable) results.knowledgeable[data.knowledgeable] = (results.knowledgeable[data.knowledgeable] || 0) + 1;
    if (data.friendly) results.friendly[data.friendly] = (results.friendly[data.friendly] || 0) + 1;
  });

  resultsList.innerHTML = `
    <div class="bg-white p-4 rounded shadow"><b>Most Inspiring:</b> ${JSON.stringify(results.inspiring)}</div>
    <div class="bg-white p-4 rounded shadow"><b>Best Mentor:</b> ${JSON.stringify(results.mentor)}</div>
    <div class="bg-white p-4 rounded shadow"><b>Most Knowledgeable:</b> ${JSON.stringify(results.knowledgeable)}</div>
    <div class="bg-white p-4 rounded shadow"><b>Friendliest:</b> ${JSON.stringify(results.friendly)}</div>
  `;
});
