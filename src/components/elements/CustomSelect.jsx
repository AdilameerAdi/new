import Select, { components } from 'react-select';
import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import '../../assets/select.css';

const CustomOption = (props) => {

  const { data, label } = props;

  return (
    <components.Option {...props}>
      <div className="flex items-center">
        {data.img &&
          <img
            src={data.img}
            alt={label}
            className="w-6 h-6 mr-2 rounded-full border border-zinc-500"
          />          
        }
        {label}
      </div>
    </components.Option>
  );
};

const CustomSingleValue = (props) => {
  const { data, children } = props;

  return (
    <components.SingleValue {...props}>
      <div className="flex items-center">
        {data.img &&
          <img
            src={data.img}
            alt={data.label}
            className="w-6 h-6 mr-2 rounded-full border border-zinc-500"
          />          
        }
        {children}
      </div>
    </components.SingleValue>
  );
};

export const CustomSelect = ({
  label = null,
  variant = 'normal',
  size = 'md',
  className = '',
  data,
  values,
  icon = null,
  element = null,
  isClearable = false,
  isSearchable = false,
  isDisabled = false,
  isLoading = false,
  isMulti = false,
  isRtl = false,
  helperLink = { url: null, text: null },
  register = {
    function: null,
    errors: { function: null, rules: {} },
  },
  ...props
}) => {

  const darkMode = useSelector((state) => state.darkMode );

  const variants = {
    sm: 'text-sm p-1',
    md: 'text-md p-2',
    lg: 'text-lg p-3',
    xl: 'text-xl p-4',
  };

  return (
    <div className="flex flex-col flex-grow gap-2">
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
      <div
        className={`flex gap-2 items-center border rounded-lg ${props.disabled && 'bg-black/10 dark:bg-black/50'} ${
          register.errors.function &&
          register.errors.function[props.name]
            ? 'border-red-400'
            : 'border-black/20 dark:border-gray-500'
        } ${variants[size]} ${className}`}
      >
        <label
          htmlFor={props.id || null}
          className="flex flex-grow gap-2 items-center"
        >
          {icon && icon}
          <Select
            components={{ 
              Option: CustomOption,
              SingleValue: CustomSingleValue,
            }}
            isMulti={isMulti}
            isDisabled={isDisabled}
            isLoading={isLoading}
            isClearable={isClearable}
            isRtl={isRtl}
            isSearchable={isSearchable}
            name={props.name || null}
            options={data}
            className="w-full"
            classNamePrefix={darkMode ? 'dark-custom-select' : 'light-custom-select'}
            {...props}
          />
          <input
            id={props.id || null}
            name={props.name || null}
            value={values || null}
            type='hidden'
            { ...register.function &&
              {...register.function(
                props.name,
                register.errors.rules,
              )}
            }
            {...props}
          />

        </label>
        {element && element}
      </div>
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
