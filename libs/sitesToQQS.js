


var installSitesToQQS = function(){
    console.log('sitesToQQS.installSites(); .... start');

    let mslInterval = -1;
    
    function mainSitesLoaded_waintForWs(){
      mslInterval = setInterval(()=>{
        if( wsInIsOk != true ){
          console.log('sites wsqq loader waiting for ws ...');
        }else{
          clearInterval( mslInterval );
          setTimeout(()=>{mainSitesLoaded();},2500);
        }
      },1000);
    }  


    function mainSitesLoaded(){  
      console.log("wsqq load sites ...");
      let wSitesBG = {};
      let wSites = {};
      for(let p of process.env.vy_config.pathsToSitesPackages){
        if( 'package' in p && 'wsqq' in p['package'] ){
          let pTo = p['pathTo'];
          console.log('  wsqq -> site with path '+pTo);
          for(let sK of Object.keys( siteByKey ) ){
            if( siteByKey[ sK ].fDir == pTo ){
              wSites[ sK ] = [];
    
              console.log(`       is as: [${sK}]\n\nwsqq looks fantastik! `+
                JSON.stringify( p['package']['wsqq'],null,2 ) );
                
              if( 'background' in p['package']['wsqq'] && p['package']['wsqq']['background'] ){
                wSitesBG[ sK ] = [];
              }
    
    
              if( 'subscribe' in p['package']['wsqq'] ){
                  for( let topik of p['package']['wsqq']['subscribe'] ){
                  
                  // device look out and/ client / site / device / cmd
                  let subS = `and/${thisClientIdent}/${sK}/${topik}/cmd`;
                  if( sK in wSitesBG ) 
                    wSitesBG [ sK ].push( subS );
                  wSites[ sK ].push( subS );
                  qqS.onMsg(sK,'',`qq:{"subscribe":"${subS}"}`);
                  console.log(subS);
    
                  // device look out and/ device / cmd
                  subS = `and/${topik}/cmd`;
                  if( sK in wSitesBG ) 
                    wSitesBG [ sK ].push( subS );
                  wSites[ sK ].push( subS );
                  qqS.onMsg(sK,'',`qq:{"subscribe":"${subS}"}`);
                  console.log(subS);
    
                }
              }
            }
    
          }
          
        }
      }  
      window['qqS_sites'] = wSites;
      window['qqS_sitesKeys'] = Object.keys( wSites );
      window['qqS_sitesKLength'] = qqS_sitesKeys.length;
      window['qqS_sitesBG'] = wSitesBG;
      window['qqS_sitesBGKeys'] = Object.keys( wSitesBG );
      window['qqS_sitesBGKLength'] = qqS_sitesBGKeys.length;
      console.log("wsqq load sites ...DONE");
    }
    document.addEventListener('DOMContentLoaded', mainSitesLoaded_waintForWs);
    
}


export {
    installSitesToQQS
}