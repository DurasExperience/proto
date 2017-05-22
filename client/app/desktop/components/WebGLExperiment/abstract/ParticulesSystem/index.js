

class ParticleSystem {

	/**
	* @constructor
	*/
	constructor(obj) {

		this.particleCount = 500;
		this.clock = new THREE.Clock(true);
		this.particles = new THREE.Geometry();


		for (var p = 0; p < this.particleCount; p++) {

			var x = Math.random() * 4000 - 2000 ;
			var y = Math.random() * 800 - 50;
			var z = Math.random() * 4000 - 2000;

			// Create the vertex
			var particle = new THREE.Vector3(x, y, z);

			// Add the vertex to the geometry
			this.particles.vertices.push(particle);
		}

		var texture = new THREE.Texture(obj.file);
		texture.needsUpdate = true;

		this.particleMaterial = new THREE.PointsMaterial({
			size: 7,
			fog: true,
			map: texture,
			opacity: 1,
			transparent: true
		});

		this.mesh = new THREE.Points(this.particles, this.particleMaterial);
	}

	/**
	* @method
	* @name update
	* @description Triggered on every TweenMax tick
	*/
	update() {
		this.deltaTime = this.clock.getDelta();

		var verts = this.mesh.geometry.vertices;
		for(var i = 0; i < verts.length; i++) {
			var vert = verts[i];
			if (vert.y < -200) {
				vert.y = Math.random() * 800 - 50;
			}
			vert.y = vert.y - (10 * this.deltaTime);
			// vert.y = sin(vert.y - (10 * this.deltaTime));
		}

		this.mesh.geometry.verticesNeedUpdate = true;

	}

}

export default ParticleSystem
