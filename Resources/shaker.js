var _ = require('/underscore');

module.exports = (function() {

    var Shaker = function() {
        this.initialize.apply(this, arguments);
    };


    Shaker.prototype = {
        settings: {
            sensibility: (Ti.Platform.osname === 'android') ? 3.0 : 0.68,
            shakeTime: 500
        },

        initialize: function(callback) {
            this.coords = {x: null, y: null, z: null};
            this.lastTime = new Date();
            this.callback = callback;
        },


        listen: function(activity) {
            var check = _.bind(this._check, this);
            if (Ti.Platform.osname === 'android') {
                activity.addEventListener('pause', function() {
                    Ti.Accelerometer.removeEventListener('update', check);
                });
                activity.addEventListener('resume', function() {
                    Ti.Accelerometer.addEventListener('update', check);
                });
            }
            Ti.Accelerometer.addEventListener('update', check);
        },

        _check: function(current) {
            var coords = this.coords,
                settings = this.settings;
            if (coords.x || coords.y || coords.z) {
                var deltaX = Math.abs(coords.x - current.x),
                    deltaY = Math.abs(coords.y - current.y),
                    deltaZ = Math.abs(coords.z - current.z);

                if (((deltaX > settings.sensibility) && (deltaY > settings.sensibility)) ||
                    ((deltaX > settings.sensibility) && (deltaZ > settings.sensibility)) ||
                    ((deltaY > settings.sensibility) && (deltaZ > settings.sensibility))) {

                    // calculate time in milliseconds since last shake registered
                    var currentTime = new Date(),
                        timeDifference = currentTime.getTime() - this.lastTime.getTime();

                    if (timeDifference > settings.shakeTime) {
                        this.callback.call();
                        this.lastTime = new Date();
                    }
                }
            }
            coords.x = current.x;
            coords.y = current.y;
            coords.z = current.z;
        }
    };

    return Shaker;
})();
