const args = process.argv.slice(2); // Skip the first two elements
console.log('Viteyss - run it selector\n  * all arguments:', args);



if( args.length == 0 ){
    console.log(`  * select Default [ localhost - vanila - no ssl :8080 ]`);

}else if( args.length == 1 && args[0] == 'devLocal' ){
    console.log(`  * select [ devLocal ]`);


}else{
    console.log(`Unknown arguments.. try:\n  * no arguments\n  * 'devLocal' `);
}


/*
if (args.length > 0) {
  console.log('First argument:', args[0]);
}

*/