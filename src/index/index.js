var scene = new THREE.Scene();

var renderer = new THREE.WebGLRenderer({antialias: true});	
renderer.setSize(window.innerWidth, window.innerHeight);

var container = document.getElementById('container');

var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 400;

var controls = new THREE.OrbitControls(camera, renderer.domElement);
var clock = new THREE.Clock();

function render() {
    var delta = clock.getDelta();
    renderer.render( scene, camera );
}

controls.addEventListener('change', render);

var loader = new THREE.JDLoader();
var spider, meshes = [], bones = {};
var model = 'Spider.JD';

loader.load('../models/' + model, function(data) {
    spider = data;
    var materials = data.materials; 
    
    data.geometries.map(function(geometry) {
        var skinnedMesh = new THREE.SkinnedMesh(geometry, materials); // new THREE.MultiMaterial(materials) instead of materials
        meshes.push(skinnedMesh);
        
        skinnedMesh.skeleton.bones.map(function(bone) {
            if(bones[bone.name]) 
                return;		

            bones[bone.name] = bone;
        });

        scene.add(skinnedMesh);
    });
    
    console.log('Model ' + model + ' loaded (' + meshes.length + ' meshes)');
});

scene.add(new THREE.AmbientLight(0xFFFFFF));

var polarGridHelper = new THREE.PolarGridHelper(200, 16, 8, 64, 0x0000ff, 0x808080);
polarGridHelper.position.y = 0;
polarGridHelper.position.x = 0;
scene.add(polarGridHelper);

container.appendChild(renderer.domElement);

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener('resize', onWindowResize, false);