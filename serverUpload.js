
import path from 'path'
import formidable from 'formidable';

class serverUpload{

    constructor(){
        
        this.method = "POST";
        this.url = "/apis/upload";
        
        
        this.cl(`init .... will handle ${this.method} at ${this.url}`);

    }
    
    cl( str ){
        console.log(` serUp     ${this.method}  ${this.url}     `,str);
    }


    async doIt( req, res ){
        let form = formidable({
            uploadDir: path.join(process.cwd(), 'uploads'),
            keepExtensions: true,
            maxFileSize: 5 * 1024 * 1024, // 5MB limit 
        });
        let [fields, files] = await form.parse(req);
        //console.log(` field   `,fields,"\n\nfiles\n",files);
        
        let uploadedFile = files.myFile ? files.myFile[0] : null;

        if (uploadedFile) {
            this.cl(['File uploaded successfully:', uploadedFile.filepath]);
            this.cl(['Original filename:', uploadedFile.originalFilename]);
            this.cl(['File size:', uploadedFile.size]);
            this.cl(['Description:', fields.description ? fields.description[0] : 'No description' ]);
            res.end(JSON.stringify(uploadedFile));
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



    }
}

export { serverUpload }