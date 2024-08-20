'use client'
import ReactQuill from 'react-quill'
import { useMemo } from "react";
// import 'react-quill/dest/quill.bubble.css';

interface PreviewProps {
    value: string;
} 

export const Preview = ({ value }: PreviewProps) => {
    // const ReactQuill = useMemo(() => 
    // dynamic(() => import("react-quill"), {ssr: false})
    // , []);
    return (
        <ReactQuill theme="bubble" value={value} readOnly  />
        
    )


}