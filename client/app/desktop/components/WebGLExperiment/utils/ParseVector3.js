import { Vector3 } from 'three'
import chunk from 'lodash.chunk'

export default function ParseVec3( array ) {
  return chunk( array, 3 ).map( ( arr ) => new Vector3( arr[ 0 ], arr[ 1 ], arr[ 2 ] ) )
}