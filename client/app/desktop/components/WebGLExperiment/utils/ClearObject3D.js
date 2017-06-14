const ClearObject3D = ( obj ) => {

  obj.mesh.geometry.dispose()
  obj.mesh.material.dispose()
  obj.mesh = undefined
  obj = undefined
  
}

export default ClearObject3D