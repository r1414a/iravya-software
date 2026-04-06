import { supabase } from "../config/supabase.js"

const uploadFile = async (file, folder) => {

    const fileName =
        `${folder}/${Date.now()}-${file.originalname}`

    const { data, error } = await supabase
        .storage
        .from('truck-documents')
        .upload(fileName, file.buffer, {
            contentType: file.mimetype
        })

    if (error) throw error

    const { data: publicUrl } = supabase
        .storage
        .from('truck-documents')
        .getPublicUrl(fileName)

    return publicUrl.publicUrl
}

export default uploadFile