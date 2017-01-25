// The distance from the starting point at which the photospheres will be placed.
const POSITIONING_RADIUS = 10;

// Setup our VR environment.
const env = new Primrose.BrowserEnvironment({

  backgroundColor: 0x000000,

  // What to show in the background.
  skyTexture: "images/bg.jpg",

  // The font to use for 3D text.
  font: "helvetiker_regular.typeface.json",

  // gaze-based interaction is kind of annoying on Oculus Rift, so I only turn it
  // on for mobile devices.
  useGaze: isMobile,

  // where to stick the buttons that make us go into VR view.
  fullScreenButtonContainer: "#fsb"

  // A progress tracker for any of the models or files that the environment
  // needs to download.
  progress: Preloader.thunk
});

// The hook on which we teleport the user back to center.
const home = box(0.1, 0.1, 0.1)
  .textured("images/home.png", {
    transparent: true,
    unshaded: true
  })
  .named("home")
  .addTo(env.ui)
  .at(0, 0, -1);

window.home = home;


// Just a place on which to hang some 3D text.
const instructions = hub()
  .addTo(env.ui)
  .named("instructions");


// The `ready` event fires whenever the VR environment has loaded all of the assets
// we provided to it.
env.addEventListener("ready", () => {

  const gazeTxt = text3D(0.25, "Gaze at house icon to return to selection");

  var b = gazeTxt.boundingBox;

  gazeText
    .colored(0xffffff)
    .addTo(instructions)
    .at(-b.max.x / 2, env.avatarHeight, -POSITIONING_RADIUS / 2);

  const back = box(b.max.x * 1.1, b.max.y * 1.3, 0.125)
    .colored(0x225273, {
      side: THREE.BackSide,
      unshaded: true
    })
    .addTo(gazeTxt)
    .at(b.max.x / 2, b.max.y / 2, 0);

  // Create the photospheres.
  Promise.all([
      "test1",
      "test2",
      "test3",
      "test4",
      "test5",
      "test6",
      "test7"
    ].map((img, i) => {
      // Position them equidistantly along a circle.
      const a = i * (2 * Math.PI / surfaces.length);

      return new Primrose.Controls.Image("images/" + img + ".jpg", {
        radius: 2,
        unshaded: true,
        progress: prog.thunk
      }).addTo(env.scene)
        .at(POSITIONING_RADIUS * Math.cos(a),
          env.avatarHeight,
          POSITIONING_RADIUS * Math.sin(a))
        .ready;
      }));

  // Hide the progress bar and show the instructions when done.
  .then(Preloader.hide);
});

// Teleporting!
env.addEventListener("gazecomplete", select);
env.addEventListener("pointerend", select);
function select(evt){
  console.log(evt);
  // Make sure the user actually clicked on a thing and didn't just click into
  // empty space.
  const obj = evt.hit && evt.hit.object;
  if(obj){
    if(obj === home){
      env.teleport({x: 0, y: 0, z: 0});

      // hide the instruction once we know the user knows how to navigate.
      instructions.visible = false;
    }
    else{
      env.teleport(obj.position);
    }
  }
}
