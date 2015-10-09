// first

var dbg = {
  prp: true // profile pics
};

var canvas = document.getElementById('canvas');
var scene = new THREE.Scene();
var camera, renderer, mouseX, mouseY;
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;
var clock = new THREE.Clock();
var groups = {
  cylinder1: new THREE.Group()
};
var pi = Math.PI;
var transitions = [];

var settings = {
  speed: 0.01,
  amplifier: 0.001,
  limit: 0.25,
  scene1Shown: false
};

var SCENE1 = {
  y: 2000,
  trSpeed: 40,
  picWidth: 100,
  picHeight: 100,
  pointlight: {}
};

var SCENEROOM = {
  y: 3000,
  x: 3000,
  z: 420,
  trSpeed: 25,
  currentRoom: {}
};

// Create an ambient light
var light = new THREE.AmbientLight(0x777777);
scene.add( light );

// Create a directional light
var directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(0, 0, 300);
scene.add(directionalLight);

// Create a point light for scene1 light and its mesh
SCENE1.lightSphere = new THREE.SphereGeometry( 1, 16, 8, 1 );
SCENE1.lightMesh = new THREE.Mesh( SCENE1.lightSphere, new THREE.MeshBasicMaterial( { color: 0xffffff } ) );
scene.add( SCENE1.lightMesh );
SCENE1.pointlight = new THREE.PointLight( 0xffffff, 3, 200 );
SCENE1.pointlight.position.set(0, SCENE1.y, 10);
scene.add(SCENE1.pointlight);
// Create a point light for scene1 light2 and its mesh
SCENE1.lightMesh2 = new THREE.Mesh( SCENE1.lightSphere, new THREE.MeshBasicMaterial( { color: 0xffffff } ) );
scene.add( SCENE1.lightMesh2 );
SCENE1.pointlight2 = new THREE.PointLight( 0xffffff, 3, 100 );
SCENE1.pointlight2.position.set(0, SCENE1.y, 10);
scene.add(SCENE1.pointlight2);

// Create a camera
camera = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 1, 1000);
camera.position.z = 120;

// Create the renderer
renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
//renderer.setPixelRatio( window.devicePixelRatio );
renderer.setClearColor(0x000000, 1);
document.body.appendChild(renderer.domElement);

// Window re-size
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  windowHalfX = window.innerWidth / 2;
  windowHalfY = window.innerHeight / 2;
}
window.addEventListener('resize', onWindowResize, false);

// load image textures
var mapMetal = THREE.ImageUtils.loadTexture( 'img/metal.jpg' );
mapMetal.wrapS = mapMetal.wrapT = THREE.ClampToEdgeWrapping;
mapMetal.anisotropy = 16;
var mapWood = THREE.ImageUtils.loadTexture( 'img/metal2.jpg' );
mapWood.wrapS = mapWood.wrapT = THREE.ClampToEdgeWrapping;
mapWood.minFilter = THREE.NearestFilter;
mapWood.anisotropy = 16;

////////////////////////////////////////////////////////////////////////////////
// Create & Add Objects
////////////////////////////////////////////////////////////////////////////////

// Create a gradient coloured plane with strobe effect for the background,
// black at the top with two alternating (strobing) tones at the bottom.
var geometry = new THREE.PlaneGeometry(5000, 2500, 0, 0);
//var wallGradientTop = new THREE.Color(0xdfdfdf);
var wallGradientTop = new THREE.Color(0x000000);
var wallGradientBottom1 = new THREE.Color(0x00333b);
var wallGradientSwitch = wallGradientBottom1;
geometry.faces[0].vertexColors = [wallGradientTop, wallGradientBottom1, wallGradientTop];
geometry.faces[1].vertexColors = [wallGradientBottom1, wallGradientBottom1, wallGradientTop];
var wallStrobeClock = 0.0; // initialize to 0.0
var wallStrobeRate = 0.03; // strobe interval in seconds
var material = new THREE.MeshBasicMaterial({color: 0xffffff, vertexColors: THREE.VertexColors});
var wall = new THREE.Mesh(geometry, material);
wall.position.z = -100;
scene.add(wall);

