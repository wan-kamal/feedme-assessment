import { Accessor, Component, createSignal, For, Setter } from "solid-js";
import styles from "../App.module.css";

type OrderState = "PENDING" | "COMPLETE";
type OrderType = "NORMAL" | "VIP";

export interface IOrdersProps {
  normalQueueAccessor: Accessor<Order[]>;
  vipQueueAccessor: Accessor<Order[]>;
  redoNormalQueueAccessor: Accessor<Order[]>;
  redoVIPQueueAccessor: Accessor<Order[]>;
  completedQueueAccessor: Accessor<Order[]>;
  normalQueueSetter: Setter<Order[]>;
  vipQueueSetter: Setter<Order[]>;
}

export interface IOrdersQueueProps {
  label: string;
  orderAccessor: Accessor<Order[]>;
}

export class Order {
  id: number;
  state: OrderState;
  progress: number;
  // because type is a reserved word
  orderType:  OrderType;

  constructor(id = 0, orderType: OrderType = "NORMAL") {
    this.id = id;
    this.state = "PENDING";
    this.progress = 0;
    this.orderType = orderType;
  }
}

const [count, setCount] = createSignal(0);

const addOrderToQueue = (queueAccessor: Accessor<Order[]>, queueSetter: Setter<Order[]>, order: Order) => {
  setCount(count() + 1);
  queueSetter([
      order,
    ...queueAccessor(),
  ]);
}

const OrdersQueue: Component<IOrdersQueueProps> = (props: IOrdersQueueProps) => {
  return (
    <div class={styles.queue}>
      <span>{props.label}</span>
      <For each={props.orderAccessor()}>
        {(order) => {
          return (
            <div class={styles.container}>
              <span>{order.id}</span>
            </div>
          );
        }}
      </For>
    </div>
  )
}

const Orders: Component<IOrdersProps> = (props: IOrdersProps) => {

  return (
    <>
      <section style="height: 25vh;">
        <button onClick={() => addOrderToQueue(props.normalQueueAccessor, props.normalQueueSetter, new Order(count() + 1))}>New Normal Order</button>
        <button onClick={() => addOrderToQueue(props.vipQueueAccessor, props.vipQueueSetter, new Order(count() + 1, "VIP"))}>New VIP Order</button>
      </section>

      <section style="height: 50vh; flex-basis: 50%;">
        <OrdersQueue
          label="Normal"
          orderAccessor={props.normalQueueAccessor}
        ></OrdersQueue>
        <OrdersQueue
          label="VIP"
          orderAccessor={props.vipQueueAccessor}
        ></OrdersQueue>
        <OrdersQueue
          label="Redo Normal"
          orderAccessor={props.redoNormalQueueAccessor}
        ></OrdersQueue>
        <OrdersQueue
          label="Redo VIP"
          orderAccessor={props.redoVIPQueueAccessor}
        ></OrdersQueue>
        <OrdersQueue
          label="Complete!"
          orderAccessor={props.completedQueueAccessor}
        ></OrdersQueue>
      </section>
    </>
  )
}

export default Orders;
