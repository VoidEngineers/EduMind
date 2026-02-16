import aio_pika
import json
import logging
from typing import Any, Callable, Dict, Optional
import asyncio

logger = logging.getLogger(__name__)

class MessageBroker:
    def __init__(self, amqp_url: str):
        self.amqp_url = amqp_url
        self.connection: Optional[aio_pika.RobustConnection] = None
        self.channel: Optional[aio_pika.RobustChannel] = None

    async def connect(self, client_name: Optional[str] = None):
        """Establish a connection to the RabbitMQ broker"""
        if not self.connection or self.connection.is_closed:
            try:
                # Add connection name to the URL as a query parameter
                # aio-pika/aiormq uses this as the connection name
                url = self.amqp_url
                if client_name:
                    separator = "&" if "?" in url else "?"
                    url = f"{url}{separator}name={client_name}"
                
                # Metadata used by RabbitMQ Management UI to identify the client
                client_properties = {
                    "connection_name": client_name,
                    "product": client_name,  # UI often uses 'product' for the name column
                    "information": "EduMind Microservice",
                    "display_name": client_name
                } if client_name else None
                
                self.connection = await aio_pika.connect_robust(
                    url,
                    client_properties=client_properties
                )
                self.channel = await self.connection.channel()
                logger.info(f"Successfully connected to RabbitMQ as {client_name or 'unknown'}")
            except Exception as e:
                logger.error(f"Failed to connect to RabbitMQ: {e}")
                raise

    async def close(self):
        """Close the connection to the broker"""
        if self.connection:
            await self.connection.close()
            logger.info("Closed RabbitMQ connection")

    async def publish(self, exchange_name: str, routing_key: str, message: Dict[str, Any]):
        """Publish a message to an exchange"""
        if not self.channel:
            await self.connect()

        exchange = await self.channel.declare_exchange(
            exchange_name, aio_pika.ExchangeType.TOPIC, durable=True
        )

        message_body = json.dumps(message).encode()
        await exchange.publish(
            aio_pika.Message(
                body=message_body,
                content_type="application/json",
                delivery_mode=aio_pika.DeliveryMode.PERSISTENT,
            ),
            routing_key=routing_key,
        )
        logger.debug(f"Published message to {exchange_name} with routing key {routing_key}")

    async def subscribe(self, queue_name: str, exchange_name: str, routing_key: str, callback: Callable[[Dict[str, Any]], Any]):
        """Subscribe to a queue and process messages using a callback"""
        if not self.channel:
            await self.connect()

        exchange = await self.channel.declare_exchange(
            exchange_name, aio_pika.ExchangeType.TOPIC, durable=True
        )

        queue = await self.channel.declare_queue(queue_name, durable=True)
        await queue.bind(exchange, routing_key=routing_key)

        async with queue.iterator() as queue_iter:
            async for message in queue_iter:
                async with message.process():
                    try:
                        payload = json.loads(message.body.decode())
                        if asyncio.iscoroutinefunction(callback):
                            await callback(payload)
                        else:
                            callback(payload)
                    except Exception as e:
                        logger.error(f"Error processing message from {queue_name}: {e}")

# Singleton instance
_broker: Optional[MessageBroker] = None

def get_broker(amqp_url: str) -> MessageBroker:
    global _broker
    if _broker is None:
        _broker = MessageBroker(amqp_url)
    return _broker
