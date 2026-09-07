const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];

window.addEventListener("load", () => {
  setTimeout(() => $("#loader").classList.add("hidden"), 650);
});

// Smooth section buttons
$$("[data-scroll]").forEach(btn => btn.addEventListener("click", () => {
  const target = $(btn.dataset.scroll);
  if (target) target.scrollIntoView({behavior:"smooth"});
}));

// Typing letter
const letter = `Happy Birthday, my love.

There are so many things I could say today, but somehow “I love you” still feels like the most important one.

Thank you for being part of my life—for the laughter, the comfort, the little moments, and for simply being you. You make ordinary days feel special, and you make the future feel like something I want to run toward.

I hope this new year of your life brings you every beautiful thing your heart deserves. And whenever life gets difficult, I hope you remember that you never have to face it alone.

Today, tomorrow, and in every chapter still waiting for us, I want to keep choosing you.

Happy Birthday, Jyoti. ❤️`;
let i=0;
const typingEl=$("#typingText");
function typeLetter(){
  if(i < letter.length){ typingEl.textContent += letter[i++]; setTimeout(typeLetter, 24); }
}
const observer = new IntersectionObserver(entries=>{
  entries.forEach(e=>{if(e.isIntersecting){typeLetter();observer.disconnect();}});
},{threshold:.25});
observer.observe($("#letter"));
// Countdown: September 9 at 12:00 AM Nepal Time
function nextBirthday() {
  const now = new Date();

  let year = now.getUTCFullYear();

  // Nepal Time = UTC + 5 hours 45 minutes
  // September 9, 00:00 Nepal Time = September 8, 18:15 UTC
  let target = new Date(Date.UTC(year, 8, 8, 18, 15, 0));

  // If this year's birthday has already passed in Nepal,
  // countdown to next year's September 9.
  if (now >= target) {
    target = new Date(Date.UTC(year + 1, 8, 8, 18, 15, 0));
  }

  return target;
}

let target = nextBirthday();

function updateCountdown() {
  const now = new Date();

  // When countdown reaches zero, automatically prepare for next year
  if (now >= target) {
    target = nextBirthday();
  }

  const diff = target - now;

  const d = Math.floor(diff / 86400000);
  const h = Math.floor(diff / 3600000) % 24;
  const m = Math.floor(diff / 60000) % 60;
  const s = Math.floor(diff / 1000) % 60;

  $("#days").textContent = String(d).padStart(2, "0");
  $("#hours").textContent = String(h).padStart(2, "0");
  $("#minutes").textContent = String(m).padStart(2, "0");
  $("#seconds").textContent = String(s).padStart(2, "0");
}

updateCountdown();
setInterval(updateCountdown, 1000);
/*
// Countdown: next September 9
function nextBirthday(){
  const now = new Date();
  let year = now.getFullYear();
  let target = new Date(year,8,9,0,0,0);
  if(now >= target) target = new Date(year+1,8,9,0,0,0);
  return target;
}
let target = nextBirthday();
function updateCountdown(){
  const now = new Date();
  if(now >= target) target = nextBirthday();
  const diff = target-now;
  const d=Math.floor(diff/86400000);
  const h=Math.floor(diff/3600000)%24;
  const m=Math.floor(diff/60000)%60;
  const s=Math.floor(diff/1000)%60;
  $("#days").textContent=String(d).padStart(2,"0");
  $("#hours").textContent=String(h).padStart(2,"0");
  $("#minutes").textContent=String(m).padStart(2,"0");
  $("#seconds").textContent=String(s).padStart(2,"0");
}
updateCountdown();setInterval(updateCountdown,1000);
*/
// Gallery / fullscreen
const photos=$$(".photo-card");
let current=0;
const lightbox=$("#lightbox"), lbImg=$("#lightboxImg"), counter=$("#galleryCounter");
function showPhoto(n){
  current=(n+photos.length)%photos.length;
  lbImg.src=photos[current].dataset.img;
  counter.textContent=`${current+1} / ${photos.length}`;
}
photos.forEach((p,n)=>p.addEventListener("click",()=>{showPhoto(n);lightbox.classList.add("open");lightbox.setAttribute("aria-hidden","false");}));
$("#closeLightbox").onclick=()=>{lightbox.classList.remove("open");lightbox.setAttribute("aria-hidden","true");};
$("#prevPhoto").onclick=()=>showPhoto(current-1);
$("#nextPhoto").onclick=()=>showPhoto(current+1);
lightbox.addEventListener("click",e=>{if(e.target===lightbox) $("#closeLightbox").click();});
document.addEventListener("keydown",e=>{
  if(!lightbox.classList.contains("open")) return;
  if(e.key==="Escape") $("#closeLightbox").click();
  if(e.key==="ArrowLeft") showPhoto(current-1);
  if(e.key==="ArrowRight") showPhoto(current+1);
});

// Hearts
function makeHeart(x=Math.random()*100){
  const h=document.createElement("span");
  h.className="heart-float";h.textContent=Math.random()>.5?"♥":"♡";
  h.style.left=x+"%";h.style.fontSize=(12+Math.random()*22)+"px";
  h.style.animationDuration=(2.5+Math.random()*2)+"s";
  $("#heartsLayer").appendChild(h);
  setTimeout(()=>h.remove(),5000);
}
$("#heartBtn").onclick=()=>{
  for(let n=0;n<24;n++) setTimeout(()=>makeHeart(25+Math.random()*50),n*45);
  $("#toast").classList.add("show");setTimeout(()=>$("#toast").classList.remove("show"),1800);
};
setInterval(()=>makeHeart(),1800);

// Final surprise
$("#lastSurprise").onclick=()=>{
  for(let n=0;n<55;n++) setTimeout(()=>makeHeart(),n*35);
  setTimeout(()=>$("#finalScreen").scrollIntoView({behavior:"smooth"}),500);
};

// Optional background music: put your own music.mp3 beside index.html.
// Browser autoplay restrictions mean it starts only after the music button is clicked.
let audio=null, musicPlaying=false;
$("#musicBtn").onclick=async()=>{
  if(!audio) audio=new Audio("music.mp3");
  audio.loop=true;
  try{
    if(musicPlaying){audio.pause();musicPlaying=false;$("#musicBtn").classList.remove("playing");$("#musicBtn").innerHTML="♫ <span>Music</span>";}
    else{await audio.play();musicPlaying=true;$("#musicBtn").classList.add("playing");$("#musicBtn").innerHTML="❚❚ <span>Music</span>";}
  }catch(err){
    $("#toast").textContent="Add your own music.mp3 to play a song 🎵";
    $("#toast").classList.add("show");setTimeout(()=>$("#toast").classList.remove("show"),2200);
  }
};

// Cursor glow on desktop
const glow=document.querySelector(".cursor-glow");
document.addEventListener("pointermove",e=>{
  glow.style.left=e.clientX+"px";glow.style.top=e.clientY+"px";
});
