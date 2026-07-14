export const useSidepanel = () => {
    const isOpen = useState('sidepanel-open', () => false);
    return {isOpen};
};