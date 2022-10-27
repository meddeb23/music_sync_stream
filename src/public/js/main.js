const BASE_URL = "http://192.168.1.14:5000/api/music";

const _id = Math.floor(Math.random() * 10000);
document.getElementById("id").innerText = _id;

const music_player = document.querySelector("#music_player");
const toggle_play_btn = document.querySelector("#toggle_play");
const progress_bar = document.querySelector(".progressBar");
const progress_bar_feedback = document.querySelector(".bar");

progress_bar.addEventListener("click", (e) => getPosition(e));

const update_progress_bar = (currentTime) => {
  console.log(`current Time : ${(currentTime / 60).toFixed(2)}`);
  music_player.currentTime = currentTime;
  progress_bar_feedback.style.width =
    (music_player.currentTime / music_player.duration) * 300 + "px";
};

toggle_play_btn.addEventListener("click", toggle_play);

music_player.addEventListener(
  "timeupdate",
  () =>
    (progress_bar_feedback.style.width =
      (music_player.currentTime / music_player.duration) * 300 + "px")
);
music_player.addEventListener("canplay", () => {
  // music_player.play()
  console.log("can play...");
  socket.emit("can_play");
});

const socket = io("http://192.168.1.14:5000", {
  query: { room: "bibo", _id },
});

const render_music_list = () => {
  fetch(BASE_URL)
    .then((res) => res.json())
    .then((res) => {
      const music_list = document.getElementById("music_list");
      res.music.forEach((i) => {
        const li = document.createElement("li");
        li.innerText = i.split(".mp3")[0];
        li.addEventListener("click", async () => {
          socket.emit("change_song", i);
          await loadSong(i);
          // music_player.setAttribute("src", BASE_URL + "/" + i);
        });
        music_list.appendChild(li);
      });
    })
    .catch((err) => console.log(err));
};

const get_song = async (song_name) => {
  let res = await fetch(BASE_URL + "/song/" + song_name);
  res = await res.json();
};

const loadSong = async (song) => {
  let data = await fetch(BASE_URL + "/" + song);
  data = await data.blob();
  music_player.src = URL.createObjectURL(data);
};

event_listeners();
render_music_list();
