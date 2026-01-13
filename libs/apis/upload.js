
import path from 'path'
import formidable from 'formidable';
import fs from 'fs';

class serverUpload{

    constructor(){
        
        this.method = "POST";
        this.url = "/apis/upload";
        
        
        this.cl(`init .... will handle ${this.method} at ${this.url}`);

    }
    
    cl( str ){
        console.log(` serUp     ${this.method}  ${this.url}     `,str);
    }

    saveMsg( msg ){
        try{
            fs.appendFileSync( 
                path.resolve( 'uploads', `msg_${Date.now()}.log` ),
                msg
             );

        }catch(e){
            console.error(' upload saveMsg     error   \n',e,'\n-------');
        }
    }

    saveFileName( fileInf ){
        let data = `${fileInf.filepath}\t\t${fileInf.originalFilename}\n`;
        try{
            fs.appendFileSync( 
                path.resolve( 'uploads', 'files.log' ),
                data
             );

        }catch(e){
            console.error(' upload      error   \n',e,'\n-------');
        }
    }

    async doIt( req, res ){
        let form = formidable({
            uploadDir: path.join(process.cwd(), 'uploads'),
            keepExtensions: true,
            allowEmptyFiles: true,
            minFileSize: 0,
            maxFileSize: 5 * 1024 * 1024, // 5MB limit 
        });
        let [fields, files] = await form.parse(req);
        this.cl([` field   `,fields,"\n\nfiles\n",files]);
        
        let uploadedFile = files.myFile ? files.myFile[0] : null;

        if( fields.msg && fields.msg[0].length > 0 ){
            this.cl('msg to file ....');
            this.saveMsg( fields.msg[0] );
        }


        if (uploadedFile) {
            this.cl(['File uploaded successfully:', uploadedFile.filepath]);
            this.cl(['Original filename:', uploadedFile.originalFilename]);
            this.cl(['File size:', uploadedFile.size]);
            this.cl(['Description:', fields.description ? fields.description[0] : 'No description' ]);
            res.end(JSON.stringify(uploadedFile));
            this.saveFileName( uploadedFile );
            return 0;
        }else{
            res.end(JSON.stringify({"error":1,"msg":"no myFile value with file to save"}));
            return 0;
        }
    }

    handleRequest( args ){
        let {req, res } = args;

        if( req.method == 'POST' && req.url == this.url ){
            this.cl('in middle ....');
            return this.doIt( req,res );

        }
        /*
        else if( req.method == 'GET' && req.url == this.url ){
            this.cl('GET in middle ....');

            let chunks = [];
            req.on('data', (chunk) => {
                chunks.push(chunk);
                console.log('data .....',chunks.length);
            });
            req.on('end', () => {
                console.log('data end .....');
                let body = Buffer.concat(chunks).toString();
                console.log('Received GET body (size):', body.length,"ECHO:",body);
            });
            let a=`

GET /apis/upload HTTP/1.1
Host: localhost:8080
User-Agent: curl/7.68.0
Accept: *\/*

`;
            res.writeHead(200,{
          'Content-Type': 'text/plain; charset=utf-8',
          'Transfer-Encoding': 'chunked',
          'Cache-Control': 'no-cache',
          'Content-Length':'1042141',
          'Connection': 'keep-alive',
        });
            res.write('<html><body>Hello');
            
            let delay = 10;
            
            let iter = setInterval(()=>{
                delay--;
                res.write( 'ok:'+delay+'\n' );


                if( delay == 0 ){
                    res.end("--- \e[37m#___[ $tDeltaInt ] ms.____\e[0m END"+' <meta http-equiv="refresh" content="0; url=/apis/upload" /></body></html>');
                    clearInterval( iter );
                }

            },500);

            return 0

        }

        */


    }
}

export { serverUpload }