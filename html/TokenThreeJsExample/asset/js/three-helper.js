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

    var scene = new THREE.Scene();
    scene.add(new THREE.AmbientLight(0xFFFFFF));

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
        this.renderer.render(scene, this.camera);

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
            scene.add(object);

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
        scene.add(helper);
        flag = window.setInterval(initCube, 1000);
    }

    function initCube(){
        if(i<50)
        {
         //绘制一个矩形
          var geometry=new THREE.CubeGeometry(3, 4, 0.2);
          var texture = THREE.ImageUtils.loadTexture('asset/Texture/hb.jpg');
          var material=new THREE.MeshPhongMaterial({
              specular:  0xC0C0C0,shininess:5,map: texture
          });
          cube = new THREE.Mesh(geometry, material);
          cube.position.x=3*parseInt(Math.random()*10-5);
          cube.position.y=20;
          cube.position.z=parseInt(Math.random()*40-20);
          cube.name="cube_"+i.toString();
          arraCube.push(cube);
          scene.add(cube);//此处setInterval中不能用this.scene
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

    //初始化性能插件
    var stats;
    this.initStats=function() {
        stats = new Stats();
        document.body.appendChild(stats.dom);
    }

    this.draw=function(){
        this.initModel();
        this.initStats();
    }

    this.render();
};

