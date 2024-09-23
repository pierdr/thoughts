// class Frame {
//     constructor(poster, scrolledPosition) {
//         // Load the poster image
//         var textureLoader = new THREE.TextureLoader();
//         var texture = textureLoader.load(poster);

//         // Create the rectangle shape
//         const element = document.createElement("div");
//         element.style.width = "640px";
//         element.style.height = "427px";
//         element.style.backgroundImage = `url(${poster})`;
//         const object = new THREE.CSS3DObject(element);
      
//         object.scale.set( new THREE.Vector3(1.0, 2.0, 1.0) );
//         this.mesh = object;

//         this.scrolledPosition = scrolledPosition;
        
//         this.mesh.position.set(this.scrolledPosition.x, this.scrolledPosition.y, this.scrolledPosition.z);
    
       
//     }

//     moveTo(newPos) {
//         this.mesh.position.set(newPos.x, newPos.y, newPos.z);
//     }

//     moveY(offsetY) {
//         this.mesh.position.set(this.mesh.position.x, this.mesh.position.y + offsetY, this.mesh.position.z);
//     }

//     interpolateWithScrolledPosition(amount) {
//         const interpolatedPosition = new THREE.Vector3(
//             THREE.MathUtils.lerp(this.mesh.position.x, this.scrolledPosition.x, amount),
//             THREE.MathUtils.lerp(this.mesh.position.y, this.scrolledPosition.y, amount),
//             THREE.MathUtils.lerp(this.mesh.position.z, this.scrolledPosition.z, amount)
//         );
//         this.mesh.position.copy(interpolatedPosition);
//     }
// }

class Frame {

 
    constructor (poster,scrolledPosition) {
        // Load the poster image
        var textureLoader = new THREE.TextureLoader();
        var texture = textureLoader.load(poster);
        console.log(texture,poster,"texture");

        // Create the rectangle shape
        const geometryRect = new THREE.PlaneGeometry(640 , 427, 1);
        const materialRect = new THREE.MeshBasicMaterial({ map: texture });
        this.mesh = new THREE.Mesh(geometryRect, materialRect);
        this.scrolledPosition = scrolledPosition;
        this.scrolledScale = 0.2;
        this.standardPosition = 0;
        this.standardScale = 1.0;
        this.amount = 0;
       // this.mesh.position.set(this.scrolledPosition.x, this.scrolledPosition.y, this.scrolledPosition.z);
    }

    moveTo(newPos) {
        this.standardPosition = newPos;
        this.updatePosition();
        // this.targetPosition = newPos;
        // this.mesh.position.set(newPos.x, newPos.y, newPos.z);
        //this.mesh.position.set(this.scrolledPosition.x, this.scrolledPosition.y, this.scrolledPosition.z);
    }
    moveY(offsetY) {
        this.standardPosition = new THREE.Vector3(this.standardPosition.x, this.standardPosition.y + offsetY, this.standardPosition.z);
        this.updatePosition();
        //this.mesh.position.set(this.scrolledPosition.x, this.scrolledPosition.y, this.scrolledPosition.z);
        //  this.mesh.position.set(this.mesh.position.x, this.mesh.position.y + offsetY, this.mesh.position.z);
    }
    interpolateWithScrolledPosition(amount)
    {
        this.amount = amount;
        this.updatePosition();
        // this.mesh.position.set(this.mesh.position.x, this.mesh.position.y + amount, this.mesh.position.z);
    }
    updatePosition()
    {
        const interpolatedPosition = new THREE.Vector3(
            THREE.MathUtils.lerp(this.standardPosition.x, this.scrolledPosition.x, this.amount),
            THREE.MathUtils.lerp(this.standardPosition.y, this.scrolledPosition.y, this.amount),
            THREE.MathUtils.lerp(this.standardPosition.z, this.scrolledPosition.z, this.amount)
        );
        this.mesh.position.set(interpolatedPosition.x, interpolatedPosition.y, interpolatedPosition.z);

        const interpolatedScale = THREE.MathUtils.lerp(this.standardScale, this.scrolledScale, this.amount);
        this.mesh.scale.set(interpolatedScale,interpolatedScale,interpolatedScale);
    }

}
