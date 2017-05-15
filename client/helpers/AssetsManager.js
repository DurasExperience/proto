import AssetsLoader from 'assets-loader'


class AssetsManager {

  constructor(){

    this.assetsLoader = new AssetsLoader({
      blob: true,
      crossOrigin: 'anonymous'
    })

  }

  load( url, onLoad, onSucess, onReject, id ) {

    let loader = new AssetsLoader()
      .add( url )
      .on('error', function( error ) {

        throw new Error("loading error", error )

      })
      .on('complete', map => {

        loader.get().forEach( resource => {

          onLoad( resource )

        })

      })
      .start()

  }

}

export default new AssetsManager()
