// The distance from the starting point at which the photospheres will be placed.
const POSITIONING_RADIUS = 10;

// Setup our VR environment.
const env = new Primrose.BrowserEnvironment({

  // since we aren't using a ground, setting the avatar height to 0 makes things easier.
  avatarHeight: 0,

  // Sometimes it's nice to have a lag between the user's movements and the UI catching up, but not in this case.
  vicinityFollowRate: 1,

  backgroundColor: 0x000000,

  // What to show in the background.
  skyTexture: "images/bg.jpg",

  // The font to use for 3D text.
  font: "helvetiker_regular.typeface.json",

  // gaze-based interaction is kind of annoying on Oculus Rift, so I only turn it
  // on for mobile devices.
  useGaze: isMobile,

  // where to stick the buttons that make us go into VR view.
  fullScreenButtonContainer: "#fsb",

  // A progress tracker for any of the models or files that the environment
  // needs to download.
  progress: Preloader.thunk
});


// Just a place on which to hang some 3D text.
const instructions = hub()
  .addTo(env.ui)
  .named("instructions");

// The hook on which we teleport the user back to center.
const home = box(0.1, 0.1, 0.1)
  .textured("images/home.png", {
    transparent: true,
    unshaded: true
  })
  .named("home")
  .addTo(env.ui)
  .at(0, 0, -1)
  .on("select", () => {
    env.teleport({x: 0, y: 0, z: 0});
    instructions.visible = false;
  });

// The `ready` event fires whenever the VR environment has loaded all of the assets
// we provided to it.
env.addEventListener("ready", (evt) => {
  const gazeTxt = text3D(0.25, "Gaze at house icon to return to selection")
    .colored(0xffffff)
    .addTo(instructions);

  var b = gazeTxt.geometry.boundingBox;

  gazeTxt.at(-b.max.x / 2, 0, -POSITIONING_RADIUS / 2);

  const back = box(b.max.x * 1.1, b.max.y * 1.3, 0.125)
    .colored(0x225273, {
      side: THREE.BackSide,
      unshaded: true
    })
    .addTo(gazeTxt)
    .at(b.max.x / 2, b.max.y / 2, 0);

  // Create the photospheres.
  const photos = [
    "test1",
    "test2",
    "test3",
    "test4",
    "test5",
    "test6",
    "test7"
  ].map((img, i, surfaces) =>
    new Primrose.Controls.Image("images/" + img + ".jpg", {
      radius: 3,
      unshaded: true,
      progress: Preloader.thunk
    })
    .addTo(env.scene)
    .latLon(0, i * 360 / surfaces.length, POSITIONING_RADIUS)
    .on("select", (evt) =>
      env.teleport(evt.hit.object.position)));

  // Hide the progress bar and show the instructions when done.
  Promise.all(photos
    .map((photo) =>
      photo.ready))
    .then(Preloader.hide);
});