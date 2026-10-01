import { redirect } from "next/navigation";

/** Story mode starts with the featured hero. */
export default function StoryIndex() {
  redirect("/heroes/opportunity/story");
}
