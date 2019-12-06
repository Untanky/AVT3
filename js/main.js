import PreciseVideoPlayer from './preciseVideoPlayer.js';
import PlaybackController from './playbackController.js';
import Analyser from './analyser.js';
import Histogramm from './histogramm.js';

// URLs for PNG-sequences, adjust to use custom videos
const baseURL = "/media/FerrisWheel/";
const highQ = "Q30/thumb";
const lowQ = "Q60/thumb";

// Canvas to render high quality video & video player object
const canvasHQ = document.getElementById("video-high-quality");
let playerHQ = new PreciseVideoPlayer(canvasHQ, baseURL + highQ);
const HQctx = canvasHQ.getContext('2d');

const canvasHistogrammHQ = document.getElementById("histogramm-high-quality")
const histogrammHQ = new Histogramm(canvasHistogrammHQ);

// Canvas to render low quality video & video player object
const canvasLQ = document.getElementById("video-low-quality");
let playerLQ = new PreciseVideoPlayer(canvasLQ, baseURL + lowQ);
const LQctx = canvasLQ.getContext('2d');

const canvasHistogrammLQ = document.getElementById("histogramm-low-quality");
const histogrammLQ = new Histogramm(canvasHistogrammLQ);

// playback controller, keeps frames in sync between low and high quality player
let playbackController = new PlaybackController(24);
playbackController.addPlayer(playerLQ);
playbackController.addPlayer(playerHQ);

const maxDisplay = document.getElementById('max-display');
const sadDisplay = document.getElementById('sad-display');
const madDisplay = document.getElementById('mad-display');
const mseDisplay = document.getElementById('mse-display');
const psnrDisplay = document.getElementById('psnr-display');

const avgMaxDisplay = document.getElementById('avg-max-display');
const avgSadDisplay = document.getElementById('avg-sad-display');
const avgMadDisplay = document.getElementById('avg-mad-display');
const avgMseDisplay = document.getElementById('avg-mse-display');
const avgPsnrDisplay = document.getElementById('avg-psnr-display');

//////////////////////////////////////////////////////////////
//               Prepare Button Listener
//////////////////////////////////////////////////////////////

let btnNextFrame = document.getElementById("btn-next-frame");
btnNextFrame.onclick = () => {
  playerHQ.nextFrame();
  playerLQ.nextFrame();
  render();
}

let btnPlayForward = document.getElementById("btn-play-forward");
btnPlayForward.onclick = () => {
  if (!playbackController.isPlaying || (playbackController.isPlaying && !playbackController.forward)) {
    playbackController.setDirection(true);
    playbackController.setPlay(true);
    btnPlayForward.classList.add("active");
    btnPlayBackward.classList.remove("active");
  } else {
    playbackController.setPlay(false);
    btnPlayForward.classList.remove("active");
  }
}

let btnPlayBackward = document.getElementById("btn-play-backward");
btnPlayBackward.onclick = () => {
  if (!playbackController.isPlaying || (playbackController.isPlaying && playbackController.forward)) {
    playbackController.setDirection(false);
    playbackController.setPlay(true);
    btnPlayBackward.classList.add("active");
    btnPlayForward.classList.remove("active");
  } else {
    playbackController.setPlay(false);
    btnPlayBackward.classList.remove("active");
  }
}

let btnPrevFrame = document.getElementById("btn-prev-frame");
btnPrevFrame.onclick = () => {
  playerHQ.prevFrame();
  playerLQ.prevFrame();
}

let avgMAX = 0;
let avgSAD = 0;
let avgMAD = 0;
let avgMSE = 0;
let avgPSNR = 0;

let iteration = 0;

// Start Render loop
render();

// Render loop, updates frames during playback
function render() {
  playbackController.render();

  if(playerHQ.newFrameAvailable()) {
    errorCalc();
  }

  requestAnimationFrame(render);
}

function errorCalc() {

  var img1 = HQctx.getImageData(0, 0, canvasHQ.width, canvasHQ.height).data; 
  var img2 = LQctx.getImageData(0, 0, canvasHQ.width, canvasHQ.height).data; 

  let result = Analyser.analyseError(img1, img2, canvasHQ.width, canvasHQ.height, histogrammHQ, histogrammLQ);

  maxDisplay.innerHTML = result.max;
  sadDisplay.innerHTML = result.sad;
  madDisplay.innerHTML = result.mad;
  mseDisplay.innerHTML = result.mse;
  psnrDisplay.innerHTML = result.psnr;

  iteration += 1;

  avgMAX = (avgMAX + result.max) / iteration;
  avgSAD = (avgSAD + result.sad) / iteration;
  avgMAD = (avgMAD + result.mad) / iteration;
  avgMSE = (avgMSE + result.mse) / iteration;
  avgPSNR = (avgPSNR + result.psnr) / iteration;

  avgMaxDisplay.innerHTML = avgMAX;
  avgSadDisplay.innerHTML = avgSAD;
  avgMadDisplay.innerHTML = avgMAD;
  avgMseDisplay.innerHTML = avgMSE;
  avgPsnrDisplay.innerHTML = avgPSNR;

  histogrammHQ.update();
  histogrammLQ.update();
}