function inRads(degrees) {
  return degrees * (pi/180);
};

var partEdgeAngles = [
  0,
  inRads(45),
  inRads(90),
  inRads(135),
  inRads(180),
  inRads(225),
  inRads(270),
  inRads(315)
];
function createGear(part, base, pivot) {
  // first create base
  var _curBase = new THREE.Mesh(base.geometry, base.material);
  var _tempGroup = new THREE.Group();
  // rotate it ( to face is -Math.PI/2 )
  _curBase.rotation.x = base.rotation;
  _tempGroup.add(_curBase);

  var _pivot = new THREE.Mesh(pivot.geometry, pivot.material);
  _pivot.rotation.x = base.rotation;
  _tempGroup.add(_pivot);

  // define it here so it is visible through all of iterations
  var _basicPart;
  // now create parts
  for ( var i=0; i<partEdgeAngles.length; i++ ) {
    var _currentPart;
    // if its first round of iteration, create the gear, otherwise clone it
    if ( i === 0 ) {
      _currentPart =_basicPart = new THREE.Mesh( part.geometry, part.material );
    } else {
      _currentPart = _basicPart.clone();
      _currentPart.rotation.z = partEdgeAngles[i];
    }

    // now that part is created we add it to the group
    _tempGroup.add(_currentPart);
  }

  return _tempGroup;
};

// Create basic materials
var materials = {
  forBase: new THREE.MeshLambertMaterial( { map: mapMetal, side: THREE.DoubleSide } ),
  forPivot: new THREE.MeshLambertMaterial( { map: mapWood, side: THREE.DoubleSide } ),
  forParts: new THREE.MeshBasicMaterial( {color: 0xffffff} )
};

var CylinderGeometry = new THREE.CylinderGeometry(50,50,25,32);
var CylinderGeometry2 = new THREE.CylinderGeometry(100,100,25,48);

var PivotGeometry = new THREE.CylinderGeometry(10,10,30,32);

var partGeom = new THREE.BoxGeometry( 18, 25, 24 );
partGeom.applyMatrix( new THREE.Matrix4().makeTranslation( 0,50,0) );
var partGeom2 = new THREE.BoxGeometry( 15, 50, 24 );
partGeom2.applyMatrix( new THREE.Matrix4().makeTranslation( 0,100,0) );

var CylindersInitial = {};
// create first gear
CylindersInitial.cylinder1 = createGear(
  {
    geometry: partGeom,
    material: materials.forBase
  },
  {
    geometry: CylinderGeometry,
    material: materials.forBase,
    rotation: -Math.PI/2
  },
  {
    geometry: PivotGeometry,
    material: materials.forPivot
  }
);

// create and move the 2nd gear
CylindersInitial.cylinder2 = CylindersInitial.cylinder1.clone();
CylindersInitial.cylinder2.position.x = 99;
CylindersInitial.cylinder2.position.y = 60;

// create third gear
CylindersInitial.cylinder3 = createGear(
  {
    geometry: partGeom2,
    material: materials.forBase
  },
  {
    geometry: CylinderGeometry2,
    material: materials.forBase,
    rotation: -Math.PI/2
  },
  {
    geometry: PivotGeometry,
    material: materials.forPivot
  }
);
// move the big guy
CylindersInitial.cylinder3.position.x = -167;
CylindersInitial.cylinder3.position.y = 55;
CylindersInitial.cylinder3.rotation.z = 0.07;

// now create groups for them
groups.cylindersRight  = new THREE.Group();
groups.cylindersLeft  = new THREE.Group();


groups.cylindersLeft.add(CylindersInitial.cylinder1);
groups.cylindersLeft.add(CylindersInitial.cylinder2);
groups.cylindersLeft.add(CylindersInitial.cylinder3);
groups.cylindersLeft.position.x = -200;

