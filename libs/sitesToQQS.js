


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
     // let skC = 0;
     /* TODO FIX OR NOT now this is not in process.env */
      for(let p of process.env.vy_config.pathsToSitesPackages){
        if( 0 && 'package' in p && 'wsqq' in p['package'] ){
          // to do only one site !!!
          //if(skC++ == 1) break;
          
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
                  for( let topic of p['package']['wsqq']['subscribe'] ){
                  
                  // device look out and/ client / site / device / cmd
                  let subS = `and/${q2.getName()}/${sK}/${topic}/cmd`;
                  if( sK in wSitesBG ) 
                    wSitesBG [ sK ].push( subS );
                  wSites[ sK ].push( subS );
                  //qqS.onMsg(sK,'',`qq:{"subscribe":"${subS}"}`);
                  q2.on( sK, subS, (t,p)=>{
                    console.log('q2  I site from and/ /cmd auto got topic:',t,'\npayload: ',p,
                      '\nsK:'+sK,
                      '\ntopic:'+topic
                    );
                   if( `q2handlers` in siteByKey[ sK ].o && `${topic}` in siteByKey[ sK ].o.q2handlers  ){
                      console.log('OK 2');
                      siteByKey[ sK ].o.q2handlers[ `${topic}` ]( {topic:t,payload:p} );
                    }
                  });
                  console.log(subS);
    
                  // device look out and/ device / cmd
                  subS = `and/${topic}/cmd`;
                  if( sK in wSitesBG ) 
                    wSitesBG [ sK ].push( subS );
                  wSites[ sK ].push( subS );
                  //qqS.onMsg(sK,'',`qq:{"subscribe":"${subS}"}`);
                  q2.on( sK, subS, (t,p)=>{
                    console.log('q2  II site from and/ /cmd auto got topic:',t,'\npayload: ',p,
                      '\nsK:'+sK,
                      '\ntopic:'+topic
                    );
                    if( `q2handlers` in siteByKey[ sK ].o && `${topic}` in siteByKey[ sK ].o.q2handlers  ){
                      console.log('OK 2');
                      siteByKey[ sK ].o.q2handlers[ `${topic}` ]( {topic:t,payload:p} );
                    }
                  });

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