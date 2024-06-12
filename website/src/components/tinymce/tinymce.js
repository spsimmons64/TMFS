import React, { useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';

export const TinyMCEEditor = (props) => {
    const editorRef = useRef(null)    

    const editorConfig = {
        apiKey: process.env.REACT_APP_TINY_MCE_API_KEY,
        height: props.height,
        skin: "small",
        content_css:"material-classic",
        statusbar: false,
        media_embed: true, 
        media_live_embeds: true, 
        media_alt_source: true, 
        media_poster: false, 
        media_previews: true, 
        media_allow_html_frames: true, 
        media_platform: {youtube: 'https://www.youtube.com/oembed?url={url}&format=json'},        
        content_style: 'body { font-family: Arial, sans-serif; }',        
        plugins: [
        'media','advlist','autolink','charmap','preview','anchor','image','link',
        'help','searchreplace','visualblocks','code','insertdatetime','media','table','wordcount'
        ],
        toolbar:
          'fontfamily fontsize | forecolor backcolor formatselect bold italic underline| \
          alignleft aligncenter alignright alignjustify | table | \
          bullist numlist outdent indent |  media image link|',
    }

    const updateEditor = (e) =>(editorRef.current &&  props.dispatch) && props.dispatch(editorRef.current.getContent())

    return (
        <Editor
            onInit={(e,editor)=>editorRef.current=editor}
            apiKey={editorConfig.apiKey}
            initialValue={props.content}
            init={editorConfig}            
            onEditorChange={updateEditor}
        />
    );
}