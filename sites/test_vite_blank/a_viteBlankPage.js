

//a xx 3
class s_viteBlankPage{

  constructor(){
   
  }

  get getName(){
    return `test vite blank`;

  }

  get getDefaultBackgroundColor(){
    return "#ffffff";

  }

  getHtml = () => {
    return `<b>Hello ${this.getName}</b>`;

  }

  getHtmlAfterLoad = () =>{
    cl(`${this.getName} - getHtmlAfterLoad()`);

  }

  get svgDyno(){
    return '';

  }

  svgDynoAfterLoad(){

  }

  onMessageCallBack = ( r ) => {
    cl( `[cb] ${this.getName} - got msg `);

  }

}

export { s_viteBlankPage };
