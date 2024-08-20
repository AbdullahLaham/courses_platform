"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import React from 'react'
interface ConfirmModelProps {
    children: React.ReactNode;
    onConfirm: () => void,
}
const ConfirmModel = ({children, onConfirm}: ConfirmModelProps) => {
  return (
    <div>
      <AlertDialog>
        <AlertDialogTrigger asChild>
            {children}
        </AlertDialogTrigger>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Ar you sure!</AlertDialogTitle>
                <AlertDialogDescription>
                    this action cannot be undone.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={onConfirm}>
                    Continue

                </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default ConfirmModel
