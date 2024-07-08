import { useState } from 'react';

export default function useMenu() {
    const [selectedIndex, setSelectedIndex] = useState(0);


    const handleListItemClick = (index: number) => {
        setSelectedIndex(index)
    }

    return { selectedIndex, handleListItemClick }
} 