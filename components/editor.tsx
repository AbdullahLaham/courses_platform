'use client'
// import dynamic from "next/dynamic";
import ReactQuill from 'react-quill'
import { useMemo } from "react";
// import 'react-quill/dest/quill.snow.css';

interface EditorProps {
    onChange: (Value: string)  => void;
    value: string;
} 

export const Editor = ({onChange, value }: EditorProps) => {
   
    return (
        <div className="bg-white">
            <ReactQuill theme="snow" value={value} onChange={onChange}  />
        </div>
    )


}