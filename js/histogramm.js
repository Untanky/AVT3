class Histogramm {
    constructor(canvas, numberOfChannels = 4, numberOfBuckets = 256) {
        this.canvasCtx = canvas.getContext('2d');
        this.width = canvas.width;
        this.height = canvas.height;
        this.buckets = [];
        this.numberOfChannels = numberOfChannels;
        this.numberOfBuckets = numberOfBuckets;

        this.clearBuckets();
    }

    clearBuckets() {
        for (let i = 0; i < this.numberOfChannels; i++) {
            this.buckets[i] = [];
            for (let j = 0; j < this.numberOfBuckets; j++) {
                this.buckets[i][j] = 0.0;
            }
        }
    }

    push(channel, value) {
        this.buckets[channel][value] += 1;
    }

    update() {

        this.canvasCtx.fillStyle = 'rgb(255, 255, 255)';
        this.canvasCtx.fillRect(0, 0, this.width, this.height);
        var barWidth = (this.width / this.numberOfBuckets);
        var barHeight;

        var x = 0;

        for (var i = 0; i < this.numberOfBuckets; i++) {
            let max = Math.max(...(this.buckets[3]));
            barHeight = this.buckets[3][i] / max * this.height;

            this.canvasCtx.fillStyle = 'rgba(127,127,127)';
            this.canvasCtx.fillRect(x, this.height - barHeight, barWidth, barHeight);

            x += barWidth + 1;
        }

        this.clearBuckets();
    }
}

export default Histogramm