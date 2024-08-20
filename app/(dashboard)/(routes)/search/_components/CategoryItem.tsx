import { usePathname, useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import React from 'react';
import qs from 'query-string'
import { IconType } from 'react-icons/lib'
import { cn } from '@/lib/utils';
interface CategoryItemProps {
    label: string,
    value?: string,
    icon?: IconType
}
const CategoryItem = ({label, value, icon: Icon}: CategoryItemProps) => {
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentCategoryId = searchParams.get('categoryId');
    const currentTitle = searchParams.get('title');

    const isSelected = currentCategoryId == value;

    const onClick = () => {
        const url = qs.stringifyUrl({
            url: pathname,
            query: {
                title: currentTitle,
                categoryId: !isSelected ? value : null,
            }
        }, {skipNull: true, skipEmptyString: true});
        router.push(url);
    }

  return (
    <button onClick={onClick} className={cn("py-2 px-3 text-sm border border-slate-200 flex items-center gap-x-1 hover:border-sky-700 transition ", isSelected && "border-sky-700 bg-sky-200/20 text-sky-800")} type='button'>
      {Icon && <Icon size={20} />}
      <div className='truncate'>
        {label}
      </div>
    </button>
  )
}

export default CategoryItem;
