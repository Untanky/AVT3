class PlaybackController {
  /**
   * Constructor, creates a PlaybackController object
   * with a given framerate. Needs player-objects to work 
   * properly. Players are added using addPlayer method.
   * 
   * @param {number} framerate - the desired framerate for playback
   */
  constructor(framerate) {
    this.framerate = framerate;
    this.millisPerFrame = 1000 / this.framerate;

    this.isPlaying = false;
    this.forward = true;

    this.player = [];
  }

  /**
   * Adds a player to the array of videoplayers controlled by this PlaybackController
   * 
   * @param {preciseVideoPlayer} newPlayer - object of PreciseVideoPlayer class, 
   * that will be controlled using this PlaybackController
   */
  addPlayer(newPlayer) {
      this.player.push(newPlayer);
  }
  
  /**
   * Should be called from an update-loop.
   * 
   * Checks if a new frame should be rendered based on the time that passed 
   * since the last refresh.
   */
  render() {
    if (!this.isPlaying) {
      return;
    }

    let deltaT = performance.now() - this.timestamp;
    while (deltaT > this.millisPerFrame) {
      this.updatePlayerFrames();
      deltaT -= this.millisPerFrame;
    }
  }

  /**
   * Calls the correct method to render the next frame of all added 
   * PreciseVideoPlayers. Based on the forward-variable this is either
   * nextFrame or prevFrame.
   */
  updatePlayerFrames() {
      let frameMethod = (this.forward) ? "nextFrame" : "prevFrame";
      this.player.forEach(player => {
          player[frameMethod]();
          this.timestamp = performance.now();
      });
  }

  /**
   * Controls wether the PlaybackController is in automated playback mode or paused
   * 
   * @param {bool} play - True for automated playback, false for pause
   */
  setPlay(play) {
    this.isPlaying = play;
    if (this.isPlaying) {
      this.timestamp = performance.now();
    }
  }

  /**
   * The PlaybackController can play a video forward and backward, this methods sets 
   * the current direction.
   * 
   * @param {bool} isForward - true to set the playback direction to forward, false for backward
   */
  setDirection(isForward) {
      this.forward = isForward;
  }
}

export default PlaybackController;
  