var cylinder1Copy = CylindersInitial.cylinder1.clone();
var cylinder2Copy = CylindersInitial.cylinder2.clone();
var cylinder3Copy = CylindersInitial.cylinder3.clone();
// move it to the right
groups.cylindersRight.add(cylinder1Copy).add(cylinder2Copy).add(cylinder3Copy);
groups.cylindersRight.position.x = 232;
groups.cylindersRight.position.y = -62;

groups.cylindersRight.position.z = groups.cylindersLeft.position.z = -50;

// add them to scene
scene.add(groups.cylindersRight);
scene.add(groups.cylindersLeft);


////////////////////////////////////////////////////////////////////////////////
// Choose ebuilder screen
////////////////////////////////////////////////////////////////////////////////
var profileImages = new THREE.Group();
var profilesSceneSettings = {
  picsZ: -40,
  picsLoadDetector: 0,
  mouseEntered: false,
  mouseLeft: true,
  defaultOpacity: 0.85,
  fadeInStep: 0.04,
  fadeOutStep: 0.06
};
var indexIterator = 0;

var ebuilders = [
  {
    id: 'eugenehlushko',
    x: -200,
    y: SCENE1.y+60
  },
  {
    id: 'eugenehlushko',
    x: -80,
    y: SCENE1.y+60
  },
  {
    id: 'eugenehlushko',
    x: 40,
    y: SCENE1.y+60
  },
  {
    id: 'eugenehlushko',
    x: 160,
    y: SCENE1.y+60
  },
  // row2
  {
    id: 'eugenehlushko',
    x: -200,
    y: SCENE1.y-60
  },
  {
    id: 'eugenehlushko',
    x: -80,
    y: SCENE1.y-60
  },
  {
    id: 'eugenehlushko',
    x: 40,
    y: SCENE1.y-60
  },
  {
    id: 'eugenehlushko',
    x: 160,
    y: SCENE1.y-60
  },
];

//before loading profile pics lets prepare our shader
var noiseTexture = new THREE.ImageUtils.loadTexture( 'img/cloud.png' );
noiseTexture.wrapS = noiseTexture.wrapT = THREE.RepeatWrapping;

// this will iterate and call to load each ebuilder
function prepareSelectionScreen() {
  for ( profilesSceneSettings.iter = 0; profilesSceneSettings.iter<ebuilders.length; profilesSceneSettings.iter++ ) {
    ebuilders.index = profilesSceneSettings.iter;
    getInstaInfo(ebuilders[profilesSceneSettings.iter], drawProfilePicture);
  }
}

function drawProfilePicture(ebuilder) {
  console.log(ebuilder);
  //var img = new THREE.MeshLambertMaterial({
  //  map:THREE.ImageUtils.loadTexture('img/parsed/'+ebuilder.pic),
  //  side: THREE.DoubleSide,
  //  transparent: true,
  //  opacity: profilesSceneSettings.defaultOpacity
  //});
  //img.map.needsUpdate = true; //ADDED
  //img.map.minFilter = THREE.LinearFilter;
  var img = THREE.ImageUtils.loadTexture('img/parsed/'+ebuilder.pic);

  var customMaterial = new THREE.ShaderMaterial(
    getPicShader(img, noiseTexture)
  );
  customMaterial.transparent = true;

  // plane for image texture
  //var tempIMG = new THREE.Mesh(new THREE.PlaneGeometry(SCENE1.picWidth, SCENE1.picHeight),img);
  var tempIMG = new THREE.Mesh(new THREE.PlaneGeometry(SCENE1.picWidth, SCENE1.picHeight),customMaterial);


  tempIMG.userData = ebuilder;
  //tempIMG.overdraw = true;
  tempIMG.position.x = ebuilder.initial.x;
  tempIMG.position.y = ebuilder.initial.y;
  tempIMG.position.z = profilesSceneSettings.picsZ;
  tempIMG.name = 'profilePicObj'+profilesSceneSettings.picsLoadDetector;
  profileImages.add(tempIMG);

  profilesSceneSettings.picsLoadDetector++;

  console.log(profilesSceneSettings.picsLoadDetector);
  if ( profilesSceneSettings.picsLoadDetector === profilesSceneSettings.iter ) {
    profileImages.position.x = 20;
    scene.add(profileImages);
    // them alpha levels now
    for ( var ii=0;ii<profileImages.children.length; ii++ ) {
      var _cur = profileImages.children[ii];
      _cur.material.uniforms.alpha.value = profilesSceneSettings.defaultOpacity;
    }
  }
}



