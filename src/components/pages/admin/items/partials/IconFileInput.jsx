import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FileUploadOutlined } from '@mui/icons-material';

export const IconFileInput = ({
  label = null,
  variant = 'normal',
  className = '',
  size = 'md',
  icon = null,
  element = null,
  full = false,
  preview = '',
  helperLink = { url: null, text: null },
  register = {
    function: null,
    errors: { function: null, rules: {} },
  },
  ...props
}) => {

    const [previewSrc, setPreviewSrc] = useState(preview);
    const [error, setError] = useState('');

    const variants = {
        sm: 'text-sm h-8',
        md: 'text-md h-10',
        lg: 'text-lg h-12',
        xl: 'text-xl h-14',
    };

    const handleFileInputChange = (event) => {
        const file = event.target.files[0];
        if (!file) {
            setError('No file selected.');
            return;
        }

        if (!file.type.startsWith('image/')) {
            setError('Please select an image file.');
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            setPreviewSrc(reader.result);
            setError('');
        };
        reader.readAsDataURL(file);
    };

    return (
        <div className={`flex flex-col gap-2 ${full && 'w-full'}`}>
        { label || helperLink.url || helperLink.text ?
            <div className="flex gap-2 justify-between">
            { label &&
                <label
                    htmlFor={props.id || null}
                    className="text-sm text-gray-500"
                >
                    {label || null}
                </label>        
            }
            {
                helperLink.url || helperLink.text ?
                <Link
                    to={helperLink.url || null}
                    className="text-sm text-blue-400 hover:underline"
                >
                    {helperLink.text || null}
                </Link>      
                : null    
            }
            </div> : null 
        }
        <label
            className={`flex gap-2 items-center border rounded-lg aspect-square
                ${props.disabled
                    ? 'bg-black/10 dark:bg-black/50'
                    : 'hover:bg-black/20 transition-all duration-300'
                } 
                ${
                register.errors.function &&
                register.errors.function[props.name]
                    ? 'border-red-400'
                    : 'border-black/20 dark:border-gray-500 aspect-square'
                } 
                ${variants[size]} ${className}`}
            htmlFor={props.id || null}
        >
            <label
                htmlFor={props.id || null}
                className="flex flex-col flex-grow gap-2 justify-center items-center relative h-full cursor-pointer p-1"
            >
                {icon && icon}
                {
                    previewSrc ?
                        <div className="w-full h-full bg-center bg-cover" style={{ 
                            backgroundImage: `url(${previewSrc})`
                        }}/>
                    :
                        <FileUploadOutlined className="text-black/30 dark:text-gray-500" />
                }
                <input
                    id={props.id || null}
                    name={props.name || null}
                    type="file"
                    className={`absolute w-0 h-0`}
                    { ...register.function &&
                        {...register.function(
                            props.name,
                            register.errors.rules,
                        )}
                    }
                    onChange={handleFileInputChange}
                    {...props}
                />
                </label>
            {element && element}
        </label>
        { register.errors.function &&
            register.errors.function[props.name] && 
            register.errors.function[props.name].message && (
            <label
                htmlFor={props.id || null}
                className="text-xs text-red-400"
            >
                {
                register.errors.function[props.name]
                    .message
                }
            </label>
        )}
        </div>
    );
};
