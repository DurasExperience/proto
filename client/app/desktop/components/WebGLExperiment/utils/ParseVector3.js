import { Vector3 } from 'three'
import chunk from 'lodash.chunk'

const ParseVec3 = ( array ) => chunk( array, 3 ).map( ( arr ) => new Vector3( arr[ 0 ], arr[ 1 ], arr[ 2 ] ) )

export default ParseVec3