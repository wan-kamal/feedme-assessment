import { Accessor, Component, createEffect, createSignal, For, Setter } from "solid-js";
import styles from "../App.module.css";
import { Order } from "../orders/Orders";
import { faker } from "@faker-js/faker";

export type BotStates = "IDLE" | "WORKING";

export class Bot {
  private interval?: number;
  name: string;
  state: BotStates;
  order: Order | null;

  constructor(order: Order | null = null) {
    this.name = faker.name.firstName();
    this.state = "IDLE";
    this.order = order;
  }

  // this should already be sorted by priority
  // redoVIP, VIP, redoNormal, normal
  navigateQueue(queueAccessors: Accessor<Order[]>[], queueSetters: Setter<Order[]>[]) {
    for (const [index, queue] of queueAccessors.entries()) {
      if (queue().length) {
        const order = queue()[queue().length - 1];
        queueSetters[index](queue().slice(0, queue().length - 1));
        return this.processOrder(order);
      }
    }
  }

  private processOrder(order: Order) {
    this.order = order;
    this.state = "WORKING";
    this.interval = setInterval(() => {
      // 10 is overshooting
      if (order.progress === 9) {
        clearInterval(this.interval);
        this.finishOrder(order);
      }
      order.progress++
    }, 1000)
  }

  private finishOrder(order: Order) {
    order.state = "COMPLETE";
    setCompleteOrder(order);
    this.order = null;
    this.state = "IDLE";
    setBots([
      ...bots().filter(b => b.name !== this.name),
      this,
    ])
  }

  destroyBot() {
    if (this.interval) {
      clearInterval(this.interval);
    }
    const order = this.order;
    if (order) {
      order.progress = 0;
      this.order = null;
      return order;
    }
  }

}

export interface IBotsProps {
  normalQueueAccessor: Accessor<Order[]>;
  vipQueueAccessor: Accessor<Order[]>;
  redoNormalQueueAccessor: Accessor<Order[]>;
  redoVIPQueueAccessor: Accessor<Order[]>;
  completedQueueAccessor: Accessor<Order[]>;
  normalQueueSetter: Setter<Order[]>;
  vipQueueSetter: Setter<Order[]>;
  redoNormalQueueSetter: Setter<Order[]>;
  redoVIPQueueSetter: Setter<Order[]>;
  completedQueueSetter: Setter<Order[]>;
}

const [bots, setBots] = createSignal<Bot[]>([]);
const [completeOrder, setCompleteOrder] = createSignal<Order | null>(null);

const addBotHandler = () => {
  setBots([
    ...bots(),
    new Bot(),
  ])
}

const checkQueues = (...queue: number[]) => !!queue.reduce((acc, cur) => acc + cur);

const Bots: Component<IBotsProps> = (props: IBotsProps) => {

  const removeBotHandler = () => {
    if (!bots().length) {
      return;
    }

    const bot = bots()[bots().length - 1];

    if (bot.order) {
      switch (bot.order?.orderType) {
        case "VIP":
          props.redoVIPQueueSetter([
            ...props.redoVIPQueueAccessor(),
            bot.order,
          ]);
          break
        default:
          props.redoNormalQueueSetter([
            ...props.redoNormalQueueAccessor(),
            bot.order,
          ]);
          break;
      }
    }

    bot.destroyBot();
    setBots(bots().slice(0, bots().length - 1));
  }

  const addCompleteOrder = (order: Order) => {
    props.completedQueueSetter([
      ...props.completedQueueAccessor(),
      order,
    ]);
    setCompleteOrder(null);
  }

  createEffect(() => {
    if (!bots().length || !checkQueues(
      props.redoVIPQueueAccessor().length,
      props.vipQueueAccessor().length,
      props.redoNormalQueueAccessor().length,
      props.normalQueueAccessor().length,
    )) {
      return;
    }
    const bot = bots().find(b => !b.order);
    if (bot) {
      bot.navigateQueue([
        props.redoVIPQueueAccessor,
        props.vipQueueAccessor,
        props.redoNormalQueueAccessor,
        props.normalQueueAccessor,
      ], [
        props.redoVIPQueueSetter,
        props.vipQueueSetter,
        props.redoNormalQueueSetter,
        props.normalQueueSetter,
      ])
    }
  })

  createEffect(() => {
    // for some reason cannot resolve accessor with condition
    const order = completeOrder();
    if (order) {
      addCompleteOrder(order);
    }
  })

  return (
    <>
      <section style="height: 25vh;">
        <div class={styles.bots}>
          <span>BOTS</span>
          <For each={bots()}>
            {(bot) => {
              return (
                <div class={styles.container}>
                  <span>{bot.name}</span>
                </div>
              )
            }}
          </For>
        </div>
      </section>

      <section style="height: 25vh;">
        <button onClick={() => addBotHandler()}>+ BOT</button>
        <button onClick={() => removeBotHandler()}>- BOT</button>
      </section>
    </>
  )
}

export default Bots;