////////////////////////////////////////////////////////////////////////////////
// Object Picking
////////////////////////////////////////////////////////////////////////////////

var pickVector = new THREE.Vector3();
var raycaster = new THREE.Raycaster();

function objectPick(event) {
  pickVector.set(
    ((event.clientX || event.touches[0].pageX) / window.innerWidth) * 2 - 1, // x
    - ((event.clientY || event.touches[0].pageY) / window.innerHeight) * 2 + 1, // y
    0.5 // z = 0.5 important!
  );
  pickVector.unproject(camera);
  raycaster.set(camera.position, pickVector.sub( camera.position ).normalize());

  var intersects = raycaster.intersectObjects( profileImages.children, true );

  if (intersects.length > 0) {

    // if mouse just entered, set the flag.
    if ( !profilesSceneSettings.mouseEntered ) {
      profilesSceneSettings.mouseEntered = true;
      profilesSceneSettings.mouseLeft = false;
    }

    if ( !intersects[0].object.userData.hover ) intersects[0].object.userData.hover = true;

    var pickedID = intersects[0].object.id;
    var transitionObject = {
      id: pickedID,
      type: 'alpha',
      value: 1,
      step: profilesSceneSettings.fadeInStep
    };

    if (
      !transitions.hasOwnProperty(pickedID)
      && transitions[pickedID] != transitionObject
    ) {
      transitions[pickedID] = transitionObject;
    }

    // check if its a click event over the picture
    if ( event.type === 'click' ) {
      var pickedEbuilders = profileImages.getObjectById(pickedID);

      goToSceneRoom(pickedEbuilders.userData);

    }
  }
  // if we had item active now change its opacity to default which is 0.5
  else if ( profilesSceneSettings.mouseEntered ) {
    dbg.prp && console.log('we will fade out items, we left the item for sure');

    profilesSceneSettings.mouseEntered = false;
    profilesSceneSettings.mouseLeft = true;

    // iterate through profile pics, see if opacity needs correction, and add to transition
    profileImages.children.forEach(function(obj) {
      // set fadeout transition object
      var transitionObject = {
        id: obj.id,
        type: 'alpha',
        operator: 'negative',
        value: profilesSceneSettings.defaultOpacity,
        step: profilesSceneSettings.fadeOutStep
      };
      // if object was in transition, remove it, we will add fade out right after.
      if ( transitions.hasOwnProperty(obj.id) ) {
        dbg.prp && console.log('picture still was fading in, i will remove this animation from sequence', obj.id);
        delete transitions[obj.id];
      }

      // if opacity is greater then default value, fade it out.
      if ( obj.material.uniforms.alpha.value > profilesSceneSettings.defaultOpacity ) {
        dbg.prp && console.log('Objects opacity seem less then expected, i will fade it out!', obj.id);
        transitions[obj.id] = transitionObject;
        obj.userData.hover = false;
      }
    });
  }
}

document.addEventListener( 'mousemove', objectPick, false );
document.addEventListener( 'click', objectPick, false );
document.addEventListener( 'touchstart', objectPick, false );

/// SCENE CHANGING
function goToScene1() {
  // start moving camera to scene one
  var transitionObject = {
    id: 'camera',
    type: 'translate',
    value: [
      {
        value: SCENE1.y,
        direction: 'y',
        operator: 'positive',
        step: SCENE1.trSpeed,
        done: false
      }
    ],
  };
  transitions[camera.id] = transitionObject;

  orbit.center.x = 0;
  orbit.center.y = SCENE1.y;
}

