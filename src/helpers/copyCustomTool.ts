import supabase from "../lib/supabase";
import { addToLibrary } from "../services/my-library/libraryService";

export const copyCustomTool = async (toolId: string, userId: string) => {
  // Fetch the original tool
  const { data: originalTool, error } = await supabase
    .from("custom_tools")
    .select("*")
    .eq("id", toolId)
    .eq("user_id", userId)
    .single();

  if (error || !originalTool) {
    return { success: false, error: "Tool not found" };
  }

  // Create a copy with the user's ID
  const newTool = {
    title: originalTool.title,
    description: originalTool.description,
    category: originalTool.category,
    icon_url: originalTool.icon_url,
    url: originalTool.url,
    is_ai_tool: originalTool.is_ai_tool,
  };

  const { data: newToolData, error: insertError } = await supabase
    .from("custom_tools")
    .insert(newTool)
    .select()
    .single();

  if (insertError || !newToolData) {
    return {
      success: false,
      error: insertError?.message || "Failed to copy tool",
    };
  }

  return { success: true, toolId: newToolData.id };
};

export const copyCollection = async (collectionId: string, userId: string) => {
  // Fetch original collection
  const { data: originalCollection, error } = await supabase
    .from("collections")
    .select("*")
    .eq("id", collectionId)
    .single();

  if (error || !originalCollection) {
    return { success: false, error: "Collection not found" };
  }

  // Create new collection
  const newCollection = {
    user_id: userId,
    name: originalCollection.name,
    description: originalCollection.description,
    color: originalCollection.color,
    is_default: false,
    created_by: userId,
  };

  const { data: newCollectionData, error: insertError } = await supabase
    .from("collections")
    .insert(newCollection)
    .select()
    .single();

  if (insertError || !newCollectionData) {
    return {
      success: false,
      error: insertError?.message || "Failed to copy collection",
    };
  }

  // Get tools in the original collection
  const { data: toolsData } = await supabase
    .from("collection_tools")
    .select("tool_id, is_custom")
    .eq("collection_id", collectionId);

  // Add tools to the new collection
  if (toolsData && toolsData.length > 0) {
    for (const toolRef of toolsData) {
      let toolIdToAdd = toolRef.tool_id;

      // If it's a custom tool, copy it first
      if (toolRef.is_custom) {
        const { success, toolId } = await copyCustomTool(
          toolRef.tool_id,
          userId
        );
        if (success && toolId) {
          // Add null check for toolId
          toolIdToAdd = toolId;
        } else {
          continue; // Skip if copying failed
        }
      }

      // Add to new collection
      await supabase.from("collection_tools").insert({
        collection_id: newCollectionData.id,
        tool_id: toolIdToAdd,
        is_custom: toolRef.is_custom,
      });

      // Check if addToLibrary requires 2 or 3 arguments
      await addToLibrary(userId, toolIdToAdd); // Assuming it needs 2 arguments based on error
    }
  }

  return { success: true, collectionId: newCollectionData.id };
};
