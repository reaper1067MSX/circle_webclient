// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX

import styled from 'styled-components';


export const Label = styled.label` //LABEL STYLE
      display: inline-block;  
      font-size: 14px;
    `;

export const InputText = styled.input`
      height: 25px;
      padding: 5px 10px;
      font-size: 14px;
      line-height: 1.5;
      border-radius: 3px;
      display: block;
      width: 100%;
      color: #555;
      background-color: #fff;
      background-image: none;
      border: 1px solid #ccc;
    `;

    export const TextArea = styled.textarea`
      height: 45px;
      padding: 5px 10px;
      font-size: 14px;
      line-height: 1.5;
      border-radius: 3px;
      display: block;
      width: 100%;
      color: #555;
      background-color: #fff;
      border: 1px solid #ccc;
    `;

export const Fieldset = styled.fieldset`  
      border: 1px solid #ccc !important;
      position: relative;
      border-radius: 4px;
      background-color: #fff;
      padding-left: 10px !important;
      width: 100%;
      margin-top:2px;
      margin-bottom:4px;
      `;

export const Legend = styled.legend`
      font-size: 13px;
      font-weight: bold;
      width: 22%;
      border: 1px solid #901f61;
      border-radius: 4px;
      padding: 3px;
      background-color: #ffffff;
      color: #901f61;
      `;

export const Fieldset1 = styled.fieldset`  
      border: 1px solid #901f61 !important;
      position: relative;
      border-radius: 4px;
      background-color: #fff;
      padding-left: 10px !important;
      width: 100%;
      margin-top:2px;
      margin-bottom:4px;
      `;

export const Legend1 = styled.legend`
      font-size: 16px;
      font-weight: bold;
      width: 22%;
      border: 1px solid #901f61;
      border-radius: 4px;
      padding: 3px;
      background-color: #ffffff;
      color: #901f61;
      `;
  