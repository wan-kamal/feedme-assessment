import { createSignal } from "solid-js";
import { Order } from "./Orders";

export const createQueues = () => {
  const [normalQueue, setNormalQueue] = createSignal<Order[]>([]);

  const [vipQueue, setVIPQueue] = createSignal<Order[]>([]);

  const [redoNormalQueue, setRedoNormalQueue] = createSignal<Order[]>([]);

  const [redoVIPQueue, setRedoVIPQueue] = createSignal<Order[]>([]);

  const [completedQueue, setCompletedQueue] = createSignal<Order[]>([]);

  return { 
    normalQueue,
    setNormalQueue,
    vipQueue,
    setVIPQueue,
    redoNormalQueue,
    setRedoNormalQueue,
    redoVIPQueue,
    setRedoVIPQueue,
    completedQueue,
    setCompletedQueue,
  }
}
