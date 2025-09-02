const video = document.getElementById('verticalVideo');
const playBtn = document.getElementById('playPause');
const soundBtn = document.getElementById('soundToggle');

function setPlayingState(isPlaying){
  if (!playBtn) return;
  playBtn.setAttribute('aria-pressed', String(isPlaying));
  playBtn.setAttribute('aria-label', isPlaying ? 'Pausar vídeo' : 'Reproducir vídeo');
}
function setMutedState(isMuted){
  if (!soundBtn) return;
  soundBtn.setAttribute('aria-pressed', String(isMuted));
  soundBtn.setAttribute('aria-label', isMuted ? 'Activar sonido' : 'Silenciar');
}
function togglePlay(){
  if (!video) return;
  if (video.paused){
    const p = video.play();
    if (p) p.catch(()=>{});
  } else {
    video.pause();
  }
  setPlayingState(!video.paused);
}
function toggleMute(){
  if (!video) return;
  video.muted = !video.muted;
  setMutedState(video.muted);
}
if (playBtn) playBtn.addEventListener('click', togglePlay);
if (soundBtn) soundBtn.addEventListener('click', toggleMute);
if (video){
  video.addEventListener('play', ()=>setPlayingState(true));
  video.addEventListener('pause', ()=>setPlayingState(false));
  video.addEventListener('volumechange', ()=>setMutedState(video.muted));
  video.addEventListener('click', togglePlay);
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches){
    video.pause();
    setPlayingState(false);
  }
  setPlayingState(!video.paused);
  setMutedState(video.muted);
  if ('IntersectionObserver' in window){
    const io = new IntersectionObserver(entries=>{
      entries.forEach(entry=>{
        if (entry.isIntersecting){
          if (video.paused && video.muted) {
            const p = video.play();
            if (p) p.catch(()=>{});
          }
        } else {
          if (!video.paused) video.pause();
        }
      });
    },{threshold:0.5});
    io.observe(video);
  }
}
