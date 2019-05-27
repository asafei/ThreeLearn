import * as THREE from 'three';

//demo1 加载一个立方体
//  场景 、相机、渲染器
let scene,camera,renderer;
// 立方体
let cube;
function component() {
    //获取body中的div对象
    const div=document.getElementById("container");

    // 一、创建场景、相机和渲染器
    scene = new THREE.Scene();
    camera=new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    renderer=new THREE.WebGLRenderer();
    renderer.setSize(500,500);

    //二、将渲染的dom添加到div中
    div.appendChild(renderer.domElement);

    //三、添加几何体
    //创建几何体
    const geometry=new THREE.BoxGeometry(1,1,1);
    //创建材质
    const material=new THREE.MeshBasicMaterial({color:0x00ff00});
    //创建网格对象
    cube=new THREE.Mesh(geometry,material);
    //将几何体添加到场景，默认添加到(0,0,0)处
    scene.add(cube);

    //设置相机位置，将相机放在(0,0,5)位置处，因为相机默认也是添加到(0,0,0)处
    camera.position.z=5;

    //四、渲染场景
    //renderer.render( scene, camera );
    animate();//让立方体动起来
}

function animate(){
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    requestAnimationFrame(animate);
    renderer.render(scene,camera);
}

component();
