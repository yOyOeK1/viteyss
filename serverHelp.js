import formidable from 'formidable';
import path from 'path';


async function sh_reqParse( req, res, callBack ){
    let form = formidable({
        uploadDir: path.join(process.cwd(), 'uploads'),
        keepExtensions: true,
        maxFileSize: 5 * 1024 * 1024, // 5MB limit 
    });
    let [fields, files] = await form.parse(req);

    return callBack( res, fields, files);

}




export { sh_reqParse }