const video = document.getElementById('verticalVideo');
const playBtn = document.getElementById('playPause');

(function(){
  var isIOS = /iP(ad|hone|od)/.test(navigator.platform) || (navigator.userAgent.indexOf('Mac') !== -1 && 'ontouchend' in document);
  if (isIOS && video) video.setAttribute('playsinline', '');
})();

function updatePlayButton(paused){
  if (!playBtn) return;
  playBtn.setAttribute('aria-pressed', String(!paused));
  playBtn.setAttribute('aria-label', paused ? 'Reproducir vídeo' : 'Pausar vídeo');
}

function togglePlay(){
  if (!video) return;
  if (video.paused){
    const playPromise = video.play();
    if (playPromise !== undefined) playPromise.catch(()=>{});
  } else {
    video.pause();
  }
  updatePlayButton(video.paused);
}

if (playBtn) playBtn.addEventListener('click', togglePlay);
if (video) video.addEventListener('click', togglePlay);

if (video){
  video.addEventListener('play', ()=>updatePlayButton(false));
  video.addEventListener('pause', ()=>updatePlayButton(true));
  if ('IntersectionObserver' in window){
    const io = new IntersectionObserver(entries=>{
      entries.forEach(entry=>{
        if (entry.isIntersecting){
          if (video.paused){
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
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches){
    video.pause();
    updatePlayButton(true);
  }
  updatePlayButton(video.paused);
}