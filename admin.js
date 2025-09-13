firebase.auth().onAuthStateChanged(async (user) => {
  if (!user) {
    // Not logged in → redirect
    window.location.href = "login.html";
  } else {
    // Check role
    const userDoc = await db.collection("users").doc(user.uid).get();
    if (!userDoc.exists || userDoc.data().role !== "admin") {
      alert("Access denied! Not an admin.");
      window.location.href = "index.html";
    } else {
      loadProducts(); // Safe to load
    }
  }
});
