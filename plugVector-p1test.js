

class p1test{


    cl(a){
        console.log(' . . o o oO O O ', a ,' O O o o o . . . .');
    }

    printCl = ( arg ) => {
        this.cl( 'hello p1test ! '+`with [${arg[0]}]` );
        if( arg[0] == 'p1' ){
            return 'p1test trigger !';
        }
    }

}

export { p1test }