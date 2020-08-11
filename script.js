let scene, camera, renderer, cloudParticles = [], flash, rain, rainGeo, rainCount = 8000; 
function init()
{
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(60,window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.z = 1;
    camera.rotation.x = 1.16;
    camera.rotation.y = -0.12;
    camera.rotation.z = -0.27;

    ambient = new THREE.AmbientLight(0x0101010);
    scene.add(ambient);
    directionLight = new THREE.DirectionalLight(0xfffedd);
    directionLight.position.set(-2,1,1);
    scene.add(directionLight);  
    flash = new THREE.PointLight(0x053664, 100, 300, 0.47);
    flash.position.set(200,800,100);
    scene.add(flash);
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth,window.innerHeight);
    document.body.appendChild(renderer.domElement);

    rainGeo = new THREE.Geometry(); 
    for(let i=0; i<rainCount; i++)
    {
        rainDrop = new THREE.Vector3(
            Math.random() * 300 - 200,
            Math.random() * 500 - 350,
            Math.random() * 400 - 300,
            Math.random() * 500 - 250
        );  
        rainDrop.velocity = {};
        rainDrop.velocity = -2;
        rainGeo.vertices.push(rainDrop);
    }

    rainMaterial = new THREE.PointsMaterial({
        color:0x33abba,
        size:0.5,
        transparent:true
    });

    rain = new THREE.Points(rainGeo,rainMaterial);
    scene.add(rain);

    let listener = new THREE.AudioListener();
    camera.add(listener);

    // create audio source

    let sound = new THREE.Audio(listener);

    // load sound
    let audioLoader = new THREE.AudioLoader();
    audioLoader.load('storm.mp3', function(buffer){
        sound.setBuffer(buffer);
        sound.setVolume(0.8);
        sound.play();
    });
    let analyser = new THREE.AudioAnalyser(sound,32);
    let data = analyser.getAverageFrequency();

    let loader = new THREE.TextureLoader();
    loader.load("cloud.png",function(texture){
        cloudGeo = new THREE.PlaneBufferGeometry(1000,800);
        cloudMaterial = new THREE.MeshLambertMaterial({
            map: texture,
            transparent: true
        });
    for(let p=0; p<100; p++){
        let cloud = new THREE.Mesh(cloudGeo,cloudMaterial);
        cloud.position.set(
            Math.random()*1000 - 700, 500,
            Math.random()*1000 - 289
        );
        cloud.rotation.x = 1.16;
        cloud.rotation.y = -0.12;
        cloud.rotation.z = Math.random()*160;
        cloud.material.opacity = 0.6;
        cloudParticles.push(cloud);
        scene.add(cloud);
    }
    animate();
    });
}  
function animate() {
    cloudParticles.forEach( p => {
        p.rotation.z -= 0.002;
    });
    rainGeo.vertices.forEach(p => {
        p.velocity -= 0.1 + Math.random() * 0.2;
        p.y += p.velocity;
        if(p.y <-200){
            p.velocity = 0;
            p.y = 200;
        }
    });
    rainGeo.verticesNeedUpdate = true;
    if(Math.random() > 0.93 || flash.power > 100) {
        if(flash.power < 100)
           flash.position.set(
               Math.random() * 400,
               300 + Math.random() *200,
               100
           );
           flash.power = 50 + Math.random() * 500;
    }
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}
init();
