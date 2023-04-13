import { Component, createSignal } from "solid-js";

import styles from "./App.module.css";
import Bots, { Bot } from "./bots/Bots";
import Orders  from "./orders/Orders";
import { createQueues } from "./orders/orders.hooks";

const { 
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
} = createQueues();


const App: Component = () => {
  return (
    <main class={styles.App}>
      <Orders
        normalQueueAccessor={normalQueue}
        normalQueueSetter={setNormalQueue}
        vipQueueAccessor={vipQueue}
        vipQueueSetter={setVIPQueue}
        redoNormalQueueAccessor={redoNormalQueue}
        redoVIPQueueAccessor={redoVIPQueue}
        completedQueueAccessor={completedQueue}
      ></Orders>
      <Bots
        normalQueueAccessor={normalQueue}
        normalQueueSetter={setNormalQueue}
        vipQueueAccessor={vipQueue}
        vipQueueSetter={setVIPQueue}
        redoNormalQueueAccessor={redoNormalQueue}
        redoNormalQueueSetter={setRedoNormalQueue}
        redoVIPQueueAccessor={redoVIPQueue}
        redoVIPQueueSetter={setRedoVIPQueue}
        completedQueueAccessor={completedQueue}
        completedQueueSetter={setCompletedQueue}
      ></Bots>
    </main>
  );
};

export default App;
