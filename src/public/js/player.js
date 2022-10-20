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
