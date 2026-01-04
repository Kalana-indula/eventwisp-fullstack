import { createClient } from "@supabase/supabase-js"

const anon_key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase_url = process.env.NEXT_PUBLIC_SUPABASE_URL!

const supabase = createClient(supabase_url, anon_key);

export const mediaUpload = (file:File|null):Promise<string> => {

    return new Promise((resolve, reject) => {

        //check if upload file is null
        if(file == null){
            reject("No files were selected");
        }

        //get current time stamp
        const timeStamp = new Date().getTime();

        //create unique file name
        const fileName = timeStamp + file.name;

        //define the bucket name "images"
        supabase.storage.from("images").upload(fileName, file, {
            cacheControl: '3600',
            upsert: false
        }).then(() => {
            //get the image url
            const publicUrl = supabase.storage.from("images").getPublicUrl(fileName).data.publicUrl;
            console.log(publicUrl);
            resolve(publicUrl);
        }).catch(()=>{
            reject("Error uploading file");
        })
    })

}
