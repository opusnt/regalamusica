export function pauseOtherAudioElements(activeAudio) {
  document.querySelectorAll("audio").forEach((audio) => {
    if (audio !== activeAudio) audio.pause();
  });
}
