////////////////////////////////////////////////////////////////////////////////
    // start D:\Documents\VR\photoVR\src\app.js
(function(){"use strict";

// Polyfill the standard, flat, unmoving monitor through the WebVR API to give
// us a single path of code through which to manage full-screen state.
WebVRStandardMonitor();

// The distance from the starting point at which the photospheres will be placed.
var POSITIONING_RADIUS = 10;

// Setup our VR environment.
var app = new Primrose.BrowserEnvironment({
  // What to show in the background.
  skyTexture: "images/bg.jpg",
  // gaze-based interaction is kind of annoying on Oculus Rift
  useGaze: isMobile
});

// The hook on which we teleport the user back to center.
var home = brick(0xc0c0c0, 0.1, 0.1, 0.1);
home.name = "home";

// Photosphere image names, sans path and file extension, which we will add later.
var images = ["test1", "test2", "test3", "test4", "test5", "test6", "test7"];

// The `ready` event fires whenever the VR environment has loaded all of the assets
// we provided to it.
app.addEventListener("ready", function () {

  // show the full-screen icons.
  var container = document.getElementById("fsb");
  app.displays.forEach(function (display, i) {
    var btn = document.createElement("button");
    btn.type = "button";
    btn.innerHTML = Primrose.Input.VR.isStereoDisplay(display) ? "&#x1f453;" : "&boxplus;";
    btn.title = display.displayName;
    btn.addEventListener("click", app.goFullScreen.bind(app, i));
    container.appendChild(btn);
  });

  // Put the home teleporter into the scene and make it clickable.
  app.appendChild(home);

  // Add the photospheres.
  Promise.all(images.map(function (room, i) {
    var imgs = [room],


    // Look for the word `left` in the image file name to determine if the file
    // is a stereo image file.
    pattern = /(\b|_)left\b/,
        match = room.match(pattern);

    if (match) {
      // Assume the complement to the left image is named exactly the same, with
      // the word "right" in place of "left".
      imgs.push(room.replace(pattern, "$1right"));
    }

    // Create the object that will hold the image.
    return new Primrose.Controls.Image({
      radius: 2,
      unshaded: true
    })
    // and load the images for that object.
    .loadImages(imgs.map(function (img) {
      return "images/" + img + ".jpg";
    }));
  })).then(function (surfaces) {
    return surfaces.forEach(function (img, i) {
      // Place the photospheres in the scene.
      app.appendChild(img);

      // Position them equidistantly along a circle.
      var a = i * (2 * Math.PI / images.length);
      img.position.set(POSITIONING_RADIUS * Math.cos(a), app.options.avatarHeight, POSITIONING_RADIUS * Math.sin(a));
    });
  });
});

app.addEventListener("update", function (dt) {
  // Move the interaction UI along with the user.
  var p = app.input.head.position;
  home.position.set(p.x, 0, p.z);
});

// Teleporting!
app.addEventListener("gazecomplete", select);
app.addEventListener("pointerend", select);
function select(evt) {
  // Make sure the user actually clicked on a thing and didn't just click into
  // empty space.
  var obj = evt.hit && evt.hit.object;
  if (obj) {
    if (obj === home) {
      // Back to the origin.
      app.input.moveStage({ x: 0, y: 0, z: 0 });
    } else {
      // Or to the center of a photosphere.
      app.input.moveStage(obj.position);
    }
  }
}
    if(typeof window !== "undefined") window.app = app;
})();
    // end D:\Documents\VR\photoVR\src\app.js
    ////////////////////////////////////////////////////////////////////////////////
console.info("photovr v1.0.0. see https://github.com/NotionTheory/photoVR#readme for more information.");