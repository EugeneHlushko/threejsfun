var room = function() {
  var prv = this;
  prv.settings = {
    wall: {
      width: 300,
      height: 200,
      depth: 5
    }
  };

  prv.init = function() {
    //prv.group = new THREE.Group();

    //construct the room part by part
    prv.makeWalls();

    // add lights
    prv.makeLights();

    //var geometry = new THREE.BoxGeometry( 50, 50, 50 );
    //var material = new THREE.MeshBasicMaterial( {color: 0xffffff} );
    //prv.cube = new THREE.Mesh( geometry, material );
    //prv.cube.position.x = SCENEROOM.x;
    //prv.cube.position.y = SCENEROOM.y;
    //scene.add( prv.cube );

  };

  prv.makeLights = function() {
    prv.lights = new THREE.Group();

    //var tempLight = new THREE.PointLight( 0xffffff, 3, 250 );
    var tempLight = new THREE.SpotLight( 0xff0000);
    tempLight.shadowCameraVisible = true;
    tempLight.shadowDarkness = 0.70;
    tempLight.intensity = 2;
    tempLight.castShadow = true;
    tempLight.name = 'roomLight';
    prv.lights.add(tempLight);

    var lightSphere = new THREE.SphereGeometry( 5, 5, 8, 1 );
    var lightMesh = new THREE.Mesh( lightSphere, new THREE.MeshBasicMaterial( { color: 0xffffff } ) );
    prv.lights.add( lightMesh );

    prv.lights.position.set(SCENEROOM.x, SCENEROOM.y, prv.settings.wall.width/2);


    scene.add(prv.lights);
  };

  prv.makeWalls = function() {
    var wallGeometry = new THREE.BoxGeometry(
      prv.settings.wall.width,
      prv.settings.wall.height,
      prv.settings.wall.depth
    );
    prv.walls = new THREE.Group();
    var wallMaterial = new THREE.MeshLambertMaterial( {color: 0x333333} );
    var sideWallMaterial = new THREE.MeshLambertMaterial( {color: 0x333333} );
    var floorMaterial = new THREE.MeshLambertMaterial( {color: 0x222222} );
    // backwall
    var backWall = new THREE.Mesh( wallGeometry, wallMaterial );
    backWall.position.x = SCENEROOM.x;
    backWall.position.y = SCENEROOM.y;
    prv.walls.add(backWall);

    // side walls
    var sideWallGeometry = new THREE.BoxGeometry(
      prv.settings.wall.depth,
      prv.settings.wall.height,
      prv.settings.wall.width
    );
    var leftWall = new THREE.Mesh( sideWallGeometry, sideWallMaterial );
    leftWall.position.x = SCENEROOM.x - prv.settings.wall.width/2 - prv.settings.wall.depth/2;
    leftWall.position.y = SCENEROOM.y;
    leftWall.position.z = prv.settings.wall.width/2;
    prv.walls.add(leftWall);

    var rightWall = new THREE.Mesh( sideWallGeometry, sideWallMaterial );
    rightWall.position.x = SCENEROOM.x + prv.settings.wall.width/2 + prv.settings.wall.depth/2;
    rightWall.position.y = SCENEROOM.y;
    rightWall.position.z = prv.settings.wall.width/2;
    prv.walls.add(rightWall);

    // floor
    var floorGeometry = new THREE.BoxGeometry(
      prv.settings.wall.width,
      prv.settings.wall.depth,
      prv.settings.wall.width
    );
    var floor = new THREE.Mesh( floorGeometry, floorMaterial );
    floor.position.x = SCENEROOM.x;
    floor.position.y = SCENEROOM.y - prv.settings.wall.height/2 + prv.settings.wall.depth/2;
    floor.position.z = prv.settings.wall.width/2;
    prv.walls.add(floor);

    scene.add(prv.walls);

  };
};
