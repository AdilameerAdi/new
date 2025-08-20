import React, { useState } from 'react'
import { Editor } from '@tinymce/tinymce-react';

export const RichTextArea = ({ setValue, initialValue = "" }) => {

    const [content, setContent] = useState('');

    const handleEditorChange = (content, editor) => {
        setContent(content);
        setValue(content)
    }
    
    return (
        <div>
            <Editor
                apiKey={import.meta.env.VITE_TINY_APIKEY}
                    init={{
                    plugins: 'ai tinycomments mentions anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount checklist mediaembed casechange export formatpainter pageembed permanentpen footnotes advtemplate advtable advcode editimage tableofcontents mergetags powerpaste tinymcespellchecker autocorrect a11ychecker typography inlinecss',
                    toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | align lineheight | tinycomments | checklist numlist bullist indent outdent | emoticons charmap | removeformat',
                    tinycomments_mode: 'embedded',
                    tinycomments_author: 'Author name',
                    mergetags_list: [
                        { value: 'First.Name', title: 'First Name' },
                        { value: 'Email', title: 'Email' },
                    ],
                    ai_request: (request, respondWith) => respondWith.string(() => Promise.reject("See docs to implement AI Assistant")),
                    skin: 'oxide-dark', // Asegúrate de tener este skin disponible
                    content_css: 'dark' // Asegúrate de tener este CSS disponible
                }}
                initialValue={initialValue}
                onEditorChange={handleEditorChange}
            />
            <div className="hidden">
                <div dangerouslySetInnerHTML={{ __html: content }}></div>
            </div>
        </div>
    )
}
