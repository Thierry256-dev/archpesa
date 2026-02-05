import { useMemo, useState } from "react";

const useExpandableList = (data = [], initialLimit = 5) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => setIsExpanded((prev) => !prev);

  const slicedData = useMemo(() => {
    if (isExpanded) return data;
    return data.slice(0, initialLimit);
  }, [data, isExpanded, initialLimit]);

  return {
    slicedData,
    isExpanded,
    toggleExpand,
    canExpand: data.length > initialLimit,
  };
};

export default useExpandableList;
