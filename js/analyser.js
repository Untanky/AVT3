class Analyser {

    static analyseError(img1, img2, width, height, histogramm1, histogramm2) {

        let max = 0;
        let sad = 0;
        let mad = 0;
        let mse = 0;
        let psnr = 0;

        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                let pixel1Avg = 0;
                let pixel2Avg = 0;
                let pixelIndex = y * width + x;
                for (let channel = 0; channel < 3; channel++) {
                    let channelIndex = pixelIndex + channel;
                    let pixel1 = img1[channelIndex];
                    let pixel2 = img2[channelIndex];

                    pixel1Avg += pixel1;
                    pixel2Avg += pixel2;

                    histogramm1.push(channel, pixel1);
                    histogramm2.push(channel, pixel2);

                    let diff = pixel1 - pixel2;
                    let absDiff = Math.abs(diff);
                    // console.log(diff);

                    max = Math.max(max, absDiff)
                    sad += absDiff
                    mse += diff * diff;
                }

                histogramm1.push(3, Math.floor(pixel1Avg / 3));
                histogramm2.push(3, Math.floor(pixel2Avg / 3));
            }
        }

        mad = sad / (width * height)
        mse = mse / (width * height)
        psnr = 10 * Math.log10((255 * 255) / mse);

        return { max, sad, mad, mse, psnr };
    }
}

export default Analyser;