/// SCENE CHANGING
function goToSceneRoom(ebuilder) {
  // first generate the room
  SCENEROOM.currentRoom = new room();
  SCENEROOM.currentRoom.init();
  console.log(SCENEROOM.currentRoom);

  // start moving camera to scene one
  var transitionObject = {
    id: 'camera',
    type: 'translate',
    value: [
      {
        value: SCENEROOM.x,
        direction: 'x',
        operator: 'positive',
        step: SCENEROOM.trSpeed,
        done: false
      },
      {
        value: SCENEROOM.y,
        direction: 'y',
        operator: 'positive',
        step: SCENEROOM.trSpeed,
        done: false
      },
      {
        value: SCENEROOM.z,
        direction: 'z',
        operator: 'positive',
        step: SCENEROOM.trSpeed,
        done: false
      }
    ],
  };
  transitions[camera.id] = transitionObject;

  orbit.center.x = SCENEROOM.x;
  orbit.center.y = SCENEROOM.y;
}


////////////////////////////////////////////////////////////////////////////////
// Post-Processing Shaders
////////////////////////////////////////////////////////////////////////////////

composer = new THREE.EffectComposer(renderer);
composer.addPass(new THREE.RenderPass(scene, camera));

var filmEffect = new THREE.ShaderPass(THREE.FilmShader);
filmEffect.uniforms[ 'grayscale' ].value = 0;
filmEffect.uniforms[ 'nIntensity' ].value = 0.2;
filmEffect.uniforms[ 'sIntensity' ].value = 0.4;
filmEffect.uniforms[ 'sCount' ].value = 1900;
composer.addPass(filmEffect);

var vignetteEffect = new THREE.ShaderPass(THREE.VignetteShader);
vignetteEffect.uniforms[ 'offset' ].value = 1.1;
vignetteEffect.renderToScreen = true;
composer.addPass(vignetteEffect);

//// TODO: disable orbits later
var orbit = new THREE.OrbitControls( camera, renderer.domElement );
orbit.enableZoom = true;
//orbit.center.x = 3000;
//orbit.center.y = 3000;



document.addEventListener('keyup', handleKeyup);
var cameraSpeed = 20;
function handleKeyup(e) {
  console.log(e.keyCode);
  // left (a, <-): 65, 37
  // top (w, ^): 87, 38
  // right (d, ->): 68, 39
  // bottom (s, v): 83, 40
  switch ( e.keyCode ) {
    // left
    case 65:
    case 37:
      camera.position.x += 10;
      break;
    // top
    case 87:
    case 38:
      camera.position.y += 10;
      break;
    // right
    case 68:
    case 39:
      camera.position.x -= 10;
      break;
    // bottom
    case 83:
    case 40:
      camera.position.y -= 10;
      break;

  }
}

window.addEventListener('mousemove', function() {
  mouseX = ( event.clientX - windowHalfX );
  mouseY = ( event.clientY - windowHalfY );
});


// Animate
function animate() {
  requestAnimationFrame(animate);
  update();
  render();
}

var stop = false;

