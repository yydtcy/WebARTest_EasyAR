
var renderer;
function initRender() {
    renderer = new THREE.WebGLRenderer({antialias:true, alpha: true});
   //renderer = new THREE.CanvasRenderer({antialias:true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    //告诉渲染器需要阴影效果
   // renderer.setClearColor(0xffffff);
    document.body.appendChild(renderer.domElement);
}

var camera;
function initCamera() {
    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.set(-30, 30, 25);
    //camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 1, 3000);
    //camera.position.set(0, 0, 50);
    camera.lookAt(new THREE.Vector3(0,0,0));
   //camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 3000 );
   //camera.position.z = 1000;
   //camera.position.y = 0;
}

var scene;
function initScene() {
    scene = new THREE.Scene();
}

//初始化dat.GUI简化试验流程
var gui;
function initGui() {
    //声明一个保存需求修改的相关数据的对象
    gui = {
    };
    var datGui = new dat.GUI();
    //将设置属性添加到gui当中，gui.add(对象，属性，最小值，最大值）
}

var light;
var light1;
function initLight() {
    scene.add(new THREE.AmbientLight(0x444444));

    light = new THREE.PointLight(0xffffff, 2, 300);
    light.position.set(100, 0, 200);

    //告诉平行光需要开启阴影投射
    light.castShadow = true;

    scene.add(light);

    light1 = new THREE.PointLight(0xffffff,2, 300);
    light1.position.set(-100, 0, -200);

    //告诉平行光需要开启阴影投射
    light1.castShadow = true;

    scene.add(light1);
}
var flag;
function initModel() {

    webAR.trace('initModel');
    //辅助工具
    var helper = new THREE.AxesHelper(50);
    scene.add(helper);

    /*var loader = new THREE.ColladaLoader();

    var mesh;
    loader.load("asset/model/duck.dae", function (result) {
        mesh = result.scene.children[0].clone();
        mesh.scale.multiplyScalar(0.1);
        scene.add(mesh);
        render();
    });*/


    /*var fbx_loader = new THREE.FBXLoader();

    fbx_loader.load('asset/model/trex_v3.fbx', function(object) {
        object.scale.multiplyScalar(0.03);    // 缩放模型大小
        scene.add(object);
    });*/

    flag = setInterval(initCube, 1000);
}


var cube;
var i=0;
var arraCube=[];
function initCube(){

    if(i<50)
    {
    // 绘制一个矩形
      var geometry=new THREE.CubeGeometry(3, 4, 0.2);
      var texture = THREE.ImageUtils.loadTexture('asset/Texture/hb.jpg');
      if(texture==null)
      {
        webAR.trace('null');
      }
      var material=new THREE.MeshPhongMaterial({
          specular:  0xC0C0C0,shininess:5,map: texture
      });
      cube = new THREE.Mesh(geometry, material);
      cube.position.x=3*parseInt(Math.random()*10-5);
      cube.position.y=20;
      cube.position.z=parseInt(Math.random()*40-20);
      cube.name="cube_"+i.toString();
      arraCube.push(cube);
      scene.add(cube);
      i++;
    }
    else 
    {
        clearInterval(flag);
    }

}

function move(){
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
function initStats() {
    stats = new Stats();
    document.body.appendChild(stats.dom);
}

//用户交互插件 鼠标左键按住旋转，右键按住平移，滚轮缩放
var controls;
function initControls() {

    controls = new THREE.OrbitControls( camera, renderer.domElement );

    // 如果使用animate方法时，将此函数删除
    //controls.addEventListener( 'change', render );
    // 使动画循环使用时阻尼或自转 意思是否有惯性
    controls.enableDamping = true;
    //动态阻尼系数 就是鼠标拖拽旋转灵敏度
    //controls.dampingFactor = 0.25;
    //是否可以缩放
    controls.enableZoom = true;
    //是否自动旋转
    //controls.autoRotate = true;
    controls.autoRotateSpeed = 0.5;
    //设置相机距离原点的最远距离
    controls.minDistance  = 1;
    //设置相机距离原点的最远距离
    controls.maxDistance  = 200;
    //是否开启右键拖拽
    controls.enablePan = true;
 
    // 在容器上注册事件，这里container也可以换成document
    document.body.addEventListener( 'mousedown', onMouseDown, false );
}

function render() {

    renderer.render( scene, camera );
    //webAR.trace('Render');
}

//窗口变动触发的函数
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    render();
    renderer.setSize( window.innerWidth, window.innerHeight );

}

var aa=1;
function animate() {
    //更新控制器

    render();
    
    //更新性能插件
    stats.update();

    controls.update();

    move();

    requestAnimationFrame(animate);

}

function removeParticle(par){
	scene.remove(par);
}

var t1 = new Date().getTime(); 
var stats;
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


const draw=function() {
    webAR.trace('$$$$$$$');
    initGui();
    initRender();
    initScene();
    initCamera();
    initModel();
    initLight();
    initControls();
    initStats();

    animate();
    window.onresize = onWindowResize;
}

