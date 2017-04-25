import AssetsLoader from 'assets-loader'


class AssetsManager {

  constructor(){

    this.assetsLoader = new AssetsLoader({
      blob: true,
      crossOrigin: 'anonymous'
    })

  }

  load( url, onLoad, onSucess, onReject, id ) {

    let loader = this.assetsLoader.add(url)
      .on('error', function( error ) {

        console.log(error);
        throw new Error("loading error", error );

      })
      .on('complete', function( map ) {

        loader.get().forEach( function( file ) {

          onLoad( file )

        })

      })
    .start()

  }

}

export default new AssetsManager()
