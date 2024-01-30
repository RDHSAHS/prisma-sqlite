import { Channel, Connection, ConsumeMessage, connect } from "amqplib";
import { ENV } from "../constant";

export async function setupAMQP() {
  const connection = await connect(ENV.AMQP_URL);
  const channel = await connection.createChannel();

  return { connection, channel };
}

export async function closeAMQP({
  connection,
  channel,
}: {
  connection: Connection;
  channel: Channel;
}) {
  await channel.close();
  await connection.close();
}

export async function consumerAMQP(routingKey: string) {
  const { connection, channel } = await setupAMQP();

  await channel.consume(
    routingKey,
    function (message: ConsumeMessage | null) {
      if (message) {
        console.log(message.fields.routingKey);
        console.log(message.content.toString());
      }
    },
    {
      noAck: true,
    }
  );

  await closeAMQP({ connection, channel });
}

export async function producerAMQP(
  exchange: string,
  routingKey: string,
  content: string,
  headers?: Record<string, string>
) {
  const { connection, channel } = await setupAMQP();

  channel.publish(exchange, routingKey, Buffer.from(content), {
    headers: {
      sample: headers || {},
    },
  });

  await closeAMQP({ connection, channel });
}
