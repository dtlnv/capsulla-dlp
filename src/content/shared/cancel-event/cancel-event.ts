/**
 * cancelEvent
 * @param e - Event
 * @description Prevents the default action of the event and stops its propagation.
 * This is useful for preventing the default behavior of events such as clicks or key presses.
 */
export default function cancelEvent(e: Event): void {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
}
