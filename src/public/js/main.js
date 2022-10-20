const BASE_URL = "http://192.168.7.207:5000/api/music";

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

const getPosition = (e) => {
  const bar = progress_bar.getBoundingClientRect();
  const currentTime =
    ((e.clientX - bar.left) * music_player.duration) / bar.width;
  update_progress_bar(currentTime);
  socket.emit("seeking", currentTime);
};

toggle_play_btn.addEventListener("click", toggle_play);

music_player.addEventListener(
  "timeupdate",
  () =>
    (progress_bar_feedback.style.width =
      (music_player.currentTime / music_player.duration) * 300 + "px")
);
music_player.addEventListener("canplay", () => music_player.play());

const socket = io("http://192.168.7.207:5000", { query: { room: "bibo" } });

socket.on("change_song", (song) => {
  music_player.setAttribute("src", BASE_URL + "/" + song);
  // music_player.currentTime = music_player.currentTime + 3;
});
socket.on("seeking", (time) => update_progress_bar(time));
socket.on("pause", (song) => music_player.pause());
socket.on("play", (song) => music_player.play());

const render_music_list = () => {
  fetch(BASE_URL)
    .then((res) => res.json())
    .then((res) => {
      const music_list = document.getElementById("music_list");
      res.music.forEach((i) => {
        const li = document.createElement("li");
        li.innerText = i.split(".mp3")[0];
        li.addEventListener("click", () => {
          socket.emit("change_song", i);
          music_player.setAttribute("src", BASE_URL + "/" + i);
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

render_music_list();
