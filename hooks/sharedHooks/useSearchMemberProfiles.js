import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";

export function useSearchMemberProfiles(searchQuery) {
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    if (!searchQuery || searchQuery.length < 2) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);

    const timeout = setTimeout(async () => {
      const { data, error } = await supabase
        .from("public_user_names")
        .select("id, first_name, last_name, membership_no")
        .or(
          `first_name.ilike.%${searchQuery}%,last_name.ilike.%${searchQuery}%`,
        )
        .limit(10);

      if (error) {
        console.error("Search error:", error);
        setSearchResults([]);
      } else {
        setSearchResults(data || []);
      }

      setIsSearching(false);
    }, 400);

    return () => clearTimeout(timeout);
  }, [searchQuery]);

  return { isSearching, searchResults };
}
