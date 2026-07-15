import { useState } from "react";
import { Reorder } from "framer-motion";

export default function ReorderChips() {
  const [items, setItems] = useState(["Research", "Wireframes", "Visual Design", "Prototype"]);

  return (
    <Reorder.Group
      axis="x"
      values={items}
      onReorder={setItems}
      className="flex flex-wrap gap-3"
    >
      {items.map((item) => (
        <Reorder.Item
          key={item}
          value={item}
          data-cursor="drag"
          whileDrag={{ scale: 1.08, zIndex: 10 }}
          className="cursor-grab rounded-full border border-ink/15 bg-[var(--color-card)] px-5 py-2.5 text-sm font-medium text-ink active:cursor-grabbing"
        >
          {item}
        </Reorder.Item>
      ))}
    </Reorder.Group>
  );
}
