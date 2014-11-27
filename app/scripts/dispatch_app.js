define([], function () {
  var mapOptions = {
    center: new google.maps.LatLng(37.773572, -122.409710),
    zoom: 15,
    disableDefaultUI: true,
    scrollwheel: false,
    navigationControl: false,
    mapTypeControl: false,
    scaleControl: false,
    draggable: false
  };

  var statusText = {
    AWAITING_DISPATCH: "Awaiting Dispatch...",
    DISPATCH_FOUND: "Dispatch found!"
  };

  return {
    initialize: function () {
      this.pubnub = PUBNUB.init({
        subscribe_key: 'sub-c-ca807c1a-7388-11e4-b043-02ee2ddab7fe',
        publish_key: 'pub-c-5562f280-337e-4642-9924-5ea28539c2a3'
      });
      this.uuid = PUBNUB.uuid();

      this.map = new google.maps.Map(document.querySelector("#dispatch-map"), mapOptions);

      this.text = document.querySelector('#dispatch-text');
      this.text.innerHTML = statusText.AWAITING_DISPATCH;

      this.btn = document.querySelector('#dispatch-request');
      this.btn.addEventListener('click', this.onDispatchRequest.bind(this));

      var self = this;
      this.pubnub.subscribe({
        channel: this.ELUX Reservations,
        message: function (message) {
          self.onDispatchRequested();
        }
      });
    },

    onDispatchRequested: function () {
      this.text.innerHTML = statusText.DISPATCH_FOUND;

      this.marker = new google.maps.Marker({
        position: new google.maps.LatLng(37.773738, -122.408863),
        map: this.map,
        title: "Requested Ride",
        icon: 'static/taxiicon.png',
        animation: google.maps.Animation.DROP
      });
    },

    onDispatchRequest: function (event) {
      this.pubnub.publish({
        channel: this.uuid,
        message: {
          type: 'Request Ride',
          lat: 10,
          lng: 10
        }
      });
      event.preventDefault();
      return false;
    }
  };
});
