const toggle_play = () => {
  if (music_player.paused) {
    console.log("play");
    socket.emit("play");
    music_player.play();
    toggle_play_btn.innerText = "pause";
  } else {
    console.log("pause");
    socket.emit("pause");
    music_player.pause();
    toggle_play_btn.innerText = "play";
  }
};

const getPosition = (e) => {
  const bar = progress_bar.getBoundingClientRect();
  const currentTime =
    ((e.clientX - bar.left) * music_player.duration) / bar.width;
  update_progress_bar(currentTime);
  socket.emit("seeking", currentTime);
};

const event_listeners = () => {
  socket.on("change_song", (song) => {
    // music_player.setAttribute("src", BASE_URL + "/" + song);
    loadSong(song);
  });
  socket.on("seeking", (time) => update_progress_bar(time));
  socket.on("pause", () => {
    console.log("onPause");
    music_player.pause();
  });
  socket.on("play", ({ play }) => {
    console.log("onPlay : ", play);
    if (play) music_player.play();
  });
};
