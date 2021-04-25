
/**
* @param {Phaser.Scene} scene 
*/
export default (scene) => {
    const title = scene.add.image(100, 0, 'title');
    title.setOrigin(0);
    title.setScale(0.3);

    const padding = 100


    var progressBar = scene.add.graphics();
    var progressBox = scene.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(240, 270 + padding, 320, 50);
    
    var width = scene.cameras.main.width;
    var height = scene.cameras.main.height;
    var loadingText = scene.make.text({
        x: width / 2,
        y: height / 2 - 50 + padding,
        text: 'Loading...',
        style: {
            font: '20px monospace',
            fill: '#ffffff'
        }
    });
    loadingText.setOrigin(0.5, 0.5);
    
    var percentText = scene.make.text({
        x: width / 2,
        y: height / 2 - 5 + padding,
        text: '0%',
        style: {
            font: '18px monospace',
            fill: '#ffffff'
        }
    });
    percentText.setOrigin(0.5, 0.5);
    
    var assetText = scene.make.text({
        x: width / 2,
        y: height / 2 + 50 + padding,
        text: '',
        style: {
            font: '18px monospace',
            fill: '#ffffff'
        }
    });

    assetText.setOrigin(0.5, 0.5);
    
    scene.load.on('progress', function (value) {
        percentText.setText(parseInt(value * 100) + '%');
        progressBar.clear();
        progressBar.fillStyle(0xffffff, 1);
        progressBar.fillRect(250, 280, 300 * value, 30);
    });
    
    scene.load.on('fileprogress', function (file) {
        assetText.setText('Loading asset: ' + file.key);
    });

    scene.load.on('complete', function () {
        progressBar.destroy();
        progressBox.destroy();
        loadingText.destroy();
        percentText.destroy();
        assetText.destroy();
        title.destroy();
    });
 
}