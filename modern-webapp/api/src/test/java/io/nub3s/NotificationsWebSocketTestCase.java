package io.nub3s;

import io.quarkus.test.common.http.TestHTTPResource;
import io.quarkus.test.junit.QuarkusTest;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

import javax.websocket.*;
import java.net.URI;
import java.util.concurrent.LinkedBlockingDeque;
import java.util.concurrent.TimeUnit;

@QuarkusTest
public class NotificationsWebSocketTestCase {

    private static final LinkedBlockingDeque<String> MESSAGES = new LinkedBlockingDeque<>();

    @TestHTTPResource("/notifications/123456")
    URI uri;

    @Test
    public void testWebsocket() throws Exception {
        try (Session session = ContainerProvider.getWebSocketContainer().connectToServer(Client.class, uri)) {
            Assertions.assertEquals("TEST CLIENT IS CONNECTED", MESSAGES.poll(10, TimeUnit.SECONDS));
            Assertions.assertEquals("_socket_debug:Client c_123456 joined", MESSAGES.poll(10, TimeUnit.SECONDS));
            session.getAsyncRemote().sendText("hello from test client");
            Assertions.assertEquals("c_123456:hello from test client", MESSAGES.poll(10, TimeUnit.SECONDS));
        }
    }

    @ClientEndpoint
    public static class Client {
        @OnOpen
        public void open(Session session) {
            MESSAGES.add("TEST CLIENT IS CONNECTED");
        }

        @OnMessage
        void message(String msg) {
            MESSAGES.add(msg);  // when we get a websocket message, put it into this queue
        }
    }
}