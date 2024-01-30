import { Router, Request, Response } from "express";
import { prisma, prismaExclude } from "../config";
import { consumerAMQP, producerAMQP } from "../config/rabbitmq";

const router = Router();

//CODE API HERE
//------------------------------------------------------------------------------------------------

//PRODUCE AMQP
router.post("/p", async (req: Request, res: Response) => {
  try {
    const { exchange, routingKey, content, headers } = req.body;

    const resp = await producerAMQP(exchange, routingKey, content, headers);

    res.status(200).json({ message: `AMQP message produced`, data: resp });
  } catch (err) {
    console.error(`Error producing amqp message`, err);
    res.status(500).send("Something went wrong");
  }
});

//CONSUME AMQP
router.post("/c", async (req: Request, res: Response) => {
  try {
    const { routingKey } = req.body;

    const resp = await consumerAMQP(routingKey);

    res.status(200).send({ message: `AMQP message consumed`, data: { resp } });
  } catch (err) {
    console.error(`Error producing amqp message`, err);
    res.status(500).send("Something went wrong");
  }
});

export default router;
