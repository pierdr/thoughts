

var WorldBuilder = function () {
    //This class creates the SCENE (aka the 3d world)

    //WORLD VARIABLES
    var self = this;
    self.scene = new THREE.Scene();
    const cFog = 0xFFFFFF;  // white
    const near = 300;
    const far = 450;
    // self.scene.fog = new THREE.Fog(cFog, near, far);
    self.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    self.renderer = new THREE.WebGLRenderer({ antialias: true });


    self.walls = [];
    self.floor = {};
    self.frames = [];

    //WORLD SETUP
    self.setup = function () {
        //CREATE THE RENDERER
        self.renderer.setSize(window.innerWidth, window.innerHeight);
        self.renderer.setClearColor(0xFAFAFA, 1);

        //ADD THE RENDERER TO THE DOCUMENT
        document.body.appendChild(self.renderer.domElement);

        //CREATE FRAME OBJECTES
        var xScrolledStatic = -350;
        var yScrolledTmp = 450;
        var xScrolledIndex = 0;
        var yStandardPositionTmp = 0;

        for (var i = 0; i < art_data.length; i++) {
            if (xScrolledStatic + xScrolledIndex * 150 + (640*0.2)> window.innerWidth-200)
            {
                xScrolledIndex = 0;
                yScrolledTmp -= 100;
            }
            
            var frameTmp = new Frame(art_data[i].poster, new THREE.Vector3(xScrolledStatic + xScrolledIndex * 150, yScrolledTmp, -400));

            // var frameTmp = new Frame(work_data[i].poster, new THREE.Vector3(0 + i * 150, 0, 0));
            self.frames.push(frameTmp);
            
            frameTmp.moveTo(new THREE.Vector3(0, yStandardPositionTmp, 0));
            yStandardPositionTmp += -750;
            self.scene.add(frameTmp.mesh);
            console.log("starting:" + i);
            xScrolledIndex ++;
        }
        yScrolledTmp -= 200;

        for(var i = 0;i<work_data.length;i++)
        {

            var frameTmp = new Frame(work_data[i].poster, new THREE.Vector3(xScrolledStatic + i * 150, yScrolledTmp,-400));
            self.frames.push(frameTmp);
            frameTmp.moveTo(new THREE.Vector3(0, yStandardPositionTmp,0));
            yStandardPositionTmp += -750;
            self.scene.add(frameTmp.mesh);
            console.log("starting:"+i);
        }

        self.camera.position.x = 0;
        self.camera.position.y = 0;
        self.camera.position.z = 600;

        var light2 = new THREE.DirectionalLight(0xfafafa, 0.75);
        light2.position.set(0, 50, 0);
        light2.target.position.set(50, 25, 50);
        self.scene.add(light2);
        self.scene.add(light2.target);


        self.camera.rotation.order = 'YXZ';
        self.camera.rotateY(0);
        self.camera.lookAt(new THREE.Vector3(0,0,0));
    }

    //WORLD LOOP
    self.animate = function () {
        self.updateCameraPosition();

        self.renderer.render(self.scene, self.camera);
        //This line assures that animate is called at each Animation Frame
        requestAnimationFrame(self.animate);
    }

    //ADD KEY LISTENERS
    self.onKeyDown = function (event) {
        switch (event.keyCode) {
            case 38:
                self.camera.position.z -= 5;

                break;
            case 40:
                self.camera.position.z += 5;

                break;
        }

    }

    self.onKeyUp = function (event) {
        console.log("key released:", event.keyCode);
    }

    self.onWheel = function (event) {
        // Check scroll direction
        var delta = Math.max(-1, Math.min(1, (event.wheelDelta || -event.detail)));
        progress +=delta*1.5;
        let divider = 25.1;//15.1;
        
        var progressIndex = Math.abs(Math.floor(progress/divider))-1;
        var amount =Math.abs( (progress /divider)%1 );
        console.log(delta, progress, progressIndex,amount);
        if(progress > 0)
        {
            return;
        }
       
            // Scrolled down
            self.frames.forEach((elem, index)=>{
               
               

                if (index < progressIndex) {
                    elem.interpolateWithScrolledPosition(1.0);
                }
                if (index == progressIndex) {
                    elem.interpolateWithScrolledPosition(amount);
                    
                }
                if(index > progressIndex)
                {
                    elem.interpolateWithScrolledPosition(0.0);
                }
                
                elem.moveTo(new THREE.Vector3(elem.standardPosition.x,(Math.abs(index - progressIndex) * -750) - (-amount * 750) ,elem.standardPosition.z));
                console.log(index,elem.standardPosition.y);

            });
        console.log("/////////////////////////");
    }

    document.addEventListener('keydown', self.onKeyDown, false);
    document.addEventListener('wheel', self.onWheel, false);
    document.addEventListener('keyup', self.onKeyUp, false);

    //CAMERA MOVEMENT PARAMETERS - NOTE: all the variables relative to camera motion are private variables (not added to self) just for convenience
    //UNDERSTANDING THE VARIABLES HERE IS PRETTY IMPORTANT

    //STATE Variables
    var movementFactor = 0.0;
    var isCameraMoving = false;

    //ROTATION AND POSITION TARGET AND START Variables (Rotation is expressed in quaternion)
    var startPosition = new THREE.Vector3();
    var targetPosition = new THREE.Vector3();



    self.randomizeCameraPosition = function () {

        //SAVE POSITION
        startPosition.x = self.camera.position.x;
        startPosition.y = self.camera.position.y;
        startPosition.z = self.camera.position.z;

        //FIND NEW RANDOM POSiTION
        targetPosition.x = ((Math.random() - 0.5) * 2) * (5 * 125);
        targetPosition.y = self.camera.position.y;
        targetPosition.z = ((Math.random() - 0.5) * 2) * (5 * 125);



        //START UPDATING
        isCameraMoving = true;
        movementFactor = 0.0;
    }

    self.updateCameraPosition = function () {
        if (isCameraMoving) {
            movementFactor += 0.005;
            let expFactor = movementFactor;

            //INTERPOLATE POSITION
            self.camera.position.x = startPosition.x * (1 - expFactor) + targetPosition.x * expFactor;
            self.camera.position.y = startPosition.y * (1 - expFactor) + targetPosition.y * expFactor;
            self.camera.position.z = startPosition.z * (1 - expFactor) + targetPosition.z * expFactor;


            //CHECK IF ANIMATION IS FINISHED
            if (movementFactor >= 1.0) {
                isCameraMoving = false;
            }
            console.log("camera", self.camera.position, "start", startPosition, "target", targetPosition, "mov", movementFactor);
        }
    }


    return self;
}
