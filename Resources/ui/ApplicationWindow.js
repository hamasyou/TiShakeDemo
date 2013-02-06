
function ApplicationWindow() {

    var shakeCount = 0;
    var self = Ti.UI.createWindow({
        backgroundColor:'white'
    });
    self.add(Ti.UI.createLabel({text: 'shake!'}));


    var shakeCountLabel = Ti.UI.createLabel({
        color: 'black',
        text: '0回',
        top: 10
    });
    self.add(shakeCountLabel);


    self.addEventListener('open', function() {
        var Shaker = require('shaker');
        var shaker = new Shaker(function() {
            shakeCount++;
            shakeCountLabel.text = '' + shakeCount + '回'
        });
        shaker.listen((Ti.Platform.osname === 'android' ? self.activity : null));
    });

    return self;
};

module.exports = ApplicationWindow;
