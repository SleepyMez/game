import { ctx } from "./canvas.js";
import { mouse } from "./net.js";
import { getPetalIcon } from "./renders.js";
import { lerp } from "./util.js";

export class DragAndDropItem {
    index = 0;
    rarity = 0;

    x = 0;
    y = 0;
    size = 0;
    ratio = 0;

    realX = 0;
    realY = 0;
    realSize = 0;
    stableSize = 0;
}

export const dragConfig = {
    /**
     * @type {DragAndDropItem}
     */
    item: null,
    enabled: false,
    isReleasing: false,
    type: -1,
    index: -1,
    onDrop: function() {}
};

export const DRAG_TYPE_MAINDOCKER = 0;
export const DRAG_TYPE_SECONDARYDOCKER = 1;
export const DRAG_TYPE_DESTROY = 2;

export function beginDragDrop(x, y, size, index, rarity) {
    const item = new DragAndDropItem();

    item.x = x;
    item.y = y;
    item.size = size;

    item.realX = x;
    item.realY = y;
    item.realSize = size;
    item.stableSize = size;

    item.index = index;
    item.rarity = rarity;

    dragConfig.item = item;
    dragConfig.enabled = true;
    dragConfig.isReleasing = false;
}

export function updateAndDrawDragDrop(mouseX, mouseY) {
    if (!dragConfig.enabled) {
        dragConfig.item = null;
        return;
    }

    if (!mouse.left || dragConfig.isReleasing) {
        dragConfig.isReleasing = true;
    } else {
        dragConfig.item.realX = mouseX;
        dragConfig.item.realY = mouseY;
    }

    dragConfig.item.x = lerp(dragConfig.item.x, dragConfig.item.realX, .2);
    dragConfig.item.y = lerp(dragConfig.item.y, dragConfig.item.realY, .2);
    dragConfig.item.size = lerp(dragConfig.item.size, dragConfig.item.realSize, .2);

    if (dragConfig.isReleasing) {
        const dx = dragConfig.item.x - dragConfig.item.realX;
        const dy = dragConfig.item.y - dragConfig.item.realY;

        if (Math.sqrt(dx * dx + dy * dy) < dragConfig.item.size) {
            dragConfig.isReleasing = false;
            dragConfig.enabled = false;
            dragConfig.onDrop(dragConfig.item);
            dragConfig.item = null;
            return;
        }
    }

    ctx.save();
    ctx.textAlign = "center";
    ctx.translate(dragConfig.item.x, dragConfig.item.y);
    ctx.scale(dragConfig.item.size, dragConfig.item.size);
    ctx.rotate(Math.sin(performance.now() / 250) * .3);
    ctx.drawImage(getPetalIcon(dragConfig.item.index, dragConfig.item.rarity), -.5, -.5, 1, 1);
    ctx.restore();

    dragConfig.item.realSize = dragConfig.item.stableSize;
}