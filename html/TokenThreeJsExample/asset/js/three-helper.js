/**
 * ThreeJS帮助类
 * @constructor
 */
const ThreeHelper = function(){
    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.set(-30, 30, 25);
    this.camera.lookAt(new THREE.Vector3(0, 0, 0));

    this.renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.domElement.setAttribute('class', 'mainCanvas');
    document.body.appendChild(this.renderer.domElement);

    this.scene = new THREE.Scene();
    this.scene.add(new THREE.AmbientLight(0xFFFFFF));

    const control = new THREE.OrbitControls(this.camera, this.renderer.domElement);
    control.update();

    this.clock = new THREE.Clock();
    this.mixers = [];

    window.addEventListener('resize', () => {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }, false);

    this.render = function() {
        this.renderer.render(this.scene, this.camera);

        this.move();

        for (const mixer of this.mixers) {
            mixer.update(this.clock.getDelta());
        }

        window.requestAnimationFrame(() => {
            this.render();
        });
    };

    this.loadObject = function(modelUrl) {
        const loader = new THREE.FBXLoader();
        loader.load(modelUrl, (object) => {
            object.scale.setScalar(0.02);
            object.position.set(0, 0, 0);
            this.scene.add(object);

            if (object.animations.length > 0) {
                object.mixer = new THREE.AnimationMixer(object);
                this.mixers.push(object.mixer);
                object.mixer.clipAction(object.animations[0]).play();
            }
        })
    };

    var flag;
    var cube;
    var i=0;
    var arraCube=[];
    this.initModel=function() {
    //辅助工具
        var helper = new THREE.AxesHelper(50);
        this.scene.add(helper);
        flag = setInterval(this.initCube, 1000);
    }

    this.initCube=function(){

        if(i<50)
        {
        // 绘制一个矩形
          var geometry=new THREE.CubeGeometry(3, 4, 0.2);
          var texture = THREE.ImageUtils.loadTexture('asset/Texture/hb.jpg');
          var material=new THREE.MeshPhongMaterial({
              specular:  0xC0C0C0,shininess:5,map: texture
          });
          cube = new THREE.Mesh(geometry, material);
          cube.position.x=0;//3*parseInt(Math.random()*10-5);
          cube.position.y=0;//20;
          cube.position.z=0;//parseInt(Math.random()*40-20);
          cube.name="cube_";//+i.toString();
          arraCube.push(cube);
          this.scene.add(cube);
          i++;
        }
        else 
        {
            clearInterval(flag);
        }
    
    }

    this.move=function(){
        for(var p=0;p<arraCube.length;p++)
        {
            if(arraCube[p]!=null)
            {
                arraCube[p].position.y=arraCube[p].position.y-0.3;
            }
        }
    
    }

    this.draw=function(){
        this.initModel();
    }

    this.render();
};

