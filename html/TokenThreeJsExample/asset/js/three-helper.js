/**
 * ThreeJS帮助类
 * @constructor
 */
const ThreeHelper = function(){
    var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 3000);
    camera.position.set(0, 0, 50);
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    var renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.domElement.setAttribute('class', 'mainCanvas');
    document.body.appendChild(renderer.domElement);

    var scene = new THREE.Scene();
    scene.add(new THREE.AmbientLight(0xFFFFFF));

    const control = new THREE.OrbitControls(camera, renderer.domElement);
    control.update();

    const deviceControl = new THREE.DeviceOrientationControls(camera);
    deviceControl.update();
    // 在容器上注册事件，这里container也可以换成document
    document.body.addEventListener( 'mousedown', onMouseDown, false );

    this.clock = new THREE.Clock();
    this.mixers = [];

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }, false);

    //初始化性能插件
    var stats;
    this.initStats=function() {
        stats = new Stats();
        document.body.appendChild(stats.dom);
    }

    this.render = function() {
        renderer.render(scene, camera);

        this.move();

        //更新性能插件
        stats.update();

        for (const mixer of this.mixers) {
            mixer.update(this.clock.getDelta());
        }

        //isDeviceing == false ? initMouseControl() : deviceControl.update();

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

    //var controlsBtn= document.getElementById("controlBtn"); // 控制陀螺仪开关的按钮
    var isDeviceing = true; // 陀螺仪状态
    //controlsBtn.addEventListener("touchend", controlDevice, true);
    //isDeviceing == true ? $("#controlBtn").addClass("controlIconae") : $("#controlBtn").addClass("controlIcon");
    // 初始化陀螺仪
    //this.initDevices=function () {
       // deviceControl = new THREE.DeviceOrientationControls(camera);
    //}

   /* // 控制陀螺仪
    this.controlDevice=function(event) {
        if (isDeviceing == true) {
            isDeviceing = false;
            //关闭陀螺仪
            $("#controlBtn").removeClass("controlIcon").addClass("controlIconae");
        } else {
            isDeviceing = true;
            //开启陀螺仪
            $("#controlBtn").removeClass("controlIconae").addClass("controlIcon");
        }
    }*/

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

    function removeParticle(par){
        scene.remove(par);
    }

    var t1 = new Date().getTime(); 
    var group, particle;
    var geometryPartical;
    var mouseX = 0, mouseY = 0;
    var clock = new THREE.Clock();
    var delta,speed;
    var lastdot = 0;

    var windowHalfX = window.innerWidth / 2;
    var windowHalfY = window.innerHeight / 2;

    function init(pos) {

        var PI2 = Math.PI * 2;
        //画点
        var program = function ( context ) {
    
            context.beginPath();
            context.arc( 0, 0, 0.5, 0, PI2, true );
            context.fill();
    
        };
    
    
        group = new THREE.Group();
        scene.add( group );
    
        //创建一个球型用作最后的形状
        geometryPartical = new THREE.SphereGeometry( 5, 20, 20 );
        var vl = geometryPartical.vertices.length;
    
        for ( var i = 0; i < vl; i++ ) {
            //为每个点附上材质
            //var texture = THREE.ImageUtils.loadTexture('asset/Texture/hb.jpg');
            var material = new THREE.SpriteMaterial( {
                //map: texture,
                color: Math.random() * 0x808008 + 0x808080,
                program:program
            } );
    
            particle = new THREE.Sprite( material );
            particle.position.x = pos.x;
            particle.position.y = pos.y;
            particle.position.z = pos.z;
            particle.scale.x = particle.scale.y = Math.random() * 0.2 + 0.1;
            var timerandom = 1*Math.random();
            //为每个点加动画
    
    
            TweenMax.to(
                particle.position,
                timerandom,
                {x:geometryPartical.vertices[i].x+pos.x+(Math.random()*2-1)*10,y:geometryPartical.vertices[i].y+pos.y+(Math.random()*2-1)*10,z:geometryPartical.vertices[i].z+pos.z+(Math.random()*2-1)*10,delay:0.0,onComplete:removeParticle,onCompleteParams:Array(particle)} 
            );
            scene.add( particle );
        }
       // scene.remove(group);
    }

    function fsin(x){     //正弦函数
        return 50*Math.sin(0.8*x*Math.PI/180);
    }

    var raycaster = new THREE.Raycaster();
    var mouse = new THREE.Vector2();
    function onMouseDown( event ) {
        //webAR.trace('点击成功1');
        mouse.x = ( event.clientX / renderer.domElement.clientWidth ) * 2 - 1;
        mouse.y = - ( event.clientY / renderer.domElement.clientHeight ) * 2 + 1;
        //console.log(scene.children);
        raycaster.setFromCamera( mouse, camera );
     
        var intersects = raycaster.intersectObjects( scene.children );
        if ( intersects.length > 0 ) {
            // 点击立方体时，将立方体变为红色
            for(var l=0;l<intersects.length;l++)
            {       
                if(intersects[l].object.name.substr(0,5)=="cube_")
                {               
                    //intersects[l].object.material.color.setHex( 0x00ff00 );
                    delete arraCube[parseInt(intersects[l].object.name.substr(5,intersects[l].object.name.length-5))];
                    scene.remove(intersects[l].object);
                    init(intersects[l].object.position);
                    break;
                }
                
            }
        } 
    }

    this.draw=function(){
        this.initModel();
        this.initStats();
        //this.initDevices();
        this.render();
    }

    
};

