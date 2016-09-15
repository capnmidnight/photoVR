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

  // The font to use for 3D text.
  font: "helvetiker_regular.typeface.json",

  // gaze-based interaction is kind of annoying on Oculus Rift, so I only turn it
  // on for mobile devices.
  useGaze: isMobile,

  autoRescaleQuality: true

});

// The hook on which we teleport the user back to center.
var home = colored(box(0.1, 0.1, 0.1), 0xffff00, {
  unshaded: true
});
home.name = "home";

// Just a place on which to hang some 3D text.
var instructions = hub();
instructions.visible = false;

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

  // Add some basic instructions.
  app.scene.add(instructions);
  instructions.rotateX(-Math.PI / 6);
  window.gazeTxt = colored(text3D(0.25, "Gaze at feet to return to selection"), 0xffffff);
  instructions.add(gazeTxt);
  var b = gazeTxt.geometry.boundingBox;
  gazeTxt.position.set(-b.max.x / 2, app.avatarHeight, -POSITIONING_RADIUS / 2);
  var back = colored(box(b.max.x * 1.1, b.max.y * 1.3, 0.125), 0x225273, {
    side: THREE.BackSide,
    unshaded: true
  });
  gazeTxt.add(back);
  back.position.set(b.max.x / 2, b.max.y / 2, 0);

  // Create a progress tracker for downloading the photospheres.
  var progress = new Primrose.Controls.Progress();
  app.appendChild(progress);
  progress.position.set(0, app.avatarHeight, -1);

  // Create the photospheres.
  Promise.all(["test1", "test2", "test3", "test4", "test5", "test6", "test7"].map(function (img) {
    return new Primrose.Controls.Image({
      id: img,
      radius: 2,
      unshaded: true
    }).loadImages(["images/" + img + ".jpg"], progress.onProgress.bind(progress));
  }))

  // Place the photospheres in the scene.
  .then(function (surfaces) {
    return surfaces.forEach(function (img, i) {
      app.appendChild(img);

      // Position them equidistantly along a circle.
      var a = i * (2 * Math.PI / surfaces.length);
      img.position.set(POSITIONING_RADIUS * Math.cos(a), app.avatarHeight, POSITIONING_RADIUS * Math.sin(a));
    });
  })

  // Hide the progress bar and show the instructions when done.
  .then(function () {
    return instructions.visible = !(progress.visible = false);
  });
});

// Move the interaction UI along with the user.
app.addEventListener("update", function (dt) {
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
      app.teleport({ x: 0, y: 0, z: 0 });

      // hide the instruction once we know the user knows how to navigate.
      instructions.visible = false;
    } else {
      app.teleport(obj.position);
    }
  }
}
    if(typeof window !== "undefined") window.app = app;
})();
    // end D:\Documents\VR\photoVR\src\app.js
    ////////////////////////////////////////////////////////////////////////////////
console.info("photovr v1.0.7. see https://github.com/NotionTheory/photoVR#readme for more information.");