// Update loop
function update() {
  timeDelta = clock.getDelta();
  var time = clock.getElapsedTime();
  // BG strobe effect
  wallStrobeClock += timeDelta;

  //camera.rotation.y = mouseX * 0.0002;
  //camera.rotation.x = mouseY * 0.0001;

  if ( settings.speed < settings.limit ) {
    // increase the speed
    settings.speed += settings.amplifier;
  } else {
    // start transition to 1st scene on load.
    if ( !settings.scene1Shown ) {
      settings.scene1Shown = true;
      goToScene1();
    }
  }
  // rotate our gears
  groups.cylindersLeft.children[0].rotation.z += settings.speed;
  groups.cylindersLeft.children[1].rotation.z -= settings.speed;
  groups.cylindersLeft.children[2].rotation.z -= settings.speed/2;

  groups.cylindersRight.children[0].rotation.z -= settings.speed;
  groups.cylindersRight.children[1].rotation.z += settings.speed;
  groups.cylindersRight.children[2].rotation.z += settings.speed/2;

  SCENE1.pointlight.position.x = 300 * Math.cos( time );
  SCENE1.pointlight.position.y = SCENE1.y + ( 100 * Math.cos( time * 1.25 ) );
  SCENE1.pointlight.position.z = 50 * Math.sin( time );
  SCENE1.lightMesh.position.copy( SCENE1.pointlight.position );

  SCENE1.pointlight2.position.x = 500 * Math.cos( time * 1.25 );
  SCENE1.pointlight2.position.y = SCENE1.y + ( 60 * Math.cos( time ) );
  SCENE1.pointlight2.position.z = 4 * Math.sin( time );
  SCENE1.lightMesh2.position.copy( SCENE1.pointlight2.position );

  // update shader uniforms when we are at scene2
  //customUniforms.time.value += timeDelta;
  for ( var ii=0;ii<profileImages.children.length; ii++ ) {
    var _cur = profileImages.children[ii];
    if ( _cur.userData.hover ) {

    } else {
      _cur.material.uniforms.time.value += timeDelta;
    }
  }


  // transition function
  transitions.forEach(function(_curTR) {
    if ( _curTR.id === 'camera' ) {
      var _obj = camera;
    } else {
      var _obj = scene.getObjectById(_curTR.id);
    }

    switch ( _curTR.type ) {
      case 'opacity':
        if ( _curTR.operator && _curTR.operator === 'negative' ) {
          _obj.material.opacity -= _curTR.step;
          if ( _obj.material.opacity <= _curTR.value ) {
            delete transitions[_curTR.id];
          }
        }
        else {
          _obj.material.opacity += _curTR.step;
          if ( _obj.material.opacity >= _curTR.value ) {
            delete transitions[_curTR.id];
          }
        }
        break;
      case 'alpha':
        if ( _curTR.operator && _curTR.operator === 'negative' ) {
          _obj.material.uniforms.alpha.value -= _curTR.step;
          if ( _obj.material.uniforms.alpha.value <= _curTR.value ) {
            delete transitions[_curTR.id];
          }
        }
        else {
          _obj.material.uniforms.alpha.value += _curTR.step;
          if ( _obj.material.uniforms.alpha.value >= _curTR.value ) {
            delete transitions[_curTR.id];
          }
        }
        break;
      case 'translate':
        var allDone = 0;
        // iterate through directions ( XYZ )
        for ( var i=0; i<_curTR.value.length; i++ ) {
          var _onedir = _curTR.value[i];

          if (_onedir.operator === 'negative') {
            // if not done, translate further
            if ( !_onedir.done ) {
              _obj.position[_onedir.direction] -= _onedir.step;
            } else {
              allDone++;
            }
            if (_obj.position[_onedir.direction] <= _onedir.value && !transitions[_obj.id].value[i].done ) {
              transitions[_obj.id].value[i].done = true;
            }
          }
          else {
            // if not done, translate further
            if ( !_onedir.done ) {
              _obj.position[_onedir.direction] += _onedir.step;
            } else {
              allDone++;
            }
            if (_obj.position[_onedir.direction] >= _onedir.value && !transitions[_obj.id].value[i].done ) {
              transitions[_obj.id].value[i].done = true;
            }
          }
        }

        //console.log(transitions[_obj.id]);
        // if all transition animations are done now, we can delete.
        if ( allDone === _curTR.value.length ) {
          delete transitions[_obj.id];
        }
        break;
    }
  });

}

// Render loop
function render() {
  // Render scene using Effect Composer
  composer.render();
}

window.onload = function() {
  // Initiate Animation
  animate();
  prepareSelectionScreen();
};


