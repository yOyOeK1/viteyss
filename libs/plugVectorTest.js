import { plugVector } from './plugVector.js';


console.log('----- by prefix --');
let pv0 = new plugVector();
pv0.populateByNpmPackage('viteyss-')


//process.exit(1);
console.log('----- by struct --');
let pv1 = new plugVector();
let struct1 = {
    'plugExamp1':{
        'o': {
            printCl: ( arg ) => {
                console.log(`print CL plug 1 [${arg[0]}]`);
            }
        }        
    },
    'plugExamp2':{
        'o': {
            printCl: ( arg ) => {
                console.log(`print CL plug 2 :))) [${arg[0]}]`);
                if( arg[0] == 2 ){
                    return true;
                }
            }
        }        
    }


};

let {a} = import('./plugVector-p1test.js').then((o)=>{
    console.log('------------------\n',o,'\n----------------');
    let po = new o['p1test']();
    console.log('------------------\n',po,'\n----------------',`${(typeof po)}`);
    pv1.addO( 'p1test0', po );

    let tS = performance.now();
    for(let i=0;i<500;i++){

        let res3 = pv1.execReturn( 'printCl' , {0:i});
        console.log(`got pv1 res3: `,res3);
        let res4 = pv1.execReturn( 'printCl' , {0:'p1'});
        console.log(`got pv1 res4: `,res3);
    }
    let inSec = (performance.now() - tS)/1000.00;
    console.log(inSec+' sec.----------------TOTAL OF ');
        
});

pv1.populateByStruct(struct1);
let res1 = pv1.execReturn( 'printCl' , {0:1});
console.log(`got pv1 res1: `,res1);
let res2 = pv1.execReturn( 'printCl' , {0:2});
console.log(`got pv1 res2: `,res2);
