// The distance from the starting point at which the photospheres will be placed.
const POSITIONING_RADIUS = 10;

// Setup our VR environment.
const app = new Primrose.BrowserEnvironment({

  // What to show in the background.
  skyTexture: "images/bg.jpg",

  // The font to use for 3D text.
  font: "helvetiker_regular.typeface.json",

  // gaze-based interaction is kind of annoying on Oculus Rift, so I only turn it
  // on for mobile devices.
  useGaze: isMobile,

  // A progress tracker for any of the models or files that the environment
  // needs to download.
  progress: prog.thunk
});

// The hook on which we teleport the user back to center.
const home = textured(box(0.1, 0.1, 0.1), "images/home.png", {
  transparent: true,
  unshaded: true
});
home.name = "home";
home.position.set(0, 0, -1);

window.home = home;


// Just a place on which to hang some 3D text.
const instructions = hub();
instructions.visible = false;


// The `ready` event fires whenever the VR environment has loaded all of the assets
// we provided to it.
app.addEventListener("ready", () => {
  prog.bar.style.height = "10px";
  // show the full-screen icons.
  const container = document.getElementById( "fsb" );
  app.displays.forEach(( display, i ) => {
    const btn = document.createElement( "button" );
    btn.type = "button";
    btn.innerHTML = Primrose.Input.VR.isStereoDisplay(display) ? "&#x1f453;" : "&boxplus;";
    btn.title = display.displayName;
    btn.addEventListener( "click", app.goFullScreen.bind(app, i));
    container.appendChild( btn );
  });


  // Put the home teleporter into the scene and make it clickable.
  app.ui.add(home);
  app.registerPickableObject(home);


  // Add some basic instructions.
  app.ui.add(instructions);
  instructions.rotateX(-Math.PI / 6);

  window.gazeTxt = colored(text3D(0.25, "Gaze at house icon to return to selection"), 0xffffff);
  instructions.add(gazeTxt);
  var b = gazeTxt.geometry.boundingBox;
  gazeTxt.position.set(-b.max.x / 2, app.avatarHeight, -POSITIONING_RADIUS / 2);
  var back = colored(box(b.max.x * 1.1, b.max.y * 1.3, 0.125), 0x225273, {
    side: THREE.BackSide,
    unshaded: true
  });
  gazeTxt.add(back);
  back.position.set(b.max.x / 2, b.max.y / 2, 0);

  // Create the photospheres.
  Promise.all([
      "test1",
      "test2",
      "test3",
      "test4",
      "test5",
      "test6",
      "test7"
    ].map((img) => new Primrose.Controls.Image({
      id: img,
      radius: 2,
      unshaded: true,
      pickable: true
    }).loadImages(
      ["images/" + img + ".jpg"],
      prog.thunk)))


  // Place the photospheres in the scene.
  .then((surfaces) => surfaces.forEach((img, i) => {
    app.appendChild(img);

    // Position them equidistantly along a circle.
    const a = i * (2 * Math.PI / surfaces.length);
    img.position.set(
      POSITIONING_RADIUS * Math.cos(a),
      app.avatarHeight,
      POSITIONING_RADIUS * Math.sin(a));
  }))


  // Hide the progress bar and show the instructions when done.
  .then(() => {
    instructions.visible = true;
    prog.bar.style.display = "none";
  });
});

// Teleporting!
app.addEventListener("gazecomplete", select);
app.addEventListener("pointerend", select);
function select(evt){
  console.log(evt);
  // Make sure the user actually clicked on a thing and didn't just click into
  // empty space.
  const obj = evt.hit && evt.hit.object;
  if(obj){
    if(obj === home){
      app.teleport({x: 0, y: 0, z: 0});

      // hide the instruction once we know the user knows how to navigate.
      instructions.visible = false;
    }
    else{
      app.teleport(obj.position);
    }
  }
}