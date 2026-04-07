import { supabase } from "../config/supabase.js"

const uploadFile = async (file, folder) => {

    const fileName =
        `${folder}/${Date.now()}-${file.originalname}`

    const { data, error } = await supabase
        .storage
        .from('Documents')   // ✅ Correct bucket name
        .upload(fileName, file.buffer, {
            contentType: file.mimetype
        })

    if (error) throw error

    const { data: publicUrl } = supabase
        .storage
        .from('Documents')   // ✅ same bucket
        .getPublicUrl(fileName)

    return publicUrl.publicUrl
}

export default uploadFile