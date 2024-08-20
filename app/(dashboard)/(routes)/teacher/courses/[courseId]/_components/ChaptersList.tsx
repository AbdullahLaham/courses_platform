"use client"
import { cn } from '@/lib/utils'
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";

interface ChapterListProps {
  items: Chapter[];
  onReorder: (updateData: { id: string, position: number }[]) => void,
  onEdit: (id: string) => void,
}
import { Chapter } from '@prisma/client';
import { Badge, Grip, Pencil } from 'lucide-react';
import React, { useEffect, useState } from 'react';

const ChaptersList = ({ items, onReorder, onEdit }: ChapterListProps) => {

  const [isMounted, setIsMounted] = useState(false);
  const [chapters, setChapters] = useState(items);

  useEffect(() => {
    setIsMounted(true);
    setChapters(items);
  }, [items]);

  // to insure the matching between what is rendered on server and on client side. (to prevent hydration errors)
  if (!isMounted) {
    return null;
  }

  // useEffect(() => {
  //   setChapters(items);
  // }, [items])


  // onDragEnd function
  const onDragEnd = (result: DropResult) => {
    // if (!result.destination) return;
    
    // const startIndex = result.source.index;
    // const endIndex = result.destination.index;
    // const copyChapters = [...chapters];
    // const [reorderTodo] = copyChapters.splice(startIndex,1);
    // copyChapters.splice(endIndex,0,reorderTodo)
    // setChapters(copyChapters);

    if (!result.destination) return;
    const items = Array.from(chapters);
    const [reorderedItem] = items.splice(result.source.index,1);
    items.splice(result.destination.index, 0, reorderedItem)
    const startIndex = Math.min(result.source.index, result.destination.index);
    const endIndex = Math.max(result.source.index, result.destination.index);
    const updatedChapters = items.slice(startIndex, endIndex + 1);
    setChapters(items);
    const bulkUpdateData = updatedChapters.map((chapter) => {
      return {
        id: chapter?.id,
        position: items.findIndex((item) => item.id == chapter.id),


      }
      
    })
    onReorder(bulkUpdateData)
    

  }




  if (!isMounted) return null;
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <h1>Todo App</h1>
      <Droppable droppableId="chapters">
        {(droppableProvider) => (
          <ul
            ref={droppableProvider.innerRef}
            {...droppableProvider.droppableProps}
          >
            {chapters.map((chapter, index) => (
              <Draggable
                index={index}
                key={chapter.id}
                draggableId={`${chapter.id}`}
              >
                {(draggableProvider) => (
                  <div className={cn("flex items-center gap-x-2 mb-4 text-sm bg-slate-200 border-slate-200 border text-slate-700 rounded-md", chapter?.isPublished && "bg-sky-200 border-sky-200 border text-sky-700")}
                    ref={draggableProvider.innerRef}
                    {...draggableProvider.draggableProps}

                  >
                    <div className={cn("px-2 py-3 border-r border-r-slate-200 hover:bg-slate-300 rounded-l-md transition ", chapter.isPublished && "border-r-sky-200 hover:bg-sky-200 ")} {...draggableProvider.dragHandleProps}>
                      <Grip className='h-5 w-5' />
                    </div>
                    {chapter?.title}
                    <div className='ml-auto pr-2 flex items-center gap-x-2'>
                      {chapter?.isFree && (
                        <Badge>
                          Free
                        </Badge>
                      )}
                      <Badge className={cn("bg-slate-500", chapter?.isPublished && "bg-sky-700")}>
                        {chapter?.isPublished ? "Published" : "Draft"}
                      </Badge>
                      <Pencil onClick={() => onEdit(chapter?.id)} className='w-4 h-4 cursor-pointer hover:opacity-75 transition' />

                    </div>
                  </div>

                )}
              </Draggable>
            ))}
            {droppableProvider.placeholder}
          </ul>
        )}
      </Droppable>
    </DragDropContext>
  )
}

export default ChaptersList;
