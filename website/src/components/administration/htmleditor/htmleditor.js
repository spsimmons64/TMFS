import React, { useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { config } from '../../../global/config';
import "./htmleditor.css";

export const HTMLEditor = (props) => {
    const { id, value, callback,height, ...nprops } = props;

    return (
        <Editor
            apiKey={config.tinyMCE}
            tinymceScriptSrc={process.env.REACT_APP_PUBLIC_URL + '/tinymce/tinymce.min.js'}                        
            value={value}
            init={{
                skin:'oxide-dark',                
                height: height,
                menubar: false,
                statusbar: false,
                plugins: [
                    'advlist', 'autolink', 'lists', 'link', 'image', 'charmap',
                    'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                    'insertdatetime', 'media', 'table', 'preview', 'help', 'wordcount'
                ],

                toolbar: 'bold italic| forecolor backcolor|alignleft aligncenter ' +
                         'alignright alignjustify| bullist numlist |outdent indent| '+
                         'table|link image media',

                content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
            }}
            onEditorChange={callback}
        />
    )
}