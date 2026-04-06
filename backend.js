// ================= FIREBASE CONFIG =================
const firebaseConfig = {
  apiKey: "YOUR_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();

let currentUserId = null;

// ================= LOGIN =================
auth.signInAnonymously().then(res => {
  currentUserId = res.user.uid;
  console.log("User ID:", currentUserId);

  db.collection("users").doc(currentUserId).set({
    id: currentUserId,
    friends: [],
    status: "online"
  }, { merge: true });
});

// ================= ADD FRIEND =================
function addFriend(friendId) {
  if (!friendId) return;

  db.collection("users").doc(currentUserId).update({
    friends: firebase.firestore.FieldValue.arrayUnion(friendId)
  });

  console.log("Friend added:", friendId);
}

// ================= GET FRIENDS =================
function loadFriends() {
  db.collection("users").doc(currentUserId).onSnapshot(doc => {
    const data = doc.data();
    renderFriends(data.friends || []);
  });
}

// ================= RENDER FRIEND LIST =================
function renderFriends(friends) {
  const panel = document.getElementById("friendsPanel");
  panel.innerHTML = "";

  friends.forEach(id => {
    db.collection("users").doc(id).get().then(doc => {
      const d = doc.data();

      const div = document.createElement("div");
      div.innerHTML = `
        <div style="display:flex;justify-content:space-between">
          <span>${id}</span>
          <span>${d?.status || "offline"}</span>
        </div>
      `;

      panel.appendChild(div);
    });
  });
}

// ================= STATUS =================
function setStatus(status) {
  db.collection("users").doc(currentUserId).update({
    status: status
  });
}

// ================= ROOM SYSTEM =================
let currentRoom = null;

function createRoom() {
  const roomRef = db.collection("rooms").doc();

  roomRef.set({
    host: currentUserId,
    players: [currentUserId],
    status: "waiting"
  });

  currentRoom = roomRef.id;
  console.log("Room created:", currentRoom);
}

function joinRoom(roomId) {
  db.collection("rooms").doc(roomId).update({
    players: firebase.firestore.FieldValue.arrayUnion(currentUserId)
  });

  currentRoom = roomId;
}

// ================= LISTEN ROOM =================
function listenRoom(roomId) {
  db.collection("rooms").doc(roomId).onSnapshot(doc => {
    const data = doc.data();
    console.log("Room update:", data);

    // update UI
  });
}

// ================= LEADERBOARD =================
function updateScore(score) {
  db.collection("leaderboard").doc(currentUserId).set({
    score: score
  });
}

function loadLeaderboard() {
  db.collection("leaderboard")
    .orderBy("score", "desc")
    .limit(10)
    .get()
    .then(snapshot => {
      snapshot.forEach(doc => {
        console.log(doc.data());
      });
    });
}